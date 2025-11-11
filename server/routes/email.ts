import { Router } from "express";
import { Resend } from "resend";
import { z } from "zod";
import { parseValidation } from "../utils/validation";

const emailRouter = Router();

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schemas
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Contact form submission endpoint
emailRouter.post("/contact", async (req, res, next) => {
  try {
    // Validate request body
    const { name, email, message } = parseValidation(contactFormSchema, req.body);

    // Get profile email from environment or use default
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.PROFILE_EMAIL;
    console.log(recipientEmail);
    
    if (!recipientEmail) {
      console.error("❌ CONTACT_EMAIL or PROFILE_EMAIL environment variable not set");
      console.error("   Please add CONTACT_EMAIL to your .env file");
      res.status(500).json({ 
        error: "Email configuration error: Recipient email not configured. Please try again later or contact directly." 
      });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY environment variable not set");
      console.error("   Please add your Resend API key to your .env file");
      console.error("   Get your API key from: https://resend.com/api-keys");
      res.status(500).json({ 
        error: "Email service not configured: Missing API key. Please try again later." 
      });
      return;
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
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
                <p style="margin: 0;"><strong style="color: #667eea;">Date:</strong> ${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}</p>
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
      `,
    });

    if (error) {
      console.error("❌ Resend API error:", error);
      console.error("   Error details:", JSON.stringify(error, null, 2));
      res.status(500).json({ 
        error: "Failed to send email. Please try again later or contact directly.",
        debug: process.env.NODE_ENV === "development" ? error : undefined
      });
      return;
    }

    console.log("✅ Contact form email sent successfully");
    console.log("   Email ID:", data?.id);
    console.log("   To:", recipientEmail);
    console.log("   From:", email);
    res.json({ 
      success: true, 
      message: "Your message has been sent successfully!",
      id: data?.id 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: "Invalid form data", 
        details: error.errors 
      });
      return;
    }
    next(error);
  }
});

// Newsletter subscription endpoint
emailRouter.post("/newsletter", async (req, res, next) => {
  try {
    // Validate request body
    const { email } = parseValidation(newsletterSchema, req.body);

    // Get admin email from environment
    const adminEmail = process.env.CONTACT_EMAIL || process.env.PROFILE_EMAIL;
    
    if (!adminEmail) {
      console.error("❌ CONTACT_EMAIL or PROFILE_EMAIL environment variable not set");
      console.error("   Please add CONTACT_EMAIL to your .env file");
      res.status(500).json({ 
        error: "Newsletter service not configured: Recipient email not configured. Please try again later." 
      });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY environment variable not set");
      console.error("   Please add your Resend API key to your .env file");
      console.error("   Get your API key from: https://resend.com/api-keys");
      res.status(500).json({ 
        error: "Email service not configured: Missing API key. Please try again later." 
      });
      return;
    }

    // Send notification email to admin
    const { data: notificationData, error: notificationError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: adminEmail,
      subject: "New Newsletter Subscription",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Newsletter Subscription</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 New Newsletter Subscriber</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 16px;">
                  <strong style="color: #667eea;">Email:</strong> 
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </p>
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>Subscribed:</strong> ${new Date().toLocaleString('en-US', { 
                    dateStyle: 'full', 
                    timeStyle: 'short' 
                  })}
                </p>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                  <strong>📝 Note:</strong> This subscriber is interested in receiving insights on proposal strategy and leadership.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This notification was sent from your portfolio website</p>
            </div>
          </body>
        </html>
      `,
    });

    // Send confirmation email to subscriber
    const { data: confirmationData, error: confirmationError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Welcome to the Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to the Newsletter</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome! 🎉</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
              <div style="background: white; padding: 25px; border-radius: 8px; text-align: center;">
                <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 22px;">Thanks for Subscribing!</h2>
                <p style="margin: 0 0 15px 0; font-size: 16px; color: #666;">
                  You'll receive regular insights on proposal strategy, leadership, and industry trends.
                </p>
                <p style="margin: 0; font-size: 14px; color: #999;">
                  Keep an eye on your inbox for valuable content!
                </p>
              </div>
              
              <div style="margin-top: 20px; padding: 20px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; font-size: 16px; color: #1565c0;">
                  <strong>What to expect:</strong>
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #1976d2;">
                  <li style="margin: 5px 0;">Expert insights on proposal strategy</li>
                  <li style="margin: 5px 0;">Leadership best practices</li>
                  <li style="margin: 5px 0;">Industry trends and analysis</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>You can unsubscribe at any time from any email we send you.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (notificationError || confirmationError) {
      console.error("❌ Resend API error:", notificationError || confirmationError);
      console.error("   Error details:", JSON.stringify(notificationError || confirmationError, null, 2));
      res.status(500).json({ 
        error: "Failed to process subscription. Please try again later.",
        debug: process.env.NODE_ENV === "development" ? (notificationError || confirmationError) : undefined
      });
      return;
    }

    console.log("✅ Newsletter subscription processed successfully");
    console.log("   Notification ID:", notificationData?.id);
    console.log("   Confirmation ID:", confirmationData?.id);
    console.log("   Subscriber:", email);
    res.json({ 
      success: true, 
      message: "Successfully subscribed! Check your email for confirmation." 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: "Invalid email address", 
        details: error.errors 
      });
      return;
    }
    next(error);
  }
});

export default emailRouter;

