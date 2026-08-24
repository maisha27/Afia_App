'use client';

import { useState, useTransition, useEffect } from 'react';
import { setExercisePublished, deleteExercise, updateExercise, createExercise } from '@/lib/actions/admin';

export interface AdminExercise {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  writing_prompt: string | null;
  duration_minutes: number;
  week_number: number;
  day_number: number;
  sort_order: number;
  is_published: boolean;
}

type ExStatus = 'Published' | 'Draft';
const STATUS_PILL: Record<ExStatus, string> = {
  Published: 'bg-[#E3F1EE] text-[#276358]',
  Draft:     'bg-[#FBF1E1] text-[#8A6410]',
};

function GripIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B7BCB8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
      <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
    </svg>
  );
}

interface Props {
  exercises: AdminExercise[];
}

/* ─── Editable draft fields (edit mode) ─── */
interface DraftFields {
  title: string;
  description: string;
  content: string;
  writing_prompt: string;
  duration_minutes: number;
}

/* ─── Fields for new exercise creation ─── */
interface CreateFields {
  title: string;
  slug: string;
  week_number: number;
  day_number: number;
  sort_order: number;
  duration_minutes: number;
  description: string;
  content: string;
  writing_prompt: string;
  slugTouched: boolean; // track if user manually edited the slug
}

function toDraft(ex: AdminExercise): DraftFields {
  return {
    title: ex.title,
    description: ex.description ?? '',
    content: ex.content ?? '',
    writing_prompt: ex.writing_prompt ?? '',
    duration_minutes: ex.duration_minutes,
  };
}

function toSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const INPUT_STYLE = {
  background: '#FBFBFA',
  border: '1.5px solid #E4E6E2',
  color: '#2E332F',
} as const;

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  min,
  max,
  className = '',
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-[6px] mb-[14px] ${className}`}>
      <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>{label}</label>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] px-[14px] py-[11px] text-[14.5px] outline-none transition-colors"
        style={INPUT_STYLE}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  italic,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  italic?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px] mb-[14px]">
      <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`rounded-[10px] px-[14px] py-[11px] text-[13.5px] leading-[1.6] resize-y outline-none transition-colors ${italic ? 'italic' : ''}`}
        style={{ ...INPUT_STYLE, color: '#565D5A' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
      />
    </div>
  );
}

function GuideBox() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-[18px] rounded-[12px] border" style={{ background: '#F0F7F5', borderColor: '#C9E0DB' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-[16px] py-[12px] text-left"
      >
        <span className="flex items-center gap-[8px] text-[13px] font-semibold" style={{ color: '#276358' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#276358" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          How to add Week 2 / 3 content
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A9B8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-[16px] pb-[16px] text-[13px] leading-[1.6]" style={{ color: '#3A5C55' }}>
          <ol className="list-decimal list-inside space-y-[6px] mb-[10px]">
            <li>Click <strong>New exercise</strong> (top right).</li>
            <li>Set <strong>Week</strong> to <code className="bg-white/60 px-1 rounded">2</code> (or 3), <strong>Day</strong> to the day within that week (1–7), and <strong>Sort order</strong> to a unique ascending number (e.g. Week 2 days use 8–14, Week 3 use 15–21).</li>
            <li>Fill in the <strong>Title</strong> — the slug auto-generates. You can edit it manually.</li>
            <li>Add <strong>Reading content</strong> (the main lesson text) and an optional <strong>Writing prompt</strong>.</li>
            <li>Click <strong>Create exercise</strong> — it saves as <em>Draft</em> so users can&apos;t see it yet.</li>
            <li>When you&apos;re happy with it, click the <strong>Draft</strong> badge on the exercise to toggle it to <strong>Published</strong>.</li>
          </ol>
          <div className="rounded-[8px] px-[12px] py-[9px] text-[12.5px]" style={{ background: '#E3F1EE', color: '#276358' }}>
            <strong>Sort order tip:</strong> Week 1 = 1–7, Week 2 = 8–14, Week 3 = 15–21, Week 4 = 22–28, and so on. Keep them consecutive so the progress bar stays accurate.
          </div>
        </div>
      )}
    </div>
  );
}

export function ContentClient({ exercises: initialExercises }: Props) {
  const [exercises, setExercises] = useState<AdminExercise[]>(initialExercises);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tab, setTab] = useState<'exercises' | 'daily'>('exercises');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ─── Create mode ─── */
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  function defaultCreateFields(): CreateFields {
    const last = exercises[exercises.length - 1];
    return {
      title: '',
      slug: '',
      week_number: last?.week_number ?? 1,
      day_number: last ? last.day_number + 1 : 1,
      sort_order: last ? last.sort_order + 1 : 1,
      duration_minutes: 6,
      description: '',
      content: '',
      writing_prompt: '',
      slugTouched: false,
    };
  }

  const [createFields, setCreateFields] = useState<CreateFields>(defaultCreateFields);

  function setCreateField<K extends keyof CreateFields>(key: K, value: CreateFields[K]) {
    setCreateFields((f) => ({ ...f, [key]: value }));
  }

  function handleCreateTitleChange(title: string) {
    setCreateFields((f) => ({
      ...f,
      title,
      slug: f.slugTouched ? f.slug : toSlug(title),
    }));
  }

  function enterCreateMode() {
    setCreateFields(defaultCreateFields());
    setCreateError(null);
    setIsCreating(true);
    setConfirmDelete(false);
    setActionError(null);
  }

  function exitCreateMode() {
    setIsCreating(false);
    setCreateError(null);
  }

  const handleCreate = () => {
    setCreateError(null);
    startTransition(async () => {
      const result = await createExercise({
        title: createFields.title,
        slug: createFields.slug,
        week_number: createFields.week_number,
        day_number: createFields.day_number,
        sort_order: createFields.sort_order,
        duration_minutes: createFields.duration_minutes,
        description: createFields.description || null,
        content: createFields.content || null,
        writing_prompt: createFields.writing_prompt || null,
      });

      if (result.error) {
        setCreateError(result.error);
        return;
      }

      if (result.exercise) {
        const newExercise: AdminExercise = result.exercise;
        const newList = [...exercises, newExercise];
        setExercises(newList);
        setSelectedIndex(newList.length - 1);
      }
      setIsCreating(false);
    });
  };

  /* ─── Edit mode ─── */
  const ex = exercises[selectedIndex] as AdminExercise | undefined;

  const [draft, setDraft] = useState<DraftFields>(() => ex ? toDraft(ex) : toDraft({
    id: '', title: '', description: null, content: null, writing_prompt: null,
    duration_minutes: 5, week_number: 1, day_number: 1, sort_order: 1, is_published: false,
  }));

  useEffect(() => {
    if (ex) { setDraft(toDraft(ex)); setSaveSuccess(false); setActionError(null); setConfirmDelete(false); }
  }, [selectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = ex ? (
    draft.title !== ex.title ||
    draft.description !== (ex.description ?? '') ||
    draft.content !== (ex.content ?? '') ||
    draft.writing_prompt !== (ex.writing_prompt ?? '') ||
    draft.duration_minutes !== ex.duration_minutes
  ) : false;

  function setField<K extends keyof DraftFields>(key: K, value: DraftFields[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaveSuccess(false);
  }

  const handleTogglePublished = () => {
    if (!ex) return;
    setActionError(null);
    const newPublished = !ex.is_published;
    setExercises((prev) =>
      prev.map((e, i) => (i === selectedIndex ? { ...e, is_published: newPublished } : e)),
    );
    startTransition(async () => {
      const result = await setExercisePublished(ex.id, newPublished);
      if (result.error) {
        setExercises((prev) =>
          prev.map((e, i) => (i === selectedIndex ? { ...e, is_published: !newPublished } : e)),
        );
        setActionError(result.error);
      }
    });
  };

  const handleSave = () => {
    if (!ex) return;
    setActionError(null);
    setSaveSuccess(false);
    startTransition(async () => {
      const result = await updateExercise(ex.id, {
        title: draft.title,
        description: draft.description || null,
        content: draft.content || null,
        writing_prompt: draft.writing_prompt || null,
        duration_minutes: draft.duration_minutes,
      });
      if (result.error) { setActionError(result.error); return; }
      setExercises((prev) =>
        prev.map((e, i) =>
          i === selectedIndex
            ? {
                ...e,
                title: draft.title,
                description: draft.description || null,
                content: draft.content || null,
                writing_prompt: draft.writing_prompt || null,
                duration_minutes: draft.duration_minutes,
              }
            : e,
        ),
      );
      setSaveSuccess(true);
    });
  };

  const handleDelete = () => {
    if (!ex) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteExercise(ex.id);
      if (result.error) {
        setActionError(result.error);
        setConfirmDelete(false);
        return;
      }
      const newList = exercises.filter((_, i) => i !== selectedIndex);
      setExercises(newList);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      setConfirmDelete(false);
    });
  };

  const exStatus: ExStatus = ex?.is_published ? 'Published' : 'Draft';

  return (
    <div className="flex-1 min-w-0 px-[30px] py-[30px] pb-[40px]">
      {/* Header row */}
      <div className="flex items-end justify-between mb-[18px]">
        <div className="flex items-center gap-[22px]">
          <h1 className="font-heading text-[24px] font-semibold tracking-[-0.02em]" style={{ color: '#26302D' }}>Content</h1>
          <div className="flex items-center gap-[20px] pb-[2px]">
            <button
              type="button"
              onClick={() => setTab('exercises')}
              className="text-[13.5px] pb-[8px] transition-colors"
              style={tab === 'exercises' ? { fontWeight: 600, color: '#26302D', borderBottom: '2px solid #2F7A6D' } : { fontWeight: 500, color: '#5F6863' }}
            >
              Exercises
            </button>
            <button
              type="button"
              onClick={() => setTab('daily')}
              className="text-[13.5px] pb-[8px] transition-colors"
              style={tab === 'daily' ? { fontWeight: 600, color: '#26302D', borderBottom: '2px solid #2F7A6D' } : { fontWeight: 500, color: '#5F6863' }}
            >
              Daily practices
            </button>
          </div>
        </div>

        {/* New exercise button */}
        <button
          type="button"
          onClick={enterCreateMode}
          disabled={isPending}
          className="inline-flex items-center gap-[7px] text-[13px] font-semibold px-[14px] py-[8px] rounded-[9px] transition-colors disabled:opacity-50"
          style={{ background: '#2F7A6D', color: '#EAF3EF' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New exercise
        </button>
      </div>

      {tab === 'exercises' && <GuideBox />}

      <div className="flex gap-[22px] items-start">
        {/* Exercise list */}
        <div className="w-[296px] flex-shrink-0 rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          <div className="px-[18px] py-[14px] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C', borderBottom: '1px solid #F0F1EE' }}>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
          </div>

          {exercises.length === 0 && !isCreating && (
            <div className="px-[18px] py-[22px] text-[13px]" style={{ color: '#9AA29C' }}>
              No exercises yet. Create the first one.
            </div>
          )}

          {exercises.map((item, i) => {
            const isActive = !isCreating && i === selectedIndex;
            const itemStatus: ExStatus = item.is_published ? 'Published' : 'Draft';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { setSelectedIndex(i); setConfirmDelete(false); setActionError(null); exitCreateMode(); }}
                className="w-full text-left flex items-center gap-3 px-[18px] py-[14px] transition-colors hover:bg-[#F6FAF8]"
                style={{
                  background: isActive ? '#F1F7F5' : undefined,
                  borderLeft: isActive ? '3px solid #2F7A6D' : '3px solid transparent',
                  borderBottom: i < exercises.length - 1 ? '1px solid #F0F1EE' : undefined,
                  paddingLeft: isActive ? 15 : 18,
                }}
              >
                <GripIcon />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold mb-[2px] truncate" style={{ color: isActive ? '#26302D' : '#3A403C' }}>
                    {item.title}
                  </div>
                  <div className="text-[12px]" style={{ color: '#5F6863' }}>
                    W{item.week_number} D{item.day_number} &middot; {item.duration_minutes} min
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-[8px] py-[3px] rounded-full flex-shrink-0 ${STATUS_PILL[itemStatus]}`}>
                  {itemStatus}
                </span>
              </button>
            );
          })}

          {/* Creating indicator in list */}
          {isCreating && (
            <div
              className="flex items-center gap-3 px-[15px] py-[14px]"
              style={{ borderLeft: '3px solid #9AA29C', borderTop: exercises.length > 0 ? '1px solid #F0F1EE' : undefined, background: '#F9FAFA' }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold italic" style={{ color: '#9AA29C' }}>
                  {createFields.title || 'New exercise…'}
                </div>
                <div className="text-[12px]" style={{ color: '#B3B7B0' }}>Draft · not saved yet</div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel — create mode */}
        {isCreating && (
          <div className="flex-1 min-w-0 rounded-[14px] px-[26px] py-[24px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
            <div className="flex items-center justify-between mb-[22px]">
              <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
                New exercise · will save as Draft
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Title</label>
              <input
                type="text"
                value={createFields.title}
                onChange={(e) => handleCreateTitleChange(e.target.value)}
                placeholder="e.g. Naming the worry"
                className="rounded-[10px] px-[14px] py-[11px] text-[14.5px] outline-none transition-colors"
                style={INPUT_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
                autoFocus
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                Slug <span className="font-normal text-[#9AA29C]">(used in the URL — lowercase, hyphens only)</span>
              </label>
              <input
                type="text"
                value={createFields.slug}
                onChange={(e) => setCreateFields((f) => ({ ...f, slug: e.target.value, slugTouched: true }))}
                placeholder="e.g. day-5"
                className="rounded-[10px] px-[14px] py-[11px] text-[14.5px] outline-none transition-colors font-mono"
                style={INPUT_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              />
            </div>

            {/* Week / Day / Sort / Duration row */}
            <div className="grid grid-cols-4 gap-[12px] mb-[14px]">
              {[
                { label: 'Week', key: 'week_number' as const, min: 1 },
                { label: 'Day', key: 'day_number' as const, min: 1 },
                { label: 'Sort order', key: 'sort_order' as const, min: 1 },
                { label: 'Duration (min)', key: 'duration_minutes' as const, min: 1, max: 120 },
              ].map(({ label, key, min, max }) => (
                <div key={key} className="flex flex-col gap-[6px]">
                  <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>{label}</label>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    value={createFields[key]}
                    onChange={(e) => setCreateField(key, Math.max(min, parseInt(e.target.value) || min))}
                    className="rounded-[10px] px-[14px] py-[11px] text-[14.5px] outline-none transition-colors"
                    style={INPUT_STYLE}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
                  />
                </div>
              ))}
            </div>

            <FieldTextarea label="Description" value={createFields.description} onChange={(v) => setCreateField('description', v)} rows={2} />
            <FieldTextarea label="Reading content" value={createFields.content} onChange={(v) => setCreateField('content', v)} rows={5} />
            <FieldTextarea label="Writing prompt" value={createFields.writing_prompt} onChange={(v) => setCreateField('writing_prompt', v)} rows={2} placeholder="Optional — leave blank to hide" italic />

            {/* Footer */}
            <div className="flex items-center justify-between pt-[16px]" style={{ borderTop: '1px solid #F0F1EE' }}>
              <button
                type="button"
                onClick={exitCreateMode}
                disabled={isPending}
                className="text-[13px] hover:opacity-75 transition-opacity disabled:opacity-40"
                style={{ color: '#5F6863' }}
              >
                Cancel
              </button>

              <div className="flex items-center gap-[12px]">
                {createError && (
                  <p className="text-[12.5px]" style={{ color: '#8A6410' }}>{createError}</p>
                )}
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isPending || !createFields.title.trim() || !createFields.slug.trim()}
                  className="inline-flex items-center gap-[7px] text-[13px] font-semibold px-[16px] py-[8px] rounded-[9px] transition-colors disabled:opacity-40"
                  style={
                    !isPending && createFields.title.trim() && createFields.slug.trim()
                      ? { background: '#2F7A6D', color: '#EAF3EF' }
                      : { background: '#EDF0EE', color: '#5F6863' }
                  }
                >
                  {isPending ? 'Creating…' : 'Create exercise'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right panel — edit mode */}
        {!isCreating && ex && (
          <div className="flex-1 min-w-0 rounded-[14px] px-[26px] py-[24px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
            {/* Editor header */}
            <div className="flex items-center justify-between mb-[22px]">
              <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
                W{ex.week_number} · Day {ex.day_number} · Sort {ex.sort_order}
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-[12px]" style={{ color: '#5F6863' }}>Status</span>
                <button
                  type="button"
                  onClick={handleTogglePublished}
                  disabled={isPending}
                  className="inline-flex items-center gap-[6px] text-[12px] font-semibold px-[11px] py-[5px] rounded-full transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={
                    exStatus === 'Published'
                      ? { color: '#276358', background: '#E3F1EE', border: '1px solid #CBE6DE' }
                      : { color: '#8A6410', background: '#FBF1E1', border: '1px solid #EFE0C2' }
                  }
                >
                  {exStatus}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Title</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => setField('title', e.target.value)}
                className="rounded-[10px] px-[14px] py-[11px] text-[14.5px] outline-none transition-colors"
                style={INPUT_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Duration (minutes)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={draft.duration_minutes}
                onChange={(e) => setField('duration_minutes', Math.max(1, parseInt(e.target.value) || 1))}
                className="rounded-[10px] px-[14px] py-[11px] text-[14.5px] outline-none transition-colors w-[120px]"
                style={INPUT_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Description</label>
              <textarea
                value={draft.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={2}
                className="rounded-[10px] px-[14px] py-[11px] text-[14px] leading-[1.55] resize-y outline-none transition-colors"
                style={{ ...INPUT_STYLE, color: '#565D5A' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              />
            </div>

            {/* Reading content */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Reading content</label>
              <textarea
                value={draft.content}
                onChange={(e) => setField('content', e.target.value)}
                rows={6}
                className="rounded-[10px] px-[14px] py-[11px] text-[13.5px] leading-[1.6] resize-y outline-none transition-colors"
                style={{ ...INPUT_STYLE, color: '#565D5A' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              />
            </div>

            {/* Writing prompt */}
            <div className="flex flex-col gap-[6px] mb-[20px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Writing prompt</label>
              <textarea
                value={draft.writing_prompt}
                onChange={(e) => setField('writing_prompt', e.target.value)}
                rows={2}
                placeholder="Optional — leave blank to hide"
                className="rounded-[10px] px-[14px] py-[11px] text-[13.5px] leading-[1.6] italic resize-y outline-none transition-colors"
                style={{ ...INPUT_STYLE, color: '#5F6863' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-[16px]" style={{ borderTop: '1px solid #F0F1EE' }}>
              {confirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-[13px]" style={{ color: '#767D79' }}>Delete this exercise?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="text-[13px] font-semibold hover:opacity-75 transition-opacity disabled:opacity-50"
                    style={{ color: '#B0503F' }}
                  >
                    {isPending ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-[13px] hover:opacity-75 transition-opacity"
                    style={{ color: '#5F6863' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: '#B0503F' }}
                >
                  Delete exercise
                </button>
              )}

              <div className="flex items-center gap-[12px]">
                {actionError && (
                  <p className="text-[12.5px]" style={{ color: '#8A6410' }}>{actionError}</p>
                )}
                {saveSuccess && (
                  <p className="text-[12.5px] font-semibold" style={{ color: '#276358' }}>Saved.</p>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending || !isDirty}
                  className="inline-flex items-center gap-[7px] text-[13px] font-semibold px-[16px] py-[8px] rounded-[9px] transition-colors disabled:opacity-40"
                  style={
                    isDirty && !isPending
                      ? { background: '#2F7A6D', color: '#EAF3EF' }
                      : { background: '#EDF0EE', color: '#5F6863' }
                  }
                >
                  {isPending ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state — no exercises and not creating */}
        {!isCreating && !ex && (
          <div className="flex-1 flex items-center justify-center text-[14px]" style={{ color: '#9AA29C' }}>
            No exercises yet.
          </div>
        )}
      </div>
    </div>
  );
}
