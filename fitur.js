// ===== fitur.js : Al-Qur'an, Dzikir, Hadits, Notifikasi =====
const V=["jadwal","quran","dzikir","hadits","ceramah","notif"];
const ls={g(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),6000)}
document.querySelectorAll(".menu button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".menu button").forEach(x=>x.classList.toggle("on",x===b));
  V.forEach(v=>$("v-"+v).classList.toggle("hide",v!==b.dataset.v));
  if(b.dataset.v==="quran"&&!SUR.length)loadList();scrollTo(0,0)});

// ----- Hadits -----
const HAD=[
["Sesungguhnya setiap amal tergantung pada niatnya, dan setiap orang hanya mendapat sesuai apa yang ia niatkan.","HR. Bukhari & Muslim"],
["Bagaimana pendapat kalian jika di depan pintu salah seorang kalian ada sungai, ia mandi di sana lima kali sehari, apakah masih tersisa kotorannya? Demikian pula sholat lima waktu, Allah menghapus dosa-dosa dengannya.","HR. Bukhari & Muslim"],
["Amal yang pertama kali dihisab dari seorang hamba pada hari kiamat adalah sholatnya. Jika baik, ia beruntung; jika rusak, ia merugi.","HR. Tirmidzi & Nasa'i"],
["Barang siapa sholat Subuh, maka ia berada dalam jaminan Allah.","HR. Muslim"],
["Sholat berjamaah lebih utama daripada sholat sendirian dengan dua puluh tujuh derajat.","HR. Bukhari & Muslim"],
["Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.","HR. Bukhari"],
["Barang siapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga.","HR. Muslim"],
["Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai Ar-Rahman: Subhanallahi wa bihamdihi, Subhanallahil 'azhim.","HR. Bukhari & Muslim"],
["Tidak sempurna iman salah seorang kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.","HR. Bukhari & Muslim"],
["Sesungguhnya Allah tidak melihat rupa dan harta kalian, tetapi Dia melihat hati dan amal kalian.","HR. Muslim"],
["Senyummu di hadapan saudaramu adalah sedekah.","HR. Tirmidzi"],
["Bersuci adalah separuh dari iman.","HR. Muslim"]];
const hi=Math.floor(Date.now()/864e5)%HAD.length;
$("hod").innerHTML=`<b>HADITS HARI INI</b><p>${HAD[hi][0]}</p><small>${HAD[hi][1]}</small>`;
$("hd-list").innerHTML=HAD.map((h,i)=>`<div class="item"><span class="no">${i+1}</span><p>${h[0]}</p><small>${h[1]}</small></div>`).join("");

// ----- Ceramah (tautan ke YouTube) -----
const UST=[["Ustadz Abdul Somad","UAS","Ustadz Abdul Somad Official"],["Ustadz Adi Hidayat","UAH","Adi Hidayat Official"]];
const TOP=["ceramah singkat","kajian sholat","kajian subuh","tausiyah"];
const yt=q=>"https://www.youtube.com/results?search_query="+encodeURIComponent(q);
$("cm-list").innerHTML=UST.map(u=>`<div class="item ust"><div class="av">${u[1]}</div><div><h3>${u[0]}</h3><a class="gps" href="${yt(u[2])}" target="_blank" rel="noopener">▶ Cari kanal resmi</a><div class="tp">${TOP.map(t=>`<a href="${yt(u[0]+" "+t)}" target="_blank" rel="noopener">${t}</a>`).join("")}</div></div></div>`).join("");

