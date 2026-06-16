/*
 * Generates "Decisions-That-Stick-Workshop.pptx" — a room-facing slide deck
 * for the 90-minute alignment workshop, plus an appendix covering the
 * background and further-learning resources for each framework.
 * Output: ../downloads/Decisions-That-Stick-Workshop.pptx
 */
const pptxgen = require("pptxgenjs");
const path = require("path");

const OUT = path.join(__dirname, "..", "downloads", "Decisions-That-Stick-Workshop.pptx");

// ---- Palette: matches the web module ----
const TEAL    = "0F766E";
const TEAL2   = "134E4A";
const TEALLT  = "F0FDFA";
const ICE     = "CCFBF1";
const AMBER   = "B45309";
const AMBERLT = "FFFBEB";
const SLATE   = "1E293B";
const WHITE   = "FFFFFF";
const INK     = "0F172A";
const MUTED   = "64748B";
const LINECL  = "CBD5E1";

const HEAD = "Georgia";
const BODY = "Calibri";

const W = 13.333;
const H = 7.5;
const M = 0.7;

const shadow = () => ({ type: "outer", color: "0F172A", blur: 7, offset: 3, angle: 135, opacity: 0.16 });

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Travis Hughes · Studio";
pres.title = "Decisions That Stick — Workshop Deck";

// ---------- shared helpers ----------
function eyebrow(slide, text, color) {
  slide.addText(text.toUpperCase(), {
    x: M, y: 0.55, w: W - 2 * M, h: 0.32, margin: 0,
    fontFace: BODY, fontSize: 12, bold: true, color: color || TEAL,
    charSpacing: 3, align: "left",
  });
}
function title(slide, text, color) {
  slide.addText(text, {
    x: M, y: 0.85, w: W - 2 * M, h: 0.8, margin: 0,
    fontFace: HEAD, fontSize: 32, bold: true, color: color || SLATE, align: "left",
  });
}
function sub(slide, text) {
  slide.addText(text, {
    x: M, y: 1.62, w: W - 2 * M, h: 0.5, margin: 0, fontFace: BODY, fontSize: 14, color: MUTED,
  });
}
function footer(slide, text) {
  slide.addText(text || "Decisions That Stick · Workshop Pack", {
    x: M, y: H - 0.45, w: W - 2 * M, h: 0.3, margin: 0, fontFace: BODY, fontSize: 9.5, color: MUTED,
  });
}
function badge(slide, x, y, d, letter, fill, txtcolor) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  slide.addText(letter, {
    x, y, w: d, h: d, margin: 0, align: "center", valign: "middle",
    fontFace: HEAD, fontSize: 18, bold: true, color: txtcolor || WHITE,
  });
}

// ============================================================
// SLIDE 1 — Cover
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEAL2 };

  // motif: three linked circles (decision-roles icon, large)
  s.addShape(pres.shapes.OVAL, { x: 10.0, y: 1.4, w: 1.3, h: 1.3, fill: { color: TEAL }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: 11.3, y: 2.6, w: 1.0, h: 1.0, fill: { color: ICE }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: 9.6, y: 3.1, w: 1.0, h: 1.0, fill: { color: AMBER }, line: { type: "none" } });

  s.addText("A 90-MINUTE FACILITATED SESSION", {
    x: M, y: 1.7, w: 8, h: 0.32, margin: 0,
    fontFace: BODY, fontSize: 12.5, bold: true, color: AMBER, charSpacing: 3,
  });
  s.addText("Decisions That Stick", {
    x: M, y: 2.05, w: 8.6, h: 1.0, margin: 0,
    fontFace: HEAD, fontSize: 46, bold: true, color: WHITE,
  });
  s.addText("Workshop Deck — alignment for cross-functional teams.", {
    x: M, y: 3.1, w: 7.6, h: 0.7, margin: 0,
    fontFace: BODY, fontSize: 18, italic: true, color: ICE,
  });

  s.addText([
    { text: "How to use this deck\n", options: { bold: true, color: WHITE, fontSize: 14, breakLine: true } },
    { text: "Slides 2–14 are room-facing — present them in sequence during the live session. Slides 15 onward are the appendix: background on each framework and further-learning resources, for participants who want to go deeper after the workshop.", options: { color: ICE, fontSize: 13 } },
  ], {
    x: M, y: 4.25, w: 7.4, h: 1.5, margin: 0, lineSpacingMultiple: 1.15, valign: "top",
  });

  s.addText("Studio · Decisions That Stick · Workshop Pack", {
    x: M, y: H - 0.7, w: 7, h: 0.3, margin: 0, fontFace: BODY, fontSize: 10.5, color: ICE,
  });
})();

