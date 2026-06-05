import { useState, useRef, useEffect } from "react";

const MODULE = {
  id: "prompt-engineering",
  title: "AI Prompt Engineering",
  lesson: "Why Your AI Gives Generic Answers (And How to Fix It)",
  context: `The visitor is trying a free practice session. They haven't taken the course yet. Treat them as a smart non-technical business owner who uses ChatGPT but gets frustrated by generic outputs. Don't teach the full framework — give them enough insight to see the value, then help them apply ONE technique to their specific business. The technique to focus on: Context Framing — telling AI who it is and who the output is for. That single change transforms generic outputs into business-ready ones. Show them this works by having them try it live in the conversation.`
};

const SYSTEM_PROMPT = `You are Muse, the practice coach at The Monifa Method Academy. This is a FREE TASTER session — the visitor hasn't purchased anything yet. Your job is to give them a genuine "aha" moment in 5 messages or fewer.

WHO YOU'RE TALKING TO:
A non-technical business owner. Could be ANY type of business — a cleaning company, a bakery, a therapist, a florist, a dog groomer, a consultant, a freelancer, a digital product creator, an accountant, a personal trainer, a construction firm. NEVER assume they run an online or digital business. They use ChatGPT but get frustrated by generic outputs. They don't code. They don't want to. They just want AI to actually help them run their business.

CRITICAL — BUSINESS TYPE RULE:
Whatever business they describe, THAT is the business you coach. If they say "cleaning company" you help a cleaning company owner improve their prompts. If they say "flower shop" you help a flower shop owner. You adapt every example to THEIR world. A prompt about "marketing" for a cleaner means local leaflets and Google reviews, not landing pages and email funnels. Match their reality, not yours.

VOICE:
- Direct, warm, slightly cheeky. Like a switched-on big sister who happens to be really good at this.
- Short sentences. Break the rhythm.
- Never use "leverage," "paradigm," "unleash." Use plain words: system, pattern, boring work, done.
- Name the frustration first. Then give the fix.

THE ONE TECHNIQUE TO TEACH:
Context Framing — the single most impactful prompt improvement. Before asking AI anything, tell it: who it is (role), who the output is for (audience), and what format you need (structure). That's it. Three lines before any request. This works for EVERY business type.

SESSION FLOW:
Message 1: Ask what their business is and what they've tried using AI for. Be warm. Be curious. Accept whatever business type they give you.
Message 2: Based on their answer, show them a "before" prompt (what they probably typed) vs an "after" prompt (with context framing). Make the contrast stark and specific to THEIR business — use their industry language, their customers, their actual tasks.
Message 3: Have them try it. "Go paste this into ChatGPT right now and tell me what you get back."
Message 4: React to what they share. Refine the prompt further. Give them a second technique hint.
Message 5: Land the value. "That's one technique. There are four more in the full framework. Plus practice sessions like this for every module."

RULES:
- Keep responses under 120 words. Punchy.
- Always ask about THEIR business first. Never give generic advice.
- Make them feel smart, not behind. They're not beginners at life — they're beginners at this specific thing.
- Be genuinely helpful. This isn't a bait-and-switch. Give real value. The upsell earns itself.
- Use British English spelling.
- Never mention that you're an AI. You're Muse. Their practice coach.`;

const MAX_MESSAGES = 5;

