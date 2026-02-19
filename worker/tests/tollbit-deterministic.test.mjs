import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";
import { resetState } from "../src/detection.js";

const env = {
  TOLLBIT_PAYWALL_URL: "https://tollbit.terence.world/paywall",
  TOLLBIT_RATE_PER_PAGE: "0.01",
};

const ctx = {
  waitUntil: () => {},
};

const call = (request) => worker.fetch(request, env, ctx);

const makeRequest = (url, init = {}) =>
  new Request(url, {
    method: "GET",
    headers: {
      accept: "text/html",
      "cf-connecting-ip": "203.0.113.10",
      ...init.headers,
    },
    ...init,
  });

test.beforeEach(() => {
  resetState();
  global.fetch = async () => new Response("origin", { status: 200 });
});

test("redirects exact UA matches to TollBit", async () => {
  const response = await call(
    makeRequest("https://terence.world/projects", {
      headers: { "user-agent": "GPTBot" },
    })
  );

  assert.equal(response.status, 302);
  assert.match(response.headers.get("location") || "", /rate=0.01/);
});

test("redirects when H1 + H2 is met", async () => {
  for (let i = 0; i < 3; i += 1) {
    const warmup = await call(
      makeRequest(`https://terence.world/writing?page=${i}`, {
        headers: {
          accept: "text/html,text/plain",
          "user-agent": "Mozilla/5.0",
          "sec-ch-ua": "Chromium",
          "sec-fetch-site": "none",
        },
      })
    );
    assert.equal(warmup.status, 200);
  }

  const response = await call(
    makeRequest("https://terence.world/writing?page=4", {
      headers: {
        accept: "text/html,text/plain",
        "user-agent": "Mozilla/5.0",
        "sec-ch-ua": "Chromium",
        "sec-fetch-site": "none",
      },
    })
  );

  assert.equal(response.status, 302);
  assert.match(response.headers.get("location") || "", /bot_type=heuristic_h1_h2/);
});

test("redirects when H1 + H3 is met", async () => {
  for (let i = 0; i < 3; i += 1) {
    const warmup = await call(
      makeRequest(`https://terence.world/projects/x?i=${i}`, {
        headers: {
          accept: "text/html,image/webp",
          "user-agent": "Mozilla/5.0",
        },
      })
    );
    assert.equal(warmup.status, 200);
  }

  const response = await call(
    makeRequest("https://terence.world/projects/x?i=4", {
      headers: {
        accept: "text/html,image/webp",
        "user-agent": "Mozilla/5.0",
      },
    })
  );

  assert.equal(response.status, 302);
  assert.match(response.headers.get("location") || "", /bot_type=heuristic_h1_h3/);
});

test("human=true sets bypass cookie and serves origin", async () => {
  const response = await call(makeRequest("https://terence.world/?human=true"));

  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie") || "", /bypass_bot_check=1/);
});

test("valid paid token serves origin", async () => {
  const response = await call(
    makeRequest("https://terence.world/projects", {
      headers: {
        "x-tollbit-token": "paid_token_abc12345",
      },
    })
  );

  assert.equal(response.status, 200);
});

test("two complaints in 24h add runtime whitelist", async () => {
  const complaintReq = (ip) =>
    new Request("https://terence.world/__ops/complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json", "cf-connecting-ip": ip },
      body: JSON.stringify({ ip }),
    });

  await call(complaintReq("198.51.100.7"));
  await call(complaintReq("198.51.100.7"));

  const response = await call(
    makeRequest("https://terence.world/projects", {
      headers: {
        "cf-connecting-ip": "198.51.100.7",
        "user-agent": "GPTBot",
      },
    })
  );

  assert.equal(response.status, 200);
});