// ============================================================
// SLIDE 2 — Workshop at a glance (agenda timeline)
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEALLT };
  eyebrow(s, "Before you start");
  title(s, "Workshop at a glance — 90 minutes");
  sub(s, "Six blocks. Each one has a clear deliverable. Stay on time — the workshop must produce either a decision or a bounded next step.");

  const rows = [
    { t: "0–5 min",   label: "Opening",               note: "State purpose. Not consensus — a decision." },
    { t: "5–15 min",  label: "White Hat",              note: "What do we know? Facts only, no opinions." },
    { t: "15–40 min", label: "Risk-First Alignment",   note: "Name risks, rate independently, discuss divergences." },
    { t: "40–70 min", label: "Six Hats — evaluation",  note: "Yellow → Black → Green. Black Hat gets the most time." },
    { t: "70–85 min", label: "Pre-Mortem",             note: "It failed in 18 months — why? Top 3 failure modes → actions." },
    { t: "85–90 min", label: "Decision",               note: "The Decider calls it. Reasons + risks accepted, stated aloud." },
  ];
  let y = 2.3;
  const rh = 0.74, gap = 0.07;
  rows.forEach((r) => {
    s.addShape(pres.shapes.RECTANGLE, { x: M, y, w: 1.7, h: rh, fill: { color: TEAL }, line: { type: "none" } });
    s.addText(r.t, { x: M, y, w: 1.7, h: rh, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 12.5, bold: true, color: WHITE });
    s.addShape(pres.shapes.RECTANGLE, { x: M + 1.7, y, w: W - 2 * M - 1.7, h: rh, fill: { color: WHITE }, line: { color: LINECL, width: 1 } });
    s.addText(r.label, { x: M + 1.95, y: y + 0.06, w: 3.2, h: 0.36, margin: 0, fontFace: HEAD, fontSize: 15, bold: true, color: SLATE });
    s.addText(r.note, { x: M + 1.95, y: y + 0.4, w: W - 2 * M - 2.2, h: 0.32, margin: 0, fontFace: BODY, fontSize: 11.5, italic: true, color: MUTED });
    y += rh + gap;
  });
  footer(s);
})();

// ============================================================
// SLIDE 3 — Before the workshop (prep checklist)
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  eyebrow(s, "Before the workshop");
  title(s, "Three things to do this week");
  sub(s, "Send these out before the session — do not spring them on people in the room.");

  const items = [
    { n: "1", h: "Choose a real decision", b: "Not a hypothetical. Pick a specific, contested decision the team has already tried and failed to resolve in a standard meeting." },
    { n: "2", h: "Assign RAPID roles in advance", b: "Send role assignments to all participants before the workshop. Explain what each role means. Give people time to sit with their assignment." },
    { n: "3", h: "Ask for a Ladder of Inference reflection", b: "\"Write down your current view, the data you're drawing on, and the assumption that connects that data to your conclusion.\" Primes inquiry over advocacy." },
  ];
  let y = 2.3;
  items.forEach((it) => {
    s.addShape(pres.shapes.RECTANGLE, { x: M, y, w: W - 2 * M, h: 1.35, fill: { color: TEALLT }, line: { color: ICE, width: 1 }, shadow: shadow() });
    badge(s, M + 0.3, y + 0.36, 0.62, it.n, TEAL, WHITE);
    s.addText(it.h, { x: M + 1.2, y: y + 0.16, w: W - 2 * M - 1.6, h: 0.4, margin: 0, fontFace: HEAD, fontSize: 17, bold: true, color: SLATE });
    s.addText(it.b, { x: M + 1.2, y: y + 0.56, w: W - 2 * M - 1.6, h: 0.7, margin: 0, fontFace: BODY, fontSize: 13, color: MUTED, valign: "top" });
    y += 1.35 + 0.18;
  });
  footer(s);
})();

