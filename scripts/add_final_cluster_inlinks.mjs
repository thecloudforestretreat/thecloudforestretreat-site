import fs from 'node:fs/promises';
const targetEn='/mindo-vs-cloud-forest-retreat/',targetEs='/es/mindo-vs-cloud-forest-retreat/';
const pages=[
 ['cloud-forest-lodge-near-quito/index.html',targetEn,'Compare with Mindo','money_page'],
 ['eco-lodge-quito-ecuador/index.html',targetEn,'Mindo comparison','money_page'],
 ['weekend-getaway-from-quito/index.html',targetEn,'Mindo or a forest retreat?','money_page'],
 ['cloud-forest-quito-ecuador/index.html',targetEn,'Compare Mindo and the retreat','money_page'],
 ['nature-retreat-quito/index.html',targetEn,'Mindo comparison','money_page'],
 ['es/lodge-bosque-nublado-cerca-de-quito/index.html',targetEs,'Compara con Mindo','money_page'],
 ['es/eco-lodge-quito-ecuador/index.html',targetEs,'Comparación con Mindo','money_page'],
 ['es/escapada-fin-de-semana-quito/index.html',targetEs,'¿Mindo o un retiro en el bosque?','money_page'],
 ['es/bosque-nublado-quito-ecuador/index.html',targetEs,'Compara Mindo y el retiro','money_page'],
 ['es/retiro-naturaleza-quito/index.html',targetEs,'Comparación con Mindo','money_page'],
];
for(const [file,href,label,type] of pages){
 let html=await fs.readFile(file,'utf8');
 if(html.includes(`href="${href}"`)) continue;
 const marker='<div class="tcfr-related__grid">';
 const start=html.indexOf(marker); if(start<0) throw Error(`Missing related grid: ${file}`);
 const end=html.indexOf('</div>',start); if(end<0) throw Error(`Missing related grid end: ${file}`);
 const link=`<a class="tcfr-related__link" href="${href}" data-analytics-event="internal_link_click" data-analytics-location="related_content" data-analytics-label="${label}" data-analytics-page-type="${type}">${label}</a>`;
 html=html.slice(0,end)+link+html.slice(end);
 await fs.writeFile(file,html);
}
console.log(JSON.stringify({updated:pages.map(x=>x[0])}));
