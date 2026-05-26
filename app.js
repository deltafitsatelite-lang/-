const STORAGE_KEY='pta_static_state_v1';
const REPORTS_KEY='pta_static_reports_v1';

const $=id=>document.getElementById(id);
const state={days:[]};

const saveState=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify({...state,form:readForm()}));
const loadState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}};
const loadReports=()=>{try{return JSON.parse(localStorage.getItem(REPORTS_KEY)||'[]')}catch{return[]}};
const saveReports=r=>localStorage.setItem(REPORTS_KEY,JSON.stringify(r));

function readForm(){return {
  nextGoal:$('nextGoal').value,goalPriority:$('goalPriority').value,goalMemo:$('goalMemo').value,
  customerName:$('customerName').value,planTitle:$('planTitle').value,startDate:$('startDate').value,endDate:$('endDate').value,nextTrainingDate:$('nextTrainingDate').value,trainerMessage:$('trainerMessage').value
};}

function renderDays(){
  const wrap=$('days');wrap.innerHTML='';
  state.days.forEach((d,i)=>{const el=document.createElement('div');el.className='day-card';el.innerHTML=`<div class="day-head"><strong>${d.date}（${d.weekday}）</strong>${d.isRest?'<span class="badge">休養日</span>':''}</div>
<label>トレーニング<textarea data-i="${i}" data-k="training">${d.training}</textarea></label>
<label>有酸素<textarea data-i="${i}" data-k="cardio">${d.cardio}</textarea></label>
<label>ケア<textarea data-i="${i}" data-k="care">${d.care}</textarea></label>
<label>食事<textarea data-i="${i}" data-k="meal">${d.meal}</textarea></label>
<label>睡眠<textarea data-i="${i}" data-k="sleep">${d.sleep}</textarea></label>
<label>体重記録<textarea data-i="${i}" data-k="weight">${d.weight}</textarea></label>
<label>水分<textarea data-i="${i}" data-k="water">${d.water}</textarea></label>
<label>習慣<textarea data-i="${i}" data-k="habit">${d.habit}</textarea></label>
<label>学習<textarea data-i="${i}" data-k="study">${d.study}</textarea></label>
<label>メモ<textarea data-i="${i}" data-k="memo">${d.memo}</textarea></label>`;wrap.appendChild(el)});
  wrap.querySelectorAll('textarea').forEach(t=>t.addEventListener('input',e=>{const {i,k}=e.target.dataset;state.days[+i][k]=e.target.value;saveState();renderPdfPreview();}));
}

function dayName(date){return ['日','月','火','水','木','金','土'][new Date(date).getDay()]}
function buildPdfHeaderHtml(form){const trainerMessage=(form.trainerMessage||'').trim();const trainerCard=trainerMessage?`<div class="pdf-card pdf-message-card"><h3>【トレーナーからのメッセージ】</h3><p>${trainerMessage.replace(/\n/g,'<br>')}</p></div>`:'';const locaboCard=`<div class="pdf-card pdf-rule-card"><h3>【ロカボルール】</h3><ul><li>1食の糖質量を20〜40gにすること</li><li>1日のトータル糖質量を120g以下にすること</li><li>タンパク質と脂質をしっかりとること</li></ul></div>`;return `<div class="pdf-card pdf-title-card"><h3>${form.planTitle||'課題プラン'}</h3><p>顧客名: ${form.customerName||'未入力'}</p><p>期間: ${form.startDate||'-'} 〜 ${form.endDate||'-'}</p><p>次回PT: ${form.nextTrainingDate||'未設定'}</p></div>${trainerCard}${locaboCard}<div class="pdf-card pdf-goal-card"><h3>【次回までの目標】</h3><p>${form.nextGoal||'未入力'}</p><p><strong>優先度:</strong> ${form.goalPriority||'中'}</p><p><strong>目標メモ:</strong> ${form.goalMemo||'なし'}</p></div>`;}
function genDays(){const s=$('startDate').value,e=$('endDate').value;if(!s||!e)return;const a=[];let cur=new Date(s),end=new Date(e);while(cur<=end){const ds=cur.toISOString().slice(0,10);a.push({date:ds,weekday:dayName(ds),isRest:cur.getDay()===0,training:'スクワット 10回 × 2セット',cardio:'10分ウォーキング',care:'下半身ストレッチ 5分',meal:'毎食たんぱく質1品',sleep:'寝る30分前にスマホを置く',weight:'起床後に体重記録',water:'水1.5L',habit:'就寝前に明日の予定確認',study:'『小さな習慣』1章',memo:'痛みが出たら中止し、トレーナーに相談してください。'});cur.setDate(cur.getDate()+1)}state.days=a;saveState();renderDays();renderPdfPreview();}