// ============================================================
// SLIDE 4 — Opening
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEAL2 };
  s.addText("ROOM-FACING · BLOCK 1 OF 6 · 0–5 MIN", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: AMBER, charSpacing: 3 });
  s.addText("Opening", { x: M, y: 1.0, w: W - 2*M, h: 1.0, margin: 0, fontFace: HEAD, fontSize: 40, bold: true, color: WHITE });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.5, w: W - 2*M, h: 2.1, fill: { color: TEAL }, line: { type: "none" }, shadow: shadow() });
  s.addText("SAY THIS, OUT LOUD, TO THE ROOM", { x: M + 0.4, y: 2.7, w: 6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: ICE, charSpacing: 2 });
  s.addText("“We are here to make a better-informed decision on [specific question], using a structured process. Today is not about consensus — it is about making the best decision we can with the information we have.”", {
    x: M + 0.4, y: 3.05, w: W - 2*M - 0.8, h: 1.4, margin: 0, fontFace: HEAD, fontSize: 19, italic: true, color: WHITE, valign: "top",
  });

  s.addText("Briefly explain that the process may feel different from a normal meeting. That's intentional.", {
    x: M, y: 4.9, w: W - 2*M, h: 0.5, margin: 0, fontFace: BODY, fontSize: 13.5, italic: true, color: ICE,
  });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 5 — White Hat
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("ROOM-FACING · BLOCK 2 OF 6 · 5–15 MIN", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 3 });
  title(s, "White Hat — what do we know?");
  sub(s, "Facts and information only. No opinions, no interpretations — just what the evidence actually shows.");

  const cols = [
    { h: "What is established?", b: "Numbers, documents, agreements everyone accepts as fact." },
    { h: "What is our best estimate?", b: "Things we believe but haven't fully confirmed." },
    { h: "What is genuinely unknown?", b: "Gaps. Be honest about what we don't know yet." },
  ];
  const colW = (W - 2*M - 2*0.4) / 3;
  cols.forEach((c, i) => {
    const x = M + i * (colW + 0.4);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.6, w: colW, h: 2.6, fill: { color: TEALLT }, line: { color: ICE, width: 1 }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.6, w: colW, h: 0.08, fill: { color: TEAL }, line: { type: "none" } });
    s.addText(c.h, { x: x + 0.25, y: 2.85, w: colW - 0.5, h: 0.6, margin: 0, fontFace: HEAD, fontSize: 15.5, bold: true, color: SLATE, valign: "top" });
    s.addText(c.b, { x: x + 0.25, y: 3.5, w: colW - 0.5, h: 1.5, margin: 0, fontFace: BODY, fontSize: 12.5, color: MUTED, valign: "top" });
  });
  s.addText("Facilitator: “Let's park that in the interpretation column and come back to it.”", { x: M, y: 5.5, w: W - 2*M, h: 0.4, margin: 0, fontFace: BODY, fontSize: 12.5, italic: true, color: MUTED });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 6 — Risk-First Alignment: name the risks
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("ROOM-FACING · BLOCK 3 OF 6 · 15–40 MIN (PART 1)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 3 });
  title(s, "Risk-First Alignment — name every risk");
  sub(s, "5 minutes. Every risk someone raises goes on the list, without debate. Naming a risk is not advocating for a position.");

  const cats = ["Cost", "Timeline", "Technical delivery", "Revenue & offtake", "Regulatory & planning", "Reputational", "Opportunity cost"];
  let y = 2.5;
  let x = M;
  const boxW = (W - 2*M - 3*0.25) / 4;
  cats.forEach((cat, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const bx = M + col * (boxW + 0.25);
    const by = 2.5 + row * 0.95;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: by, w: boxW, h: 0.75, fill: { color: TEAL }, line: { type: "none" }, shadow: shadow() });
    s.addText(cat, { x: bx, y: by, w: boxW, h: 0.75, margin: 0, align: "center", valign: "middle", fontFace: BODY, fontSize: 12.5, bold: true, color: WHITE });
  });
  s.addText("Spend 10–15 minutes total generating the complete list before moving to ratings.", { x: M, y: 4.9, w: W - 2*M, h: 0.4, margin: 0, fontFace: BODY, fontSize: 12.5, italic: true, color: MUTED });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 7 — Risk-First Alignment: rate & reveal
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("ROOM-FACING · BLOCK 3 OF 6 · 15–40 MIN (PART 2)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 3 });
  title(s, "Rate independently. Reveal together.");
  sub(s, "5 min: rate silently, alone. 15 min: reveal simultaneously, discuss only the divergences.");

  // 2x4 probability/impact grid
  const gx = M, gy = 2.45, gw = 6.4, gh = 3.7;
  const probs = ["Negligible", "Low", "Medium", "High"];
  const impacts = ["Minor", "Manageable", "Significant", "Critical"];
  const cellW = gw / 4, cellH = gh / 4;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const intensity = (r + c) / 6;
      const cellColor = intensity < 0.34 ? "D1FAE5" : intensity < 0.67 ? "FDE68A" : "FECACA";
      s.addShape(pres.shapes.RECTANGLE, { x: gx + c * cellW, y: gy + (3-r) * cellH, w: cellW, h: cellH, fill: { color: cellColor }, line: { color: WHITE, width: 1.5 } });
    }
  }
  s.addText("IMPACT →", { x: gx, y: gy - 0.32, w: gw, h: 0.28, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: MUTED });
  impacts.forEach((lab, i) => s.addText(lab, { x: gx + i*cellW, y: gy + gh + 0.05, w: cellW, h: 0.3, margin: 0, align: "center", fontFace: BODY, fontSize: 10, color: MUTED }));
  probs.slice().reverse().forEach((lab, i) => s.addText(lab, { x: gx - 1.1, y: gy + i*cellH, w: 1.0, h: cellH, margin: 0, align: "right", valign: "middle", fontFace: BODY, fontSize: 10, color: MUTED }));
  s.addText("PROBABILITY ↑ (rotated label, read bottom-up)", { x: gx - 1.55, y: gy - 0.32, w: 1.6, h: 0.28, margin: 0, fontFace: BODY, fontSize: 8, color: MUTED });

  // right column: inquiry questions
  const rx = gx + gw + 0.6, rw = W - M - rx;
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: gy, w: rw, h: gh + 0.35, fill: { color: TEALLT }, line: { color: ICE, width: 1 }, shadow: shadow() });
  s.addText("WHEN RATINGS DIVERGE, ASK:", { x: rx + 0.25, y: gy + 0.2, w: rw - 0.5, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: TEAL, charSpacing: 1 });
  s.addText([
    { text: "“What data are you drawing on?”\n\n", options: { bold: true, fontSize: 13.5, color: SLATE, breakLine: true } },
    { text: "“What would have to shift for your rating to change?”", options: { bold: true, fontSize: 13.5, color: SLATE } },
  ], { x: rx + 0.25, y: gy + 0.6, w: rw - 0.5, h: gh - 0.5, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 8 — Six Hats: Yellow
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: "FFFBEB" };
  s.addText("ROOM-FACING · BLOCK 4 OF 6 · 40–70 MIN (1 OF 3)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: AMBER, charSpacing: 3 });
  title(s, "Yellow Hat — 8 minutes", SLATE);
  s.addShape(pres.shapes.OVAL, { x: W - 2.6, y: 1.0, w: 1.6, h: 1.6, fill: { color: "FBBF24" }, line: { type: "none" } });
  s.addText("Optimism and value", { x: M, y: 1.7, w: 8, h: 0.5, margin: 0, fontFace: BODY, fontSize: 16, italic: true, color: MUTED });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.6, w: W - 2*M, h: 2.4, fill: { color: WHITE }, line: { color: "FDE68A", width: 1.5 }, shadow: shadow() });
  s.addText([
    { text: "What is the best case if we proceed?\n", options: { bold: true, fontSize: 18, color: SLATE, breakLine: true } },
    { text: "What value does this option create if it works?\n\n", options: { bold: true, fontSize: 18, color: SLATE, breakLine: true } },
    { text: "As rigorous as the Black Hat — not cheerleading, a systematic search for upside.", options: { fontSize: 13, italic: true, color: MUTED } },
  ], { x: M + 0.4, y: 2.85, w: W - 2*M - 0.8, h: 2.0, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 9 — Six Hats: Black
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: SLATE };
  s.addText("ROOM-FACING · BLOCK 4 OF 6 · 40–70 MIN (2 OF 3)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: AMBER, charSpacing: 3 });
  title(s, "Black Hat — 12 minutes", WHITE);
  s.addShape(pres.shapes.OVAL, { x: W - 2.6, y: 1.0, w: 1.6, h: 1.6, fill: { color: "0F172A" }, line: { color: WHITE, width: 2 } });
  s.addText("Caution and risk", { x: M, y: 1.7, w: 8, h: 0.5, margin: 0, fontFace: BODY, fontSize: 16, italic: true, color: ICE });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.6, w: W - 2*M, h: 2.5, fill: { color: "334155" }, line: { type: "none" }, shadow: shadow() });
  s.addText([
    { text: "What could go wrong? What are the weaknesses?\n", options: { bold: true, fontSize: 18, color: WHITE, breakLine: true } },
    { text: "Where is the logic flawed?\n\n", options: { bold: true, fontSize: 18, color: WHITE, breakLine: true } },
    { text: "This is the most important hat for a high-stakes project decision — give it the most time. Everyone wears it together; it is not the technical lead's job alone.", options: { fontSize: 13, italic: true, color: ICE } },
  ], { x: M + 0.4, y: 2.85, w: W - 2*M - 0.8, h: 2.1, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
  s.addText("Facilitator: redirect advocacy back to analysis — “that sounds like a conclusion, let's park it.”", { x: M, y: 5.4, w: W - 2*M, h: 0.4, margin: 0, fontFace: BODY, fontSize: 12, italic: true, color: ICE });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide", );
})();

