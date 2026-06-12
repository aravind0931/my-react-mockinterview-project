import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    id: 1,
    category: "Behavioral",
    question: "Tell me about yourself and your background.",
    tips: ["Keep it under 2 minutes", "Highlight relevant experience", "End with why you're interested in this role"],
    timeLimit: 120,
  },
  {
    id: 2,
    category: "Technical",
    question: "Explain the difference between var, let, and const in JavaScript.",
    tips: ["Mention scope differences", "Talk about hoisting", "Give a practical example"],
    timeLimit: 90,
  },
  {
    id: 3,
    category: "Behavioral",
    question: "Describe a challenging project and how you overcame it.",
    tips: ["Use the STAR method", "Be specific with the challenge", "Quantify the outcome if possible"],
    timeLimit: 150,
  },
  {
    id: 4,
    category: "Technical",
    question: "What is the difference between REST and GraphQL APIs?",
    tips: ["Compare data fetching approaches", "Mention over/under-fetching", "Give use cases for each"],
    timeLimit: 90,
  },
  {
    id: 5,
    category: "HR",
    question: "Where do you see yourself in 5 years?",
    tips: ["Align with the company's goals", "Show ambition but be realistic", "Demonstrate commitment to growth"],
    timeLimit: 60,
  },
];

const categoryColors = {
  Behavioral: { bg: "#EEF2FF", text: "#4338CA", dot: "#6366F1" },
  Technical: { bg: "#ECFDF5", text: "#065F46", dot: "#10B981" },
  HR: { bg: "#FFF7ED", text: "#9A3412", dot: "#F97316" },
};