function renderPdfPreview(){const f=readForm();const p=$('pdfPreview');p.innerHTML=buildPdfHeaderHtml(f);
  state.days.forEach(d=>{const c=document.createElement('div');c.className='pdf-card';c.innerHTML=`<div class="day-head"><strong>${d.date}（${d.weekday}）</strong>${d.isRest?'<span class="badge">休養日</span>':''}</div><p><strong>トレーニング</strong><br>${d.training}</p><p><strong>有酸素</strong><br>${d.cardio}</p><p><strong>ケア</strong><br>${d.care}</p><p><strong>食事</strong><br>${d.meal}</p><p><strong>睡眠</strong><br>${d.sleep}</p><p><strong>体重記録</strong><br>${d.weight}</p><p><strong>水分</strong><br>${d.water}</p><p><strong>習慣</strong><br>${d.habit}</p><p><strong>学習</strong><br>${d.study}</p><p><strong>メモ</strong><br>${d.memo}</p>`;p.appendChild(c)});
}

function saveReport(){const f=readForm();const report={id:crypto.randomUUID(),customerName:f.customerName,periodStart:f.startDate,periodEnd:f.endDate,nextGoal:f.nextGoal,goalPriority:f.goalPriority,goalMemo:f.goalMemo,days:structuredClone(state.days),completionSummary:{trainingCompletion:+$('cTraining').value,mealCompletion:+$('cMeal').value,sleepCompletion:+$('cSleep').value,weightLogCompletion:+$('cWeight').value,waterCompletion:+$('cWater').value,studyCompletion:+$('cStudy').value,overallCompletion:Math.round((+$('cTraining').value + +$('cMeal').value + +$('cSleep').value + +$('cWeight').value + +$('cWater').value + +$('cStudy').value)/6)},customerFeedback:$('customerFeedback').value,trainerMemo:$('reportTrainerMemo').value,painOrDiscomfort:$('painOrDiscomfort').value,difficultyFeedback:$('difficultyFeedback').value,improvementMemo:$('improvementMemo').value,createdAt:new Date().toISOString()};
const reports=loadReports();reports.unshift(report);saveReports(reports);bindReportSelect();alert('保存しました');}

function bindReportSelect(){const name=$('reportCustomerFilter').value.trim();const sel=$('reportSelect');sel.innerHTML='<option value="">選択してください</option>';loadReports().filter(r=>!name||r.customerName.includes(name)).forEach(r=>{const o=document.createElement('option');o.value=r.id;o.textContent=`${r.customerName} ${r.periodStart}〜${r.periodEnd} (${new Date(r.createdAt).toLocaleDateString()})`;sel.appendChild(o);});}

function previewReport(){const id=$('reportSelect').value;const r=loadReports().find(v=>v.id===id);$('reportPreview').textContent=r?JSON.stringify(r,null,2):'';}