// ============================================================
// SLIDE 10 — Six Hats: Green
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEALLT };
  s.addText("ROOM-FACING · BLOCK 4 OF 6 · 40–70 MIN (3 OF 3)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 3 });
  title(s, "Green Hat — 10 minutes", SLATE);
  s.addShape(pres.shapes.OVAL, { x: W - 2.6, y: 1.0, w: 1.6, h: 1.6, fill: { color: TEAL }, line: { type: "none" } });
  s.addText("Creativity and alternatives", { x: M, y: 1.7, w: 8, h: 0.5, margin: 0, fontFace: BODY, fontSize: 16, italic: true, color: MUTED });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.6, w: W - 2*M, h: 2.4, fill: { color: WHITE }, line: { color: ICE, width: 1.5 }, shadow: shadow() });
  s.addText([
    { text: "What modifications address the Black Hat concerns?\n", options: { bold: true, fontSize: 18, color: SLATE, breakLine: true } },
    { text: "What alternatives haven't we explored?\n\n", options: { bold: true, fontSize: 18, color: SLATE, breakLine: true } },
    { text: "Generative, not evaluative. Defer judgement — just generate options.", options: { fontSize: 13, italic: true, color: MUTED } },
  ], { x: M + 0.4, y: 2.85, w: W - 2*M - 0.8, h: 2.0, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 11 — Pre-Mortem prompt
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEAL2 };
  s.addText("ROOM-FACING · BLOCK 5 OF 6 · 70–85 MIN (PART 1)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: AMBER, charSpacing: 3 });
  s.addText("Pre-Mortem", { x: M, y: 1.0, w: W - 2*M, h: 1.0, margin: 0, fontFace: HEAD, fontSize: 40, bold: true, color: WHITE });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.4, w: W - 2*M, h: 2.6, fill: { color: TEAL }, line: { type: "none" }, shadow: shadow() });
  s.addText("SET THE FRAME, OUT LOUD", { x: M + 0.4, y: 2.6, w: 6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: ICE, charSpacing: 2 });
  s.addText("“We are 18 months from now. This project went ahead. It has failed — significantly, embarrassingly, expensively. Spend five minutes, alone, writing down every reason you can think of for why it failed.”", {
    x: M + 0.4, y: 2.95, w: W - 2*M - 0.8, h: 1.7, margin: 0, fontFace: HEAD, fontSize: 18, italic: true, color: WHITE, valign: "top",
  });
  s.addText("3 min independent writing (no talking) → 7 min round-robin capture → 5 min prioritise.", { x: M, y: 5.25, w: W - 2*M, h: 0.4, margin: 0, fontFace: BODY, fontSize: 13, italic: true, color: ICE });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 12 — Pre-Mortem actions table
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("ROOM-FACING · BLOCK 5 OF 6 · 70–85 MIN (PART 2)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 3 });
  title(s, "Top 3 failure modes → mitigation actions");
  sub(s, "These become explicit risk mitigation commitments in the decision record — not afterthoughts.");

  const headers = ["Failure mode", "How likely / how bad", "What we'll do now"];
  const colW = [3.8, 2.8, W - 2*M - 6.6];
  let y = 2.5;
  let x = M;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: colW[i], h: 0.55, fill: { color: TEAL }, line: { type: "none" } });
    s.addText(h, { x, y, w: colW[i], h: 0.55, margin: 6, align: "left", valign: "middle", fontFace: BODY, fontSize: 13, bold: true, color: WHITE });
    x += colW[i];
  });
  y += 0.55;
  for (let r = 0; r < 3; r++) {
    x = M;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: colW[i], h: 0.85, fill: { color: r % 2 === 0 ? "FFFFFF" : TEALLT }, line: { color: LINECL, width: 0.75 } });
      x += colW[i];
    });
    y += 0.85;
  }
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 13 — Decision: RAPID recap
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("ROOM-FACING · BLOCK 6 OF 6 · 85–90 MIN (1 OF 2)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 3 });
  title(s, "Decision — who's in which role?");
  sub(s, "Recap the RAPID roles assigned before the workshop, so everyone remembers who calls it.");

  const roles = [
    { l: "R", name: "Recommend", who: "[Name]", fill: TEAL },
    { l: "A", name: "Agree", who: "[Name(s)]", fill: AMBER },
    { l: "P", name: "Perform", who: "[Name(s)]", fill: "0EA5E9" },
    { l: "I", name: "Input", who: "[Everyone else]", fill: "94A3B8" },
    { l: "D", name: "Decide", who: "[Name]", fill: SLATE },
  ];
  const cw = (W - 2*M - 4*0.25) / 5;
  roles.forEach((r, i) => {
    const x = M + i * (cw + 0.25);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.5, w: cw, h: 2.6, fill: { color: WHITE }, line: { color: LINECL, width: 1 }, shadow: shadow() });
    badge(s, x + cw/2 - 0.35, 2.7, 0.7, r.l, r.fill, WHITE);
    s.addText(r.name, { x, y: 3.55, w: cw, h: 0.4, margin: 0, align: "center", fontFace: HEAD, fontSize: 15, bold: true, color: SLATE });
    s.addText(r.who, { x, y: 3.95, w: cw, h: 0.9, margin: 4, align: "center", valign: "top", fontFace: BODY, fontSize: 12.5, italic: true, color: MUTED });
  });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 14 — Decision: the call + commitment
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEAL2 };
  s.addText("ROOM-FACING · BLOCK 6 OF 6 · 85–90 MIN (2 OF 2)", { x: M, y: 0.55, w: W - 2*M, h: 0.32, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: AMBER, charSpacing: 3 });
  s.addText("The Decider calls it", { x: M, y: 1.0, w: W - 2*M, h: 0.9, margin: 0, fontFace: HEAD, fontSize: 36, bold: true, color: WHITE });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.3, w: W - 2*M, h: 1.6, fill: { color: TEAL }, line: { type: "none" }, shadow: shadow() });
  s.addText("STATE ALOUD: the decision, the main reasons, the risks accepted.", { x: M + 0.4, y: 2.5, w: W - 2*M - 0.8, h: 1.2, margin: 0, fontFace: HEAD, fontSize: 18, italic: true, color: WHITE, valign: "top" });

  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 4.2, w: W - 2*M, h: 1.7, fill: { color: AMBER }, line: { type: "none" }, shadow: shadow() });
  s.addText("EACH PARTICIPANT CONFIRMS, OUT LOUD OR IN WRITING:", { x: M + 0.4, y: 4.4, w: W - 2*M - 0.8, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: AMBERLT, charSpacing: 1 });
  s.addText("“I will support this decision in implementation even if my preferred option was different.”", { x: M + 0.4, y: 4.75, w: W - 2*M - 0.8, h: 1.0, margin: 0, fontFace: HEAD, fontSize: 17, italic: true, color: WHITE, valign: "top" });
  footer(s, "Decisions That Stick · Workshop Pack — room-facing slide");
})();

