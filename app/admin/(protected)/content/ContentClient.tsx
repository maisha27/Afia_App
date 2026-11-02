'use client';

import { useState, useTransition, useEffect } from 'react';
import { setExercisePublished, deleteExercise, updateExercise, createExercise, bulkSetPublished } from '@/lib/actions/admin';

const EXERCISE_TYPES = [
  'Psychoeducation', 'CBT', 'ERP', 'Behavioural',
  'Body awareness', 'ACT-adjacent', 'Reflection', 'Relapse prevention',
] as const;

export interface AdminExercise {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  writing_prompt: string | null;
  duration_minutes: number;
  week_number: number;
  day_number: number;
  sort_order: number;
  is_published: boolean;
  exercise_type: string | null;
  therapy_focus: string | null;
  minimum_band: string | null;
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
  exercise_type: string;
  therapy_focus: string;
  minimum_band: string;
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
  exercise_type: string;
  therapy_focus: string;
  minimum_band: string;
  slugTouched: boolean;
}

function toDraft(ex: AdminExercise): DraftFields {
  return {
    title: ex.title,
    description: ex.description ?? '',
    content: ex.content ?? '',
    writing_prompt: ex.writing_prompt ?? '',
    duration_minutes: ex.duration_minutes,
    exercise_type: ex.exercise_type ?? '',
    therapy_focus: ex.therapy_focus ?? '',
    minimum_band: ex.minimum_band ?? '',
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
            <li>Fill in the <strong>Title</strong> - the slug auto-generates. You can edit it manually.</li>
            <li>Add <strong>Reading content</strong> (the main lesson text) and an optional <strong>Writing prompt</strong>.</li>
            <li>Click <strong>Create exercise</strong> - it saves as <em>Draft</em> so users can&apos;t see it yet.</li>
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ─── Bulk selection ─── */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkError, setBulkError] = useState<string | null>(null);
  const allSelected = exercises.length > 0 && exercises.every((e) => selectedIds.has(e.id));
  const someSelected = !allSelected && exercises.some((e) => selectedIds.has(e.id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds(allSelected ? new Set() : new Set(exercises.map((e) => e.id)));
  }

  const handleBulkPublish = (published: boolean) => {
    setBulkError(null);
    const ids = [...selectedIds];
    setExercises((prev) => prev.map((e) => selectedIds.has(e.id) ? { ...e, is_published: published } : e));
    setSelectedIds(new Set());
    startTransition(async () => {
      const result = await bulkSetPublished(ids, published);
      if (result.error) {
        setBulkError(result.error);
        setExercises((prev) => prev.map((e) => ids.includes(e.id) ? { ...e, is_published: !published } : e));
      }
    });
  };

  /* ─── Last-saved timestamp ─── */
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

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
      exercise_type: '',
      therapy_focus: '',
      minimum_band: '',
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
        exercise_type: createFields.exercise_type || null,
        therapy_focus: createFields.therapy_focus || null,
        minimum_band: createFields.minimum_band || null,
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
    id: '', slug: '', title: '', description: null, content: null, writing_prompt: null,
    duration_minutes: 5, week_number: 1, day_number: 1, sort_order: 1, is_published: false,
    exercise_type: null, therapy_focus: null, minimum_band: null,
  }));

  useEffect(() => {
    if (ex) { setDraft(toDraft(ex)); setSaveSuccess(false); setActionError(null); setConfirmDelete(false); setLastSavedAt(null); }
  }, [selectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = ex ? (
    draft.title !== ex.title ||
    draft.description !== (ex.description ?? '') ||
    draft.content !== (ex.content ?? '') ||
    draft.writing_prompt !== (ex.writing_prompt ?? '') ||
    draft.duration_minutes !== ex.duration_minutes ||
    draft.exercise_type !== (ex.exercise_type ?? '') ||
    draft.therapy_focus !== (ex.therapy_focus ?? '') ||
    draft.minimum_band !== (ex.minimum_band ?? '')
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
        exercise_type: draft.exercise_type || null,
        therapy_focus: draft.therapy_focus || null,
        minimum_band: draft.minimum_band || null,
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
                exercise_type: draft.exercise_type || null,
                therapy_focus: draft.therapy_focus || null,
                minimum_band: draft.minimum_band || null,
              }
            : e,
        ),
      );
      setSaveSuccess(true);
      setLastSavedAt(new Date());
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
        <h1 className="font-heading text-[24px] font-semibold tracking-[-0.02em]" style={{ color: '#26302D' }}>Content</h1>

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

      <GuideBox />

      <div className="flex gap-[22px] items-start">
        {/* Exercise list */}
        <div className="w-[296px] flex-shrink-0 rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          <div className="px-[18px] py-[13px] flex items-center gap-[10px]" style={{ borderBottom: '1px solid #F0F1EE' }}>
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => { if (el) el.indeterminate = someSelected; }}
              onChange={toggleSelectAll}
              className="w-[14px] h-[14px] rounded cursor-pointer flex-shrink-0"
              aria-label="Select all exercises"
              title="Select all"
              style={{ accentColor: '#2F7A6D' }}
            />
            <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
              {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </span>
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
              <div
                key={item.id}
                className="w-full flex items-center transition-colors hover:bg-[#F6FAF8]"
                style={{
                  background: isActive ? '#F1F7F5' : undefined,
                  borderLeft: isActive ? '3px solid #2F7A6D' : '3px solid transparent',
                  borderBottom: i < exercises.length - 1 ? '1px solid #F0F1EE' : undefined,
                }}
              >
                <div
                  className="flex-shrink-0 px-[12px] py-[14px]"
                  onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-[14px] h-[14px] rounded cursor-pointer"
                    style={{ accentColor: '#2F7A6D' }}
                    aria-label={`Select ${item.title}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedIndex(i); setConfirmDelete(false); setActionError(null); exitCreateMode(); }}
                  className="flex-1 text-left flex items-center gap-3 pr-[18px] py-[14px] min-w-0"
                  style={{ paddingLeft: isActive ? 0 : 0 }}
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
              </div>
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
                Slug <span className="font-normal text-[#9AA29C]">(used in the URL - lowercase, hyphens only)</span>
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

            {/* Exercise type + Therapy focus */}
            <div className="grid grid-cols-2 gap-[12px] mb-[14px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Exercise type</label>
                <select
                  value={createFields.exercise_type}
                  onChange={(e) => setCreateField('exercise_type', e.target.value)}
                  className="rounded-[10px] px-[14px] py-[11px] text-[14px] outline-none transition-colors"
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
                >
                  <option value="">— Select type —</option>
                  {EXERCISE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                  Therapy focus <span className="font-normal" style={{ color: '#9AA29C' }}>(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={createFields.therapy_focus}
                  onChange={(e) => setCreateField('therapy_focus', e.target.value)}
                  placeholder="e.g. Worry, Reassurance seeking"
                  className="rounded-[10px] px-[14px] py-[11px] text-[14px] outline-none transition-colors"
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
                />
              </div>
            </div>

            {/* Minimum band (create) */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                Minimum band <span className="font-normal" style={{ color: '#9AA29C' }}>(who sees this exercise)</span>
              </label>
              <select
                value={createFields.minimum_band}
                onChange={(e) => setCreateField('minimum_band', e.target.value)}
                className="rounded-[10px] px-[14px] py-[11px] text-[14px] outline-none transition-colors"
                style={INPUT_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              >
                <option value="">All bands</option>
                <option value="mild">Mild+</option>
                <option value="moderate">Moderate+</option>
              </select>
            </div>

            <FieldTextarea label="Description" value={createFields.description} onChange={(v) => setCreateField('description', v)} rows={2} />
            <FieldTextarea label="Reading content" value={createFields.content} onChange={(v) => setCreateField('content', v)} rows={5} />
            <FieldTextarea label="Writing prompt" value={createFields.writing_prompt} onChange={(v) => setCreateField('writing_prompt', v)} rows={2} placeholder="Optional - leave blank to hide" italic />

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
              <div className="flex items-center gap-[12px]">
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
                  W{ex.week_number} · Day {ex.day_number} · Sort {ex.sort_order}
                </div>
                {lastSavedAt && (
                  <span className="text-[11.5px]" style={{ color: '#9AA29C' }}>
                    Saved at {lastSavedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <a
                  href={`/plan/${ex.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Preview exercise (opens as user)"
                  className="inline-flex items-center gap-[5px] text-[11.5px] font-semibold px-[9px] py-[4px] rounded-[7px] transition-colors hover:opacity-80"
                  style={{ color: '#276358', background: '#E3F1EE', border: '1px solid #CBE6DE' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                  </svg>
                  Preview
                </a>
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

            {/* Exercise type + Therapy focus */}
            <div className="grid grid-cols-2 gap-[12px] mb-[14px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>Exercise type</label>
                <select
                  value={draft.exercise_type}
                  onChange={(e) => setField('exercise_type', e.target.value)}
                  className="rounded-[10px] px-[14px] py-[11px] text-[14px] outline-none transition-colors"
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
                >
                  <option value="">— Select type —</option>
                  {EXERCISE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                  Therapy focus <span className="font-normal" style={{ color: '#9AA29C' }}>(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={draft.therapy_focus}
                  onChange={(e) => setField('therapy_focus', e.target.value)}
                  placeholder="e.g. Worry, Reassurance seeking"
                  className="rounded-[10px] px-[14px] py-[11px] text-[14px] outline-none transition-colors"
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
                />
              </div>
            </div>

            {/* Minimum band */}
            <div className="flex flex-col gap-[6px] mb-[14px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                Minimum band <span className="font-normal" style={{ color: '#9AA29C' }}>(who sees this exercise)</span>
              </label>
              <select
                value={draft.minimum_band}
                onChange={(e) => setField('minimum_band', e.target.value)}
                className="rounded-[10px] px-[14px] py-[11px] text-[14px] outline-none transition-colors"
                style={INPUT_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E6E2')}
              >
                <option value="">All bands</option>
                <option value="mild">Mild+</option>
                <option value="moderate">Moderate+</option>
              </select>
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
                placeholder="Optional - leave blank to hide"
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

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div
          className="fixed bottom-[24px] left-[50%] -translate-x-[50%] z-50 flex items-center gap-[10px] rounded-[14px] px-[20px] py-[13px] shadow-lg"
          style={{ background: '#2A302D', border: '1px solid #3D4540' }}
        >
          <span className="text-[13px] font-semibold mr-[4px]" style={{ color: '#C5CCC8' }}>
            {selectedIds.size} selected
          </span>

          <button
            type="button"
            onClick={() => handleBulkPublish(true)}
            disabled={isPending}
            className="inline-flex items-center gap-[6px] text-[13px] font-semibold px-[13px] py-[7px] rounded-[9px] transition-colors disabled:opacity-50"
            style={{ background: '#2F7A6D', color: '#EAF3EF' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Publish
          </button>

          <button
            type="button"
            onClick={() => handleBulkPublish(false)}
            disabled={isPending}
            className="inline-flex items-center gap-[6px] text-[13px] font-semibold px-[13px] py-[7px] rounded-[9px] transition-colors disabled:opacity-50"
            style={{ background: '#3D4540', color: '#C5CCC8', border: '1px solid #4E5650' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="M8 12h8" />
            </svg>
            Set draft
          </button>

          <button
            type="button"
            onClick={() => { setSelectedIds(new Set()); setBulkError(null); }}
            className="text-[13px] hover:opacity-70 transition-opacity ml-[2px]"
            style={{ color: '#8A928E' }}
          >
            Clear
          </button>

          {bulkError && (
            <span className="text-[12.5px]" style={{ color: '#E8AA7A' }}>{bulkError}</span>
          )}
        </div>
      )}
    </div>
  );
}
