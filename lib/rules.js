const RULES = [
  {
    name: "greeting",
    test: (text) => /\b(hi|hello|hey|good morning|good evening)\b/i.test(text),
    reply: "Hello! I'm Tapasya AI Assistant. How can I help you today?",
  },
  {
    name: "pricing",
    test: (text) => /\bprice|cost|pricing\b/i.test(text),
    reply:
      "I can share pricing details once you tell me which plan or service you’re asking about.",
  },
  {
    name: "handoff",
    test: (text) => /\b(human|agent|support)\b/i.test(text),
    reply:
      "I can connect you with a human agent. Please share your email and a brief summary.",
  },
];

export function applyRules(text) {
  const match = RULES.find((rule) => rule.test(text));
  return match ? { reply: match.reply, rule: match.name } : null;
}
