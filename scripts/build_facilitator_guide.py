"""
Builds Decisions-That-Stick-Facilitator-Guide.pdf — the companion document
for whoever is running the 90-minute workshop. Complements the room-facing
PPTX deck (build-workshop-deck.js) with the facilitator's own script, the
specific dysfunctions to watch for, and what to do when they show up.
"""
import os
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, NextPageTemplate, PageTemplate,
    Frame, BaseDocTemplate
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas as canvas_mod

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "downloads", "Decisions-That-Stick-Facilitator-Guide.pdf")

# ---- Palette (matches the web module) ----
TEAL = colors.HexColor("#0F766E")
TEAL_DARK = colors.HexColor("#134E4A")
TEAL_SOFT = colors.HexColor("#F0FDFA")
TEAL_BORDER = colors.HexColor("#99F6E4")
AMBER = colors.HexColor("#B45309")
AMBER_SOFT = colors.HexColor("#FFFBEB")
AMBER_BORDER = colors.HexColor("#FDE68A")
SLATE = colors.HexColor("#1E293B")
SLATE_2 = colors.HexColor("#334155")
TEXT_MUTE = colors.HexColor("#64748B")
ROSE = colors.HexColor("#E11D48")
ROSE_SOFT = colors.HexColor("#FFF1F2")
ROSE_BORDER = colors.HexColor("#FECDD3")
BORDER = colors.HexColor("#E2E8F0")
WHITE = colors.white

PAGE_W, PAGE_H = LETTER
MARGIN = 0.75 * inch

styles = getSampleStyleSheet()

def style(name, parent="Normal", **kw):
    base = styles[parent]
    return ParagraphStyle(name, parent=base, **kw)

S_COVER_EYEBROW = style("CoverEyebrow", fontName="Helvetica-Bold", fontSize=11,
                         textColor=AMBER, leading=14, spaceAfter=10, tracking=2)
S_COVER_TITLE = style("CoverTitle", fontName="Helvetica-Bold", fontSize=34,
                       textColor=WHITE, leading=38, spaceAfter=10)
S_COVER_SUB = style("CoverSub", fontName="Helvetica-Oblique", fontSize=15,
                     textColor=TEAL_BORDER, leading=20, spaceAfter=4)
S_COVER_PURPOSE = style("CoverPurpose", fontName="Helvetica", fontSize=12,
                         textColor=colors.HexColor("#CBD5E1"), leading=18)

S_H1 = style("H1", fontName="Helvetica-Bold", fontSize=20, textColor=SLATE,
             leading=24, spaceBefore=4, spaceAfter=10)
S_H2 = style("H2", fontName="Helvetica-Bold", fontSize=14, textColor=TEAL_DARK,
             leading=18, spaceBefore=14, spaceAfter=6)
S_H3 = style("H3", fontName="Helvetica-Bold", fontSize=11.5, textColor=SLATE_2,
             leading=15, spaceBefore=8, spaceAfter=4)
S_BODY = style("Body", fontName="Helvetica", fontSize=10, textColor=SLATE_2,
               leading=14.5, spaceAfter=6)
S_BODY_SM = style("BodySm", fontName="Helvetica", fontSize=9, textColor=TEXT_MUTE,
                   leading=12.5, spaceAfter=4)
S_LABEL = style("Label", fontName="Helvetica-Bold", fontSize=8.5, textColor=TEAL,
                 leading=11, spaceAfter=3)
S_LABEL_AMBER = style("LabelAmber", fontName="Helvetica-Bold", fontSize=8.5, textColor=AMBER,
                       leading=11, spaceAfter=3)
S_LABEL_ROSE = style("LabelRose", fontName="Helvetica-Bold", fontSize=8.5, textColor=ROSE,
                      leading=11, spaceAfter=3)
S_SCRIPT = style("Script", fontName="Helvetica-Oblique", fontSize=10.5,
                  textColor=WHITE, leading=15, spaceAfter=4)
