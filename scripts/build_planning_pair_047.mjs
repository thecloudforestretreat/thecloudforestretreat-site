import fs from 'node:fs/promises';

const origin='https://thecloudforestretreat.com';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const track=(event,location,label,type)=>`data-analytics-event="${event}" data-analytics-location="${location}" data-analytics-label="${esc(label)}" data-analytics-page-type="${type}"`;

function schemas(p){
  const url=origin+p.path;
  return {'@context':'https://schema.org','@graph':[
    {'@type':['LodgingBusiness','BedAndBreakfast'],'@id':origin+'/#lodging',name:'The Cloud Forest Retreat',url:origin+'/',address:{'@type':'PostalAddress',addressRegion:'Pichincha',addressCountry:'EC'}},
    {'@type':'WebPage','@id':url+'#webpage',url,name:p.title,headline:p.name,description:p.description,inLanguage:p.lang,about:{'@id':origin+'/#lodging'},breadcrumb:{'@id':url+'#breadcrumb'},primaryImageOfPage:{'@type':'ImageObject',url:origin+p.hero}},
    {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:p.lang==='es'?'Inicio':'Home',item:origin+(p.lang==='es'?'/es/':'/')},{'@type':'ListItem',position:2,name:p.name,item:url}]},
    {'@type':'FAQPage','@id':url+'#faq',mainEntity:p.faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
  ]};
}

function head(p){
  const url=origin+p.path,alt=origin+p.alt,en=p.lang==='en'?url:alt,es=p.lang==='es'?url:alt,image=origin+p.hero;
  return `<!doctype html>
<html lang="${p.lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${en}" />
    <link rel="alternate" hreflang="es" href="${es}" />
    <link rel="alternate" hreflang="x-default" href="${en}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="The Cloud Forest Retreat" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.title)}" />
    <meta name="twitter:description" content="${esc(p.description)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0D5925" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/css/site.css?v=2" />
    <link rel="stylesheet" href="/assets/css/header.css?v=5" />
    <link rel="stylesheet" href="/assets/css/global.css?v=4" />
    <link rel="stylesheet" href="/assets/css/footer.css?v=10" />
    <link rel="stylesheet" href="/assets/css/clusters/planning.css?v=6" />
    <link rel="stylesheet" href="/assets/css/components/faq.css?v=2" />
    <script src="/assets/js/site-config.js?v=2"></script>
    <script defer src="/assets/js/head.js?v=3"></script>
    <script type="application/ld+json">${JSON.stringify(schemas(p))}</script>
  </head>
`;
}

