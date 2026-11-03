import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const routes=['','projects','notes','about','contact','github-projects','404',...['linux-file-server','robomaster','tbox','balance-car'].map(id=>'projects/'+id),...['linux-learning-guide','robomaster-review'].map(id=>'notes/'+id)];
for(const route of routes){
 const file=path.join(root,route,'index.html'),html=readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`Missing primary heading: ${route}`);
 assert(!html.includes('{{'),'No unresolved Liquid markup');
 for(const [,url,hash]of html.matchAll(/(?:href|src)="(\/[^"#]*)(#[^"]*)?"/g)){
  const target=path.join(root,url,url.endsWith('/')?'index.html':'');
  assert(existsSync(target),`Missing link: ${url}`);
  if(hash)assert(readFileSync(target,'utf8').includes(`id="${hash.slice(1)}"`));
 }
 for(const [,id]of html.matchAll(/href="#([^"]+)"/g))assert(html.includes(`id="${id}"`),`Missing anchor ${id}`);
}
for(const from of ['portfolio','posts','categories','tags','portfolio/linux-file-server','portfolio/robomaster','portfolio/tbox','portfolio/balance-car','项目/robomaster-总结','学习笔记/linux-应用编程学习指南']){
 const html=readFileSync(path.join(root,from,'index.html'),'utf8');
 const to=html.match(/http-equiv="refresh" content="0;url=([^"]+)"/)[1];
 assert(existsSync(path.join(root,to,'index.html')),`Missing redirect target: ${to}`);
}
assert(existsSync(path.join(root,'.nojekyll')));
assert.equal(JSON.parse(readFileSync(path.join(root,'assets/search.json'),'utf8')).length,6);
console.log('Verified all 13 pages, 10 legacy redirects, local assets, anchors, search index and GitHub Pages entrypoint.');
