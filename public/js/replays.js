const grid=document.getElementById("grid"),empty=document.getElementById("empty");
const youtubeEmbedUrl=value=>{
  try{
    const url=new URL(value);
    let id="";
    if(url.hostname==="youtu.be")id=url.pathname.slice(1);
    if(url.hostname==="www.youtube.com"||url.hostname==="youtube.com"){
      if(url.pathname==="/watch")id=url.searchParams.get("v")||"";
      if(url.pathname.startsWith("/shorts/"))id=url.pathname.split("/")[2]||"";
      if(url.pathname.startsWith("/embed/"))id=url.pathname.split("/")[2]||"";
    }
    if(!/^[\w-]{11}$/.test(id))return null;
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }catch{return null}
};
fetch("videos/manifest.json",{cache:"no-cache"}).then(r=>r.json()).then(list=>{
  if(!list.length){empty.hidden=false;return;}
  for(const v of list){
    const embedUrl=youtubeEmbedUrl(v.url);
    if(!embedUrl)continue;
    const fig=document.createElement("figure");
    const frame=document.createElement("iframe");
    frame.src=embedUrl;frame.title=v.title;frame.loading="lazy";
    frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen=true;
    const cap=document.createElement("figcaption");
    cap.textContent=v.title;
    fig.append(frame,cap);grid.append(fig);
  }
}).catch(()=>{empty.hidden=false;});