// ============================================================
// SLIDE 15 — Appendix divider
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: SLATE };
  s.addText("APPENDIX", { x: M, y: 2.7, w: W - 2*M, h: 0.5, margin: 0, fontFace: BODY, fontSize: 16, bold: true, color: AMBER, charSpacing: 4 });
  s.addText("Background & further learning", { x: M, y: 3.15, w: W - 2*M, h: 1.0, margin: 0, fontFace: HEAD, fontSize: 38, bold: true, color: WHITE });
  s.addText("The theory behind each framework, plus where to go next — talks, books, and podcasts on teaming and decision-making more broadly.", { x: M, y: 4.15, w: 9, h: 0.6, margin: 0, fontFace: BODY, fontSize: 14, italic: true, color: "CBD5E1" });
  footer(s, "Decisions That Stick · Workshop Pack — appendix");
})();

// ---------- Appendix framework background helper ----------
function appendixSlide({ eyebrowText, slideTitle, originText, bodyParagraphs, learnItems }) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  eyebrow(s, eyebrowText);
  title(s, slideTitle);
  s.addText(originText, { x: M, y: 1.6, w: W - 2*M, h: 0.4, margin: 0, fontFace: BODY, fontSize: 13, italic: true, color: MUTED });

  // left: background paragraph(s)
  const leftW = 6.9;
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.2, w: leftW, h: 4.6, fill: { color: TEALLT }, line: { color: ICE, width: 1 } });
  s.addText("BACKGROUND", { x: M + 0.3, y: 2.4, w: leftW - 0.6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: TEAL, charSpacing: 2 });
  s.addText(bodyParagraphs, { x: M + 0.3, y: 2.75, w: leftW - 0.6, h: 3.9, margin: 0, fontFace: BODY, fontSize: 12.5, color: SLATE, valign: "top", lineSpacingMultiple: 1.25 });

  // right: further learning
  const rx = M + leftW + 0.4, rw = W - M - rx;
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: 2.2, w: rw, h: 4.6, fill: { color: AMBERLT }, line: { color: "FDE68A", width: 1 } });
  s.addText("FURTHER LEARNING", { x: rx + 0.3, y: 2.4, w: rw - 0.6, h: 0.3, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: AMBER, charSpacing: 2 });
  const learnRuns = [];
  learnItems.forEach((it, i) => {
    learnRuns.push({ text: `${it.icon}  ${it.title}\n`, options: { bold: true, fontSize: 12.5, color: SLATE, breakLine: true } });
    learnRuns.push({ text: `${it.note}\n${i < learnItems.length - 1 ? "\n" : ""}`, options: { fontSize: 11, color: MUTED, breakLine: true } });
  });
  s.addText(learnRuns, { x: rx + 0.3, y: 2.75, w: rw - 0.6, h: 3.9, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });

  footer(s, "Decisions That Stick · Workshop Pack — appendix");
}

