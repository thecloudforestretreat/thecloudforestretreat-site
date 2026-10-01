export const APPROVED_EMAILS=["thecloudforestretreat@gmail.com","sschettini18@gmail.com"];
export const DEFAULTS={
  GA4_PROPERTY_ID:"449392042",GA4_STREAM_ID:"8455404842",GA4_MEASUREMENT_ID:"G-D3W4SP5MGX",
  GSC_SITE_URL:"sc-domain:thecloudforestretreat.com",GTM_ACCOUNT_ID:"6378581981",GTM_CONTAINER_ID:"265010300",
  GTM_PUBLIC_ID:"GTM-KJ67MZ2C",GTM_WORKSPACE_ID:"3",PUBLIC_SITE_ORIGIN:"https://thecloudforestretreat.com",
  ADMIN_HOSTNAME:"admin.thecloudforestretreat.com"
};
export function config(env={}){const out={};for(const [k,v] of Object.entries(DEFAULTS))out[k]=env[k]||v;out.ADMIN_EMAIL_ALLOWLIST=(env.ADMIN_EMAIL_ALLOWLIST||APPROVED_EMAILS.join(",")).split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);return out;}
