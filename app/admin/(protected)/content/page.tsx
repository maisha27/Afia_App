'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

type ExStatus = 'Published' | 'Draft';

interface Exercise {
  title: string;
  steps: number;
  duration: string;
  status: ExStatus;
  description: string;
  stepList: string[];
}

const EXERCISES: Exercise[] = [
  {
    title: 'Naming the worry',
    steps: 4,
    duration: '6 min',
    status: 'Published',
    description:
      'A gentle way to put a shape around an anxious thought, so it feels less like a fact and more like something passing through.',
    stepList: [
      'Notice the worry and write it down, word for word',
      'Give it a shape and a size — describe it in physical terms',
      'Name what you feel underneath the worry',
      'Remind yourself: a worry is not a fact',
    ],
  },
  {
    title: 'The body scan',
    steps: 5,
    duration: '8 min',
    status: 'Published',
    description:
      'A slow, deliberate scan from feet to head, releasing held tension and returning awareness to the body.',
    stepList: [
      'Find a comfortable position, lying or sitting',
      'Close your eyes and take three slow breaths',
      'Bring attention to your feet — notice any sensation',
      'Slowly move upward: legs, abdomen, chest, arms, face',
      'Rest in the whole-body awareness for a moment',
    ],
  },
  {
    title: 'Checking the checking',
    steps: 3,
    duration: '5 min',
    status: 'Draft',
    description:
      'Noticing reassurance-seeking patterns and gently exploring what drives them.',
    stepList: [
      'Identify a checking behaviour you noticed today',
      'Ask: what are you afraid would happen if you didn\'t check?',
      'Sit with the uncertainty for 30 seconds',
    ],
  },
  {
    title: 'Riding the urge',
    steps: 4,
    duration: '7 min',
    status: 'Published',
    description:
      'Surfing an urge without acting on it — a core skill for compulsive patterns.',
    stepList: [
      'Name the urge as it arises',
      'Notice where you feel it in your body',
      'Breathe and observe it like a wave',
      'Let it pass without following it',
    ],
  },
  {
    title: 'What would you tell a friend',
    steps: 3,
    duration: '5 min',
    status: 'Published',
    description:
      'Turning self-compassion into a practical skill through the friend perspective.',
    stepList: [
      'Describe the situation to yourself as if talking to a friend',
      'Write the advice you\'d give them',
      'Read it back to yourself as if you were the friend',
    ],
  },
];

const STATUS_PILL: Record<ExStatus, string> = {
  Published: 'bg-[#E3F1EE] text-[#276358]',
  Draft: 'bg-[#FBF1E1] text-[#8A6410]',
};

function GripIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B7BCB8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0 cursor-grab"
    >
      <circle cx="9" cy="6" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
    </svg>
  );
}

