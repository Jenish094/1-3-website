const TEAM_NUMBER="41103C";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const qs=o=>Object.entries(o).flatMap(([k,v])=>[].concat(v).map(x=>encodeURIComponent(k)+"="+encodeURIComponent(x))).join("&");
async function get(path,params={}){const r=await fetch("/api/"+path+"?"+qs(params));if(!r.ok)throw new Error(path+" returned "+r.status);return r.json();}
async function getAll(path,params={}){const out=[];let page=1,last=1;do{const j=await get(path,{...params,per_page:250,page});out.push(...j.data);last=j.meta?.last_page||1;page++;}while(page<=last);return out;}
const pct=(w,n)=>n?Math.round(w/n*100)+"%":"n/a";
const ratio=(w,l)=>l?(w/l).toFixed(2):(w?w.toFixed(2):"n/a");
const fmt=d=>d?new Date(d).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"2-digit"}):"";

(async()=>{
try{
  const {data}=await get("teams",{"number[]":TEAM_NUMBER,"program[]":1});
  const team=data[0];
  if(!team)throw new Error("Team "+TEAM_NUMBER+" not found");
  const [events,matches,awards]=await Promise.all([
    getAll(`teams/${team.id}/events`),getAll(`teams/${team.id}/matches`),getAll(`teams/${team.id}/awards`)]);
  const seasonOf={};events.forEach(e=>seasonOf[e.id]=e.season?.name||"Other");

  const by={},played=[];let W=0,L=0,T=0;
  for(const m of matches){
    if(m.round<2||m.scored===false)continue;
    const mine=m.alliances.find(a=>a.teams.some(t=>t.team?.id===team.id));
    const opp=m.alliances.find(a=>a!==mine);
    if(!mine||!opp||(mine.score===0&&opp.score===0&&!m.scored))continue;
    const r=mine.score>opp.score?"W":mine.score<opp.score?"L":"T";
    const s=seasonOf[m.event?.id]||"Other";
    by[s]??={W:0,L:0,T:0};by[s][r]++;
    r==="W"?W++:r==="L"?L++:T++;
    played.push({m,mine,opp,r});
  }
  const n=W+L+T;
  $("f-record").textContent=`${W} ${L} ${T}`;
  $("f-rate").textContent=pct(W,n);
  $("f-events").textContent=events.length;
  $("f-awards").textContent=awards.length;

  const rows=Object.entries(by).sort((a,b)=>b[0].localeCompare(a[0])).map(([s,v])=>{
    const t=v.W+v.L+v.T;
    return `<tr><td>${esc(s)}</td><td>${t}</td><td>${v.W}</td><td>${v.L}</td><td>${v.T}</td><td>${pct(v.W,t)}</td><td>${ratio(v.W,v.L)}</td></tr>`;}).join("");
  $("seasons").innerHTML=(rows||`<tr><td colspan="7" class="note">No scored matches yet.</td></tr>`)+
    (n?`<tr><td><b>All seasons</b></td><td>${n}</td><td>${W}</td><td>${L}</td><td>${T}</td><td>${pct(W,n)}</td><td>${ratio(W,L)}</td></tr>`:"");

  played.sort((a,b)=>new Date(b.m.started||b.m.scheduled||0)-new Date(a.m.started||a.m.scheduled||0));
  const names=a=>a.teams.map(t=>t.team?.name||t.team?.code).filter(x=>x&&x!==TEAM_NUMBER).join(", ");
  $("matches").innerHTML=played.slice(0,12).map(({m,mine,opp,r})=>
    `<li class="match"><span class="d">${fmt(m.started||m.scheduled)}</span>
     <span class="t">${esc(m.name)} <small>${esc(m.event?.name)}, ${esc(mine.color)} alliance${names(mine)?" with "+esc(names(mine)):""} vs ${esc(names(opp))}</small></span>
     <span class="s">${mine.score} : ${opp.score}</span><span class="res ${r}">${r}</span></li>`).join("")||`<li class="note">No matches yet.</li>`;

  $("awards").innerHTML=awards.map(a=>`<li>${esc(a.title.replace(/\s*\(.*\)$/,""))}<small>${esc(a.event?.name)}, ${esc(seasonOf[a.event?.id]||"")}</small></li>`).join("")||`<li class="note">No awards recorded yet.</li>`;
}catch(e){
  const box=$("stats-error");box.hidden=false;
  box.textContent="Live results could not be loaded ("+e.message+"). Check that the API token is set in Cloudflare and try again.";
  ["f-record","f-rate","f-events","f-awards"].forEach(i=>$(i).textContent="n/a");
  $("seasons").innerHTML="";$("matches").innerHTML="";$("awards").innerHTML="";
}})();
