import test from "node:test";
import assert from "node:assert/strict";
import { authorize,isLocal,isPagesDev,parseJwt } from "../functions/lib/auth.js";

const b64=value=>Buffer.from(JSON.stringify(value)).toString("base64url");
test("localhost is allowed for development",async()=>{const result=await authorize(new Request("http://localhost:8788/"),{});assert.equal(result.ok,true);});
test("direct pages.dev access is rejected",async()=>{const result=await authorize(new Request("https://tcfr-admin.pages.dev/"),{});assert.deepEqual({ok:result.ok,status:result.status},{ok:false,status:403});});
test("an unrelated hostname is rejected",async()=>{const result=await authorize(new Request("https://example.com/"),{});assert.equal(result.status,403);});
test("custom hostname requires an Access JWT",async()=>{const result=await authorize(new Request("https://admin.thecloudforestretreat.com/"),{});assert.equal(result.status,401);});
test("host helpers recognize exact classes",()=>{assert.equal(isLocal("127.0.0.1:8788"),true);assert.equal(isPagesDev("branch.project.pages.dev"),true);assert.equal(isPagesDev("pages.dev.example.com"),false);});
test("malformed JWTs are rejected",()=>assert.throws(()=>parseJwt("broken"),/Malformed/));
test("JWT parsing preserves claims without trusting them",()=>{const parsed=parseJwt(`${b64({alg:"RS256",kid:"1"})}.${b64({email:"thecloudforestretreat@gmail.com"})}.AA`);assert.equal(parsed.payload.email,"thecloudforestretreat@gmail.com");});
