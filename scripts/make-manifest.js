// Runs at deploy time. Lists public/videos so the replays page updates on every push.
const fs=require("fs"),path=require("path");
const dir=path.join(__dirname,"..","public","videos");
fs.mkdirSync(dir,{recursive:true});
const list=fs.readdirSync(dir).filter(f=>/\.(mp4|webm|mov|m4v)$/i.test(f)).sort().reverse()
  .map(file=>({file,size:fs.statSync(path.join(dir,file)).size}));
fs.writeFileSync(path.join(dir,"manifest.json"),JSON.stringify(list,null,2));
console.log(`manifest: ${list.length} video(s)`);
