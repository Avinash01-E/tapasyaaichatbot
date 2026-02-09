const ENQUIRY_URL =
  process.env.ENQUIRY_URL ||
  "http://tapasyauat.edusoftsolution.com/enquiryBot/api/chatBotEnquiry";

export async function POST(request) {
  const body = await request.json();
  const { name, mob, interestedCourse } = body || {};

  if (!name || !mob || !interestedCourse) {
    return Response.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const response = await fetch(ENQUIRY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: process.env.ENQUIRY_AUTH_KEY || "New_Tapasya_App_GVTGRP0013",
    },
    body: JSON.stringify({ name, mob, interestedCourse }),
  });

  if (!response.ok) {
    const text = await response.text();
    return Response.json(
      { error: "Upstream error", details: text },
      { status: 502 }
    );
  }

  const data = await response.json().catch(() => ({}));
  return Response.json({ ok: true, data });
}
