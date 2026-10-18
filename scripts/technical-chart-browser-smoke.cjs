/* Run after starting Storybook: node scripts/technical-chart-browser-smoke.cjs [base URL]
 * Requires playwright and axe-core (AXE_PATH can point to an isolated install).
 * Produces visual baselines, a browser trace and machine-readable evidence.
 */
const { chromium } = require("playwright");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const out = path.resolve("output/technical-chart-verification");
const screenshots = path.resolve("output/playwright");
const axePath =
  process.env.AXE_PATH ||
  path.join(out, "deps/node_modules/axe-core/axe.min.js");
const base = process.argv[2] || "http://localhost:6006";
const storyUrl = (name) =>
  `${base}/iframe.html?id=market-charts-technicalchartview--${name}&viewMode=story`;

(async () => {
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const evidence = {
    hardware: {
      platform: os.platform(),
      cpu: os.cpus()[0]?.model,
      logicalCpus: os.cpus().length,
      memoryGiB: Math.round(os.totalmem() / 2 ** 30),
      browser: browser.version(),
      headless: true,
    },
    stories: [],
    interactions: [],
    performance: null,
  };
  try {
    for (const story of [
      "complete-technical-analysis",
      "light",
      "narrow-responsive",
      "fullscreen-contained",
      "loading",
      "empty",
      "error",
      "accurate-profile-levels",
      "approximate-profile-from-bars",
      "reduced-motion",
      "keyboard-navigation",
    ]) {
      await page.emulateMedia({
        reducedMotion: story === "reduced-motion" ? "reduce" : "no-preference",
      });
      await page.goto(storyUrl(story));
      await page.locator("[data-technical-chart-view]").waitFor();
      if (!["loading", "error"].includes(story))
        await page.locator("canvas").waitFor();
      await page.waitForTimeout(450);
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () =>
        (
          await axe.run(document.querySelector("[data-technical-chart-view]"), {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            html: n.html,
            summary: n.failureSummary,
          })),
        })),
      );
      const overflow = await page
        .locator("[data-technical-chart-view]")
        .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      await page.locator("[data-technical-chart-view]").screenshot({
        path: path.join(screenshots, `technical-chart-${story}.png`),
      });
      evidence.stories.push({ story, violations, overflow });
      console.log(story, "violations", violations.length, "overflow", overflow);
      assert.equal(overflow, false, `${story}: overflow`);
      assert.equal(
        violations.length,
        0,
        `${story}: ${JSON.stringify(violations)}`,
      );
    }
    await page.goto(storyUrl("complete-technical-analysis"));
    const canvas = page.locator("canvas");
    await canvas.waitFor();
    await page.waitForTimeout(350);
    const initial = await canvas.boundingBox();
    assert(initial);
    const readout = page.getByLabel("OHLC readout");
    const latestOhlc = await readout.textContent();
    assert.match(latestOhlc, /O .*H .*L .*C /);
    await page.mouse.move(initial.x + 350, initial.y + 220);
    await page.waitForTimeout(100);
    assert.notEqual(await readout.textContent(), latestOhlc);
    assert.match(await readout.textContent(), /Inspect/);
    await page.mouse.move(initial.x + 450, initial.y + 220);
    await page.waitForTimeout(100);
    assert.deepEqual(await canvas.boundingBox(), initial);
    const earningsPin = page.getByRole("button", { name: /Q2 earnings ·/ });
    await earningsPin.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("dialog").waitFor();
    await page.getByRole("dialog").evaluate(async (dialog) => {
      await new Promise(requestAnimationFrame);
      await Promise.all(
        dialog
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    assert.match(
      await page.getByRole("dialog").textContent(),
      /Q3 earnings.*Estimated date/,
    );
    assert.match(
      await page.getByRole("dialog").textContent(),
      /Reported EPS: 1.38/,
    );
    await page.addScriptTag({ path: axePath });
    const earningsViolations = await page.evaluate(
      async () =>
        (
          await axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations,
    );
    assert.equal(
      earningsViolations.length,
      0,
      JSON.stringify(earningsViolations),
    );
    await page.keyboard.press("Escape");
    evidence.interactions.push(
      "hover OHLC changes without layout shift; earnings pin opens keyboard-accessible dates/EPS dialog with zero axe violations",
    );
    await canvas.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("+");
    await page.mouse.move(initial.x + 400, initial.y + 240);
    await page.mouse.down();
    await page.mouse.move(initial.x + 520, initial.y + 240, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(250);
    assert.deepEqual(await canvas.boundingBox(), initial);
    evidence.interactions.push(
      "pointer pan and keyboard inspect/zoom keep Canvas geometry stable",
    );
    const axisX = initial.x + initial.width - 35;
    await page.mouse.move(axisX, initial.y + 240);
    await page.mouse.down();
    await page.mouse.move(axisX, initial.y + 275, { steps: 10 });
    await page.mouse.up();
    assert.equal(
      await page
        .getByRole("button", { name: "Toggle automatic scale" })
        .getAttribute("aria-pressed"),
      "false",
    );
    await page.mouse.dblclick(axisX, initial.y + 240);
    assert.equal(
      await page
        .getByRole("button", { name: "Toggle automatic scale" })
        .getAttribute("aria-pressed"),
      "true",
    );
    evidence.interactions.push(
      "price-axis drag enters manual scale; double-click restores auto",
    );
    const separator = page.getByRole("separator").first();
    await separator.focus();
    const before = (await separator.boundingBox()).y;
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(100);
    assert.notEqual((await separator.boundingBox()).y, before);
    evidence.interactions.push("keyboard pane resizing");
    await page
      .getByRole("button", { name: "Chart settings", exact: true })
      .click();
    await page
      .getByLabel("Price scale", { exact: true })
      .selectOption("percentage");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "View chart data" }).click();
    assert.equal(await page.getByRole("row").count(), 101);
    evidence.interactions.push(
      "percentage scale and bounded study/profile data alternative",
    );
    await page.getByRole("button", { name: "View chart data" }).click();
    await page
      .getByRole("button", { name: "Horizontal line", exact: true })
      .click();
    await page.mouse.move(initial.x + 400, initial.y + 240);
    await page.mouse.down();
    await page.mouse.move(initial.x + 450, initial.y + 240);
    await page.mouse.up();
    await page.waitForTimeout(150);
    assert.equal(await page.locator("[data-drawing-id]").count(), 1);
    evidence.interactions.push("pointer drawing creation");
    await page.goto(storyUrl("narrow-responsive"));
    await page.locator("canvas").waitFor();
    await page.waitForTimeout(250);
    const narrowBefore = await page.locator("canvas").boundingBox();
    await page
      .getByRole("button", { name: "Drawing tools", exact: true })
      .click();
    assert.deepEqual(await page.locator("canvas").boundingBox(), narrowBefore);
    await page
      .getByRole("button", { name: "Drawing tools", exact: true })
      .click();
    evidence.interactions.push("20rem floating rail preserves Canvas geometry");
    await page
      .getByRole("button", { name: "Chart settings", exact: true })
      .click();
    await page.addScriptTag({ path: axePath });
    await page.locator('[role="dialog"]').evaluate(async (el) => {
      await new Promise(requestAnimationFrame);
      await Promise.all(
        el
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    const dialogViolations = await page.evaluate(
      async () =>
        (
          await axe.run(document.querySelector("[role=dialog]"), {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations,
    );
    assert.equal(dialogViolations.length, 0, JSON.stringify(dialogViolations));
    evidence.interactions.push("narrow settings accessibility");
    await page.keyboard.press("Escape");
    await page.evaluate(() => (document.documentElement.style.zoom = "2"));
    assert.equal(
      await page
        .locator("[data-technical-chart-view]")
        .evaluate((el) => el.scrollWidth > el.clientWidth + 1),
      false,
    );
    await page
      .getByRole("button", { name: "Chart settings", exact: true })
      .click();
    await page
      .getByLabel("Price scale", { exact: true })
      .selectOption("indexedTo100");
    await page.keyboard.press("Escape");
    evidence.interactions.push(
      "200% zoom keeps narrow commands and scales usable",
    );
    await page.evaluate(() => (document.documentElement.style.zoom = "1"));
    await page.emulateMedia({ forcedColors: "active" });
    await page.reload();
    await page.locator("canvas").waitFor();
    await page.locator("[data-technical-chart-view]").screenshot({
      path: path.join(screenshots, "technical-chart-forced-colors.png"),
    });
    await page.emulateMedia({ forcedColors: "none" });
    const touchContext = await browser.newContext({
      viewport: { width: 390, height: 900 },
      hasTouch: true,
      isMobile: true,
    });
    const touchPage = await touchContext.newPage();
    await touchPage.goto(storyUrl("narrow-responsive"));
    await touchPage.locator("canvas").waitFor();
    await touchPage.waitForTimeout(350);
    const touchBox = await touchPage.locator("canvas").boundingBox();
    const touchClient = await touchContext.newCDPSession(touchPage);
    const beforeTouch = await touchPage
      .getByLabel("Volume profile summary")
      .innerText();
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: touchBox.x + 70, y: touchBox.y + 240 }],
    });
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: touchBox.x + 140, y: touchBox.y + 240 }],
    });
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touchPage.waitForTimeout(300);
    assert.notEqual(
      await touchPage.getByLabel("Volume profile summary").innerText(),
      beforeTouch,
    );
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { id: 1, x: touchBox.x + 60, y: touchBox.y + 220 },
        { id: 2, x: touchBox.x + 160, y: touchBox.y + 220 },
      ],
    });
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { id: 1, x: touchBox.x + 70, y: touchBox.y + 220 },
        { id: 2, x: touchBox.x + 150, y: touchBox.y + 220 },
      ],
    });
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { id: 1, x: touchBox.x + 80, y: touchBox.y + 220 },
        { id: 2, x: touchBox.x + 140, y: touchBox.y + 220 },
      ],
    });
    await touchClient.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touchPage.waitForTimeout(250);
    await touchContext.close();
    evidence.interactions.push(
      "Chromium touch pan updates profile and two-finger pinch executes",
    );
    await page.goto(storyUrl("stress"));
    await page.locator("canvas").waitFor({ timeout: 60000 });
    await page.waitForTimeout(1000);
    const client = await context.newCDPSession(page);
    await client.send("Tracing.start", {
      categories: "devtools.timeline,blink.user_timing",
      transferMode: "ReturnAsStream",
    });
    evidence.performance = await page.evaluate(async () => {
      const canvas = document.querySelector("canvas");
      const rect = canvas.getBoundingClientRect();
      const samples = [];
      let previous = performance.now();
      for (let i = 0; i < 180; i++) {
        await new Promise(requestAnimationFrame);
        const now = performance.now();
        if (i > 10) samples.push(now - previous);
        previous = now;
        canvas.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: rect.x + 100 + ((i * 5) % 600),
            clientY: rect.y + 250,
            pointerId: 1,
            bubbles: true,
          }),
        );
        if (i % 6 === 0)
          canvas.dispatchEvent(
            new WheelEvent("wheel", {
              clientX: rect.x + 400,
              deltaY: i % 12 === 0 ? 8 : -8,
              bubbles: true,
              cancelable: true,
            }),
          );
      }
      const sorted = [...samples].sort((a, b) => a - b);
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      return {
        bars: 100000,
        drawings: 100,
        profileRows: 100,
        frames: samples.length,
        meanFrameMs: mean,
        p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
        estimatedFps: 1000 / mean,
      };
    });
    const traceDone = new Promise((resolve) =>
      client.once("Tracing.tracingComplete", resolve),
    );
    await client.send("Tracing.end");
    const { stream } = await traceDone;
    let trace = "";
    for (;;) {
      const chunk = await client.send("IO.read", { handle: stream });
      trace += chunk.data;
      if (chunk.eof) break;
    }
    await client.send("IO.close", { handle: stream });
    fs.writeFileSync(path.join(out, "performance-trace.json"), trace);
    assert.equal(errors.length, 0, errors.join("\n"));
    console.log("Performance", evidence.performance);
    evidence.errors = errors;
  } finally {
    fs.writeFileSync(
      path.join(out, "browser-smoke.json"),
      JSON.stringify(evidence, null, 2),
    );
    await context.tracing.stop({ path: path.join(out, "browser-trace.zip") });
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
