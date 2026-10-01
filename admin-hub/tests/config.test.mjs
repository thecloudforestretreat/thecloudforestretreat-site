import test from "node:test";
import assert from "node:assert/strict";
import { APPROVED_EMAILS,config } from "../functions/lib/config.js";
import { rangeDates } from "../functions/lib/reports.js";
import { SECURITY_HEADERS } from "../functions/lib/responses.js";

test("stable platform identifiers are pinned",()=>{const c=config({});assert.equal(c.GA4_PROPERTY_ID,"449392042");assert.equal(c.GA4_STREAM_ID,"8455404842");assert.equal(c.GTM_PUBLIC_ID,"GTM-KJ67MZ2C");assert.equal(c.GSC_SITE_URL,"sc-domain:thecloudforestretreat.com");});
test("approved administrator allowlist is explicit",()=>{assert.deepEqual(APPROVED_EMAILS,["thecloudforestretreat@gmail.com","sschettini18@gmail.com"]);});
test("only approved reporting ranges are accepted",()=>{assert.equal(rangeDates(7,new Date("2026-10-01T12:00:00Z")).days,7);assert.equal(rangeDates(90,new Date("2026-10-01T12:00:00Z")).days,90);assert.equal(rangeDates(13,new Date("2026-10-01T12:00:00Z")).days,28);});
test("reporting periods exclude two potentially unsettled days",()=>{const r=rangeDates(7,new Date("2026-10-01T12:00:00Z"));assert.deepEqual(r,{days:7,start:"2026-09-23",end:"2026-09-29",previousStart:"2026-09-16",previousEnd:"2026-09-22"});});
test("security headers prevent caching, indexing and framing",()=>{assert.match(SECURITY_HEADERS["Cache-Control"],/no-store/);assert.match(SECURITY_HEADERS["X-Robots-Tag"],/noindex/);assert.equal(SECURITY_HEADERS["X-Frame-Options"],"DENY");assert.match(SECURITY_HEADERS["Content-Security-Policy"],/frame-ancestors 'none'/);});