S_BULLET = style("Bullet", fontName="Helvetica", fontSize=9.5, textColor=SLATE_2,
                  leading=13.5, spaceAfter=4, leftIndent=12, bulletIndent=0)
S_META = style("Meta", fontName="Helvetica-Bold", fontSize=9, textColor=TEXT_MUTE,
               leading=12)
S_FOOT = style("Foot", fontName="Helvetica", fontSize=8, textColor=TEXT_MUTE)


def callout(title_text, body_text, label_color, bg, border, title_style):
    """A boxed callout — used for 'What to look out for' / 'If this happens' / guardrails."""
    t = Table(
        [[Paragraph(title_text, title_style)],
         [Paragraph(body_text, S_BODY)]],
        colWidths=[6.5 * inch],
    )
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 1, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (0, 0), 8),
        ("BOTTOMPADDING", (0, 0), (0, 0), 2),
        ("TOPPADDING", (0, 1), (0, 1), 0),
        ("BOTTOMPADDING", (0, 1), (0, 1), 10),
    ]))
    return t


def script_box(text):
    """Dark teal box for 'say this aloud' facilitator scripts."""
    t = Table([[Paragraph("SAY THIS, OUT LOUD", S_LABEL.clone("ScriptLabel", textColor=TEAL_BORDER))],
               [Paragraph(text, S_SCRIPT)]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TEAL_DARK),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (0, 0), 10),
        ("BOTTOMPADDING", (0, 0), (0, 0), 2),
        ("TOPPADDING", (0, 1), (0, 1), 0),
        ("BOTTOMPADDING", (0, 1), (0, 1), 12),
    ]))
    return t


def section_divider():
    return HRFlowable(width="100%", thickness=0.75, color=BORDER, spaceBefore=10, spaceAfter=10)


def bullets(items, style_=S_BULLET, bullet_char="–"):
    flow = []
    for it in items:
        flow.append(Paragraph(f"{bullet_char}&nbsp;&nbsp;{it}", style_))
    return flow


# ============================================================
# Cover page background
# ============================================================
class CoverBackground(Flowable):
    def __init__(self, width, height):
        Flowable.__init__(self)
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        c.setFillColor(TEAL_DARK)
        c.rect(-MARGIN, -self.height, self.width + 2 * MARGIN, self.height + 2 * inch, fill=1, stroke=0)
        # decorative circles
        c.setFillColor(TEAL)
        c.circle(self.width - 0.6 * inch, self.height - 1.3 * inch, 0.55 * inch, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#CCFBF1"))
        c.circle(self.width - 1.9 * inch, self.height - 0.5 * inch, 0.4 * inch, fill=1, stroke=0)
        c.setFillColor(AMBER)
        c.circle(self.width - 0.3 * inch, self.height - 2.3 * inch, 0.4 * inch, fill=1, stroke=0)


def build_cover(story):
    story.append(CoverBackground(6.5 * inch, 5.4 * inch))
    story.append(Spacer(1, 0.9 * inch))
    story.append(Paragraph("FACILITATOR GUIDE", S_COVER_EYEBROW))
    story.append(Paragraph("Decisions That Stick", S_COVER_TITLE))
    story.append(Paragraph("Running the 90-minute workshop, end to end.", S_COVER_SUB))
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph(
        "This guide is for the person facilitating the session — not the room. "
        "It gives you the exact script for each block, the specific dysfunctions "
        "to watch for, and the precise move to make when they show up.",
        S_COVER_PURPOSE))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph(
        "Pairs with the room-facing slide deck (Decisions-That-Stick-Workshop.pptx).<br/>"
        "Part of the Decisions That Stick module · Studio",
        style("CoverMeta", fontName="Helvetica", fontSize=9.5, textColor=colors.HexColor("#94A3B8"), leading=14)))
    story.append(PageBreak())


