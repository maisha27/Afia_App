// Crisis support — never requires login or subscription (CLAUDE.md §2)
export const metadata = { title: "Crisis Support" };

export default function CrisisSupportPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Need to talk to someone?
      </h1>
      <p className="mt-4 text-muted-foreground">
        Afia is a self-help tool, not a substitute for professional care. If you
        are in distress or crisis, please reach out to one of these services:
      </p>
      <ul className="mt-8 space-y-4 text-foreground">
        <li>
          <strong>NHS urgent mental health line</strong> — call 111, option 2
          (24 hours)
        </li>
        <li>
          <strong>Samaritans</strong> — call 116 123 (24 hours, every day)
        </li>
        <li>
          <strong>SHOUT</strong> — text 85258 (24/7 text support)
        </li>
        <li>
          <strong>Muslim Youth Helpline</strong> — 0808 808 2008 (4pm to 10pm
          daily)
        </li>
        <li>
          <strong>Muslim Community Helpline</strong> — 020 8908 6715 (Mon to
          Fri, 10am to 1pm)
        </li>
        <li>
          <strong>Muslim Women Network UK</strong> — 0800 999 5786 (Mon to Fri,
          10am to 4pm)
        </li>
      </ul>
    </main>
  );
}