export default function AskMuseTaster() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [emailError, setEmailError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (hasAccess && !sessionEnded) inputRef.current?.focus();
  }, [hasAccess, messages]);

  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) { setEmailError("That doesn't look quite right. Check the email address."); return; }
    setEmailError("");
    setHasAccess(true);
    setIsLoading(true);

    // Send email to Kit
    try {
      fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name.trim() })
      });
    } catch (e) { /* Don't block the session if Kit fails */ }

    const firstName = name.trim().split(" ")[0] || "there";
    const openingMsg = { role: "user", content: `Hi, my name is ${firstName}. I'd like to try a practice session on AI prompting.` };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [openingMsg]
        })
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === "text")?.text || `Hey ${firstName}. Let's make your AI actually useful. What's your business — what do you do and who do you do it for?`;
      setMessages([
        { role: "user", content: openingMsg.content, hidden: true },
        { role: "assistant", content: text }
      ]);
    } catch {
      setMessages([{ role: "assistant", content: `Hey ${firstName}. Good — you're here. Let's make this count. What's your business? And what have you tried using AI for so far?` }]);
    }
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || sessionEnded) return;

    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (newCount >= MAX_MESSAGES) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `That's our taster session done.\n\nIn five messages you've improved your prompting more than most people do in months. And that was one technique — context framing.\n\nThe full course has four more frameworks, plus practice sessions like this for every module. Workbeaver automation. Manus delegation. Distribution systems. All of it with me as your practice coach.\n\nThe full Academy starts at £14.99.\n\nNo pressure. No countdown timer. Just better AI outputs, starting Monday morning.`,
          isUpsell: true
        }]);
        setSessionEnded(true);
        setIsLoading(false);
      }, 1500);
      return;
    }

    const apiMessages = newMessages
      .filter(m => !m.hidden || m.role === "user")
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          system: SYSTEM_PROMPT + `\n\nThis is message ${newCount} of ${MAX_MESSAGES} from the user. ${newCount >= MAX_MESSAGES - 1 ? "This is their second-to-last message. Start hinting that the full course goes deeper." : ""}`,
          messages: apiMessages
        })
      });
      const data = await response.json();
      const text = data.content?.find(c => c.type === "text")?.text || "Tell me more about that.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Try sending that again." }]);
    }
    setIsLoading(false);
  };

  // ── Email Gate ──
  if (!hasAccess) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f1a2e 0%, #1B2A4A 40%, #162340 100%)",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px"
      }}>
        <div style={{ maxWidth: "460px", width: "100%", textAlign: "center" }}>
          {/* Logo */}
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "linear-gradient(135deg, #028090, #026d7a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: "700", color: "#fff",
            margin: "0 auto 28px", boxShadow: "0 4px 24px rgba(2,128,144,0.3)"
          }}>M</div>

          {/* Headline */}
          <h1 style={{
            fontSize: "28px", fontWeight: "700", color: "#fff",
            lineHeight: "1.25", margin: "0 0 12px",
            fontFamily: "'Georgia', serif"
          }}>
            Your AI gives you generic answers.<br />
            <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Let's fix that in 5 minutes.</span>
          </h1>

          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", margin: "0 0 32px", lineHeight: "1.65" }}>
            One free practice session with Muse. She'll show you the single prompt technique that turns generic AI outputs into business-ready results — using your actual business as the example.
          </p>

          {/* Social proof line */}
          <div style={{
            fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "24px", fontWeight: "500"
          }}>
            No tech background needed · Works with any AI tool · Takes 5 minutes
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your first name"
              style={{
                padding: "14px 18px", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px",
                color: "#fff", fontSize: "15px", fontFamily: "inherit", outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(2,128,144,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={e => { if (e.key === "Enter") handleEmailSubmit(); }}
              placeholder="Your email address"
              style={{
                padding: "14px 18px", background: "rgba(255,255,255,0.06)",
                border: `1px solid ${emailError ? "rgba(224,122,95,0.6)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "8px", color: "#fff", fontSize: "15px", fontFamily: "inherit",
                outline: "none", transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(2,128,144,0.4)"}
              onBlur={e => e.target.style.borderColor = emailError ? "rgba(224,122,95,0.6)" : "rgba(255,255,255,0.12)"}
            />
            {emailError && <div style={{ fontSize: "12px", color: "#E07A5F", textAlign: "left" }}>{emailError}</div>}

            <button
              onClick={handleEmailSubmit}
              style={{
                padding: "16px", background: "linear-gradient(135deg, #C9A84C, #b8963f)",
                border: "none", borderRadius: "8px", color: "#1B2A4A",
                fontSize: "15px", fontWeight: "600", cursor: "pointer",
                transition: "all 0.2s", letterSpacing: "0.02em"
              }}
              onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}
            >
              Start My Free Session with Muse →
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: "0" }}>
            No spam. No password. No account creation. Just one practice session.
          </p>
        </div>

        <style>{`input::placeholder { color: rgba(255,255,255,0.3); } * { box-sizing: border-box; } body { margin: 0; }`}</style>
      </div>
    );
  }

  // ── Chat Interface ──
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1a2e 0%, #1B2A4A 40%, #162340 100%)",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: "#E8ECF1",
      display: "flex", flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(2,128,144,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
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
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>Practice with Muse</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Free taster · AI Prompt Engineering
            </div>
          </div>
        </div>

        {/* Message counter */}
        {!sessionEnded && (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.06)", padding: "6px 14px",
            borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Messages left</span>
            <span style={{
              fontSize: "13px", fontWeight: "700",
              color: (MAX_MESSAGES - userMessageCount) <= 1 ? "#E07A5F" : "#C9A84C"
            }}>
              {Math.max(0, MAX_MESSAGES - userMessageCount)}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto", width: "100%" }}>
        {messages.filter(m => !m.hidden).map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%", padding: msg.isUpsell ? "20px 22px" : "14px 18px",
              borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: msg.isUpsell
                ? "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))"
                : msg.role === "user"
                  ? "linear-gradient(135deg, #028090, #026d7a)"
                  : "rgba(255,255,255,0.06)",
              border: msg.isUpsell
                ? "1px solid rgba(201,168,76,0.3)"
                : msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
              fontSize: "14px", lineHeight: "1.65",
              color: msg.role === "user" ? "#fff" : "#d4dae3",
              whiteSpace: "pre-wrap"
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  fontSize: "10px", color: msg.isUpsell ? "#C9A84C" : "#C9A84C",
                  fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px"
                }}>
                  Muse
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {/* Upsell CTA buttons */}
        {sessionEnded && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "8px 0 24px" }}>
            <a
              href="https://www.themonifamethod.com/courses"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block", padding: "14px 32px",
                background: "linear-gradient(135deg, #C9A84C, #b8963f)",
                color: "#1B2A4A", borderRadius: "8px", textDecoration: "none",
                fontSize: "14px", fontWeight: "600", transition: "all 0.2s",
                textAlign: "center"
              }}
            >
              Explore the Full Academy — from £14.99 →
            </a>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
              No pressure. No countdown timer. No fake urgency.
            </span>
          </div>
        )}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "14px 18px", borderRadius: "14px 14px 14px 4px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ fontSize: "10px", color: "#C9A84C", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Muse</div>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: "#028090",
                    animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!sessionEnded && (
        <div style={{
          padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.1)", maxWidth: "720px", margin: "0 auto", width: "100%"
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
                outline: "none", lineHeight: "1.5", minHeight: "44px", maxHeight: "120px",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(2,128,144,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                padding: "12px 20px",
                background: input.trim() && !isLoading ? "linear-gradient(135deg, #C9A84C, #b8963f)" : "rgba(255,255,255,0.06)",
                border: "none", borderRadius: "10px",
                color: input.trim() && !isLoading ? "#1B2A4A" : "rgba(255,255,255,0.3)",
                fontSize: "14px", fontWeight: "600",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}
            >
              Send →
            </button>
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: "10px" }}>
            Free taster session · {MAX_MESSAGES - userMessageCount} messages remaining
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
