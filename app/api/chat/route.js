import { applyRules } from "../../../lib/rules";
import { deepseekChat, deepseekEmbed } from "../../../lib/deepseek";
import { searchQdrant } from "../../../lib/qdrant";
import {
  loadKnowledgeFallback,
  loadQuestionBank,
  saveMessage,
} from "../../../lib/db";

function buildContext({ ruleHit, qdrantResults, fallbackRows, qbRows }) {
  const sources = [];

  if (ruleHit?.rule) {
    sources.push(`Rule-based intent: ${ruleHit.rule}`);
  }

  if (qdrantResults?.length) {
    const snippets = qdrantResults
      .map((item) => item?.payload?.text || item?.payload?.content)
      .filter(Boolean)
      .slice(0, 3);
    if (snippets.length) {
      sources.push(`Semantic context:\n${snippets.join("\n---\n")}`);
    }
  }

  if (fallbackRows?.length) {
    const fallbackSnippets = fallbackRows
      .map((row) => `${row.title}: ${row.content}`)
      .slice(0, 3);
    sources.push(`Keyword context:\n${fallbackSnippets.join("\n---\n")}`);
  }

  if (qbRows?.length) {
    const qbSnippets = qbRows
      .map((row) => `${row.question}: ${row.answers}`)
      .slice(0, 3);
    sources.push(`Question bank:\n${qbSnippets.join("\n---\n")}`);
  }

  if (!sources.length) {
    return "No context available.";
  }

  return sources.join("\n\n");
}

