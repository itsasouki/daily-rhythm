const routines={morning:['protein','meditate','journal','stretch'],day:['movement','music','water'],evening:['stretch','read']};
const quotes=[
  ['The most creative act you will ever undertake is the act of creating yourself.','Deepak Chopra'],
  ['Knowing yourself is the beginning of all wisdom.','Aristotle'],
  ['I am rooted, but I flow.','Virginia Woolf'],
  ['The quieter you become, the more you are able to hear.','Rumi'],
  ['Attention is the rarest and purest form of generosity.','Simone Weil'],
  ['Creativity takes courage.','Henri Matisse'],
  ['Your vision will become clear only when you can look into your own heart.','Carl Jung'],
  ['Nothing is worth more than this day.','Johann Wolfgang von Goethe'],
  ['The future belongs to those who believe in the beauty of their dreams.','Eleanor Roosevelt'],
  ['There is no greater agony than bearing an untold story inside you.','Maya Angelou'],
  ['Arrange whatever pieces come your way.','Virginia Woolf'],
  ['The privilege of a lifetime is being who you are.','Joseph Campbell'],
  ['Be present in all things and thankful for all things.','Maya Angelou'],
  ['Within you there is a stillness and a sanctuary to which you can retreat at any time.','Hermann Hesse']
];
let selected=new Date();
const pad=n=>String(n).padStart(2,'0');
const key=()=>`${selected.getFullYear()}-${pad(selected.getMonth()+1)}-${pad(selected.getDate())}`;
const saved=()=>JSON.parse(localStorage.getItem('rhythm:'+key())||'[]');
function setSaved(v){localStorage.setItem('rhythm:'+key(),JSON.stringify(v))}
function isToday(){const n=new Date();return selected.toDateString()===n.toDateString()}
function render(){
  const done=saved();
  document.querySelectorAll('.tasks').forEach(x=>x.innerHTML='');
  Object.entries(routines).forEach(([period,items])=>items.forEach((label,i)=>{
    const id=`${period}-${i}`; const b=document.createElement('button');
    b.className='task'+(done.includes(id)?' done':''); b.dataset.id=id;
    b.innerHTML=`<span class="num">${pad(i+1)}</span><span class="label">${label}</span><span class="circle"></span>`;
    b.onclick=()=>toggle(id); document.getElementById(period).appendChild(b);
  }));
  const total=Object.values(routines).flat().length, count=done.length;
  document.getElementById('count').textContent=`${count} / ${total}`;
  document.getElementById('bar').style.width=`${count/total*100}%`;
  document.getElementById('weekday').textContent=selected.toLocaleDateString('en-US',{weekday:'long'});
  document.getElementById('date').textContent=selected.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  document.getElementById('greeting').textContent=count===total?'The day is complete.':isToday()?'A quiet beginning.':'A day remembered.';
  document.getElementById('next').style.opacity=isToday()?'.18':'1';
  const word=document.getElementById('dailyWord');
  word.value=localStorage.getItem('word:'+key())||'';
  const dayNumber=Math.floor(new Date(selected.getFullYear(),selected.getMonth(),selected.getDate()).getTime()/86400000);
  const q=quotes[Math.abs(dayNumber)%quotes.length];
  document.getElementById('quote').textContent=q[0];
  document.getElementById('author').textContent='— '+q[1];
}
function toggle(id){const d=saved(),i=d.indexOf(id);i<0?d.push(id):d.splice(i,1);setSaved(d);render()}
function move(n){selected.setDate(selected.getDate()+n);const now=new Date();if(selected>now)selected=now;render()}
document.getElementById('prev').onclick=()=>move(-1);document.getElementById('next').onclick=()=>move(1);
const picker=document.getElementById('picker');document.getElementById('dateButton').onclick=()=>picker.showPicker();
picker.onchange=()=>{const [y,m,d]=picker.value.split('-');selected=new Date(y,m-1,d);if(selected>new Date())selected=new Date();render()};
function archiveData(){
  const total=Object.values(routines).flat().length, today=new Date(), rows=[];
  for(let i=27;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);const k=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;let count=0;try{count=JSON.parse(localStorage.getItem('rhythm:'+k)||'[]').length}catch(e){}rows.push({d,k,count,pct:count/total*100})}
  return rows;
}
function renderArchive(){
  const rows=archiveData(), active=rows.filter(x=>x.count>0), avg=active.length?active.reduce((s,x)=>s+x.pct,0)/active.length:0;
  const prior=rows.slice(0,14), recent=rows.slice(14), mean=a=>a.reduce((s,x)=>s+x.pct,0)/a.length, delta=mean(recent)-mean(prior);
  document.getElementById('average').textContent=Math.round(avg)+'%';
  document.getElementById('days').textContent=active.length;
  document.getElementById('change').textContent=active.length<2?'—':`${delta>=0?'+':''}${Math.round(delta)}%`;
  document.getElementById('archiveRange').textContent=rows[0].d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' — '+rows[27].d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  document.getElementById('chart').innerHTML=rows.map((x,i)=>`<span class="chart-bar ${x.count?'':'zero'} ${i===27?'today':''}" style="--h:${Math.max(x.pct,1)}%" title="${x.k}: ${x.count}/9"></span>`).join('');
  let text='Your rhythm will appear here as you complete each day.';
  if(active.length>=2) text=delta>5?'Your recent rhythm is strengthening. Keep the practice gentle and consistent.':delta < -5?'Your pace has softened recently. Begin again with one small ritual.':'Your practice is steady. Consistency is becoming its own quiet form of progress.';
  document.getElementById('insightText').textContent=text;
}
function openArchive(){renderArchive();document.getElementById('archive').classList.add('open');document.getElementById('archive').setAttribute('aria-hidden','false');document.body.classList.add('archive-visible')}
function closeArchive(){document.getElementById('archive').classList.remove('open');document.getElementById('archive').setAttribute('aria-hidden','true');document.body.classList.remove('archive-visible')}
document.getElementById('archiveOpen').onclick=openArchive;
document.getElementById('archiveClose').onclick=closeArchive;
document.getElementById('dailyWord').addEventListener('input',e=>localStorage.setItem('word:'+key(),e.target.value.trim()));

document.getElementById('reset').onclick=()=>{if(confirm('Clear this day’s rhythm and word?')){setSaved([]);localStorage.removeItem('word:'+key());render()}};
render();
