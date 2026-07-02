import { useState, useRef, useEffect } from "react";

const MODULES = [
  {
    id: "winning-combination",
    title: "01 — The Winning Combination",
    lesson: "What to Sell in 2026",
    context: `The student just completed Module 01 of The Successful Woman's System. They learned the pattern successful women use to choose a product fast and validate it before building. Specifically: 1) The 5-question framework to identify the right product in one session — based on existing skills, real demand, and personal energy, 2) How to validate demand in 7 days using signals already available online (search volume, community questions, competitor gaps), 3) Digital product trends in 2026 and which formats are gaining traction, 4) The 3 questions to ask before building anything — Is someone already paying for this? Can I deliver it without burning out? Does this fit my distribution?, 5) Blue Ocean vs Red Ocean strategy — how successful women find less-competed spaces rather than fighting for attention in saturated markets. The student should now have a validated product idea or be much closer to one. Help them pressure-test it, refine it, or work through any remaining hesitation.`
  },
  {
    id: "48-hour-launch",
    title: "02 — 48-Hour Launch Sprint",
    lesson: "Idea to Live Product This Weekend",
    context: `The student just completed Module 02 of The Successful Woman's System. They learned why perfectionism is a delay mechanism — not a quality standard — and how successful women use strategic speed (not reckless speed) to get to market. The module covered: 1) The perfectionism trap: why the nervous system treats the moment of exposure like danger and produces one more revision, 2) The 5-step launch sequence: choose the product in 4 hours → build the minimum viable version → write a simple sales page → set up checkout and delivery → launch to warm audience, 3) Why "first version = most expensive market research available" — every revision before launch is guesswork, every sale is evidence, 4) The 14-Day Vulnerability Protocol: what to do in the days after launch so the student doesn't misread silence as failure. They also have access to the Claude Prompts Library, Canva Templates Library, and a full course workbook. Help them apply the sequence to their specific product idea, or work through whatever's blocking them from hitting publish.`
  },
  {
    id: "copy-ai-brand",
    title: "03 — Copy AI Brand Brain",
    lesson: "Build Your Brand Voice Once. Let It Scale.",
    context: `The student just completed Module 03 of The Successful Woman's System. They learned how to stop rewriting from scratch every time by building an AI Brand Brain — a system that knows their voice, their audience, their tone, and their offer, and produces on-brand content consistently. The 7-part module covered: 1) Setting up their AI Brand Brain and Infobase — feeding the system their story, values, audience description, and examples of great past content, 2) The CEO Systems Toolkit — turning the Brand Brain into a repeatable content engine, 3) Their AI Copywriting Factory — using the Brand Brain to produce sales copy, email sequences, and ad scripts, 4) Landing page builder — creating high-converting pages without starting from blank, 5) A 30-day content calendar generated from their Brand Brain, 6) The Advanced Workflow — chaining AI tools to multiply output, 7) The free AI Brand Brain tool for solopreneurs (no paid subscription needed to start). The student should now have the foundation of their Brand Brain set up. Help them practise using it, refine their inputs, or troubleshoot why their outputs don't sound like them yet.`
  },
  {
    id: "ai-powered-business",
    title: "04 — AI-Powered Digital Business",
    lesson: "Use AI for Leverage, Not Just Speed",
    context: `The student just completed Module 04 of The Successful Woman's System — 12 lessons on using AI as a solopreneur. The key shift this module teaches: successful women don't use AI to do the same thing faster, they use it to do fundamentally different things at scale. The lessons covered: 1) The AI Audit — a framework for identifying which tools they're actually using, which are redundant, and what's missing, 2) Finding a niche using AI — using AI to analyse demand, competition, and positioning before committing, 3) Crafting their creator voice — getting AI to sound like them, not like a template, 4) Content ideation at scale — generating a month of ideas in one session, 5) Writing with AI that still feels human — the editing and humanisation layer, 6) Visual content creation — AI tools for images and graphics without a designer, 7) Video and AI content that actually works, 8) Building their first offer using AI assistance, 9) Marketing and launch strategy, 10) Systems and automation, 11) Niche-specific strategies, 12) The Minimal Expansion Method — how to grow without complexity. The student also has the AI Tool Comparison Guide. Help them apply any of these areas to their specific business.`
  },
  {
    id: "distribution",
    title: "05 — Distribution Foundations",
    lesson: "How Your Work Actually Finds People",
    context: `The student just completed Module 05 of The Successful Woman's System. They learned that creating great content and distributing it are completely different skills — and most solopreneurs only do the first one. The 4-module section covered: 1) The Psychology of the Self-Made Woman — why successful women think about distribution as infrastructure rather than a byproduct of effort, 2) Foundations of Business Literacy — understanding how a business actually functions as a system: offer, distribution, delivery, finance, 3) Strategic Distribution — the strategy layer: which channels compound for their business type, how to design distribution rather than hope for it, the difference between owned distribution (email list) and rented distribution (social media), 4) The Tools — the specific platforms and methods that work for different business types in 2026. The student should now understand why posting more doesn't fix distribution and have a clearer picture of which channels to prioritise. Help them map their current distribution situation and identify the biggest gap.`
  },
  {
    id: "digital-marketing",
    title: "06 — Digital Marketing",
    lesson: "The Two Lanes Every Digital Business Needs",
    context: `The student just completed Module 06 of The Successful Woman's System. They learned why the advice "build in public and the money will follow" is incomplete — and what successful women do differently. The 6-module section + free demo covered: 1) The Lie We Were Sold — why building an audience and building a business are two different projects that require different strategies, 2) Value Creation vs Visibility Creation — the critical distinction: visibility gets attention, value creation gets paid, 3) The Creator Trap — why "build an audience first" leaves most people with followers but no customers, 4) The Two Lanes — Lane 1 is demand capture (SEO, search, people already looking for what you sell), Lane 2 is demand creation (content, social, education), and why mixing them up kills conversion, 5) Why authentic messaging converts slower but deeper — and why that's actually the better strategy for a sustainable business, 6) The Marketing Gap — the piece most business owners are missing that sits between content and sales. Help the student identify which lane they're currently stuck in and what the next move is.`
  },
  {
    id: "lead-generation",
    title: "07 — Faceless Lead Generation",
    lesson: "The Invisible Funnel",
    context: `The student just completed Module 07 of The Successful Woman's System. They learned how to build lead generation that runs without their daily presence — no camera required, no posting every day. The 6-module section covered: 1) The Invisible Funnel — the architecture of a lead generation system that works in the background: traffic source → landing page → email capture → nurture → offer, 2) Content That Attracts Without You — evergreen content formats (especially Pinterest and YouTube) that continue surfacing for months after you create them, 3) The Lead Magnet Architecture — what makes someone actually opt in: specificity of the promise, immediate value, low commitment, 4) The Nurture Sequence — the 5-7 email sequence that builds trust automatically after someone opts in, 5) Paid Traffic on £5/Day — how to use Pinterest or Meta ads to feed the top of the funnel without a big budget, 6) The System, Not the Hustle — how to design the whole funnel as a system that improves over time. The student should now understand the structure of an invisible funnel. Help them build one for their specific offer or identify where their current funnel is leaking.`
  },
  {
    id: "90-day-plan",
    title: "08 — The 90-Day Action Plan",
    lesson: "From Invisible to Inevitable",
    context: `The student just completed Module 08 of The Successful Woman's System. They have a full 90-day roadmap and the tools to get their first 10 customers. The 3 lessons + PDF roadmap covered: 1) The Visibility Map — a structured exercise to identify exactly who their first 10 customers are, where they already spend time, and how to get in front of them without a big audience, 2) The Conversation Bridge — the specific sequence for moving someone from awareness to trust to sale: the warm DM, the value-first touch, the offer conversation, 3) The Close Without Closing — how to make an offer that feels like a natural next step rather than a pitch: the language patterns, the objection responses, the follow-up sequence. The student also watched the free Invisible to Inevitable Masterclass. They should now have a clear picture of who their first 10 customers are and what to say to them. Help them practise the conversation bridge in a roleplay, refine their visibility map, or work through any resistance to reaching out.`
  },
  {
    id: "ethical-selling",
    title: "09 — Ethical Selling",
    lesson: "The CFO Pricing Framework",
    context: `The student just completed Module 09 of The Successful Woman's System. They learned how to sell from alignment rather than desperation — and how to price like someone who knows their value. The 7 modules + roleplay bonus covered: 1) Sales Psychology — why undercharging has nothing to do with confidence and everything to do with identity: the belief that the price needs to be justified before the value is understood, 2) Leading With Value — the sales conversation structure that lets the outcome sell itself, 3) Pricing Like a CFO — the three-part pricing framework: cost-based floor, market positioning, and value-based ceiling. How successful women pick a number and hold it., 4) The Introvert's Sales Conversation — a word-for-word structure for people who hate "selling": low pressure, high clarity, natural close, 5) Getting Out of Research Mode — recognising the pattern of using "I'm not ready" as avoidance rather than preparation, 6) The Investment Gap — the specific reframe for price objections that shifts the conversation from "is this affordable" to "what does staying stuck cost", 7) Running Ads Without Losing Your Soul — ethical paid promotion. They also have the Why Roleplays Matter bonus module. Help them practise a sales conversation in roleplay, refine their pricing, or work through a specific objection they keep getting.`
  },
  {
    id: "agentic-ai",
    title: "10 — Agentic AI",
    lesson: "Your Digital Workforce",
    context: `The student just completed Module 10 of The Successful Woman's System. They learned the difference between AI assistants (you ask, they answer) and AI agents (you set a goal, they figure out how to achieve it). The 5-part module covered: 1) The AI Shift Nobody's Talking About — why 2026 is the year agentic AI becomes practical for solopreneurs: agents can now browse the web, write and run code, manage files, and deliver finished outputs, 2) Setting Up Their First Workflow — step-by-step: choosing the right task for automation (repetitive, pattern-based, same steps every time), building the workflow, testing with fake data first, 3) Their Complete Digital Workforce — the full AI stack for a solo business: content agent, research agent, admin agent, customer service agent. How to layer them together so the business runs with minimal human input, 4) The 30-Day Implementation Sprint — a structured plan to go from "I've set up one workflow" to "I have a functioning AI back-office" in 30 days. Help the student identify which tasks in their business are best candidates for automation, practise framing goals for their AI agents, or troubleshoot a workflow they've tried to build.`
  },
  {
    id: "faceless-course",
    title: "11 — Build Your Faceless Course Fast",
    lesson: "No Camera. No Team. No Problem.",
    context: `The student just completed Module 11 of The Successful Woman's System — the final module. They learned how to build and launch their own AI-avatar-delivered course without appearing on camera. The 5-part module + resources covered: 1) The AI Avatar Education Market — why avatar-delivered courses are gaining traction, how students are responding, and why being early gives you a positioning advantage, 2) Build Your Faceless Course Fast — the course architecture framework: how to structure a course that gets results, which platforms support AI avatar delivery, how to record and produce, 3) The 48-Hour Course Launch — applied specifically to course creation: how to go from curriculum outline to live course in one weekend, 4) Publish and Price — the three pricing decisions most course creators get wrong, and how to price a course before you have reviews or an audience, 5) 100+ Prompt Templates — a complete library of prompts for every stage of course creation: scripting, marketing, sales pages, email sequences, student communications. They also have the six-module course outline template, Pinterest ad creative brief, and 48-hour launch checklist. Help them apply any of this to their own course idea, practise their course positioning, or work through the pricing decision.`
  }
];

