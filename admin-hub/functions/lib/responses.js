export const SECURITY_HEADERS={
  "Cache-Control":"private, no-store, max-age=0","Pragma":"no-cache","X-Robots-Tag":"noindex, nofollow, noarchive, nosnippet",
  "X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"no-referrer",
  "Permissions-Policy":"camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  "Content-Security-Policy":"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'"
};
export function secure(response){const next=new Response(response.body,response);for(const [k,v] of Object.entries(SECURITY_HEADERS))next.headers.set(k,v);return next;}
export function json(data,status=200){return secure(new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8"}}));}