const pages=[
{lang:'en',path:'/mindo-vs-cloud-forest-retreat/',alt:'/es/mindo-vs-cloud-forest-retreat/',name:'Mindo vs. The Cloud Forest Retreat',title:'Mindo vs. The Cloud Forest Retreat | Compare Your Stay',description:'Compare Mindo and The Cloud Forest Retreat by setting, pace, rooms, activities, transport and booking needs to choose the cloud forest stay that fits.',hero:'/assets/images/pages/new/Untitled-20.jpg',eyebrow:'Two different ways to plan cloud forest time',lead:'Choose by the experience you want, not by a claim that one destination is universally better. Compare the exact lodging, setting, pace, transport and activities for your dates.',facts:[['Decision','Match the stay to your priorities'],['Comparison','Use current property details'],['Planning','Confirm transport and activities']],topicsTitle:'Start with the experience you want to have',topicsText:'The useful comparison is between specific stays and itineraries—not between a town name and a photograph.',topics:[['01','Destination base','Consider Mindo as a broader trip base','Compare the exact Mindo lodging, access to town services, activity providers and transport arrangements you would use.','/blog/things-to-do-near-quito-nature/'],['02','Retreat base','Consider a quieter lodging stay','Compare The Cloud Forest Retreat’s rooms, shared spaces, landscape setting and current nature options.','/cloud-forest-lodge-near-quito/'],['03','Practical fit','Price the complete itinerary','Include lodging, transport, meals, activity fees, guides and the time required to move between priorities.','/quito-to-cloud-forest-distance/']],compareImage:'/assets/images/pages/new/Untitled-15.jpg',compareTitle:'Compare the trip structure, not just the label',compareText:'One traveler may value access to a recognized destination and multiple providers; another may prefer a room-centered stay with open time in the cloud forest.',choices:[['Mindo itinerary','Verify the specific lodging, town access, transport and independently booked activities that make the trip work.'],['Retreat itinerary','Verify room choice, shared-space expectations, arrival, meals and any coordinated nature activity.']],compareLink:['Compare rooms at the retreat','/rooms/'],stepsTitle:'Make the final comparison concrete',stepsText:'Use the same questions for both options so atmosphere does not hide a practical mismatch.',steps:[['01 · STAY','Compare exact lodging','Review room, beds, access, shared areas and cancellation terms.'],['02 · DAY','Compare the real itinerary','List the main activity, transport, meals and unstructured time.'],['03 · TOTAL','Compare complete cost','Include services and fees that are separate from the room.']],faqs:[['Is Mindo the same place as The Cloud Forest Retreat?','No. Treat them as separate destination and lodging choices. Confirm the exact location, route and itinerary for whichever option you select.'],['Which option is better for a quiet stay?','That depends on the exact property and dates. Compare room setting, nearby movement, shared spaces, planned activities and how much open time you want.'],['Which option is better for activities?','Compare the activities actually available for your dates, including provider, access, transport, guide, physical demands, duration and price.'],['Can I combine Mindo with The Cloud Forest Retreat?','A combined itinerary may be possible, but it adds travel and coordination. Check routes, transfer time, lodging dates and the value of moving bases before deciding.']],related:[['Booking','/booking/'],['Rooms','/rooms/'],['Best eco lodge guide','/best-eco-lodge-quito/'],['Where to stay for nature','/where-to-stay-near-quito-nature/'],['Nature activities','/nature-activities-quito/'],['Contact','/contact/']]},
{lang:'es',path:'/es/mindo-vs-cloud-forest-retreat/',alt:'/mindo-vs-cloud-forest-retreat/',name:'Mindo vs. The Cloud Forest Retreat',title:'Mindo vs. The Cloud Forest Retreat | Compara tu estadía',description:'Compara Mindo y The Cloud Forest Retreat por entorno, ritmo, habitaciones, actividades, transporte y reserva para elegir una estadía adecuada.',hero:'/assets/images/pages/new/Untitled-20.jpg',eyebrow:'Dos formas distintas de planificar tiempo en el bosque',lead:'Elige según la experiencia que buscas, no porque una opción sea mejor para todos. Compara alojamiento, entorno, ritmo, transporte y actividades para tus fechas.',facts:[['Decisión','Ajusta la estadía a prioridades'],['Comparación','Usa detalles actuales'],['Planificación','Confirma transporte y actividades']],topicsTitle:'Comienza por la experiencia que quieres vivir',topicsText:'La comparación útil es entre estadías e itinerarios específicos, no entre el nombre de un pueblo y una fotografía.',topics:[['01','Base de destino','Considera Mindo como base de viaje','Compara el alojamiento exacto, acceso al pueblo, proveedores de actividades y transporte que usarías.','/es/blog/que-hacer-cerca-de-quito-naturaleza/'],['02','Base de retiro','Considera una estadía más tranquila','Compara habitaciones, áreas comunes, paisaje y opciones naturales actuales de The Cloud Forest Retreat.','/es/lodge-bosque-nublado-cerca-de-quito/'],['03','Ajuste práctico','Calcula el itinerario completo','Incluye alojamiento, transporte, comidas, actividades, guías y tiempo para moverte entre prioridades.','/es/distancia-quito-bosque-nublado/']],compareImage:'/assets/images/pages/new/Untitled-15.jpg',compareTitle:'Compara la estructura del viaje',compareText:'Una persona puede valorar un destino reconocido y varios proveedores; otra puede preferir una estadía centrada en la habitación y tiempo abierto en el bosque.',choices:[['Itinerario en Mindo','Verifica alojamiento, acceso al pueblo, transporte y actividades reservadas de forma independiente.'],['Itinerario en el retiro','Verifica habitación, áreas comunes, llegada, comidas y cualquier actividad natural coordinada.']],compareLink:['Compara habitaciones del retiro','/es/habitaciones/'],stepsTitle:'Haz concreta la comparación final',stepsText:'Usa las mismas preguntas para ambas opciones para que la atmósfera no oculte un desajuste práctico.',steps:[['01 · ESTADÍA','Compara el alojamiento','Revisa habitación, camas, acceso, áreas comunes y cancelación.'],['02 · DÍA','Compara el itinerario real','Enumera actividad, transporte, comidas y tiempo libre.'],['03 · TOTAL','Compara el costo completo','Incluye servicios y tarifas separados de la habitación.']],faqs:[['¿Mindo es el mismo lugar que The Cloud Forest Retreat?','No. Trátalos como opciones distintas de destino y alojamiento. Confirma ubicación, ruta e itinerario exactos para tu elección.'],['¿Qué opción conviene para una estadía tranquila?','Depende de la propiedad y las fechas. Compara entorno de la habitación, movimiento cercano, áreas comunes, actividades y tiempo libre.'],['¿Qué opción conviene para actividades?','Compara actividades realmente disponibles, incluidos proveedor, acceso, transporte, guía, exigencia, duración y precio.'],['¿Puedo combinar Mindo con The Cloud Forest Retreat?','Puede ser posible, pero añade traslado y coordinación. Revisa rutas, tiempo, fechas y el valor de cambiar de base.']],related:[['Reservas','/es/reservas/'],['Habitaciones','/es/habitaciones/'],['Guía de eco lodge','/es/mejor-eco-lodge-quito/'],['Dónde alojarse en naturaleza','/es/donde-alojarse-cerca-de-quito-naturaleza/'],['Actividades naturales','/es/actividades-naturaleza-quito/'],['Contacto','/es/contacto/']]}
];


