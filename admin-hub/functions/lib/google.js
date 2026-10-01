const encoder=new TextEncoder();
const toB64Url=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
const jsonB64=value=>toB64Url(encoder.encode(JSON.stringify(value)));
function pemBytes(pem){const clean=String(pem||"").replace(/\\n/g,"\n").replace(/-----[^-]+-----/g,"").replace(/\s/g,"");return Uint8Array.from(atob(clean),c=>c.charCodeAt(0));}
export function googleCredentialsAvailable(env){return Boolean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL&&env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);}
export async function googleAccessToken(env,fetcher=fetch,now=Math.floor(Date.now()/1000)){
  if(!googleCredentialsAvailable(env))throw new Error("Google service-account credentials are not configured");
  const scope=["https://www.googleapis.com/auth/analytics.readonly","https://www.googleapis.com/auth/webmasters.readonly","https://www.googleapis.com/auth/tagmanager.readonly"].join(" ");
  const header=jsonB64({alg:"RS256",typ:"JWT"});const payload=jsonB64({iss:env.GOOGLE_SERVICE_ACCOUNT_EMAIL,scope,aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600});
  const key=await crypto.subtle.importKey("pkcs8",pemBytes(env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
  const signature=toB64Url(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,encoder.encode(`${header}.${payload}`)));
  const body=new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:`${header}.${payload}.${signature}`});
  const response=await fetcher("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});const data=await response.json();if(!response.ok)throw new Error(data.error_description||"Google authorization failed");return data.access_token;
}
export async function googleJson(url,token,options={},fetcher=fetch){const response=await fetcher(url,{...options,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json",...(options.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error?.message||`Google API request failed (${response.status})`);return data;}
