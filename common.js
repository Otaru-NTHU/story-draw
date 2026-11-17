// 共用：Firebase 初始化、欄位定義、小工具
const ORDER = ["hero","time","place","action","goal","mg"];
const FIELDS = {
  hero:  { k:"主角",   hint:"一個具體的人／生物／職業。例：便利商店夜班店員、即將被關機的 AI" },
  time:  { k:"時間",   hint:"時段、節慶或抽象的時間。例：期末考週、世界末日前一天" },
  place: { k:"地點",   hint:"真實或虛構。例：清大夜市、海底圖書館" },
  action:{ k:"做什麼", hint:"主角要做的一件事。例：偷回被沒收的手機、阻止一場婚禮" },
  goal:  { k:"目標",   hint:"真正的動機。例：想被某個人記住、贖罪" },
  mg:    { k:"麥高芬", hint:"大家都在追、但本身是什麼不必深究的東西。例：一把沒有門的鑰匙、核心鑽頭" }
};
const TECHS = [
  "麥高芬在第一幕出現、第三幕才揭露它的真相",
  "契訶夫之槍：第一幕放的東西，第三幕一定要用到",
  "資訊差：觀眾知道、主角不知道",
  "開場即反轉：第 1 分鐘就推翻觀眾的預期",
  "不可靠敘事者：敘述者說的不一定是真的",
  "第一集結尾鉤子：最後 30 秒翻盤",
  "雙線敘事：兩條線在第三幕交會",
  "倒敘開場：先看到結局的一角再回頭"
];
const PHASES = { login:"登入", input:"填元素", draw:"抽籤", write:"寫大綱", scored:"看評分", reveal:"揭曉前三名" };

firebase.initializeApp(window.FIREBASE_CONFIG);
const auth = firebase.auth();
const dbf = firebase.firestore();
const SID = window.SESSION_ID;
const sessRef = dbf.collection("sessions").doc(SID);
const stuCol = sessRef.collection("students");
const pubCol = sessRef.collection("public");
const scoreCol = sessRef.collection("scores");

function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function $(id){ return document.getElementById(id); }
let _tt; function toast(m){ const t=$("toast"); if(!t) return; t.textContent=m; t.classList.add("show"); clearTimeout(_tt); _tt=setTimeout(()=>t.classList.remove("show"),2200); }
function slotHTML(d, opts){
  opts=opts||{}; d=d||{};
  return ORDER.map(k=>{
    const has = d[k]!=null && d[k]!=="";
    const cls = ["slot", k==="mg"?"mg":"", k==="tech"?"tech":"", has?"":"wait"].join(" ");
    return `<div class="${cls}" data-k="${k}"><div class="k">${FIELDS[k].k}</div><div class="v">${has?esc(d[k]):(opts.waitText||"…")}</div></div>`;
  }).join("");
}