// SLIDE 16 — Background: Ladder of Inference
appendixSlide({
  eyebrowText: "Appendix · Framework 1",
  slideTitle: "Inquiry over Advocacy",
  originText: "Chris Argyris & Donald Schön (organisational learning) · popularised by Peter Senge, The Fifth Discipline",
  bodyParagraphs:
    "The Ladder of Inference describes how people move — in seconds, mostly unconsciously — from raw data to selected data, to interpretation, to assumptions, to conclusions, to action.\n\nMost discussions only ever exchange the top rung: conclusions. Inquiry means climbing back down to find out where two reasonable people actually diverge — almost always at assumptions or interpretation, not the conclusion itself.\n\nArgyris's research found that highly skilled professionals are often worse at genuine inquiry than less experienced people, because they have more invested in their existing models being right.",
  learnItems: [
    { icon: "🎥", title: "Search YouTube: “Peter Senge Ladder of Inference”", note: "Short explainer talks from Senge and systems-thinking practitioners." },
    { icon: "🎧", title: "HBR IdeaCast — episodes on organisational learning & mental models", note: "Harvard Business Review's podcast frequently revisits Argyris's defensive-routines research." },
    { icon: "📖", title: "The Fifth Discipline — Peter Senge", note: "The definitive text. Chapter on mental models covers this directly." },
  ],
});

