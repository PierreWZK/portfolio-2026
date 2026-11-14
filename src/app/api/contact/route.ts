import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { contact } from "@/content";
import { validateContact } from "@/lib/contact";

// Envoi du message par SMTP. Sans configuration (variables absentes), la route répond 503 :
// le formulaire le dit honnêtement et propose un lien mailto. Rien n'est simulé.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) return NextResponse.json({ errors: result.errors }, { status: 422 });

  // Champ piège rempli : un robot. On répond comme si c'était envoyé, sans rien envoyer.
  if (result.data.website) return NextResponse.json({ ok: true });

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const port = Number(SMTP_PORT ?? 465);
  const { name, email, message } = result.data;
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: SMTP_USER,
      to: CONTACT_TO ?? contact.email,
      replyTo: `${name} <${email}>`,
      subject: `[Portfolio] Message de ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