async function render(p){
  const es=p.lang==='es',type='info_page';
  const topics=p.topics.map((x,i)=>`<a class="planningTopic${i===1?' planningTopic--sage':''}" href="${x[4]}" ${track('internal_link_click','planning_topics',x[2],type)}><span class="planningTopic__number">${x[0]}</span><span class="planningTopic__label">${x[1]}</span><h3>${x[2]}</h3><p>${x[3]}</p><strong>${es?'Explorar':'Explore'} →</strong></a>`).join('');
  const choices=p.choices.map(x=>`<div class="planningCompare__choice"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('');
  const steps=p.steps.map(x=>`<article class="planningStep"><span>${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
  const faq=p.faqs.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('');
  const related=p.related.map(x=>`<a class="tcfr-related__link" href="${x[1]}" ${track(x[1].includes('booking')||x[1].includes('reservas')?'booking_cta_click':'internal_link_click','related_content',x[0],type)}>${x[0]}</a>`).join('');
  const html=`${head(p)}  <body data-page-language="${p.lang}" data-page-type="${type}" data-tcfr-cluster="planning" data-tcfr-template="premium-planning">
    <div id="siteHeader" data-current-lang="${p.lang}"></div><nav class="rawLangLinks" aria-label="${es?'Selector de idioma':'Language switch'}"><a href="${es?p.alt:p.path}" lang="en" hreflang="en" ${!es?'aria-current="page"':''}>English</a><a href="${es?p.path:p.alt}" lang="es" hreflang="es" ${es?'aria-current="page"':''}>Español</a></nav>
    <main class="planningPreview"><div class="planningPreview__notice"><strong>${es?'Información actual':'Current information'}</strong><p>${es?'Confirma acceso, clima, proveedores y precios para tus fechas.':'Confirm access, weather, providers and prices for your dates.'}</p></div><nav class="planningPreview__crumbs"><a href="${es?'/es/':'/'}" ${track('internal_link_click','breadcrumb',es?'Inicio':'Home',type)}>${es?'Inicio':'Home'}</a><span>/</span><span>${p.name}</span></nav>
      <section class="planningHero"><img class="planningHero__image" src="${p.hero}" alt="${esc(p.name)}" loading="eager" decoding="async" /><div class="planningHero__shade" aria-hidden="true"></div><div class="planningHero__content"><p class="planningEyebrow">${p.eyebrow}</p><h1>${p.name}</h1><p class="planningHero__lead">${p.lead}</p><div class="planningHero__actions"><a class="btn primary" href="${es?'/es/reservas/':'/booking/'}" ${track('booking_cta_click','hero',es?'Consultar disponibilidad':'Check availability',type)}>${es?'Consultar disponibilidad':'Check availability'}</a><a class="btn planningButtonLight" href="${es?'/es/contacto/':'/contact/'}" ${track('contact_cta_click','hero',es?'Preguntar por condiciones':'Ask about conditions',type)}>${es?'Preguntar por condiciones':'Ask about conditions'}</a></div></div><div class="planningHero__facts">${p.facts.map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div></section>
      <section class="planningSection" id="planning-topics"><header class="planningHeading"><p class="planningEyebrow planningEyebrow--dark">${es?'Compara el plan':'Compare the plan'}</p><h2>${p.topicsTitle}</h2><p>${p.topicsText}</p></header><div class="planningTopics">${topics}</div></section>
      <section class="planningSection planningCompare" id="planning-compare"><div class="planningCompare__image"><img src="${p.compareImage}" alt="${esc(p.compareTitle)}" loading="lazy" decoding="async" /></div><div class="planningCompare__copy"><p class="planningEyebrow planningEyebrow--dark">${es?'Elige con cuidado':'Choose carefully'}</p><h2>${p.compareTitle}</h2><p>${p.compareText}</p><div class="planningCompare__choices">${choices}</div><a class="planningCompare__link" href="${p.compareLink[1]}" ${track('internal_link_click','planning_compare',p.compareLink[0],type)}>${p.compareLink[0]} →</a></div></section>
      <section class="planningSection planningSteps" id="planning-steps"><div class="planningSteps__intro"><p class="planningEyebrow">${es?'Antes de salir':'Before you go'}</p><h2>${p.stepsTitle}</h2><p>${p.stepsText}</p></div><div class="planningSteps__grid">${steps}</div></section>
      <section class="planningSection planningFaq tcfrFaq" id="faq"><div class="tcfrFaq__intro"><p class="planningEyebrow planningEyebrow--dark">FAQ</p><h2>${es?'Preguntas para planificar':'Planning questions'}</h2><p>${es?'Respuestas claras para tomar decisiones con información actual.':'Clear answers for decisions based on current information.'}</p></div><div class="tcfrFaq__list">${faq}</div></section>
      <section class="tcfr-related"><p class="tcfr-related__eyebrow">${es?'Sigue planificando':'Continue planning'}</p><h2 class="tcfr-related__title">${es?'Conecta la actividad con tu estadía':'Connect the activity to your stay'}</h2><div class="tcfr-related__grid">${related}</div></section>
    </main><div id="siteFooter"></div><script src="/assets/js/attribution.js?v=2"></script><script src="/assets/js/site.js?v=8"></script>
  </body>
</html>\n`;
  await fs.writeFile(p.path.slice(1)+'index.html',html);
}

for(const p of pages) await render(p);
console.log(JSON.stringify({batch:'pair_047',written:pages.map(p=>p.path)}));