// SLIDE 17 — Background: Six Thinking Hats
appendixSlide({
  eyebrowText: "Appendix · Framework 2",
  slideTitle: "Six Thinking Hats",
  originText: "Edward de Bono, 1985",
  bodyParagraphs:
    "De Bono's method separates types of thinking so a group does one at a time, together, instead of each person doing all types at once from a fixed role.\n\nWhite (facts), Red (feelings), Black (caution/risk), Yellow (optimism/value), Green (creativity), Blue (process). The Black Hat is the most valuable and most misunderstood — critical analysis, not pessimism, and everyone wears it together rather than it being one person's job.\n\nWidely used in facilitation, education, and corporate strategy work since the 1980s.",
  learnItems: [
    { icon: "🎥", title: "Search YouTube: “Edward de Bono Six Thinking Hats”", note: "De Bono's own recorded talks and many facilitator explainer videos." },
    { icon: "🎧", title: "Search podcasts: “Six Thinking Hats facilitation”", note: "Several facilitation- and innovation-focused podcasts have dedicated episodes." },
    { icon: "📖", title: "Six Thinking Hats — Edward de Bono", note: "Short, practical, one afternoon to read." },
  ],
});

// SLIDE 18 — Background: Risk-First Alignment
appendixSlide({
  eyebrowText: "Appendix · Framework 3",
  slideTitle: "Risk-First Alignment",
  originText: "Applied risk-management practice, drawing on probability × impact risk-register methodology",
  bodyParagraphs:
    "Standard risk-register technique (probability × impact rating) applied specifically to team alignment: rate independently and silently, reveal simultaneously, then discuss only where ratings diverge.\n\nThe insight that makes this powerful for cross-functional teams: disagreements about which option to choose are almost always proxy disagreements about which risks matter most. Resolve the risk picture first and the option debate often resolves itself.\n\nWidely used in project management (PMI, PRINCE2) but rarely applied explicitly to resolve team disagreement — most teams skip straight to debating options.",
  learnItems: [
    { icon: "🎥", title: "Search YouTube: “probability impact risk matrix facilitation”", note: "Practical walk-throughs of running a risk workshop with a group." },
    { icon: "🎧", title: "Search podcasts: “project risk management”", note: "PMI and infrastructure-sector podcasts regularly cover risk-register technique." },
    { icon: "📖", title: "Thinking, Fast and Slow — Daniel Kahneman", note: "The cognitive science behind why risk perception diverges between people looking at the same facts." },
  ],
});

// SLIDE 19 — Background: RAPID
appendixSlide({
  eyebrowText: "Appendix · Framework 4",
  slideTitle: "RAPID Decision Roles",
  originText: "Bain & Company, 1990s — decision-rights methodology",
  bodyParagraphs:
    "RAPID (Recommend, Agree, Perform, Input, Decide) assigns exactly one role per person per decision — designed to fix the most common cause of corporate decision paralysis: ambiguity about who actually has authority.\n\nThe most frequent misconfiguration Bain found in client organisations: too many informal “Agree” holders (effective vetoes) and no clear single Decider. Naming roles explicitly, even when uncomfortable, surfaces the implicit power dynamics that were causing the deadlock.\n\nWidely adopted across consulting, private equity, and large corporates as a standard decision-governance tool.",
  learnItems: [
    { icon: "🎥", title: "Search YouTube: “Bain RAPID decision making framework”", note: "Bain & Company and business-school explainer videos." },
    { icon: "🎧", title: "Search podcasts: “decision rights organisational design”", note: "Strategy and org-design podcasts cover RAPID alongside RACI and other decision-rights models." },
    { icon: "📖", title: "HBR.org — search “Who Has the D?”", note: "Bain's original Harvard Business Review article introducing RAPID." },
  ],
});

