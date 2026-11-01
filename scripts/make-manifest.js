// Runs at deploy time. Preserves YouTube entries and lists any local videos.
const fs=require("fs"),path=require("path");
const dir=path.join(__dirname,"..","public","videos");
fs.mkdirSync(dir,{recursive:true});
const manifestPath=path.join(dir,"manifest.json");
let existing=[];
try{existing=JSON.parse(fs.readFileSync(manifestPath,"utf8"))}
catch(error){if(error.code!=="ENOENT")throw error}
if(!Array.isArray(existing))throw new Error("videos/manifest.json must contain an array");
const local=fs.readdirSync(dir).filter(f=>/\.(mp4|webm|mov|m4v)$/i.test(f)).sort().reverse()
  .map(file=>({file,size:fs.statSync(path.join(dir,file)).size}));
fs.writeFileSync(manifestPath,JSON.stringify([...existing,...local],null,2));
console.log(`manifest: ${existing.length+local.length} replay(s)`);
