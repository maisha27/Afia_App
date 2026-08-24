import { jsPDF } from 'jspdf';

type Row = Record<string, unknown>;

interface ExportData {
  email: string | undefined;
  exportedAt: string;
  firstName?: string | null;
  screenerResults: unknown[];
  exerciseProgress: unknown[];
  journalEntries: unknown[];
  calmSessions: unknown[];
}

const BRAND = '#2F6E7A';
const TEXT = '#2A2F2C';
const MUTED = '#8A928D';
const LIGHT = '#F5F3EF';
const LINE = '#E7E2DA';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toolLabel(tool: string): string {
  const map: Record<string, string> = {
    breathe: 'Box breathing',
    'ocean-breath': 'Ocean breath',
    grounding: '5-4-3-2-1 senses',
    'body-scan': 'Body scan',
    'loving-kindness': 'Loving-kindness',
    'safe-place': 'Safe place',
  };
  return map[tool] ?? tool;
}

export function generatePDF(data: ExportData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const marginL = 18;
  const marginR = 18;
  const contentW = pageW - marginL - marginR;
  let y = 0;

  // ── helpers ────────────────────────────────────────────────────────────────

  function hex(h: string): [number, number, number] {
    const n = parseInt(h.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function setFill(color: string) {
    doc.setFillColor(...hex(color));
  }

  function setDraw(color: string) {
    doc.setDrawColor(...hex(color));
  }

  function setTextColor(color: string) {
    doc.setTextColor(...hex(color));
  }

  function checkPage(needed = 14) {
    if (y + needed > pageH - 16) {
      doc.addPage();
      y = 18;
    }
  }

  function sectionHeader(title: string) {
    checkPage(20);
    y += 4;
    setFill(LIGHT);
    doc.roundedRect(marginL, y, contentW, 9, 2, 2, 'F');
    setTextColor(BRAND);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(title.toUpperCase(), marginL + 4, y + 6);
    y += 14;
  }

  function divider() {
    setDraw(LINE);
    doc.setLineWidth(0.3);
    doc.line(marginL, y, marginL + contentW, y);
    y += 5;
  }

  function wrappedText(
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineH: number,
  ): number {
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      checkPage(lineH + 2);
      doc.text(line, x, startY);
      startY += lineH;
    }
    return startY;
  }

  // ── Cover ──────────────────────────────────────────────────────────────────

  setFill(BRAND);
  doc.rect(0, 0, pageW, 48, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('afia', marginL, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(200, 230, 225);
  doc.text('Your personal data export', marginL, 32);

  doc.setFontSize(9);
  doc.setTextColor(160, 210, 200);
  doc.text(`Exported ${fmtDate(data.exportedAt)}`, marginL, 42);

  y = 60;

  // ── Summary box ────────────────────────────────────────────────────────────

  setFill('#EAF3EF');
  setDraw(LINE);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginL, y, contentW, 30, 3, 3, 'FD');

  const name = data.firstName?.trim() || data.email?.split('@')[0] || 'You';
  setTextColor(TEXT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`Hello, ${name}`, marginL + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setTextColor(MUTED);
  doc.text(
    `This report contains everything Afia holds about you: check-ins, journal entries, calm sessions, and exercise progress.`,
    marginL + 6,
    y + 18,
    { maxWidth: contentW - 12 },
  );

  y += 40;

  // ── Stats row ──────────────────────────────────────────────────────────────

  const stats = [
    { label: 'Check-ins', value: data.screenerResults.length },
    { label: 'Journal entries', value: data.journalEntries.length },
    { label: 'Calm sessions', value: data.calmSessions.length },
    { label: 'Plan steps', value: data.exerciseProgress.length },
  ];
  const tileW = (contentW - 9) / 4;

  stats.forEach((s, i) => {
    const tx = marginL + i * (tileW + 3);
    setFill('#FFFFFF');
    setDraw(LINE);
    doc.setLineWidth(0.35);
    doc.roundedRect(tx, y, tileW, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    setTextColor(BRAND);
    doc.text(String(s.value), tx + tileW / 2, y + 9, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setTextColor(MUTED);
    doc.text(s.label, tx + tileW / 2, y + 15, { align: 'center' });
  });

  y += 26;

  // ── Check-in history ───────────────────────────────────────────────────────

  sectionHeader('Weekly check-in history');

  if (data.screenerResults.length === 0) {
    setTextColor(MUTED);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text('No check-ins recorded yet.', marginL, y);
    y += 10;
  } else {
    (data.screenerResults as Row[]).forEach((r, i) => {
      checkPage(12);
      const isLast = i === data.screenerResults.length - 1;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setTextColor(TEXT);
      doc.text(fmtDate(r.created_at as string), marginL, y);

      doc.setFont('helvetica', 'bold');
      setTextColor(BRAND);
      doc.text(`Score ${r.score as number}`, marginL + 52, y);

      doc.setFont('helvetica', 'normal');
      setTextColor(MUTED);
      doc.text(`· ${r.band as string}`, marginL + 70, y);

      y += 6;
      if (!isLast) {
        setDraw(LINE);
        doc.setLineWidth(0.2);
        doc.line(marginL, y, marginL + contentW, y);
        y += 4;
      }
    });
    y += 6;
  }

  // ── Journal entries ────────────────────────────────────────────────────────

  sectionHeader('Journal entries');

  if (data.journalEntries.length === 0) {
    setTextColor(MUTED);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text('No journal entries yet.', marginL, y);
    y += 10;
  } else {
    (data.journalEntries as Row[]).forEach((entry, i) => {
      checkPage(20);
      const isLast = i === data.journalEntries.length - 1;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      setTextColor(MUTED);
      doc.text(fmtDateTime(entry.created_at as string), marginL, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setTextColor(TEXT);
      y = wrappedText(entry.content as string, marginL, y, contentW, 5.2);

      if (!isLast) {
        y += 3;
        divider();
      } else {
        y += 6;
      }
    });
  }

  // ── Calm sessions ──────────────────────────────────────────────────────────

  sectionHeader('Calm tool sessions');

  if (data.calmSessions.length === 0) {
    setTextColor(MUTED);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text('No calm sessions recorded yet.', marginL, y);
    y += 10;
  } else {
    // Group by tool
    const byTool: Record<string, number> = {};
    (data.calmSessions as Row[]).forEach((s) => {
      const t = s.tool as string;
      byTool[t] = (byTool[t] ?? 0) + 1;
    });

    Object.entries(byTool).forEach(([tool, count], i, arr) => {
      checkPage(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setTextColor(TEXT);
      doc.text(toolLabel(tool), marginL, y);
      doc.setFont('helvetica', 'bold');
      setTextColor(BRAND);
      doc.text(`${count}×`, marginL + contentW, y, { align: 'right' });
      y += 6;
      if (i < arr.length - 1) {
        setDraw(LINE);
        doc.setLineWidth(0.2);
        doc.line(marginL, y, marginL + contentW, y);
        y += 4;
      }
    });

    y += 4;
    setTextColor(MUTED);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${data.calmSessions.length} sessions total`, marginL, y);
    y += 10;
  }

  // ── Exercise progress ──────────────────────────────────────────────────────

  sectionHeader('Plan exercise progress');

  if (data.exerciseProgress.length === 0) {
    setTextColor(MUTED);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text('No exercises completed yet.', marginL, y);
    y += 10;
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    setTextColor(TEXT);
    doc.text(`${data.exerciseProgress.length} step${data.exerciseProgress.length === 1 ? '' : 's'} completed`, marginL, y);
    y += 6;

    const firstStep = data.exerciseProgress[0] as Row | undefined;
    if (firstStep?.completed_at) {
      setTextColor(MUTED);
      doc.setFontSize(8.5);
      doc.text(
        `First completed ${fmtDate(firstStep.completed_at as string)}`,
        marginL,
        y,
      );
      y += 6;
    }
    y += 4;
  }

  // ── Footer on every page ───────────────────────────────────────────────────

  const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setDraw(LINE);
    doc.setLineWidth(0.3);
    doc.line(marginL, pageH - 12, marginL + contentW, pageH - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setTextColor(MUTED);
    doc.text('afia · your mental health companion', marginL, pageH - 7);
    doc.text(`Page ${p} of ${totalPages}`, marginL + contentW, pageH - 7, { align: 'right' });
  }

  doc.save(`afia-my-data-${new Date().toISOString().slice(0, 10)}.pdf`);
}
