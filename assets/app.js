const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(other => {const selected=other===button;other.classList.toggle('selected',selected);other.setAttribute('aria-pressed',String(selected));});
  document.querySelectorAll('.filter-items [data-category]').forEach(item=>{item.hidden=button.dataset.filter!=='all'&&item.dataset.category!==button.dataset.filter;});
}));

const dialog=document.querySelector('.search-dialog');
const input=document.querySelector('#site-search');
const results=document.querySelector('#search-results');
let searchIndex;
async function search(){
  if(!searchIndex){try{const res=await fetch('/assets/search.json');if(!res.ok)throw Error('load');searchIndex=await res.json();}catch{results.innerHTML='<p class="search-empty">暂时无法加载搜索，请稍后重试。</p>';return;}}
  const query=input.value.trim().toLowerCase();
  const matches=searchIndex.filter(item=>!query||(item.title+' '+item.text).toLowerCase().includes(query));
  results.replaceChildren();
  if(!matches.length){const p=document.createElement('p');p.className='search-empty';p.textContent='没有找到相关内容，试试 Linux、PID 或 STM32。';results.append(p);return;}
  matches.forEach(item=>{const a=document.createElement('a');a.className='search-result';a.href=item.url;const type=document.createElement('span');type.textContent=item.type;const title=document.createElement('strong');title.textContent=item.title;a.append(type,title);results.append(a);});
}
document.querySelector('.search-trigger').addEventListener('click',()=>{dialog.showModal();input.focus();search();});
document.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
input.addEventListener('input',search);
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(!dialog.open){dialog.showModal();input.focus();search();}}});

document.querySelectorAll('.prose pre').forEach(pre=>{const wrapper=document.createElement('div');wrapper.className='code-wrap';pre.before(wrapper);wrapper.append(pre);const button=document.createElement('button');button.className='copy-code';button.textContent='复制代码';wrapper.append(button);button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.textContent);button.textContent='已复制 ✓';}catch{button.textContent='请手动选择复制';}setTimeout(()=>button.textContent='复制代码',2000);});});
const progress=document.querySelector('.reading-progress');
if(progress){const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?Math.min(100,scrollY/max*100):0)+'%';};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}

const refreshButton=document.querySelector('#refresh-repos');
async function refreshRepos(){
  refreshButton.disabled=true;
  const status=document.querySelector('#repo-status');status.textContent='正在获取最新公开项目…';
  try{
    const response=await fetch('https://api.github.com/users/Ygreece/repos?sort=updated&per_page=100',{signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('GitHub unavailable');
    const all=await response.json();if(!Array.isArray(all))throw Error('Invalid response');
    const repos=all.filter(r=>!r.fork&&r.name.toLowerCase()!=='ygreece.github.io').slice(0,12);
    if(!repos.length){status.textContent='暂未找到可展示的公开项目，保留仓库记录。';return;}
    const list=document.querySelector('#repo-list');list.replaceChildren();
    for(const repo of repos){
      // Only accept this account's canonical public GitHub links.
      if(!/^https:\/\/github\.com\/Ygreece\/[^/?#]+$/i.test(repo.html_url))continue;
      const a=document.createElement('a');a.className='repo-row';a.href=repo.html_url;
      const details=document.createElement('div'),h=document.createElement('h2'),p=document.createElement('p'),meta=document.createElement('span'),date=document.createElement('small');
      h.textContent=repo.name+' ↗';p.textContent=repo.description||'代码与学习记录。';meta.className='repo-meta';meta.textContent=repo.language||'PROJECT';date.textContent=String(repo.updated_at).slice(0,10);meta.append(date);details.append(h,p);a.append(details,meta);list.append(a);
    }
    status.textContent='已同步 GitHub 最新公开项目 · '+new Date().toLocaleDateString('zh-CN');
  }catch{status.textContent='暂时无法连接 GitHub，显示原站仓库记录（2026.09）。';}
  finally{refreshButton.disabled=false;}
}
if(refreshButton){refreshButton.addEventListener('click',refreshRepos);refreshRepos();}
