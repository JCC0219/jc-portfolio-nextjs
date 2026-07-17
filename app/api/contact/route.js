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

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await web3Response.json();

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
