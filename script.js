// ===== CALC-START =====
function calc(lat,lng,tz,y,m,d){
  const R=Math.PI/180,mod=(a,n)=>((a%n)+n)%n;
  const n=Date.UTC(y,m-1,d,12)/864e5+2440587.5-2451545;
  const L=mod(280.46+0.9856474*n,360),g=mod(357.528+0.9856003*n,360)*R;
  const lam=(L+1.915*Math.sin(g)+0.02*Math.sin(2*g))*R,eps=(23.439-4e-7*n)*R;
  const dec=Math.asin(Math.sin(eps)*Math.sin(lam));
  const ra=Math.atan2(Math.cos(eps)*Math.sin(lam),Math.cos(lam))/R;
  let eot=(L-ra)/15; eot=mod(eot+12,24)-12;
  const noon=12+tz-lng/15-eot;
  const H=a=>{const c=(Math.sin(a*R)-Math.sin(lat*R)*Math.sin(dec))/(Math.cos(lat*R)*Math.cos(dec));return Math.acos(Math.max(-1,Math.min(1,c)))/R/15};
  const asr=Math.atan(1/(1+Math.tan(Math.abs(lat*R-dec))))/R;
  const ih=2/60;
  return {subuh:noon-H(-20)+ih,terbit:noon-H(-0.833)-ih,dzuhur:noon+ih,ashar:noon+H(asr)+ih,maghrib:noon+H(-0.833)+ih,isya:noon+H(-18)+ih};
}
// ===== CALC-END =====
const CITIES=[["Banda Aceh",5.55,95.32,7],["Medan",3.59,98.67,7],["Padang",-0.95,100.35,7],["Pekanbaru",0.51,101.45,7],["Jambi",-1.61,103.61,7],["Palembang",-2.98,104.76,7],["Bengkulu",-3.8,102.26,7],["Bandar Lampung",-5.43,105.26,7],["Batam",1.05,104.03,7],["Pangkalpinang",-2.13,106.11,7],["Jakarta",-6.21,106.85,7],["Serang",-6.12,106.15,7],["Bandung",-6.92,107.61,7],["Semarang",-6.97,110.42,7],["Yogyakarta",-7.8,110.36,7],["Surabaya",-7.25,112.75,7],["Malang",-7.97,112.63,7],["Pontianak",-0.03,109.33,7],["Palangka Raya",-2.21,113.92,7],["Banjarmasin",-3.32,114.59,8],["Samarinda",-0.5,117.15,8],["Balikpapan",-1.24,116.83,8],["Denpasar",-8.65,115.22,8],["Mataram",-8.58,116.12,8],["Kupang",-10.18,123.61,8],["Makassar",-5.15,119.43,8],["Palu",-0.9,119.87,8],["Manado",1.47,124.84,8],["Kendari",-3.97,122.51,8],["Gorontalo",0.54,123.06,8],["Ambon",-3.7,128.18,9],["Ternate",0.79,127.38,9],["Sorong",-0.88,131.26,9],["Jayapura",-2.53,140.72,9],["Merauke",-8.49,140.4,9]];
const NAMES=[["subuh","Subuh","الفجر","🌌"],["dzuhur","Dzuhur","الظهر","🌞"],["ashar","Ashar","العصر","🌤️"],["maghrib","Maghrib","المغرب","🌇"],["isya","Isya","العشاء","🌃"]];
const $=id=>document.getElementById(id),p2=n=>String(n).padStart(2,"0"),root=document.documentElement;
const sel=$("city");CITIES.forEach((c,i)=>sel.add(new Option(c[0],i)));
let loc=CITIES[4],sig="";
try{const s=localStorage.getItem("city");if(s!==null&&CITIES[s])loc=CITIES[s];const th=localStorage.getItem("theme");if(th)root.dataset.theme=th}catch(e){}
sel.value=CITIES.indexOf(loc);
const fmt=h=>{const m=Math.round(h*60);return p2(Math.floor(m/60)%24)+":"+p2(m%60)};
const ymd=(tz,o=0)=>{const t=new Date(Date.now()+tz*36e5+o*864e5);return[t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate()]};
const ms=(y,m,d,h,tz)=>Date.UTC(y,m-1,d)+(h-tz)*36e5;
const todayStr=()=>{const[y,m,d]=ymd(loc[3]);return y+"-"+p2(m)+"-"+p2(d)};
const dt=(y,m,d)=>new Date(Date.UTC(y,m-1,d,12));
function seq(){const out=[];[-1,0,1].forEach(o=>{const[y,m,d]=ymd(loc[3],o),t=calc(loc[1],loc[2],loc[3],y,m,d);NAMES.forEach(([k,n])=>out.push({k,n,w:ms(y,m,d,t[k],loc[3]),o}))});return out}
function next(){const s=seq(),i=s.findIndex(x=>x.w>Date.now());return{...s[i],prev:s[i-1],tomorrow:s[i].o===1}}
function render(){
  const[y,m,d]=$("date").value.split("-").map(Number),t=calc(loc[1],loc[2],loc[3],y,m,d);
  const isT=$("date").value===todayStr(),nx=isT?next():null,now=Date.now();
  sig=nx?nx.k+nx.tomorrow:"";
  $("where").textContent=loc[0];
  $("gd").textContent=dt(y,m,d).toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
  try{$("hd").textContent=new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(dt(y,m,d))}catch(e){$("hd").textContent=""}
  $("sr").textContent="🌅 Terbit "+fmt(t.terbit);
  $("today").innerHTML=NAMES.map(([k,n,ar,ic])=>{const cl=isT&&nx&&nx.k===k&&!nx.tomorrow?" on":isT&&ms(y,m,d,t[k],loc[3])<now?" done":"";
    return `<div class="card${cl}"><div class="ic">${ic}</div><div class="ar">${ar}</div><div class="nm">${n}</div><div class="tm">${fmt(t[k])}</div></div>`}).join("");
  const dim=new Date(Date.UTC(y,m,0)).getUTCDate();let rows="";
  for(let i=1;i<=dim;i++){const c=calc(loc[1],loc[2],loc[3],y,m,i);
    rows+=`<tr${i===d?' class="now"':""}><td>${dt(y,m,i).toLocaleDateString("id-ID",{weekday:"short",day:"numeric",timeZone:"UTC"})}</td>${["subuh","terbit","dzuhur","ashar","maghrib","isya"].map(k=>"<td>"+fmt(c[k])+"</td>").join("")}</tr>`}
  $("mb").innerHTML=rows;
  $("mt").textContent=loc[0]+" · "+dt(y,m,1).toLocaleDateString("id-ID",{month:"long",year:"numeric",timeZone:"UTC"});
  tick();
}
function tick(){
  const n=next(),s=Math.max(0,Math.floor((n.w-Date.now())/1e3));
  $("nx").textContent=n.n+(n.tomorrow?" (besok)":"");
  $("cd").textContent=p2(Math.floor(s/3600))+":"+p2(Math.floor(s%3600/60))+":"+p2(s%60);
  const tot=n.prev?n.w-n.prev.w:1,pc=n.prev?(Date.now()-n.prev.w)/tot*100:0;
  $("pg").style.width=Math.min(100,Math.max(0,pc))+"%";
  const c=new Date(Date.now()+loc[3]*36e5);
  $("clk").textContent="🕐 "+p2(c.getUTCHours())+":"+p2(c.getUTCMinutes())+":"+p2(c.getUTCSeconds())+" UTC+"+loc[3];
  if($("date").value===todayStr()&&sig!==n.k+n.tomorrow)render();
}
sel.onchange=()=>{loc=CITIES[sel.value];try{localStorage.setItem("city",sel.value)}catch(e){}$("date").value=todayStr();render()};
$("date").onchange=()=>{if($("date").value)render()};
$("gps").onclick=()=>{
  if(!navigator.geolocation)return alert("Browser tidak mendukung geolokasi.");
  navigator.geolocation.getCurrentPosition(p=>{loc=["Lokasi saya",p.coords.latitude,p.coords.longitude,-new Date().getTimezoneOffset()/60];$("date").value=todayStr();render()},()=>alert("Izin lokasi ditolak. Silakan pilih kota secara manual."));
};
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));
  $("today").classList.toggle("hide",b.dataset.t!=="today");$("month").classList.toggle("hide",b.dataset.t!=="month")});
$("pr").onclick=()=>window.print();
$("theme").onclick=()=>{const dk=root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
  root.dataset.theme=dk?"light":"dark";try{localStorage.setItem("theme",root.dataset.theme)}catch(e){}};
$("date").value=todayStr();render();setInterval(tick,1000);