function Timer({ seconds, isRunning, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning) return;
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, remaining, onExpire]);

  const pct = (remaining / seconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const color = pct > 50 ? "#10B981" : pct > 20 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20" fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${(pct / 100) * 125.6} 125.6`}
            style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.5s ease" }}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color,
        }}>
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function MockInterview() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | answering | review | done
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const textareaRef = useRef(null);

  const question = QUESTIONS[currentIdx];
  const isLast = currentIdx === QUESTIONS.length - 1;

  const startAnswer = () => {
    setPhase("answering");
    setTimerRunning(true);
    setAnswer("");
    setFeedback(null);
    setShowTips(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const submitAnswer = async () => {
    setTimerRunning(false);
    setPhase("review");
    setLoadingFeedback(true);

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a professional interview coach. Evaluate this interview answer.

Question: "${question.question}"
Category: ${question.category}
Candidate's Answer: "${answer || "(No answer given)"}"

Respond ONLY in JSON with this exact structure (no markdown, no backticks):
{
  "score": <number 1-10>,
  "summary": "<2 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "sampleAnswer": "<2-3 sentence strong model answer>"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      setFeedback(JSON.parse(clean));
    } catch {
      setFeedback({
        score: 0,
        summary: "Could not load feedback. Please try again.",
        strengths: [],
        improvements: [],
        sampleAnswer: "",
      });
    }
    setLoadingFeedback(false);
  };

  const nextQuestion = () => {
    setAnswers(prev => [...prev, { question: question.question, answer, feedback }]);
    if (isLast) {
      setPhase("done");
    } else {
      setCurrentIdx(i => i + 1);
      setPhase("ready");
      setFeedback(null);
      setAnswer("");
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setPhase("ready");
    setAnswer("");
    setFeedback(null);
    setAnswers([]);
    setShowTips(false);
  };

  const cat = categoryColors[question?.category] || {};
  const avgScore = answers.filter(a => a.feedback?.score).reduce((s, a, _, arr) => s + a.feedback.score / arr.length, 0);

  if (phase === "done") {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 560, width: "100%", background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>Interview Complete!</h2>
          <p style={{ color: "#64748B", marginBottom: 32 }}>You answered all {QUESTIONS.length} questions</p>
          <div style={{ background: "#F1F5F9", borderRadius: 16, padding: "20px 32px", marginBottom: 32 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: avgScore >= 7 ? "#10B981" : avgScore >= 5 ? "#F59E0B" : "#EF4444" }}>
              {avgScore.toFixed(1)}<span style={{ fontSize: 24, color: "#94A3B8" }}>/10</span>
            </div>
            <div style={{ color: "#64748B", fontWeight: 600, marginTop: 4 }}>Average Score</div>
          </div>
          <div style={{ textAlign: "left", marginBottom: 32 }}>
            {answers.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ color: "#475569", fontSize: 14, flex: 1, marginRight: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Q{i + 1}: {QUESTIONS[i].question}
                </span>
                <span style={{ fontWeight: 800, color: a.feedback?.score >= 7 ? "#10B981" : a.feedback?.score >= 5 ? "#F59E0B" : "#EF4444", minWidth: 40, textAlign: "right" }}>
                  {a.feedback?.score ?? "–"}/10
                </span>
              </div>
            ))}
          </div>
          <button onClick={restart} style={{ width: "100%", padding: "14px 24px", background: "#6366F1", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#F8FAFC", padding: "24px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0F172A" }}>Mock Interview</h1>
            <p style={{ margin: 0, color: "#94A3B8", fontSize: 14 }}>Question {currentIdx + 1} of {QUESTIONS.length}</p>
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: 28, height: 6, borderRadius: 4,
                background: i < currentIdx ? "#6366F1" : i === currentIdx ? "#A5B4FC" : "#E2E8F0"
              }} />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ background: cat.bg, color: cat.text, fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.dot, display: "inline-block" }} />
              {question.category}
            </span>
            {(phase === "answering" || phase === "review") && (
              <Timer key={`${currentIdx}-${phase}`} seconds={question.timeLimit} isRunning={timerRunning} onExpire={() => setTimerRunning(false)} />
            )}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 20px", lineHeight: 1.4 }}>
            {question.question}
          </h2>

          {/* Tips toggle */}
          <button
            onClick={() => setShowTips(t => !t)}
            style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#64748B", cursor: "pointer", marginBottom: showTips ? 12 : 0 }}
          >
            {showTips ? "Hide tips ↑" : "Show tips ↓"}
          </button>
          {showTips && (
            <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
              {question.tips.map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, color: "#475569", fontSize: 14 }}>
                  <span style={{ color: "#6366F1", fontWeight: 700, marginTop: 1 }}>→</span> {tip}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action area */}
        {phase === "ready" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ color: "#94A3B8", marginBottom: 20 }}>You'll have {Math.floor(question.timeLimit / 60)}:{(question.timeLimit % 60).toString().padStart(2, "0")} to answer</p>
            <button onClick={startAnswer} style={{ padding: "14px 40px", background: "#6366F1", color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}>
              Start Answering →
            </button>
          </div>
        )}

        {phase === "answering" && (
          <div>
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              style={{ width: "100%", minHeight: 160, borderRadius: 14, border: "2px solid #E2E8F0", padding: 16, fontSize: 15, color: "#0F172A", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = "#6366F1"; }}
              onBlur={e => { e.target.style.borderColor = "#E2E8F0"; }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button onClick={submitAnswer} style={{ padding: "12px 32px", background: "#0F172A", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {phase === "review" && (
          <div>
            {/* Answer recap */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>Your Answer</p>
              <p style={{ margin: 0, color: "#334155", fontSize: 15, lineHeight: 1.6 }}>{answer || <em style={{ color: "#94A3B8" }}>No answer given</em>}</p>
            </div>

            {/* Feedback */}
            {loadingFeedback ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
                <div style={{ fontSize: 32, marginBottom: 12, animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
                <p>Getting AI feedback...</p>
              </div>
            ) : feedback && (
              <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: feedback.score >= 7 ? "#10B981" : feedback.score >= 5 ? "#F59E0B" : "#EF4444" }}>
                    {feedback.score}<span style={{ fontSize: 20, color: "#CBD5E1" }}>/10</span>
                  </div>
                  <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: 1.5, flex: 1 }}>{feedback.summary}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#ECFDF5", borderRadius: 12, padding: 16 }}>
                    <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#065F46", fontSize: 13 }}>✓ Strengths</p>
                    {feedback.strengths?.map((s, i) => <p key={i} style={{ margin: "4px 0", color: "#065F46", fontSize: 14 }}>{s}</p>)}
                  </div>
                  <div style={{ background: "#FFF7ED", borderRadius: 12, padding: 16 }}>
                    <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#9A3412", fontSize: 13 }}>↑ Improve</p>
                    {feedback.improvements?.map((s, i) => <p key={i} style={{ margin: "4px 0", color: "#9A3412", fontSize: 14 }}>{s}</p>)}
                  </div>
                </div>

                {feedback.sampleAnswer && (
                  <div style={{ background: "#EEF2FF", borderRadius: 12, padding: 16 }}>
                    <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#4338CA", fontSize: 13 }}>★ Sample Strong Answer</p>
                    <p style={{ margin: 0, color: "#3730A3", fontSize: 14, lineHeight: 1.6 }}>{feedback.sampleAnswer}</p>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={nextQuestion} disabled={loadingFeedback} style={{ padding: "13px 32px", background: loadingFeedback ? "#E2E8F0" : "#6366F1", color: loadingFeedback ? "#94A3B8" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loadingFeedback ? "not-allowed" : "pointer" }}>
                {isLast ? "Finish Interview" : "Next Question →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
