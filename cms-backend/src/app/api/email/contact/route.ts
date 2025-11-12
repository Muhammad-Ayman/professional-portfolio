import { NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { handleError, jsonResponse } from "@/lib/http";
import { parseValidation } from "@/lib/validation-helpers";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const payload = parseValidation(contactFormSchema, await request.json());

    const recipientEmail = process.env.CONTACT_EMAIL || process.env.PROFILE_EMAIL;
    if (!recipientEmail) {
      throw new Error(
        "Email configuration error: CONTACT_EMAIL or PROFILE_EMAIL must be set"
      );
    }

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Email service not configured: Missing RESEND_API_KEY");
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: recipientEmail,
      replyTo: payload.email,
      subject: `New Contact Form Message from ${payload.name}`,
      html: contactEmailTemplate(payload),
    });

    if (error) {
      console.error("[Email] Resend API error", error);
      throw new Error("Failed to send email. Please try again later.");
    }

    return jsonResponse({
      success: true,
      message: "Your message has been sent successfully!",
      id: data?.id,
    });
  } catch (error) {
    return handleError(error);
  }
}

function contactEmailTemplate(payload: z.infer<typeof contactFormSchema>) {
  const { name, email, message } = payload;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Message</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Message</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">From:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
            <p style="margin: 0;"><strong style="color: #667eea;">Date:</strong> ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">Message:</h2>
            <div style="white-space: pre-wrap; word-wrap: break-word;">${message}</div>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #2e7d32;">
              <strong>💡 Quick Actions:</strong> Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This message was sent via your portfolio contact form</p>
        </div>
      </body>
    </html>
  `;
}