// ----- Dzikir & Wirid -----
const DZ=[
["s","أَسْتَغْفِرُ اللّٰهَ","Astaghfirullah","Aku memohon ampun kepada Allah.",3],
["s","اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ","Allahumma antas salam wa minkas salam, tabarakta ya dzal jalali wal ikram.","Ya Allah, Engkaulah Maha Sejahtera dan dari-Mu kesejahteraan. Maha Suci Engkau, wahai Pemilik keagungan dan kemuliaan.",1],
["s","سُبْحَانَ اللّٰهِ","Subhanallah","Maha Suci Allah.",33],
["s","الْحَمْدُ لِلّٰهِ","Alhamdulillah","Segala puji bagi Allah.",33],
["s","اللّٰهُ أَكْبَرُ","Allahu Akbar","Allah Maha Besar.",33],
["s","لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ","La ilaha illallahu wahdahu la syarika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli syai'in qadir.","Tiada tuhan selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.",1],
["p","سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ","Subhanallahi wa bihamdih","Maha Suci Allah dan segala puji bagi-Nya.",100],
["p","حَسْبِيَ اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ","Hasbiyallahu la ilaha illa huwa, 'alaihi tawakkaltu wa huwa rabbul 'arsyil 'azhim.","Cukuplah Allah bagiku, tiada tuhan selain Dia. Hanya kepada-Nya aku bertawakal, dan Dia Tuhan Arsy yang agung.",7],
["p","اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ","Allahumma shalli 'ala Muhammad wa 'ala ali Muhammad.","Ya Allah, limpahkan sholawat kepada Muhammad dan keluarga Muhammad.",10],
["p","اللّٰهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ","Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastatha'tu, a'udzu bika min syarri ma shana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidzanbi faghfir li fa innahu la yaghfirudz dzunuba illa anta. (Sayyidul Istighfar)","Ya Allah, Engkau Tuhanku, tiada tuhan selain Engkau. Engkau menciptakanku dan aku hamba-Mu; aku berada di atas perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu atasku dan mengakui dosaku, maka ampunilah aku, sebab tiada yang mengampuni dosa selain Engkau.",1]];
let dg="s",cnt={};
function drawDz(){
  $("dz-list").innerHTML=DZ.map((d,i)=>d[0]!==dg?"":`<div class="item"><div class="ar-big">${d[1]}</div><i class="lt">${d[2]}</i><p>${d[3]}</p><button class="cnt" data-i="${i}">${cnt[i]||0} / ${d[4]}</button></div>`).join("");
  document.querySelectorAll(".cnt").forEach(b=>b.onclick=()=>{const i=b.dataset.i;cnt[i]=(cnt[i]||0)+1;if(cnt[i]>DZ[i][4])cnt[i]=0;b.textContent=cnt[i]+" / "+DZ[i][4];b.classList.toggle("ok",cnt[i]===DZ[i][4])})}
document.querySelectorAll("#dz-tabs button").forEach(b=>b.onclick=()=>{dg=b.dataset.g;document.querySelectorAll("#dz-tabs button").forEach(x=>x.classList.toggle("on",x===b));drawDz()});
drawDz();

// ----- Al-Qur'an (API equran.id, butuh internet) -----
const API="https://equran.id/api/v2/surat";let SUR=[];
async function loadList(){
  $("q-list").innerHTML="Memuat daftar surah…";
  try{SUR=(await (await fetch(API)).json()).data;drawList()}catch(e){$("q-list").innerHTML="<p>Gagal memuat. Periksa koneksi internet lalu coba lagi.</p>"}contChip()}
function drawList(){
  const q=$("q-search").value.toLowerCase();
  $("q-list").innerHTML=SUR.filter(s=>(s.nomor+" "+s.namaLatin+" "+s.arti).toLowerCase().includes(q)).map(s=>`<div class="card sr" data-n="${s.nomor}"><div class="no">${s.nomor}</div><div class="ar">${s.nama}</div><b>${s.namaLatin}</b><div class="nm">${s.arti} · ${s.jumlahAyat} ayat</div></div>`).join("");
  document.querySelectorAll(".sr").forEach(c=>c.onclick=()=>openS(+c.dataset.n))}
$("q-search").oninput=drawList;
function contChip(){const b=ls.g("bm",null);$("q-cont").innerHTML=b?`<button class="gps" id="q-go">📖 Lanjutkan: ${b.nm} ayat ${b.a}</button>`:"";if(b)$("q-go").onclick=()=>openS(b.n,b.a)}
function backQ(){$("q-read").classList.add("hide");$("q-box").classList.remove("hide");contChip()}
async function openS(n,a){
  const R=$("q-read");$("q-box").classList.add("hide");R.classList.remove("hide","nolt","notr");R.innerHTML="Memuat surah…";scrollTo(0,0);
  try{
    const d=(await (await fetch(API+"/"+n)).json()).data;
    R.innerHTML=`<button class="back" id="q-back">← Daftar surah</button><div class="qh"><div class="ar-big" style="text-align:center">${d.nama}</div><h3>${d.namaLatin} · ${d.arti}</h3><small>${d.tempatTurun} · ${d.jumlahAyat} ayat</small><audio controls src="${d.audioFull["05"]}"></audio><label class="ck"><input type="checkbox" id="o-l" checked> Latin</label><label class="ck"><input type="checkbox" id="o-t" checked> Terjemahan</label></div>`+
    d.ayat.map(y=>`<div class="item" id="ay-${y.nomorAyat}"><div class="top"><span class="no">${y.nomorAyat}</span><button class="bm" data-a="${y.nomorAyat}">🔖</button></div><div class="ar-big">${y.teksArab}</div><i class="lt">${y.teksLatin}</i><p class="tr">${y.teksIndonesia}</p></div>`).join("");
    $("q-back").onclick=backQ;
    $("o-l").onchange=e=>R.classList.toggle("nolt",!e.target.checked);
    $("o-t").onchange=e=>R.classList.toggle("notr",!e.target.checked);
    R.querySelectorAll(".bm").forEach(b=>b.onclick=()=>{ls.s("bm",{n,a:+b.dataset.a,nm:d.namaLatin});toast("Tanda baca: "+d.namaLatin+" ayat "+b.dataset.a)});
    if(a){const e=$("ay-"+a);if(e)e.scrollIntoView({block:"center"})}
  }catch(e){R.innerHTML='<button class="back" id="q-back">← Kembali</button><p>Gagal memuat surah. Periksa koneksi internet.</p>';$("q-back").onclick=backQ}}

