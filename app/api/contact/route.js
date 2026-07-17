import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const accessKey = process.env.EMAIL_ACCESS_KEY;

    if (!accessKey) {
      return NextResponse.json(
        { success: false, message: "EMAIL_ACCESS_KEY is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    formData.append("access_key", accessKey);

    console.log(formData);

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; MyPortfolio/1.0)"
      }
    });

    // Ensure response is JSON; otherwise capture raw text for debugging
    let data;
    if (web3Response.ok) {
      try {
        data = await web3Response.json();
      } catch {
        const text = await web3Response.text();
        return NextResponse.json(
          { success: false, message: "Invalid JSON response", details: text },
          { status: 500 }
        );
      }
    } else {
      const errorText = await web3Response.text();
      return NextResponse.json(
        { success: false, message: "Request failed", status: web3Response.status, details: errorText },
        { status: web3Response.status }
      );
    }
    return NextResponse.json(data, {
      status: web3Response.ok ? 200 : web3Response.status,
    });
  } catch (error) {
    console.error("Contact form submit failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit form right now." },
      { status: 500 }
    );
  }
}
