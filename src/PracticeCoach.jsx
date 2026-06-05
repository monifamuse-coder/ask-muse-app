import { useState, useRef, useEffect } from "react";

const MODULES = [
  {
    id: "prompt-engineering",
    title: "AI Prompt Engineering",
    lesson: "The Prompt Framework That Changes Everything",
    context: `The student just completed a lesson on structured prompt engineering. They learned that generic AI outputs aren't the AI's fault — they're a prompt structure problem. The lesson covered: 1) Context framing (telling AI who it is and who the output is for), 2) Specificity layers (format, length, tone, audience), 3) The "show don't tell" method (providing examples of good output), 4) Iteration loops (refining outputs by feeding back what's missing). They should now be able to write prompts that produce business-ready outputs instead of generic filler.`
  },
  {
    id: "workbeaver",
    title: "Agentic AI — Workbeaver",
    lesson: "Your Watch-and-Learn Assistant",
    context: `The student just completed a lesson on Workbeaver — a screen-based AI agent that watches you perform a task once, maps every click and keystroke, then repeats that task automatically on a schedule. No coding, no APIs. The lesson covered: 1) What tasks are automatable (repetitive, pattern-based, same steps every time), 2) How to prepare your screen for a clean recording, 3) The three-pass testing method (fake data first, then supervised real data, then autonomous), 4) The kill switch — every automation needs an off button. They should now understand which of their daily tasks could be automated with Workbeaver.`
  },
  {
    id: "manus",
    title: "Agentic AI — Manus",
    lesson: "The Goal-Oriented Agent",
    context: `The student just completed a lesson on Manus — a multi-agent AI that achieves goals rather than following steps. Unlike Workbeaver (which copies your actions), Manus takes an objective and figures out how to achieve it: it opens a virtual computer, browses the web, analyses data, writes code, and delivers finished reports. The lesson covered: 1) Goal-based vs step-based AI (the fundamental difference), 2) How to frame objectives clearly for Manus, 3) Use cases: market research, competitor analysis, content repurposing, report generation, 4) Limitations: Manus works best with research and analysis tasks, not with tasks requiring your personal accounts or logins. They should now be able to identify 3-5 business objectives they could delegate to Manus.`
  },
  {
    id: "distribution",
    title: "Distribution Engine",
    lesson: "Why Nobody Is Buying (It's Not Your Product)",
    context: `The student just completed a lesson on the distribution gap — the structural reason most businesses struggle to get customers even when their product or service is good. The lesson taught: 1) Marketing and distribution are completely different skills — most business owners do marketing but not distribution, 2) Organic social media reach is 5-10% — posting more doesn't fix distribution, 3) The three distribution channels that actually work for any business: email (highest conversion), search/SEO (highest intent), paid ads (fastest data), 4) The difference between "getting attention" and "building distribution" — attention is rented, distribution is owned. These principles apply to ANY business: a cleaning company needs distribution just as much as an online store. A therapist needs people to find them. A bakery needs repeat customers. The channel mix changes but the principle is the same.`
  },
  {
    id: "cfo-mindset",
    title: "The CFO Mindset",
    lesson: "Business Is a System, Not a Feeling",
    context: `The student just completed a lesson on financial thinking for solopreneurs. The lesson covered: 1) Revenue vs profit vs margin — and why most solopreneurs only track revenue, 2) Cash flow vs profit — why profitable businesses still fail, 3) The employee operating system vs the CEO operating system (employees are rewarded for preparation; CEOs are rewarded for decisions), 4) How to make financial decisions without fear using the "CFO filter" — a three-question framework. They should now understand the basic financial metrics their business needs to track and be able to calculate their actual profit margin.`
  }
];

const PRACTICE_MODES = [
  { id: "apply", label: "Apply this lesson", icon: "🎯", prompt: "Help me apply what I just learned to my specific business. Ask me about my situation first." },
  { id: "review", label: "Review my work", icon: "📝", prompt: "I've done some work based on this lesson. Let me share it and get your honest feedback." },
  { id: "roleplay", label: "Roleplay a scenario", icon: "🎭", prompt: "Let's roleplay a real business scenario where I need to use what I just learned." },
  { id: "challenge", label: "Challenge my thinking", icon: "⚡", prompt: "Challenge my assumptions about this topic. Push me to think harder about what I actually believe." }
];

const SYSTEM_PROMPT = (module, mode) => `You are Muse, the practice coach at The Monifa Method Academy. You help non-technical business owners apply what they've just learned to THEIR specific business.

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