const PRACTICE_MODES = [
  { id: "apply", label: "Apply this lesson", icon: "🎯", prompt: "Help me apply what I just learned to my specific business. Ask me about my situation first." },
  { id: "review", label: "Review my work", icon: "📝", prompt: "I've done some work based on this lesson. Let me share it and get your honest feedback." },
  { id: "roleplay", label: "Roleplay a scenario", icon: "🎭", prompt: "Let's roleplay a real business scenario where I need to use what I just learned." },
  { id: "challenge", label: "Challenge my thinking", icon: "⚡", prompt: "Challenge my assumptions about this topic. Push me to think harder about what I actually believe." }
];

const SYSTEM_PROMPT = (module, mode) => `You are Muse, the AI practice coach for The Successful Woman's System by The Monifa Method. You help women apply what they've just learned to THEIR specific business situation.

CRITICAL RULE — BUSINESS TYPE:
The student can run ANY type of business. A cleaning company. A bakery. A consultancy. A therapy practice. A dog grooming service. A digital product business. An accounting firm. A flower shop. A construction company. NEVER assume they run a digital or online business. NEVER redirect them because their business type doesn't match your expectation. The frameworks you teach are universal — help them apply the lesson to WHATEVER business they describe. If they say "I run a cleaning company" your job is to help a cleaning company owner use AI and automation. That is on-topic. Always.

VOICE:
- Direct, warm, slightly cheeky. Like a switched-on big sister who happens to be really good at this.
- Short sentences. Break the rhythm. One word. Three words. Then a longer one to breathe.
- Never use "leverage," "paradigm," "unleash," or "revolutionary." Use plain words: system, pattern, boring work, clicks, done.
- Never say "you need to" or "you must." Say "here's what changes when..."
- Name the frustration first. Then give the fix.
- If the student seems stuck, don't lecture — ask one sharp question that unlocks their thinking.

LESSON CONTEXT:
${module.context}

PRACTICE MODE: ${mode.prompt}

RULES:
- Ask about their specific business before giving advice. Never give generic guidance.
- Keep responses under 150 words. Punchy. No essays.
- If they share work, be honest. Kind but honest. Don't praise mediocre work — improve it.
- End each response with either a question or a specific next step. Never end with "Let me know if you need anything else."
- Adapt every example, every framework, and every suggestion to THEIR business type. A prompt engineering lesson for a florist should reference flower arrangements and seasonal campaigns, not landing pages and email funnels.
- Never mention that you're an AI. You're Muse. You're their practice coach. That's it.
- Use British English spelling (colour, organisation, analyse).`;

