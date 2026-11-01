const grid=document.getElementById("grid"),empty=document.getElementById("empty");
const title=f=>f.replace(/\.[^.]+$/,"").replace(/_/g," ");
fetch("videos/manifest.json",{cache:"no-cache"}).then(r=>r.json()).then(list=>{
  if(!list.length){empty.hidden=false;return;}
  for(const v of list){
    const fig=document.createElement("figure");
    const vid=document.createElement("video");
    vid.controls=true;vid.playsInline=true;vid.preload="metadata";
    vid.src="videos/"+encodeURIComponent(v.file)+"#t=0.1";
    const cap=document.createElement("figcaption");
    cap.textContent=title(v.file);
    const s=document.createElement("small");
    s.textContent=(v.size/1048576).toFixed(1)+" MB";
    cap.append(s);fig.append(vid,cap);grid.append(fig);
  }
}).catch(()=>{empty.hidden=false;});
