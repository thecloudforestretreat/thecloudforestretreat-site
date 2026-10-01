import { config } from "./config.js";

const encoder=new TextEncoder();
let keyCache={issuer:"",expires:0,keys:[]};
const b64url=value=>Uint8Array.from(atob(value.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(value.length/4)*4,"=")),c=>c.charCodeAt(0));
export function parseJwt(token){const parts=String(token||"").split(".");if(parts.length!==3)throw new Error("Malformed access token");return {header:JSON.parse(new TextDecoder().decode(b64url(parts[0]))),payload:JSON.parse(new TextDecoder().decode(b64url(parts[1]))),signature:b64url(parts[2]),signed:`${parts[0]}.${parts[1]}`};}
export function isLocal(host){return /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host||"");}
export function isPagesDev(host){return /\.pages\.dev(?::\d+)?$/i.test(host||"");}
async function accessKeys(issuer,fetcher=fetch){if(keyCache.issuer===issuer&&keyCache.expires>Date.now())return keyCache.keys;const res=await fetcher(`${issuer}/cdn-cgi/access/certs`);if(!res.ok)throw new Error("Unable to load Access signing keys");const body=await res.json();const keys=body.keys||body.public_certs||[];keyCache={issuer,keys,expires:Date.now()+300000};return keys;}
export async function verifyAccessJwt(token,env,fetcher=fetch,now=Math.floor(Date.now()/1000)){
  const {header,payload,signature,signed}=parseJwt(token);if(header.alg!=="RS256"||!header.kid)throw new Error("Unsupported access token");
  const team=String(env.CF_ACCESS_TEAM_DOMAIN||"").replace(/^https?:\/\//,"").replace(/\/$/,"");if(!team)throw new Error("Access issuer is not configured");
  const issuer=`https://${team}`;if(payload.iss!==issuer)throw new Error("Invalid access issuer");if(!payload.exp||payload.exp<=now||payload.nbf>now)throw new Error("Expired access token");
  const audiences=Array.isArray(payload.aud)?payload.aud:[payload.aud];if(!env.CF_ACCESS_AUD||!audiences.includes(env.CF_ACCESS_AUD))throw new Error("Invalid access audience");
  const keys=await accessKeys(issuer,fetcher);const jwk=keys.find(k=>k.kid===header.kid);if(!jwk)throw new Error("Unknown access signing key");
  const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
  const ok=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,signature,encoder.encode(signed));if(!ok)throw new Error("Invalid access signature");
  const email=String(payload.email||payload.sub||"").toLowerCase();if(!config(env).ADMIN_EMAIL_ALLOWLIST.includes(email))throw new Error("Administrator is not approved");return {email,payload};
}
export async function authorize(request,env,fetcher=fetch){const host=new URL(request.url).host;if(isPagesDev(host))return {ok:false,status:403,reason:"Direct pages.dev access is disabled."};if(isLocal(host))return {ok:true,email:"local-development"};const expected=config(env).ADMIN_HOSTNAME;if(host!==expected)return {ok:false,status:403,reason:"Unapproved admin hostname."};try{return {ok:true,...await verifyAccessJwt(request.headers.get("Cf-Access-Jwt-Assertion"),env,fetcher)};}catch(error){return {ok:false,status:401,reason:error.message};}}
