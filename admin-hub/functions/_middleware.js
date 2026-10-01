import { authorize } from "./lib/auth.js";
import { secure } from "./lib/responses.js";

export async function onRequest(context){
  const auth=await authorize(context.request,context.env);
  if(!auth.ok)return secure(new Response(auth.reason,{status:auth.status,headers:{"Content-Type":"text/plain; charset=utf-8"}}));
  return secure(await context.next());
}