# ============================================================
# Before you start
# ============================================================
def build_before_you_start(story):
    story.append(Paragraph("Before you start", S_H1))
    story.append(Paragraph(
        "Do these three things in the week before the session. Do not skip the advance "
        "communication — springing RAPID roles or the Ladder of Inference reflection on "
        "people in the room produces worse results than not running the workshop at all.",
        S_BODY))

    story.append(Paragraph("Prep checklist — send before the session", S_H2))
    prep_items = [
        "<b>Choose a real decision.</b> Not a hypothetical. Pick a specific, contested decision the "
        "team has already tried and failed to resolve in a standard meeting. The energy in the room "
        "will be genuine — that's what makes the workshop work.",
        "<b>Assign RAPID roles in advance.</b> Send role assignments to all participants before the "
        "workshop. Be explicit: who Recommends, who must Agree, who Performs, who is Input, who Decides. "
        "Explain what each role means. Give people time to sit with their assignment before the room.",
        "<b>Ask each participant to prepare a Ladder of Inference reflection.</b> “Write down your "
        "current view on the decision, the data you're drawing on, and the assumption that connects that "
        "data to your conclusion.” This primes inquiry over advocacy — people arrive ready to explain "
        "their reasoning rather than just defend their conclusion.",
    ]
    story.extend(bullets(prep_items))

    story.append(Paragraph("Room setup", S_H2))
    setup_items = [
        "Whiteboard or large shared surface, visible to everyone, plus sticky notes for independent writing exercises (Risk-First ratings, Pre-Mortem).",
        "A visible timer. This workshop runs on tight blocks — put the clock where everyone, including you, can see it.",
        "RAPID role assignments printed or displayed somewhere persistent in the room — not just mentioned once at the start.",
        "The decision question itself, written out in full, visible for the whole session. Not “discuss grid connection strategy” — the actual bounded question, e.g. “Do we proceed to FEED on the Stage 2 connection option?”",
    ]
    story.extend(bullets(setup_items))
    story.append(PageBreak())


# ============================================================
# Agenda block builder
# ============================================================
def build_block(story, block_no, total, time_range, title_text, purpose, script_text,
                 watch_items, do_items, guardrail_text, accent=TEAL):
    header_tbl = Table(
        [[Paragraph(f"BLOCK {block_no} OF {total} · {time_range}", S_META),
          Paragraph(title_text, style("BlockTitle", fontName="Helvetica-Bold", fontSize=16,
                                       textColor=SLATE, leading=20, alignment=TA_LEFT))]],
        colWidths=[1.6 * inch, 4.9 * inch],
    )
    header_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(header_tbl)
    story.append(Spacer(1, 2))

    bar = Table([[""]], colWidths=[6.5 * inch], rowHeights=[3])
    bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), accent)]))
    story.append(bar)
    story.append(Spacer(1, 6))

    story.append(Paragraph(f"<b>Purpose:</b> {purpose}", S_BODY))
    story.append(Spacer(1, 4))
    story.append(script_box(script_text))
    story.append(Spacer(1, 6))

    watch_body = "<br/>".join(f"• {w}" for w in watch_items)
    story.append(callout(
        "WHAT TO LOOK OUT FOR", watch_body, AMBER, AMBER_SOFT, AMBER_BORDER, S_LABEL_AMBER
    ))
    story.append(Spacer(1, 6))

    do_body = "<br/><br/>".join(f"<b>If this happens:</b> {w[0]}<br/><b>Do this:</b> {w[1]}" for w in do_items)
    story.append(callout(
        "FACILITATOR INTERVENTIONS", do_body, ROSE, ROSE_SOFT, ROSE_BORDER, S_LABEL_ROSE
    ))
    story.append(Spacer(1, 6))

    story.append(callout(
        "TIMING GUARDRAIL", guardrail_text, TEAL, TEAL_SOFT, TEAL_BORDER, S_LABEL
    ))
    story.append(PageBreak())