export default function AskMuse() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("modules");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (view === "chat") inputRef.current?.focus();
  }, [view]);

  const startSession = async (mode) => {
    setSelectedMode(mode);
    setView("chat");
    setIsLoading(true);

    const systemPrompt = SYSTEM_PROMPT(selectedModule, mode);
    const openingMessage = {
      role: "user",
      content: `I just finished the lesson "${selectedModule.lesson}" in the ${selectedModule.title} module. I want to: ${mode.prompt}`
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          system: systemPrompt,
          messages: [openingMessage]
        })
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === "text")?.text || "Let's get started. Tell me about your business.";
      setMessages([
        { role: "user", content: openingMessage.content, hidden: true },
        { role: "assistant", content: text }
      ]);
    } catch {
      setMessages([{ role: "assistant", content: "Let's get started. Tell me about your business — what do you do, who do you serve, and what's the thing that's taking up most of your time right now?" }]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const apiMessages = newMessages
      .filter(m => !m.hidden || m.role === "user")
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          system: SYSTEM_PROMPT(selectedModule, selectedMode),
          messages: apiMessages
        })
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === "text")?.text || "Tell me more about that.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong on my end. Try sending that again." }]);
    }
    setIsLoading(false);
  };

  const reset = () => {
    setSelectedModule(null);
    setSelectedMode(null);
    setMessages([]);
    setInput("");
    setView("modules");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1a2e 0%, #1B2A4A 40%, #162340 100%)",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: "#E8ECF1",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid rgba(2,128,144,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "linear-gradient(135deg, #028090, #026d7a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: "700", color: "#fff"
          }}>M</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff", letterSpacing: "0.02em" }}>
              Practice with Muse
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              The Monifa Method Academy
            </div>
          </div>
        </div>
        {view !== "modules" && (
          <button onClick={reset} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)", padding: "6px 14px", borderRadius: "6px",
            fontSize: "12px", cursor: "pointer", transition: "all 0.2s"
          }}
          onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.08)"}
          >← Back to modules</button>
        )}
      </div>

      {/* Module Selection */}
      {view === "modules" && (
        <div style={{ flex: 1, padding: "40px 24px", maxWidth: "640px", margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", margin: "0 0 8px", lineHeight: "1.3" }}>
              What did you just learn?
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Pick your lesson. Then practise it with Muse.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MODULES.map(mod => (
              <button key={mod.id} onClick={() => { setSelectedModule(mod); setView("modes"); }}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", padding: "18px 20px", textAlign: "left", cursor: "pointer",
                  transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "4px"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(2,128,144,0.12)"; e.currentTarget.style.borderColor = "rgba(2,128,144,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <span style={{ fontSize: "11px", color: "#028090", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {mod.title}
                </span>
                <span style={{ fontSize: "15px", color: "#fff", fontWeight: "500" }}>
                  {mod.lesson}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode Selection */}
      {view === "modes" && selectedModule && (
        <div style={{ flex: 1, padding: "40px 24px", maxWidth: "640px", margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "11px", color: "#028090", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {selectedModule.title}
            </span>
          </div>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: "0 0 8px" }}>
              {selectedModule.lesson}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              How do you want to practise?
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {PRACTICE_MODES.map(mode => (
              <button key={mode.id} onClick={() => startSession(mode)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", padding: "20px 16px", textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <span style={{ fontSize: "24px" }}>{mode.icon}</span>
                <span style={{ fontSize: "13px", color: "#fff", fontWeight: "500" }}>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      {view === "chat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "720px", margin: "0 auto", width: "100%" }}>
          {/* Chat context bar */}
          <div style={{
            padding: "12px 24px", background: "rgba(2,128,144,0.08)",
            borderBottom: "1px solid rgba(2,128,144,0.15)",
            display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"
          }}>
            <span style={{ fontSize: "11px", color: "#028090", fontWeight: "600" }}>{selectedModule?.title}</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{selectedModule?.lesson}</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize: "11px", color: "#C9A84C" }}>{selectedMode?.icon} {selectedMode?.label}</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.filter(m => !m.hidden).map((msg, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth: "85%", padding: "14px 18px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #028090, #026d7a)"
                    : "rgba(255,255,255,0.06)",
                  border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  fontSize: "14px", lineHeight: "1.65", color: msg.role === "user" ? "#fff" : "#d4dae3",
                  whiteSpace: "pre-wrap"
                }}>
                  {msg.role === "assistant" && (
                    <div style={{ fontSize: "10px", color: "#C9A84C", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Muse
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "14px 18px", borderRadius: "14px 14px 14px 4px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ fontSize: "10px", color: "#C9A84C", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                    Muse
                  </div>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: "6px", height: "6px", borderRadius: "50%", background: "#028090",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Tell Muse about your business..."
                rows={1}
                style={{
                  flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                  color: "#fff", fontSize: "14px", fontFamily: "inherit", resize: "none",
                  outline: "none", lineHeight: "1.5", transition: "border-color 0.2s",
                  minHeight: "44px", maxHeight: "120px"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(2,128,144,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  padding: "12px 20px", background: input.trim() && !isLoading
                    ? "linear-gradient(135deg, #C9A84C, #b8963f)"
                    : "rgba(255,255,255,0.06)",
                  border: "none", borderRadius: "10px", color: input.trim() && !isLoading ? "#1B2A4A" : "rgba(255,255,255,0.3)",
                  fontSize: "14px", fontWeight: "600", cursor: input.trim() && !isLoading ? "pointer" : "default",
                  transition: "all 0.2s", whiteSpace: "nowrap"
                }}
              >
                Send →
              </button>
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "10px" }}>
              Muse is your practice coach — not a replacement for doing the work.
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        textarea::placeholder { color: rgba(255,255,255,0.3); }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
