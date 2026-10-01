import { buildDashboard } from "../lib/reports.js";
import { json } from "../lib/responses.js";

export async function onRequestGet({request,env}){
  const days=Number(new URL(request.url).searchParams.get("range")||28);
  if(![7,28,90].includes(days))return json({error:"Choose a reporting range of 7, 28, or 90 days."},400);
  try{return json(await buildDashboard(env,days));}
  catch(error){return json({error:"The aggregate report could not be generated.",detail:error.message},502);}
}