def build_all_blocks(story):
    story.append(Paragraph("Running the six blocks", S_H1))
    story.append(Paragraph(
        "Each block below has the same structure: what it's for, exactly what to say, the specific "
        "things that go wrong in this kind of room, and the precise move to make when they do.",
        S_BODY))
    story.append(PageBreak())

    # Block 1 — Opening
    build_block(
        story, 1, 6, "0–5 min", "Opening",
        "Set the frame: this is a decision session, not a debate, and it will end with a call.",
        "“We are here to make a better-informed decision on [specific question], using a "
        "structured process. Today is not about consensus — it is about making the best decision "
        "we can with the information we have. The process will feel different from a normal meeting. "
        "That's intentional.”",
        watch_items=[
            "Someone immediately starts advocating for their preferred option before the process has even begun — a sign they've arrived ready to fight, not inquire.",
            "Visible scepticism about the format itself (“why don't we just discuss it like normal”).",
        ],
        do_items=[
            ("Someone jumps straight to advocacy.",
             "Acknowledge it without engaging: “Hold that thought — we'll get to options later. Right now we're just establishing what we know.”"),
            ("Open scepticism about the process.",
             "Name the reason directly: “We've tried the normal way on this exact decision and it didn't resolve it. This is 90 minutes — if it doesn't work, we've lost very little.”"),
        ],
        guardrail_text="This block should never run over 5 minutes. If you're still explaining the process at minute 6, you're over-explaining — cut it short and let the structure speak for itself in block 2.",
    )

    # Block 2 — White Hat
    build_block(
        story, 2, 6, "5–15 min", "White Hat — what do we know?",
        "Establish a shared fact base before anyone interprets it.",
        "“What do we actually know? What is our best estimate? What is genuinely unknown? "
        "I want facts and data only right now — no opinions, no interpretations. We'll get to "
        "what it means later.”",
        watch_items=[
            "People stating interpretations as if they were facts (“the connection cost is too high” is an interpretation; “the connection cost estimate is $X” is a fact).",
            "Silence from quieter participants — often a sign they're waiting to see which “side” the facts support before committing to a version of events.",
            "Disagreement about what a number actually means (a sign you're already sliding into interpretation — catch it early).",
        ],
        do_items=[
            ("Someone states an interpretation as fact.",
             "“Let's park that in the interpretation column and come back to it. What's the actual number/document/agreement underneath that view?”"),
            ("A quieter participant hasn't spoken.",
             "Address them directly and specifically: “[Name], what's the most important fact from your side that hasn't been said yet?”"),
        ],
        guardrail_text="If you're at minute 13 and still gathering facts, call it: “Let's capture what we have and move — we can add facts later if something critical comes up.” Don't let perfect information-gathering eat the time budget for the parts of the session that actually resolve disagreement.",
    )

    # Block 3 — Risk-First Alignment
    build_block(
        story, 3, 6, "15–40 min", "Risk-First Alignment",
        "Agree on the risk picture before anyone argues about which option is best.",
        "“Before we discuss options, I want us to agree on the risks. First we'll list every "
        "risk — no debate, just naming. Then everyone rates each risk on probability and impact, "
        "silently, on your own. We'll reveal all the ratings at once and only discuss where they "
        "differ.”",
        watch_items=[
            "Risk ratings cluster suspiciously close together across everyone in the room — often a sign of social conformity (people glancing at neighbours, or rating to avoid standing out) rather than genuine independent judgement.",
            "One person's ratings are consistently the outlier on every risk — worth exploring directly rather than treating as noise.",
            "People start debating options during the risk-naming step (“well if we did X then Y wouldn't be a risk”) — a sign the room is jumping ahead.",
        ],
        do_items=[
            ("Ratings cluster suspiciously and you suspect conformity, not consensus.",
             "Spot-check it: “These ratings are very close — did anyone genuinely consider rating this differently before settling here?” Make it safe to admit they didn't think hard about it."),
            ("Someone debates options during risk-naming.",
             "“That's a great point for the options discussion — let's capture it on a side list and come back to it once we've agreed the risk picture.”"),
            ("Real divergence shows up (the productive outcome — don't suppress it).",
             "Use inquiry, not argument: “What data are you each drawing on? What would have to be true for your rating to shift?” This is the most valuable conversation in the whole workshop — let it run."),
        ],
        guardrail_text="This is the longest block (25 minutes) because it's doing the most work. If divergence discussion is genuinely productive at minute 38, it's fine to borrow 5 minutes from the Six Hats block — better to resolve a real disagreement here than rush to evaluate options without it.",
    )

    # Block 4 — Six Hats
    build_block(
        story, 4, 6, "40–70 min", "Six Hats — evaluation",
        "Evaluate the options with everyone in the same thinking mode at the same time — starting with upside, then rigorous risk, then alternatives.",
        "Yellow Hat: “What's the best case if we proceed? What value does this create?” "
        "Black Hat: “What could go wrong? Where is the logic weakest? I want everyone in this "
        "hat together — this isn't one person's job.” "
        "Green Hat: “What modifications address the Black Hat concerns? What haven't we considered?”",
        watch_items=[
            "Someone uses the Black Hat to advocate for their pre-existing position rather than genuinely analyse risk (the most common failure in this block).",
            "The most senior person in the room dominates airtime across all three hats, regardless of whose Input/Recommend/Decide role it actually is.",
            "Black Hat analysis stays vague (“it's risky”) rather than specific (“the connection timeline risk is High probability because X”).",
            "Yellow Hat gets rushed or skipped — teams under stress tend to jump straight to risk and skip genuine upside analysis.",
        ],
        do_items=[
            ("Someone uses Black Hat to advocate for a position.",
             "Call it out plainly: “That sounds like a conclusion, not a risk — let's park it and come back to it in the decision phase. Right now: what specifically could go wrong?”"),
            ("The most senior person dominates.",
             "Use the RAPID roles explicitly: “As the Input role here, your view matters — but I want to make sure we hear from the Recommender and from [quieter person] too before we move on.”"),
            ("Black Hat analysis is vague.",
             "Push for specificity every time: “Say more — risky how? Which risk, and what's driving the probability?”"),
        ],
        guardrail_text="Black Hat (12 min) is the priority — protect its time even if Yellow or Green run short. If you're at minute 68 and Green Hat hasn't started, skip straight to capturing whatever alternatives have already surfaced and move to Pre-Mortem on time.",
    )

    # Block 5 — Pre-Mortem
    build_block(
        story, 5, 6, "70–85 min", "Pre-Mortem",
        "Surface the failure modes nobody has felt safe naming yet, by reframing concern as a thought experiment.",
        "“We are 18 months from now. This project went ahead. It has failed — significantly, "
        "embarrassingly, expensively. Spend five minutes, alone, writing down every reason you can "
        "think of for why it failed. No talking yet.”",
        watch_items=[
            "The exercise turns into a generic complaint session about unrelated grievances (team process, resourcing, other projects) rather than specific failure modes for this decision.",
            "Everyone names the same one or two failure modes — a sign people are anchoring on whoever spoke first rather than genuinely thinking independently.",
            "Someone treats this as an opportunity to relitigate the option debate from block 4 rather than identify failure modes.",
        ],
        do_items=[
            ("It becomes a generic complaint session.",
             "Let one round happen — people often need to vent — then redirect firmly: “That's useful context. Now let's focus specifically on what could make *this* decision fail.”"),
            ("Everyone names the same failure mode.",
             "Check whether independent writing actually happened: “Before we captured these, did everyone write their own list privately first, or did we talk it through as we went?” If the silent-writing step got skipped, redo it properly — the anchoring effect is real and costly."),
            ("Someone relitigates the option debate.",
             "“That's an options conversation — right now I want failure modes assuming we've already gone ahead with whatever we decide.”"),
        ],
        guardrail_text="The independent writing step (3 min, no talking) is non-negotiable — it's what prevents anchoring. If people start talking during it, stop them: “Hold off — keep writing, we'll share in a moment.” Don't let this slip even under time pressure.",
    )

    # Block 6 — Decision
    build_block(
        story, 6, 6, "85–90 min", "Decision",
        "The Decider makes the call, states it aloud with reasoning, and the room commits.",
        "“[Decider's name], based on everything we've heard — what's the decision, what are "
        "the main reasons, and what risks are we explicitly accepting?” Then to the room: "
        "“I want each of you to confirm: will you support this decision in implementation even "
        "if your preferred option was different?”",
        watch_items=[
            "The Decider hesitates and the room slides back into open debate instead of waiting for a bounded next step.",
            "Visible non-verbal disagreement (crossed arms, silence, eye-rolling) from someone who verbally says they'll support the decision — a likely sign of compliance, not commitment.",
            "The Decider states a decision without stating the reasoning or the risks accepted — this will resurface as confusion or relitigation later.",
        ],
        do_items=[
            ("The Decider can't decide in the room.",
             "That's legitimate if genuinely new information emerged. Don't let the room drift into general discussion — ask the Decider directly: “What specific information do you need, and by when will you decide?” Get a date before the room disperses."),
            ("Visible non-verbal disagreement from someone who verbally agrees.",
             "Address it directly, privately if needed: “[Name], you said you're on board — is there something specific that's still sitting with you?” Better to surface it now than have it resurface as quiet resistance during implementation."),
            ("The Decider skips the reasoning.",
             "Prompt explicitly: “Can you say the main reasons out loud, and which risks we're accepting? That's what goes in the decision record.”"),
        ],
        guardrail_text="This block must produce either a decision or a dated next step — never a return to open discussion. If you're at minute 89 and the room is still debating, interrupt: “We need to land this now. [Decider], what's the call?”",
    )


