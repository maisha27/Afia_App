import Link from "next/link";

export const metadata = { title: "Medical Disclaimer" };

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Medical disclaimer
      </h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">
        Afia is a self-help platform. It is not a medical device, a diagnostic
        tool, or a substitute for professional medical or psychological care. The
        content and exercises on Afia are based on evidence-based self-help
        approaches (CBT, ERP) and are intended to support general wellbeing.
        They are not therapy, and using Afia does not create a therapist-client
        relationship. If you are experiencing a mental health crisis or have
        concerns about your physical health, please contact a healthcare
        professional or your local emergency service immediately. Afia does not
        provide medical advice, diagnosis, or treatment.
      </p>
      <p className="mt-8 text-sm text-muted-foreground">
        If you are in crisis, please visit our{" "}
        <Link
          href="/crisis-support"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          crisis support page
        </Link>
        .
      </p>
    </main>
  );
}