// SLIDE 20 — Background: Pre-Mortem & Red Team
appendixSlide({
  eyebrowText: "Appendix · Framework 5",
  slideTitle: "Pre-Mortem & Red Team",
  originText: "Pre-Mortem: Gary Klein, Harvard Business Review, 2007 · Red Team: military & intelligence adversarial-review tradition",
  bodyParagraphs:
    "Pre-Mortem reframes “what are you worried about?” (which feels like dissent) into “imagine it already failed — why?” (a thought experiment everyone can safely contribute to). Klein's research found this single reframe dramatically increases the number and quality of risks teams surface before committing.\n\nRed Team borrows from military and intelligence practice: a team explicitly mandated to attack a plan, structurally separate from the team that built it, with no stake in being right.\n\nBoth techniques work because they change the social framing of criticism — from “objecting” to “doing the job you were assigned.”",
  learnItems: [
    { icon: "🎥", title: "Search YouTube: “Gary Klein pre-mortem TED”", note: "Gary Klein has multiple recorded talks specifically on the pre-mortem technique." },
    { icon: "🎧", title: "Search podcasts: “Gary Klein decision making”", note: "Klein has appeared on numerous decision-science and management podcasts." },
    { icon: "📖", title: "Decisive — Chip and Dan Heath", note: "Covers Pre-Mortem in practical depth, with case studies of teams applying it." },
  ],
});

// ============================================================
// SLIDE 21 — Further learning: teaming & psych safety (general)
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  eyebrow(s, "Appendix · Beyond this workshop");
  title(s, "Teaming & psychological safety, more broadly");
  sub(s, "The frameworks in this deck only work if people feel safe enough to say what they actually think. These resources go deeper on that prerequisite.");

  const items = [
    { icon: "🎥", title: "Amy Edmondson — “Building a psychologically safe workplace” (TEDx)", note: "The single best 12-minute primer on why teams that feel safe outperform teams that don't." },
    { icon: "📖", title: "The Fearless Organization — Amy Edmondson", note: "The deeper text behind the talk. Directly relevant to every framework in this deck." },
    { icon: "📖", title: "Team of Teams — General Stanley McChrystal", note: "How a rigid command structure rebuilt itself around shared information and decentralised decision rights under real operational pressure." },
    { icon: "📖", title: "The Five Dysfunctions of a Team — Patrick Lencioni", note: "A model of how trust, conflict avoidance, and lack of accountability compound in teams — useful diagnostic alongside the diagnosis section of this workshop." },
    { icon: "🎧", title: "Search podcasts: “WorkLife with Adam Grant”", note: "Regularly covers team dynamics, decision-making, and organisational psychology with practical takeaways." },
    { icon: "🎧", title: "Search podcasts: “Dare to Lead” and “HBR IdeaCast”", note: "Both have recurring episodes on team trust, conflict, and difficult conversations." },
  ];
  let y = 2.45;
  items.forEach((it) => {
    s.addText(it.icon, { x: M, y, w: 0.5, h: 0.5, margin: 0, fontSize: 16, valign: "top" });
    s.addText(it.title, { x: M + 0.5, y: y - 0.02, w: W - 2*M - 0.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 13.5, bold: true, color: SLATE });
    s.addText(it.note, { x: M + 0.5, y: y + 0.3, w: W - 2*M - 0.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 11.5, color: MUTED });
    y += 0.72;
  });
  footer(s, "Decisions That Stick · Workshop Pack — appendix");
})();

// ============================================================
// SLIDE 22 — Closing
// ============================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: TEAL2 };
  s.addText("Run it. Adapt it. Make it yours.", { x: M, y: 2.7, w: W - 2*M, h: 0.9, margin: 0, fontFace: HEAD, fontSize: 36, bold: true, color: WHITE });
  s.addText("These slides are templates — duplicate, edit the bracketed prompts, and present them live during your session. The full written module, with worked reasoning behind every framework, lives at the link below.", {
    x: M, y: 3.7, w: 9.5, h: 1.0, margin: 0, fontFace: BODY, fontSize: 14, color: ICE, lineSpacingMultiple: 1.2,
  });
  s.addText("travis-coder712.github.io/decisions-that-stick", { x: M, y: 4.9, w: 9, h: 0.4, margin: 0, fontFace: BODY, fontSize: 14, bold: true, color: AMBER });
  s.addText("Studio · Decisions That Stick · Workshop Pack", { x: M, y: H - 0.7, w: 7, h: 0.3, margin: 0, fontFace: BODY, fontSize: 10.5, color: ICE });
})();

// ============================================================
pres.writeFile({ fileName: OUT }).then(() => {
  console.log("Wrote", OUT);
});
