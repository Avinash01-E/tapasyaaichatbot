"use client";

import { useState } from "react";

const initialMessages = [
  {
    role: "assistant",
    content:
      "Welcome to Tapasya Institutions, I am your AI assistant set for you by Tapasya. Before we begin, please provide this information.",
  },
];

export default function Widget({ embedded = false }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    course: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          userProfile: profile
        }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply ?? "No response." },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: embedded ? "100%" : 520,
        maxWidth: 480,
        background: "white",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
      }}
    >
      <header
        style={{
          padding: "16px 20px",
          background: "#0f172a",
          color: "white",
        }}
      >
        <strong>Tapasya AI Assistant</strong>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Hybrid AI Chatbot</div>
      </header>

      <div
        style={{
          flex: 1,
          padding: 16,
          overflowY: "auto",
          background: "#f8fafc",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            style={{
              display: "flex",
              justifyContent:
                message.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: 14,
                background:
                  message.role === "user" ? "#1d4ed8" : "#ffffff",
                color: message.role === "user" ? "#ffffff" : "#0f172a",
                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        {!profileSaved && (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (!profile.name || !profile.mobile || !profile.course) return;
              try {
                const response = await fetch("/api/enquiry", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: profile.name,
                    mob: profile.mobile,
                    interestedCourse: profile.course,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to submit enquiry");
                }
                setProfileSaved(true);
                // Check if the course is a valid Tapasya course
                const validCourses = ['mec', 'cec', 'b.com', 'bcom', 'bba', 'bs computer science', 'bs economics', 'ca', 'cma', 'cs', 'clat', 'acca', 'cima', 'upsc', 'ipm', 'cuet', 'sat', 'ceba', 'seba', 'meba'];
                const enteredCourse = profile.course.toLowerCase().trim();
                const isValidCourse = validCourses.some(course => enteredCourse.includes(course) || course.includes(enteredCourse));

                // Trigger automatic greeting with appropriate message based on course validity
                if (isValidCourse) {
                  setMessages((current) => [
                    ...current,
                    {
                      role: "assistant",
                      content: `Hello ${profile.name}! 👋 Great choice with ${profile.course}! We have excellent faculty and resources for this course.`,
                    },
                    {
                      role: "assistant",
                      content: "Which city would you prefer to study in - Hyderabad or Bengaluru?",
                    },
                  ]);
                } else {
                  setMessages((current) => [
                    ...current,
                    {
                      role: "assistant",
                      content: `Hello ${profile.name}! 👋 No worries if you're unsure about which course to take. I'm here to help you find the perfect fit!`,
                    },
                    {
                      role: "assistant",
                      content: "To suggest the best course for you, could you tell me - are you from a Commerce or Science background? And what are your career interests?",
                    },
                  ]);
                }
              } catch (error) {
                setMessages((current) => [
                  ...current,
                  {
                    role: "assistant",
                    content:
                      "Sorry, I couldn't submit your details. Please try again.",
                  },
                ]);
              }
            }}
            style={{
              background: "#ffffff",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              marginTop: 8,
            }}
          >
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>
              Please share your details
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                value={profile.name}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Full Name"
                style={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              />
              <input
                value={profile.mobile}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    mobile: event.target.value,
                  }))
                }
                placeholder="Mobile Number"
                style={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              />
              <input
                value={profile.course}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    course: event.target.value,
                  }))
                }
                placeholder="Interested Course"
                style={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                marginTop: 10,
                borderRadius: 10,
                border: "none",
                background: "#0f172a",
                color: "white",
                padding: "8px 12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </form>
        )}
        {loading && (
          <div style={{ fontSize: 12, color: "#64748b" }}>Thinking...</div>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        style={{ display: "flex", gap: 8, padding: 12, background: "#fff" }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Tapasya..."
          disabled={!profileSaved}
          style={{
            flex: 1,
            borderRadius: 999,
            border: "1px solid #e2e8f0",
            padding: "10px 14px",
            fontSize: 14,
            background: profileSaved ? "#ffffff" : "#f1f5f9",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            borderRadius: 999,
            border: "none",
            background: "#1d4ed8",
            color: "white",
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