export default function AdminContentPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tab, setTab] = useState<'exercises' | 'daily'>('exercises');

  const ex = EXERCISES[selectedIndex];

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="content" />

      <main className="flex-1 min-w-0 px-[30px] py-[30px] pb-[40px]">
        {/* Header row */}
        <div className="flex items-end justify-between mb-[18px]">
          <div className="flex items-center gap-[22px]">
            <h1
              className="font-heading text-[24px] font-semibold tracking-[-0.02em]"
              style={{ color: '#26302D' }}
            >
              Content
            </h1>
            <div className="flex items-center gap-[20px] pb-[2px]">
              <button
                type="button"
                onClick={() => setTab('exercises')}
                className="text-[13.5px] pb-[8px] transition-colors"
                style={
                  tab === 'exercises'
                    ? { fontWeight: 600, color: '#26302D', borderBottom: '2px solid #2F7A6D' }
                    : { fontWeight: 500, color: '#8A928D' }
                }
              >
                Exercises
              </button>
              <button
                type="button"
                onClick={() => setTab('daily')}
                className="text-[13.5px] pb-[8px] transition-colors"
                style={
                  tab === 'daily'
                    ? { fontWeight: 600, color: '#26302D', borderBottom: '2px solid #2F7A6D' }
                    : { fontWeight: 500, color: '#8A928D' }
                }
              >
                Daily practices
              </button>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-[8px] text-white font-heading text-[13.5px] font-semibold px-[16px] py-[10px] rounded-[9px] transition-opacity hover:opacity-90"
            style={{ background: '#2F7A6D' }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New exercise
          </button>
        </div>

        <div className="flex gap-[22px] items-start">
          {/* ── Exercise list ── */}
          <div
            className="w-[296px] flex-shrink-0 rounded-[14px] overflow-hidden"
            style={{ background: '#fff', border: '1px solid #E4E6E2' }}
          >
            <div
              className="px-[18px] py-[14px] text-[11px] font-semibold tracking-[0.06em] uppercase"
              style={{ color: '#9AA29C', borderBottom: '1px solid #F0F1EE' }}
            >
              {EXERCISES.length} exercises
            </div>

            {EXERCISES.map((item, i) => {
              const isActive = i === selectedIndex;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className="w-full text-left flex items-center gap-3 px-[18px] py-[14px] transition-colors hover:bg-[#F6FAF8]"
                  style={{
                    background: isActive ? '#F1F7F5' : undefined,
                    borderLeft: isActive ? '3px solid #2F7A6D' : '3px solid transparent',
                    borderBottom: i < EXERCISES.length - 1 ? '1px solid #F0F1EE' : undefined,
                    paddingLeft: isActive ? 15 : 18,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[14px] font-semibold mb-[2px] truncate"
                      style={{ color: isActive ? '#26302D' : '#3A403C' }}
                    >
                      {item.title}
                    </div>
                    <div className="text-[12px]" style={{ color: '#8A928D' }}>
                      {item.steps} steps &middot; {item.duration}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-[8px] py-[3px] rounded-full flex-shrink-0 ${STATUS_PILL[item.status]}`}
                  >
                    {item.status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Editor ── */}
          <div
            className="flex-1 min-w-0 rounded-[14px] px-[26px] py-[24px]"
            style={{ background: '#fff', border: '1px solid #E4E6E2' }}
          >
            {/* Editor header */}
            <div className="flex items-center justify-between mb-[22px]">
              <div
                className="text-[11px] font-semibold tracking-[0.06em] uppercase"
                style={{ color: '#9AA29C' }}
              >
                Editing exercise
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-[12px]" style={{ color: '#8A928D' }}>
                  Status
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-[6px] text-[12px] font-semibold px-[11px] py-[5px] rounded-full transition-opacity hover:opacity-80"
                  style={
                    ex.status === 'Published'
                      ? { color: '#276358', background: '#E3F1EE', border: '1px solid #CBE6DE' }
                      : { color: '#8A6410', background: '#FBF1E1', border: '1px solid #EFE0C2' }
                  }
                >
                  {ex.status}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Title + Duration */}
            <div className="flex gap-[16px] mb-[16px]">
              <div className="flex-[2] flex flex-col gap-[6px]">
                <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                  Title
                </label>
                <div
                  className="rounded-[10px] px-[14px] py-[11px] text-[14.5px]"
                  style={{
                    background: '#FBFBFA',
                    border: '1.5px solid #E4E6E2',
                    color: '#2E332F',
                  }}
                >
                  {ex.title}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                  Duration
                </label>
                <div
                  className="rounded-[10px] px-[14px] py-[11px] text-[14.5px]"
                  style={{
                    background: '#FBFBFA',
                    border: '1.5px solid #E4E6E2',
                    color: '#2E332F',
                  }}
                >
                  {ex.duration}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-[6px] mb-[22px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                Short description
              </label>
              <div
                className="rounded-[10px] px-[14px] py-[11px] text-[14px] leading-[1.5]"
                style={{
                  background: '#FBFBFA',
                  border: '1.5px solid #E4E6E2',
                  color: '#565D5A',
                }}
              >
                {ex.description}
              </div>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between mb-[12px]">
              <label className="text-[12.5px] font-semibold" style={{ color: '#4A514C' }}>
                Steps
              </label>
              <button
                type="button"
                className="text-[12.5px] font-semibold hover:opacity-70 transition-opacity"
                style={{ color: '#2F7A6D' }}
              >
                + Add step
              </button>
            </div>
            <div className="flex flex-col gap-[8px] mb-[24px]">
              {ex.stepList.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[12px] rounded-[10px] px-[14px] py-[12px]"
                  style={{ background: '#FBFBFA', border: '1px solid #EBEDE9' }}
                >
                  <GripIcon />
                  <span
                    className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: '#E3F1EE', color: '#276358' }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[13.5px]" style={{ color: '#3A403C' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Save / delete footer */}
            <div
              className="flex items-center justify-between pt-[18px]"
              style={{ borderTop: '1px solid #F0F1EE' }}
            >
              <button
                type="button"
                className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
                style={{ color: '#B0503F' }}
              >
                Delete exercise
              </button>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  className="text-[13.5px] font-semibold px-[18px] py-[9px] rounded-[9px] transition-colors hover:bg-[#F0F2EE]"
                  style={{ color: '#5F6863', border: '1px solid #DDE0DC', background: '#fff' }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="text-[13.5px] font-semibold text-white px-[18px] py-[9px] rounded-[9px] transition-opacity hover:opacity-90"
                  style={{ background: '#2F7A6D' }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