// ----- Notifikasi & nada dering -----
let S=ls.g("nf",{on:false,tone:"lonceng",lead:0,vol:.8,pr:{subuh:1,dzuhur:1,ashar:1,maghrib:1,isya:1}}),AC,custom=ls.g("nfc",null);const fired=new Set();
const saveS=()=>ls.s("nf",S);
function tone(name){
  AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();
  if(name==="kustom"){if(custom){const a=new Audio(custom);a.volume=S.vol;a.play()}return}
  const t0=AC.currentTime,g=AC.createGain();g.gain.value=S.vol*.4;g.connect(AC.destination);
  const note=(f,t,d,ty)=>{const o=AC.createOscillator(),e=AC.createGain();o.type=ty;o.frequency.value=f;e.gain.setValueAtTime(0,t0+t);e.gain.linearRampToValueAtTime(1,t0+t+.02);e.gain.exponentialRampToValueAtTime(.001,t0+t+d);o.connect(e);e.connect(g);o.start(t0+t);o.stop(t0+t+d+.05)};
  const P={lonceng:[[880,0,2],[1320,0,1.6],[1760,.02,1],[880,1.2,2],[1320,1.2,1.6]],seruling:[[523,0,.6],[587,.5,.6],[659,1,.6],[784,1.5,1.2],[659,2.6,.6],[523,3.1,1.4]],melodi:[[659,0,.5],[622,.5,.5],[659,1,.5],[587,1.5,.5],[523,2,.5],[587,2.5,.5],[494,3,1.5]],digital:[[1000,0,.15],[1000,.25,.15],[1000,.5,.15],[1400,.9,.4]]};
  (P[name]||P.lonceng).forEach(n=>note(n[0],n[1],n[2],name==="digital"?"square":"sine"))}
function fire(x){
  const m=S.lead?`${S.lead} menit lagi masuk waktu ${x.n}`:`Waktunya sholat ${x.n}`;
  tone(S.tone);toast("🔔 "+m);
  try{if(Notification.permission==="granted")new Notification(m,{body:loc[0]+" · "+fmt(((x.w+loc[3]*36e5)%864e5)/36e5),tag:x.k+x.w})}catch(e){}}
setInterval(()=>{if(!S.on)return;const now=Date.now();
  seq().forEach(x=>{const f=x.w-S.lead*6e4,key=x.k+x.w;if(S.pr[x.k]&&now>=f&&now-f<6e4&&!fired.has(key)){fired.add(key);fire(x)}})},1000);
function drawN(){
  $("nf-on").textContent=S.on?"🔕 Matikan notifikasi":"🔔 Aktifkan notifikasi";
  const p=window.Notification?Notification.permission:"tidak didukung";
  $("nf-st").textContent="Status: "+(S.on?"AKTIF":"nonaktif")+" · izin browser: "+p;
  $("nf-tone").value=S.tone;$("nf-lead").value=S.lead;$("nf-vol").value=S.vol;
  $("nf-pr").innerHTML=NAMES.map(([k,n])=>`<label class="ck"><input type="checkbox" data-k="${k}" ${S.pr[k]?"checked":""}> ${n}</label>`).join("");
  document.querySelectorAll("#nf-pr input").forEach(c=>c.onchange=()=>{S.pr[c.dataset.k]=c.checked?1:0;saveS()})}
$("nf-on").onclick=async()=>{
  S.on=!S.on;
  if(S.on){AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();try{await Notification.requestPermission()}catch(e){}toast("Notifikasi aktif. Biarkan halaman tetap terbuka.")}
  saveS();drawN()};
$("nf-tone").onchange=e=>{S.tone=e.target.value;saveS();if(S.tone==="kustom"&&!custom)$("nf-file").click()};
$("nf-lead").onchange=e=>{S.lead=+e.target.value;saveS()};
$("nf-vol").oninput=e=>{S.vol=+e.target.value;saveS()};
$("nf-file").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{custom=r.result;if(!ls.s("nfc",custom))toast("File terlalu besar untuk disimpan; berlaku sampai halaman ditutup.");tone("kustom")};r.readAsDataURL(f)};
$("nf-t1").onclick=()=>tone(S.tone);
$("nf-t2").onclick=()=>fire({k:"uji",n:"Dzuhur",w:Date.now()});
drawN();
