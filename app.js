const exercises=[
 {name:'Goblet Squat',thai:'Goblet Squat',sets:3,reps:'10–12',weight:'เริ่ม 6–10 kg',icon:'01'},
 {name:'Dumbbell Romanian Deadlift',thai:'Dumbbell RDL',sets:3,reps:'10–12',weight:'เริ่ม 6–10 kg',icon:'02'},
 {name:'Dumbbell Floor Press',thai:'Dumbbell Floor Press',sets:3,reps:'10–12',weight:'เริ่ม 4–8 kg',icon:'03'},
 {name:'One-arm Dumbbell Row',thai:'One-arm Row',sets:3,reps:'10 / ข้าง',weight:'เริ่ม 6–10 kg',icon:'04'},
 {name:'Dumbbell Shoulder Press',thai:'Shoulder Press',sets:3,reps:'8–10',weight:'เริ่ม 4–8 kg',icon:'05'},
 {name:'Plank',thai:'Plank',sets:3,reps:'30–45 วินาที',weight:'น้ำหนักตัว',icon:'06'}
];
const key='fittrack-history';
let history=JSON.parse(localStorage.getItem(key)||'[]');
let completed=JSON.parse(localStorage.getItem('fittrack-today')||'[]');
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem(key,JSON.stringify(history));localStorage.setItem('fittrack-today',JSON.stringify(completed));}
function todayKey(){return new Date().toISOString().slice(0,10)}
function fmtDate(d){return new Intl.DateTimeFormat('th-TH',{day:'numeric',month:'short',year:'numeric'}).format(new Date(d))}
function renderWorkout(){
 $('#workoutList').innerHTML=exercises.map((e,i)=>`<article class="workout-card"><div class="workout-number">${e.icon}</div><div><h3>${e.thai}</h3><p>${e.name}</p><div class="workout-meta"><span class="chip">${e.sets} เซ็ต</span><span class="chip">${e.reps}</span><span class="chip">${e.weight}</span></div></div><label>น้ำหนัก (kg)<input type="number" min="0" step="0.5" value="${localStorage.getItem('weight-'+i)||''}" data-weight="${i}" placeholder="kg"></label></article>`).join('');
 $$('[data-weight]').forEach(x=>x.addEventListener('input',e=>localStorage.setItem('weight-'+e.target.dataset.weight,e.target.value)));
}
function renderDashboard(){
 $('#dashboardExercises').innerHTML=exercises.slice(0,5).map((e,i)=>`<div class="exercise-row"><div class="exercise-icon">${e.icon}</div><div class="exercise-info"><b>${e.thai}</b><small>${e.sets} เซ็ต · ${e.reps}</small></div><button class="check ${completed.includes(i)?'done':''}" data-check="${i}">${completed.includes(i)?'✓':''}</button></div>`).join('')+`<div class="exercise-row"><div class="exercise-icon">06</div><div class="exercise-info"><b>Plank</b><small>3 เซ็ต · 30–45 วินาที</small></div><button class="check ${completed.includes(5)?'done':''}" data-check="5">${completed.includes(5)?'✓':''}</button></div>`;
 $$('[data-check]').forEach(b=>b.onclick=()=>{const i=+b.dataset.check;completed=completed.includes(i)?completed.filter(x=>x!==i):[...completed,i];save();renderAll()});
 const pct=Math.round(completed.length/exercises.length*100);$('#heroCount').textContent=pct+'%';
 const workouts=history.length, mins=history.reduce((a,x)=>a+x.minutes,0), sets=history.reduce((a,x)=>a+x.sets,0);
 $('#statWorkouts').textContent=workouts;$('#statMinutes').textContent=mins;$('#statSets').textContent=sets;$('#statStreak').textContent=calcStreak();
 $('#goalText').textContent=Math.min(workouts,4)+' / 4 วัน';$('#goalBar').style.width=Math.min(workouts/4*100,100)+'%';
 const week=$('#week');week.innerHTML=['จ','อ','พ','พฤ','ศ','ส','อา'].map((d,i)=>`<div class="day ${i<Math.min(workouts,4)?'done':''}"><b>${d}</b><span>${i<Math.min(workouts,4)?'✓':'—'}</span></div>`).join('');
}
function calcStreak(){if(!history.length)return 0;let dates=[...new Set(history.map(x=>x.date))].sort().reverse(),streak=0;let cur=new Date();for(const d of dates){const target=new Date(cur);target.setDate(cur.getDate()-streak);if(d===target.toISOString().slice(0,10))streak++;else if(streak===0&&d===new Date(cur.getTime()-86400000).toISOString().slice(0,10))streak++;else break}return streak}
function renderHistory(){const box=$('#historyList');if(!history.length){box.innerHTML='<div class="empty">ยังไม่มีประวัติ — เริ่ม Workout วันนี้ได้เลย</div>';return}box.innerHTML=[...history].reverse().map(x=>`<div class="history-item"><div><b>Full Body Workout</b><span>${fmtDate(x.date)} · ${x.sets} เซ็ต · ${x.minutes} นาที</span></div><strong>✓ เสร็จแล้ว</strong></div>`).join('')}
function renderProgress(){const total=history.length;$('#progressWorkouts').textContent=total;$('#progressMinutes').textContent=history.reduce((a,x)=>a+x.minutes,0);$('#progressSets').textContent=history.reduce((a,x)=>a+x.sets,0);$('#progressRate').textContent=total?Math.round(history.reduce((a,x)=>a+x.completed,0)/(total*6)*100)+'%':'0%';$('#exerciseProgress').innerHTML=exercises.map((e,i)=>{const n=history.reduce((a,x)=>a+(x.exerciseIndexes||[]).includes(i)?a+1:a,0);const pct=total?Math.round(n/total*100):0;return `<div class="progress-line"><header><span>${e.thai}</span><b>${pct}%</b></header><div class="progress"><i style="width:${pct}%"></i></div></div>`}).join('')}
function renderAll(){renderDashboard();renderHistory();renderProgress()}
function nav(){ $$('.nav-item').forEach(b=>b.onclick=()=>go(b.dataset.section));$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go)) }
function go(id){$$('.section').forEach(s=>s.classList.remove('active-section'));$('#'+id).classList.add('active-section');$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===id));$('#pageTitle').textContent=id==='dashboard'?'Dashboard':id==='workout'?'Workout วันนี้':id==='history'?'ประวัติ':'Progress';window.scrollTo({top:0,behavior:'smooth'})}
$('#finishWorkout').onclick=()=>{if(!completed.length){alert('เลือกหรือทำอย่างน้อย 1 ท่าก่อนบันทึกครับ');return}const today=todayKey();const existing=history.findIndex(x=>x.date===today);const entry={date:today,completed:completed.length,sets:completed.reduce((a,i)=>a+exercises[i].sets,0),minutes:completed.length*7,exerciseIndexes:completed};if(existing>=0)history[existing]=entry;else history.push(entry);completed=[];save();renderAll();alert('บันทึก Workout วันนี้เรียบร้อยแล้ว');go('dashboard')};
$('#today').textContent=new Intl.DateTimeFormat('th-TH',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
renderWorkout();nav();renderAll();