# ============================================================
# Extensions & variations
# ============================================================
def build_extensions(story):
    story.append(Paragraph("Extensions and variations", S_H1))
    story.append(Paragraph(
        "The 90-minute format is the default. These are the situations where you should deliberately "
        "deviate from it — and exactly how.",
        S_BODY))

    story.append(Paragraph("Splitting across two sessions (complex or politically charged decisions)", S_H2))
    story.append(Paragraph(
        "For decisions with significant history, seniority conflicts, or organisational politics, split "
        "the workshop across two sessions with a 48-hour pause in between.",
        S_BODY))
    story.extend(bullets([
        "<b>Session 1 (45 min):</b> White Hat + Risk-First Alignment + sharing of Ladder of Inference reflections.",
        "<b>48-hour pause.</b> No informal lobbying in between — set this expectation explicitly at the end of Session 1.",
        "<b>Session 2 (45 min):</b> Six Hats (abridged — 8 min Yellow, 10 min Black, 5 min Green) + Pre-Mortem + Decision.",
    ]))
    story.append(Paragraph(
        "Why the pause works: it prevents the pressure-cooker effect where people agree under time "
        "pressure and quietly relitigate afterwards. It also gives people genuine time to reflect on "
        "what they heard in Session 1, rather than reflexively defending their position straight through.",
        S_BODY))

    story.append(Paragraph("Mid-project Pre-Mortem (decisions already in flight)", S_H2))
    story.append(Paragraph(
        "Six months into delivery, before a major project gate, run a standalone Pre-Mortem on its own "
        "(30 minutes) rather than the full workshop. This surfaces concerns that have emerged since the "
        "original decision but that nobody has formally raised — particularly valuable after cost "
        "escalation, a policy change, a team change, or a market shift.",
        S_BODY))
    story.extend(bullets([
        "Same structure as the standalone Pre-Mortem block: frame, 3 min silent writing, 7 min round-robin, 5 min prioritise, then action the top three.",
        "Explicitly frame it as routine, not an emergency review — “we do this at every gate” removes the stigma of it looking like a vote of no confidence in the original decision.",
    ]))

    story.append(Paragraph("Scaling down to 45 minutes (lower-stakes decisions)", S_H2))
    story.append(Paragraph(
        "Not every decision warrants the full 90 minutes. For lower-stakes calls, compress to:",
        S_BODY))
    story.extend(bullets([
        "Opening — 2 min",
        "White Hat — 5 min",
        "Risk-First Alignment (rate + reveal divergences only, skip full category brainstorm) — 15 min",
        "Black Hat only (skip Yellow and Green) — 10 min",
        "Quick Pre-Mortem (skip independent writing, go straight to round-robin) — 8 min",
        "Decision — 5 min",
    ]))
    story.append(Paragraph(
        "Don't compress further than this. Below 45 minutes, the structure stops doing real work and "
        "becomes theatre — if the decision is that low-stakes, it may not need a workshop at all.",
        S_BODY))

    story.append(Paragraph("Running it virtually", S_H2))
    story.extend(bullets([
        "<b>Silent rating:</b> use a shared spreadsheet, Mentimeter, or even a simple poll tool with results hidden until everyone has submitted — the simultaneous reveal is the part that matters, not the medium.",
        "<b>Round-robin sharing:</b> go around the participant list explicitly by name rather than relying on people to unmute themselves — video calls amplify the loudest-voice-wins dynamic, not reduce it.",
        "<b>Independent writing:</b> use a shared doc with individual sections, or have people write privately and paste in simultaneously on your count — never let people see others' inputs before they've submitted their own.",
        "<b>Watch for camera-off disengagement</b> during Black Hat and Pre-Mortem specifically — these are the blocks where silent withdrawal is most likely and most costly. Call on people by name if cameras are off for an extended period.",
    ]))
    story.append(PageBreak())


