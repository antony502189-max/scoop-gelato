const header=document.querySelector('.site-header');
document.querySelector('.mobile-toggle')?.addEventListener('click',e=>{const opened=header.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',opened);e.currentTarget.textContent=opened?'Закрыть ×':'Меню ☰';e.currentTarget.setAttribute('aria-label',opened?'Закрыть навигацию':'Открыть навигацию')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('open'))document.querySelector('.mobile-toggle').click()});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b===button));let count=0;document.querySelectorAll('.menu-grid .flavor-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&!card.dataset.type.split(' ').includes(button.dataset.filter);if(!card.hidden)count++});document.querySelector('#filter-status').textContent=`Показано вкусов: ${count}`}));
document.querySelectorAll('.detail-toggle').forEach(button=>button.addEventListener('click',()=>{const detail=document.getElementById(button.getAttribute('aria-controls'));detail.hidden=!detail.hidden;button.setAttribute('aria-expanded',!detail.hidden);button.textContent=detail.hidden?'Состав и аллергены +':'Свернуть состав −'}));
const form=document.querySelector('.visit-form');
if(form){const date=form.querySelector('[name=date]');const today=new Date();const localDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);date.min=localDate;date.value=localDate;form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form));const label=new Date(values.date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});let saved=false;try{localStorage.setItem('scoop-visit',JSON.stringify(values));saved=true}catch{}document.querySelector('.form-message').textContent=`План ${saved?'сохранён на этом устройстве':'готов'}: ${label}, ${values.time}, гостей — ${values.guests}. Любимый вкус: ${values.flavor}. Это демонстрация: бронь никуда не отправлена.`})}
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.swatch').forEach(b=>b.setAttribute('aria-pressed',b===button));document.querySelector('#flavor-name').textContent=button.dataset.name;document.dispatchEvent(new CustomEvent('scoop-flavor',{detail:button.dataset.color}))}));
if(document.querySelector('#scoop-canvas'))import('./model.js').catch(()=>{document.querySelector('.model-hint').textContent='Фирменный рожок SCOOP';document.querySelector('.flavor-control').hidden=true});

const surprise=document.querySelector('#surprise-flavor');
let lastPick=null;
function clearPick(){document.querySelectorAll('.is-picked').forEach(card=>card.classList.remove('is-picked'));const result=document.querySelector('#surprise-result');if(result)result.textContent='Не можете выбрать? Доверьтесь случаю.'}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',clearPick));
surprise?.addEventListener('click',()=>{
 const visible=[...document.querySelectorAll('.menu-grid .flavor-card')].filter(card=>!card.hidden);
 const candidates=visible.length>1?visible.filter(card=>card!==lastPick):visible;
 if(!candidates.length)return;
 clearPick();const card=candidates[Math.floor(Math.random()*candidates.length)];lastPick=card;card.classList.add('is-picked');
 document.querySelector('#surprise-result').textContent='Сегодня попробуйте: '+card.querySelector('h3').textContent+'.';
 card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
});
if(form){
 try{const saved=JSON.parse(localStorage.getItem('scoop-visit'));if(saved&&typeof saved==='object'&&typeof saved.date==='string'&&saved.date>=form.elements.date.min){for(const name of ['date','time','guests','flavor']){const field=form.elements[name];if(typeof saved[name]==='string'&&(name==='date'||[...field.options].some(option=>option.value===saved[name])))field.value=saved[name]}document.querySelector('.form-message').textContent='Ваш сохранённый план восстановлен. Можно изменить детали и сохранить снова.'}}catch{}
}