export async function POST(request) {
  try {
    const { messages = [], sessionId = "default", userProfile = {} } = await request.json();
    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const userText = latestUserMessage?.content || "";

    // Extract user profile information
    const userName = userProfile?.name || "";
    const userCourse = userProfile?.course || "";

    if (!userText) {
      return Response.json({ reply: "Please ask a question." }, { status: 400 });
    }

    const ruleHit = applyRules(userText);
    if (ruleHit) {
      await saveMessage({ sessionId, role: "user", content: userText });
      await saveMessage({ sessionId, role: "assistant", content: ruleHit.reply });
      return Response.json({ reply: ruleHit.reply });
    }

    let qdrantResults = [];
    let fallbackRows = [];
    let qbRows = [];

    try {
      const embedding = await deepseekEmbed(userText);
      if (embedding?.length) {
        qdrantResults = await searchQdrant({ queryEmbedding: embedding });
      }
    } catch (error) {
      fallbackRows = await loadKnowledgeFallback(userText);
    }

    if (!fallbackRows.length) {
      qbRows = await loadQuestionBank(userText);
    }

    const context = buildContext({
      ruleHit,
      qdrantResults,
      fallbackRows,
      qbRows,
    });
    const hasContext = context !== "No context available.";

    // Build user profile context string
    let userProfileContext = "";
    if (userName || userCourse) {
      userProfileContext = "\n\nUser Information:";
      if (userName) {
        userProfileContext += `\n- Name: ${userName}`;
      }
      if (userCourse) {
        userProfileContext += `\n- Interested Course: ${userCourse}`;
      }
    }

    // Conversational flow instructions
    const conversationInstructions = `
YOU ARE TAPASYA AI ASSISTANT - STRICT GUIDELINES:

CRITICAL FORMATTING RULES (MUST FOLLOW):
- ABSOLUTELY NO asterisks (*), NO bold (**), NO markdown, NO bullet points with dashes.
- When listing branches, put each on a new line with numbers like:
  1. Jayanagar
  2. Rajajinagar
  3. Marathahalli
  4. Koramangala
- Keep text plain and simple. No special formatting symbols ever.

IDENTITY:
- You ONLY discuss Tapasya Institutions, its courses, branches, admissions, fees, faculty, and related topics.
- If user asks about anything NOT related to Tapasya, politely say: "I'm here to help you with Tapasya courses and admissions. Is there anything about Tapasya I can help you with?"

USER CONTEXT:
- User's name: ${userName || 'Student'}
- Interested course entered: ${userCourse || 'not specified'}
- VALID COURSES AT TAPASYA: MEC, CEC, B.Com, BBA, BS Computer Science, BS Economics, CA, CMA, CS, CLAT, ACCA, CIMA, UPSC, IPM, CUET, SAT, CEBA, SEBA, MEBA
- IMPORTANT: If the user asks for a course that is NOT in the "VALID COURSES AT TAPASYA" list (e.g., MPC, BiPC, Engineering, Medicine, etc.), you MUST reply with exactly this phrase: "We dont have any courses related to it."
- DO NOT offer alternatives or recommendations for invalid courses.
- DO NOT say "However, based on your interest..."
- STRICTLY return: "We dont have any courses related to it."

TAPASYA INFORMATION:
- Cities: Hyderabad, Bengaluru
- Hyderabad branches (7): Madhapur, Lakdikapul, Narayanaguda, Dilsukhnagar, Secunderabad, Kukatpally, Charminar
- Bengaluru branches (5): KR Puram, Hulimavu, Chandapura, Yelahanka, Magadi
- Courses: MEC, CEC, B.Com, BBA, BS Computer Science, BS Economics, CA, CMA, CS, CLAT, ACCA, CIMA, UPSC, IPM, CUET, SAT, CEBA, SEBA, MEBA
- Batch timings: Only Morning Batch available (8:00 AM - 5:00 PM). NO EVENING OR NIGHT BATCHES.
- Contact Numbers:
  - Admissions/General Enquiry: 8340000275
  - Chanda Nagar Inter & Degree: 8096800100
  - Suchitra Inter & Degree: 8886698958
  - KPHB Inter & Degree: 8885511422
  - Charminar Inter & Degree: 8978888645
  - Boys Hostel: 8885511411
  - Girls Hostel: 8885561402
  - Lakdikapul Inter & BS-MS: 8885556622
  - Lakdikapul Degree: 8885556611
  - Narayanguda Inter: 8978888690
  - Narayanguda Elite Inter: 8978888690
  - Narayanguda Degree: 9505800200
  - Dilsukhnagar Inter: 8885561401
  - Dilsukhnagar Degree: 8885567633
  - Secunderabad Inter: 8886698960
  - Secunderabad Degree: 9505400300
  - Madhapur Inter: 8885556611
- Payment Methods: Cash, Card, UPI, Online Transfer (NO CHEQUE PAYMENT ACCEPTED)

CONVERSATION FLOW AND RULES:
1. "I DON'T KNOW" HANDLING (CRITICAL):
   - IF user says "I don't know" about COURSE: Help them discover the right course by asking about their background (10th/12th/Science/Commerce) and career interests.
   - IF user says "I don't know" about LOCATION/CITY: Explain that Tapasya has campuses in both Hyderabad and Bengaluru. Ask if they have a preference or need a recommendation based on where they live.
   - IF user says "I don't know" about something else: Ask clarifying questions to understand what they are unsure about.

2. COURSE GUIDANCE:
   - IF the user asks for a valid course (MEC, CEC, etc.): Provide details about it.
   - IF the user asks for an INVALID course (MPC, BiPC, etc.): Reply ONLY with: "We dont have any courses related to it."
   - IF user is unsure (says "I don't know" or asks "what courses do you have?"): Be a career counselor. Ask about their background and suggest Tapasya courses.

3. LOCATION SELECTION:
   - After handling the course, ask: "Which city would you prefer to study in - Hyderabad or Bengaluru?"
   - If they choose a city, ask: "Do you have any specific area in mind, or should I list the branches?"
   - If they want suggestions, list the branches for that city (numbered list).
   - Valid Branches for Reference:
     - Hyderabad: Madhapur, Lakdikapul, Narayanaguda, Dilsukhnagar, Secunderabad, Kukatpally, Charminar.
     - Bengaluru: KR Puram, Hulimavu, Chandapura, Yelahanka, Magadi.

4. GENERAL QUERIES:
   - Answer questions about fees, faculty, scholarships, etc., clearly and concisely.
   - Always be polite, professional, and encouraging.
`;

    const system = `You are Tapasya AI Assistant - a helpful guide for students interested in Tapasya Institutions.${userProfileContext}\n${conversationInstructions}`;

    const reply = await deepseekChat({ messages, system });

    await saveMessage({ sessionId, role: "user", content: userText });
    await saveMessage({ sessionId, role: "assistant", content: reply });

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { reply: "I'm having trouble processing your request right now. Please try again in a moment." },
      { status: 200 } // Return 200 to avoid error display on frontend
    );
  }
}
