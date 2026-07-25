const routines={morning:['protein','meditate','journal','stretch'],day:['movement','music','water'],evening:['stretch','read']};
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
}
function toggle(id){const d=saved(),i=d.indexOf(id);i<0?d.push(id):d.splice(i,1);setSaved(d);render()}
function move(n){selected.setDate(selected.getDate()+n);const now=new Date();if(selected>now)selected=now;render()}
document.getElementById('prev').onclick=()=>move(-1);document.getElementById('next').onclick=()=>move(1);
const picker=document.getElementById('picker');document.getElementById('dateButton').onclick=()=>picker.showPicker();
picker.onchange=()=>{const [y,m,d]=picker.value.split('-');selected=new Date(y,m-1,d);if(selected>new Date())selected=new Date();render()};
document.getElementById('reset').onclick=()=>{if(confirm('Clear this day’s rhythm?')){setSaved([]);render()}};
render();
