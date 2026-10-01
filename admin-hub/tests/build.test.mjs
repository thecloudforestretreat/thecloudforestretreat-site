import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const routes=["dist/index.html","dist/marketing/index.html","dist/marketing/analytics/index.html","dist/marketing/search-console/index.html","dist/marketing/tag-manager/index.html","dist/marketing/attribution/index.html"];
for(const route of routes)test(`build contains ${route}`,async()=>{const html=await readFile(new URL(`../${route}`,import.meta.url),"utf8");assert.match(html,/Marketing command center/);assert.match(html,/noindex,nofollow/);});
test("crawler blocking is absolute",async()=>assert.equal(await readFile(new URL("../dist/robots.txt",import.meta.url),"utf8"),"User-agent: *\nDisallow: /\n"));
test("client bundle contains privacy rules but no credential or guest-field plumbing",async()=>{const js=await readFile(new URL("../dist/assets/admin.js",import.meta.url),"utf8");assert.match(js,/free-text messages/);assert.match(js,/Turnstile tokens/);for(const forbidden of ["GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY","guest_email","guest_phone","appointment_details"])assert.ok(!js.includes(forbidden));});
test("reporting routes use their page-specific renderers",async()=>{const js=await readFile(new URL("../dist/assets/admin.js",import.meta.url),"utf8");assert.match(js,/"search-console":search/);assert.match(js,/"tag-manager":tagManager/);});
