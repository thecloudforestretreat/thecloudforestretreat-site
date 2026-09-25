import fs from "node:fs/promises";
import { Workbook } from "/Users/juangranda/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const inputPath = "outputs/01a0cacb-9307-7181-a26c-990d3a098536/TCFR_site_roadmap_enriched_2026-09-23.csv";
const pairId = process.argv[2];

if (pairId !== "pair_005") {
  throw new Error("This updater is scoped to the completed pair_005 rollout.");
}

const csvText = await fs.readFile(inputPath, "utf8");
const workbook = await Workbook.fromCSV(csvText, { sheetName: "Roadmap" });
const sheet = workbook.worksheets.getItem("Roadmap");
const beforePreview = await workbook.render({ sheetName: "Roadmap", range: "A9:J11", scale: 1, format: "png" });
await fs.writeFile("/tmp/tcfr-roadmap-pair005-before.png", new Uint8Array(await beforePreview.arrayBuffer()));

const used = sheet.getUsedRange();
const rows = used.values;
const headers = rows[0].map((value) => String(value));
const column = Object.fromEntries(headers.map((header, index) => [header, index]));
const targetRows = rows.map((row, index) => ({ row, index })).filter(({ row }) => row[column.pair_id] === pairId);

if (targetRows.length !== 2) {
  throw new Error(`Expected 2 rows for ${pairId}, found ${targetRows.length}.`);
}

const shared = {
  implementation_status: "Completed and QA-verified in upgrade branch",
  audit_status: "Passed bilingual pair rollout QA",
  schema_type: "LodgingBusiness, BedAndBreakfast, CollectionPage, ItemList, HotelRoom, BreadcrumbList, FAQPage",
  status: "Complete — staging review",
  environment: "Staging only — production unchanged",
  next_action: "Stakeholder review; retain in staging until full-site approval",
  pair_completion_status: "Complete — pair_005",
  seo_status: "Complete — title, description, canonical, hreflang, headings and intent aligned",
  aeo_status: "Complete — concise comparison answers and 4 matched visible FAQs",
  geo_status: "Complete — entity, place, lodging, room and breadcrumb schema present",
  schema_status: "Complete — LodgingBusiness, BedAndBreakfast, CollectionPage, ItemList, HotelRoom, BreadcrumbList, FAQPage",
  faq_status: "Complete — 4 visible FAQs match structured data",
  internal_link_status: "Complete — room-detail, common-area, planning and conversion paths validated",
  analytics_status: "Complete — GA4/GTM and room, booking, review, language and internal-link attribution hooks",
  site_config_status: "Complete — shared configuration v3 controls WhatsApp, analytics IDs, reviews and form security",
  responsive_qa_status: "Passed — rendered at 390, 768 and 1440 pixels with no horizontal overflow and equal-height room cards",
  deployment_status: "Staging only — production unchanged",
  qa_completed_at: "2026-09-24",
  completion_evidence: "EN and ES pages; reciprocal hreflang; ItemList/HotelRoom and FAQ schema parity; 3 room cards; 3 Google reviews; common-area pathway; architecture markers; analytics hooks; shared includes; rendered pair-level QA"
};

const localized = {
  en: {
    seo_title: "Rooms at The Cloud Forest Retreat | Near Quito, Ecuador",
    meta_description: "Compare the Panoramic Suite, Sunrise Room, Sunset Room, and shared spaces at The Cloud Forest Retreat near Quito, Ecuador.",
    h1: "Choose the room that fits your rhythm.",
    qa_notes: "Rooms hub rebuilt with the approved premium Rooms cluster and global 1280-pixel shell; customer-facing room comparison; equal-height cards; common-area pathway; three Google reviews; reciprocal hreflang; canonical and social metadata; ItemList and HotelRoom structured data; 4 visible FAQs aligned with FAQPage; tracked room, booking, review, language and internal-link actions; shared header, footer and site configuration; rendered QA passed at 390, 768 and 1440 pixels without overflow."
  },
  es: {
    seo_title: "Habitaciones de The Cloud Forest Retreat | Cerca de Quito",
    meta_description: "Compara la Suite Panorámica, Habitación Amanecer, Habitación Atardecer y áreas comunes de The Cloud Forest Retreat cerca de Quito.",
    h1: "Elige la habitación que se adapta a tu ritmo.",
    qa_notes: "Hub de habitaciones reconstruido con el clúster premium Rooms aprobado y el contenedor global de 1280 píxeles; comparación dirigida a huéspedes; tarjetas de igual altura; ruta hacia áreas comunes; tres reseñas de Google; hreflang recíproco; metadatos canónicos y sociales; datos estructurados ItemList y HotelRoom; 4 preguntas visibles alineadas con FAQPage; eventos de habitaciones, reservas, reseñas, idioma y enlaces internos; cabecera, pie y configuración compartidos; QA a 390, 768 y 1440 píxeles sin desbordamiento."
  }
};

for (const { row, index } of targetRows) {
  const language = row[column.language];
  const updates = { ...shared, ...localized[language] };
  updates.current_title_length = String(updates.seo_title.length);
  updates.current_meta_description_length = String(updates.meta_description.length);

  for (const [header, value] of Object.entries(updates)) {
    if (!(header in column)) throw new Error(`Missing roadmap column: ${header}`);
    sheet.getCell(index, column[header]).values = [[value]];
  }
}

workbook.recalculate();
const updatedRows = sheet.getUsedRange().values;
const verification = targetRows.map(({ index }) => {
  const row = updatedRows[index];
  return {
    review_order: row[column.review_order],
    pair_id: row[column.pair_id],
    language: row[column.language],
    implementation_status: row[column.implementation_status],
    pair_completion_status: row[column.pair_completion_status],
    responsive_qa_status: row[column.responsive_qa_status]
  };
});

const afterPreview = await workbook.render({ sheetName: "Roadmap", range: "BN9:BZ11", scale: 1, format: "png" });
await fs.writeFile("/tmp/tcfr-roadmap-pair005-after.png", new Uint8Array(await afterPreview.arrayBuffer()));

const escaped = updatedRows.map((row) => row.map((value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}).join(",")).join("\n") + "\n";

const temporaryPath = `${inputPath}.tmp`;
await fs.writeFile(temporaryPath, escaped, "utf8");
await fs.rename(temporaryPath, inputPath);
console.log(JSON.stringify(verification, null, 2));