# ============================================================
# After the workshop
# ============================================================
def build_after(story):
    story.append(Paragraph("After the workshop", S_H1))

    story.append(Paragraph("Decision record — within 24 hours", S_H2))
    story.append(Paragraph(
        "One page, sent to everyone who attended. Structure:",
        S_BODY))
    dr_table = Table(
        [[Paragraph("<b>Section</b>", style("DRHead", fontName="Helvetica-Bold", fontSize=9.5, textColor=WHITE)),
          Paragraph("<b>Content</b>", style("DRHead2", fontName="Helvetica-Bold", fontSize=9.5, textColor=WHITE))],
         [Paragraph("Decision", S_BODY), Paragraph("The specific decision made, stated as a complete sentence.", S_BODY)],
         [Paragraph("Reasoning", S_BODY), Paragraph("The main factors that drove the decision — not a transcript, the key 2–3 reasons.", S_BODY)],
         [Paragraph("Risks accepted", S_BODY), Paragraph("The risks the team explicitly chose to accept, from the Risk-First Alignment step.", S_BODY)],
         [Paragraph("Mitigation actions", S_BODY), Paragraph("The top failure modes from the Pre-Mortem and what will be done now to address each one — with an owner and a date.", S_BODY)],
         [Paragraph("Next review", S_BODY), Paragraph("The project gate or date at which this decision record will be revisited.", S_BODY)]],
        colWidths=[1.5 * inch, 5.0 * inch],
    )
    dr_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("BACKGROUND", (0, 1), (-1, -1), TEAL_SOFT),
        ("GRID", (0, 0), (-1, -1), 0.5, TEAL_BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(dr_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Commitment declaration", S_H2))
    story.append(Paragraph(
        "Capture this in the decision record itself, or as a follow-up message each participant replies "
        "to individually:",
        S_BODY))
    story.append(script_box(
        "“I will support this decision in implementation even if my preferred option was different.”"
    ))
    story.append(Paragraph(
        "If someone won't confirm this, that's important information — follow up with them directly "
        "and privately before the workshop is considered closed. A decision with even one unresolved "
        "holdout in the implementation team is a decision still at risk.",
        S_BODY))

    story.append(Paragraph("Review at the next gate", S_H2))
    story.append(Paragraph(
        "Revisit the decision record at the next project gate. Were the risks you identified the ones "
        "that materialised? What did you miss? This closes the learning loop and makes the next workshop "
        "better — both for this team and for whoever facilitates the next one.",
        S_BODY))
    story.append(PageBreak())


# ============================================================
# Diagnosing whether alignment was real
# ============================================================
def build_diagnosis_checklist(story):
    story.append(Paragraph("Diagnosing whether alignment was real", S_H1))
    story.append(Paragraph(
        "The real test of alignment is implementation behaviour in the weeks after the workshop — "
        "not agreement in the room. Watch for these signs.",
        S_BODY))

    good_items = [
        "People execute consistently with the decision, including the parts they originally disagreed with.",
        "New concerns get raised through the agreed process (e.g. flagged to the Decider or at the next gate) — not relitigated in side conversations or hallway complaints.",
        "When the project hits difficulty, the team problem-solves together rather than reverting to the pre-decision factions.",
        "The person who held the minority view during the workshop is still actively engaged in implementation, not quietly disengaged.",
    ]
    bad_items = [
        "Someone who confirmed the commitment declaration is now telling a different story informally (“I never thought this was a good idea”).",
        "Implementation is slower or lower-quality specifically in the areas owned by people who didn't get their preferred option.",
        "The decision gets reopened informally outside the agreed review process, especially by someone who was an Agree or Input role, not the Decider.",
        "Side conversations that sound like the workshop never happened — the same advocacy positions, the same arguments, just relocated to the corridor.",
    ]

    story.append(Paragraph("Signs alignment was real", S_H2))
    good_tbl = Table([[Paragraph("✓&nbsp;&nbsp;" + i, S_BODY)] for i in good_items], colWidths=[6.5 * inch])
    good_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TEAL_SOFT),
        ("BOX", (0, 0), (-1, -1), 1, TEAL_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, TEAL_BORDER),
    ]))
    story.append(good_tbl)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Signs it was compliance, not commitment", S_H2))
    bad_tbl = Table([[Paragraph("✗&nbsp;&nbsp;" + i, S_BODY)] for i in bad_items], colWidths=[6.5 * inch])
    bad_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ROSE_SOFT),
        ("BOX", (0, 0), (-1, -1), 1, ROSE_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, ROSE_BORDER),
    ]))
    story.append(bad_tbl)
    story.append(Spacer(1, 12))

    story.append(Paragraph(
        "If you see more than one or two items from the second list, the frameworks alone won't fix it. "
        "This points to a psychological safety issue that requires a direct, private conversation between "
        "the team leader and the individuals concerned — not another workshop.",
        S_BODY))
    story.append(Spacer(1, 16))
    story.append(section_divider())
    story.append(Paragraph(
        "Part of the Decisions That Stick module — travis-coder712.github.io/decisions-that-stick",
        S_FOOT))


# ============================================================
# Page numbering / footer
# ============================================================
def add_page_decoration(canv, doc):
    canv.saveState()
    canv.setFont("Helvetica", 8)
    canv.setFillColor(TEXT_MUTE)
    if doc.page > 1:
        canv.drawString(MARGIN, 0.5 * inch, "Decisions That Stick — Facilitator Guide")
        canv.drawRightString(PAGE_W - MARGIN, 0.5 * inch, f"Page {doc.page}")
        canv.setStrokeColor(BORDER)
        canv.setLineWidth(0.5)
        canv.line(MARGIN, 0.68 * inch, PAGE_W - MARGIN, 0.68 * inch)
    canv.restoreState()


def main():
    doc = SimpleDocTemplate(
        OUT, pagesize=LETTER,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title="Decisions That Stick — Facilitator Guide",
        author="Travis Hughes · Studio",
    )

    story = []
    build_cover(story)
    build_before_you_start(story)
    build_all_blocks(story)
    build_extensions(story)
    build_after(story)
    build_diagnosis_checklist(story)

    doc.build(story, onFirstPage=add_page_decoration, onLaterPages=add_page_decoration)
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
