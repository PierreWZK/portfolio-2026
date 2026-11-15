import type { Metadata } from "next";
import { ContactForm } from "@/components/classic/ContactForm";
import { View } from "@/components/classic/View";
import { contact } from "@/content";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <View path="contact" title="Contact" lead="Un projet, une question, une idée à partager ?">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <ContactForm />

        <aside className="space-y-8 font-mono text-sm">
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gold">E-mail</h2>
            <p className="mt-2 break-all">
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-gold">
                {contact.email}
              </a>
            </p>
          </section>
          <section>
            <h2 className="text-xs uppercase tracking-widest text-gold">Ailleurs</h2>
            <ul className="mt-2 space-y-2">
              {contact.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-gold"
                  >
                    {l.label}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </View>
  );
}
