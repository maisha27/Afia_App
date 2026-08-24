'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { saveJournalEntry, deleteJournalEntry } from '@/lib/actions/journal';

export interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
}

interface Props {
  initialEntries: JournalEntry[];
  dailyPrompt: string;
}

function formatEntryDate(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${date} · ${time}`;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function JournalClient({ initialEntries, dailyPrompt }: Props) {
  const reduced = useReducedMotion();
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [content, setContent] = useState('');
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-grow textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(140, ta.scrollHeight)}px`;
  }, [content]);

  /* Clean up timer on unmount */
  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current); }, []);

  const handleSave = () => {
    setSaveError(null);
    startSave(async () => {
      const result = await saveJournalEntry(content);
      if (result.error) {
        setSaveError(result.error);
        return;
      }
      const now = new Date().toISOString();
      setEntries((prev) => [
        { id: result.id!, content: content.trim(), created_at: now },
        ...prev,
      ]);
      setContent('');

      // Brief "Saved" flash
      setJustSaved(true);
      savedTimerRef.current = setTimeout(() => setJustSaved(false), 900);
    });
  };

  const handleDelete = (id: string) => {
    setDeleteError(null);
    startDelete(async () => {
      const result = await deleteJournalEntry(id);
      if (result.error) {
        setDeleteError('Could not delete this entry. Please try again.');
        setConfirmDeleteId(null);
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setConfirmDeleteId(null);
    });
  };

  const words = wordCount(content);
  const chars = content.length;
  const canSave = content.trim().length > 0 && chars <= 10000;

  const EASE: [number, number, number, number] = [0.25, 0, 0.15, 1];

  return (
    <div className="flex flex-col gap-7">
      {/* ── Write area ── */}
      <div
        className="bg-white rounded-[18px] border border-[#E7E2DA] overflow-hidden"
        style={{ boxShadow: '0 4px 24px -8px rgba(20,24,22,.07)' }}
      >
        {/* Header strip */}
        <div className="flex items-center gap-3 px-[26px] pt-[22px] pb-[14px] border-b border-[#F0EBE3]">
          <span
            className="flex w-[34px] h-[34px] rounded-[10px] items-center justify-center flex-shrink-0"
            style={{ background: '#EDEBF3' }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6A5FA0"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 4C11 5 6 10 5 19l3-3c6-1 10-5 12-12Z" />
              <path d="M8.5 15.5c2.6-2.6 4.6-4.8 6.5-8" />
              <path d="M4 20l3.5-3.5" />
            </svg>
          </span>
          <div>
            <div className="font-heading text-[15px] font-semibold text-[#3A403C]">New entry</div>
            <div className="text-[12.5px] italic text-[#6E7672] mt-[1px]">{dailyPrompt}</div>
          </div>
        </div>

        {/* Textarea */}
        <div className="px-[26px] pt-[18px] pb-[14px]">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write whatever's on your mind. This is just for you."
            className="w-full resize-none bg-transparent text-[15px] leading-[1.7] text-[#3A403C] placeholder:text-[#B0AEA8] focus:outline-none"
            style={{ minHeight: 140 }}
            aria-label="Journal entry"
            disabled={isSaving}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-[26px] pb-[20px] gap-4">
          <div className="text-[12px] text-[#9AA29C]">
            {words > 0 ? (
              <>
                {words} {words === 1 ? 'word' : 'words'}
                {chars > 8000 && (
                  <span className={chars > 10000 ? 'text-[#B26A44] ml-2' : 'text-[#B98E4A] ml-2'}>
                    · {10000 - chars} chars left
                  </span>
                )}
              </>
            ) : (
              'Start writing — no one else will see this'
            )}
          </div>
          <div className="flex items-center gap-3">
            {saveError && (
              <p className="text-[12.5px] text-[#8A6410]" role="alert">
                {saveError}
              </p>
            )}
            {content.trim().length > 0 && !isSaving && (
              <button
                type="button"
                onClick={() => setContent('')}
                className="text-[13px] text-[#6E7672] hover:text-[#565D5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Clear
              </button>
            )}
            <motion.button
              type="button"
              onClick={handleSave}
              disabled={!canSave || isSaving}
              whileTap={reduced || !canSave || isSaving ? {} : { scale: 0.96 }}
              transition={{ duration: 0.1 }}
              className="font-heading text-[14px] font-semibold px-[20px] py-[10px] rounded-[10px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
              style={{
                background: justSaved ? '#3B9B72' : '#2F6E7A',
                color: '#fff',
                minWidth: 100,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {justSaved ? (
                  <motion.span
                    key="saved"
                    className="flex items-center justify-center gap-1.5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Saved
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {isSaving ? 'Saving…' : 'Save entry'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Past entries ── */}
      {entries.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-heading text-[17px] font-semibold text-[#3A403C]">
              Your reflections
            </h2>
            <span
              className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: '#EDEBF3', color: '#6A5FA0' }}
            >
              {entries.length}
            </span>
          </div>
          {deleteError && (
            <p className="text-[12.5px] text-[#C99A46] mb-3" role="alert">
              {deleteError}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: reduced ? 0 : -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: reduced ? 0 : -20, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="bg-white rounded-[16px] border border-[#E7E2DA] px-[22px] py-[18px]"
                  style={{ boxShadow: '0 2px 12px -4px rgba(20,24,22,.05)' }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <time
                      dateTime={entry.created_at}
                      className="text-[12px] font-semibold text-[#6E7672]"
                    >
                      {formatEntryDate(entry.created_at)}
                    </time>

                    {confirmDeleteId === entry.id ? (
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[12.5px] text-[#767D79]">Delete this entry?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={isDeleting}
                          className="text-[12.5px] font-semibold text-[#B0503F] hover:opacity-75 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        >
                          {isDeleting ? 'Deleting…' : 'Delete'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[12.5px] text-[#6E7672] hover:text-[#565D5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setConfirmDeleteId(entry.id); setDeleteError(null); }}
                        className="text-[12px] text-[#B0B8B2] hover:text-[#767D79] transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        aria-label="Delete this entry"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-[14.5px] leading-[1.7] text-[#565D5A] whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-[14px] text-[#6E7672] leading-[1.6]">
            No entries yet. Your first reflection is already waiting to be written.
          </p>
        </div>
      )}
    </div>
  );
}