function generateFromLast(){const id=$('reportSelect').value;const r=loadReports().find(v=>v.id===id);if(!r){alert('先週レポートを選択してください');return}
state.days=state.days.map((d,i)=>{const prev=r.days[i]||r.days[r.days.length-1]||d;const high=r.completionSummary.overallCompletion>=80;const low=r.completionSummary.overallCompletion<50;const hard=r.difficultyFeedback==='難しかった';const easy=r.difficultyFeedback==='簡単すぎた';const pain=(r.painOrDiscomfort||'').trim().length>0;
let training=prev.training||d.training;
if(high||easy) training=training.replace('2セット','3セット');
if(low||hard) training='椅子スクワット 8回 × 2セット（最低限これだけでOK）';
if(pain) training+='\n痛みが出たら中止し、トレーナーに相談してください。';
const meal=r.completionSummary.mealCompletion<60?'毎食たんぱく質を1品入れる':prev.meal;
const sleep=r.completionSummary.sleepCompletion<60?'寝る30分前にスマホを置く':prev.sleep;
const weight=r.completionSummary.weightLogCompletion<60?'体重記録は週3回でOK':prev.weight;
const study=(prev.study||d.study).replace('ページ範囲','').replace(/p\.?\d+[-~〜]\d+/g,'').trim();
return {...d,training,meal,sleep,weight,study,memo:(prev.memo||d.memo)+'\n先週の結果を反映して調整済み。'};});
renderDays();renderPdfPreview();saveState();}

function downloadPdf(){const f=readForm();const w=window.open('','_blank');if(!w)return;const content=buildPdfHeaderHtml(f)+state.days.map(d=>`<div class="pdf-card"><div class="day-head"><strong>${d.date}（${d.weekday}）</strong>${d.isRest?'<span class="badge">休養日</span>':''}</div><p><strong>トレーニング</strong><br>${d.training}</p><p><strong>有酸素</strong><br>${d.cardio}</p><p><strong>ケア</strong><br>${d.care}</p><p><strong>食事</strong><br>${d.meal}</p><p><strong>睡眠</strong><br>${d.sleep}</p><p><strong>体重記録</strong><br>${d.weight}</p><p><strong>水分</strong><br>${d.water}</p><p><strong>習慣</strong><br>${d.habit}</p><p><strong>学習</strong><br>${d.study}</p><p><strong>メモ</strong><br>${d.memo}</p></div>`).join('');w.document.write(`<html><head><title>PDF</title><style>body{font-family:sans-serif;padding:16px}.pdf-card{border:1px solid #ccc;border-radius:8px;padding:10px;margin-bottom:10px}.pdf-title-card{border:2px solid #2563eb;background:#dbeafe}.pdf-title-card h3{margin:0 0 6px 0;color:#1e3a8a}.pdf-goal-card{border:2px solid #2563eb;background:#eff6ff}.pdf-goal-card h3{margin:0 0 6px 0;color:#1e3a8a}.pdf-message-card,.pdf-rule-card{background:#f8fafc}.pdf-message-card h3,.pdf-rule-card h3{margin:0 0 6px 0;color:#0f172a}.pdf-rule-card ul{margin:0;padding-left:18px;display:grid;gap:4px}.day-head{display:flex;justify-content:space-between}.badge{background:#fef3c7;color:#92400e;border-radius:999px;padding:2px 8px;font-size:12px}</style></head><body>${content}</body></html>`);w.document.close();w.focus();w.print();}

function init(){const st=loadState();if(st.form){Object.entries(st.form).forEach(([k,v])=>{const el=$(k);if(el)el.value=v??''});}
state.days=st.days||[];renderDays();renderPdfPreview();bindReportSelect();
['nextGoal','goalPriority','goalMemo','customerName','planTitle','startDate','endDate','nextTrainingDate','trainerMessage','reportCustomerFilter'].forEach(id=>$(id).addEventListener('input',()=>{saveState();if(id==='reportCustomerFilter')bindReportSelect();renderPdfPreview();}));
$('generateDays').onclick=genDays;$('saveReport').onclick=saveReport;$('reportSelect').onchange=previewReport;$('generateFromLast').onclick=generateFromLast;$('downloadPdf').onclick=downloadPdf;}
init();
