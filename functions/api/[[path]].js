// Proxies browser requests to the VEX events API so the token stays server side.
export async function onRequestGet({request,env,params}){
  const path=[].concat(params.path||[]).join("/");
  if(!/^(teams|events)(\/|$)/.test(path))return json({error:"Not allowed"},403);
  if(!env.VEX_API_TOKEN)return json({error:"VEX_API_TOKEN is not set"},500);
  const base=(env.VEX_API_BASE||"https://events.vex.com/api/v2").replace(/\/$/,"");
  const res=await fetch(`${base}/${path}${new URL(request.url).search}`,{
    headers:{Authorization:`Bearer ${env.VEX_API_TOKEN}`,Accept:"application/json"},
    cf:{cacheTtl:300,cacheEverything:true}});
  return new Response(res.body,{status:res.status,headers:{"Content-Type":"application/json","Cache-Control":"public, max-age=300"}});
}
const json=(o,s)=>new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json"}});
