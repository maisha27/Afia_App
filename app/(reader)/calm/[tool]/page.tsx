import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { GuidedSessionClient, type GuidedSessionProps, type Step } from './GuidedSessionClient';
import {
  OceanWaveAnimation,
  GroundingAnimation,
  BodyScanAnimation,
  LovingKindnessAnimation,
  SafePlaceAnimation,
} from '@/components/calm/tools';

/* ─── Step builder for repeating breathing cycles ─── */
function breathCycles(
  cycles: number,
  inDurationMs: number,
  inHeading: string,
  inSub: string,
  outDurationMs: number,
  outHeading: string,
  outSub: string,
): Step[] {
  const result: Step[] = [];
  for (let i = 0; i < cycles; i++) {
    result.push({ heading: inHeading, sub: inSub, durationMs: inDurationMs });
    result.push({ heading: outHeading, sub: outSub, durationMs: outDurationMs });
  }
  return result;
}

/* ─── Icons (serializable JSX — safe to pass as RSC props) ─── */
function OceanIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgb(159,201,188)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <path d="M2 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgb(208,167,128)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 11V6a2 2 0 0 1 4 0v4" />
      <path d="M10 10V4.5a2 2 0 0 1 4 0V10" />
      <path d="M14 10V6a2 2 0 0 1 4 0v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L4 14a2 2 0 0 1 3-2.6" />
    </svg>
  );
}

function BodyIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgb(208,167,128)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.4" />
      <path d="M12 7.5v7M8.5 10.5 12 12l3.5-1.5M9.5 21l2.5-6.5L14.5 21" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgb(180,170,220)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgb(180,170,220)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

/* ─── Tool configs ─── */
type ToolId = 'ocean-breath' | 'grounding' | 'body-scan' | 'loving-kindness' | 'safe-place';

type ToolConfig = Omit<GuidedSessionProps, 'icon'> & { icon: React.ReactNode; centerVisual: React.ReactNode };

const CONFIGS: Record<ToolId, ToolConfig> = {
  'ocean-breath': {
    toolId: 'ocean-breath',
    title: 'Ocean breath',
    accentRgb: '159,201,188',
    isBreathing: true,
    cycleLength: 2,
    steps: breathCycles(
      20,
      5000,
      'Breathe in',
      'Draw a slow breath in through your nose. Let your belly soften and rise.',
      10000,
      'Breathe out',
      'Let it go slowly through your mouth — twice as long as the inhale. Like a tide going out.',
    ),
    completionMessage: 'Well done.',
    completionDetail: 'Twenty rounds of ocean breathing — five minutes of slow, intentional calm. Your nervous system notices every exhale.',
    icon: <OceanIcon />,
    centerVisual: <OceanWaveAnimation accentRgb="159,201,188" />,
  },

  grounding: {
    toolId: 'grounding',
    title: '5-4-3-2-1 senses',
    accentRgb: '208,167,128',
    isBreathing: false,
    cycleLength: 1,
    steps: [
      {
        heading: 'Five things you can see',
        sub: 'Look around slowly. Name five things in this space — anything at all. Their colour, their edges, their texture.',
        durationMs: 40000,
      },
      {
        heading: 'Four things you can touch',
        sub: 'Feel your hands, your feet on the floor, your clothes against your skin. Notice each surface in turn.',
        durationMs: 35000,
      },
      {
        heading: 'Three things you can hear',
        sub: 'Close your eyes if that feels right. Listen for three separate sounds — close by or far away.',
        durationMs: 35000,
      },
      {
        heading: 'Two things you can smell',
        sub: 'Breathe gently through your nose. Notice any scent, however faint — even the quality of the air itself.',
        durationMs: 35000,
      },
      {
        heading: 'One thing you can taste',
        sub: 'Bring attention to your mouth. Notice any lingering taste. Just observe it, without judging.',
        durationMs: 35000,
      },
    ],
    completionMessage: 'You did it.',
    completionDetail: "Three minutes with all five senses. Grounding moves you out of your head and back into the room you're actually in.",
    icon: <HandIcon />,
    centerVisual: <GroundingAnimation accentRgb="208,167,128" />,
  },

  'body-scan': {
    toolId: 'body-scan',
    title: 'Body scan',
    accentRgb: '208,167,128',
    isBreathing: false,
    cycleLength: 1,
    steps: [
      {
        heading: 'Top of your head',
        sub: 'Begin here — the very top. Let your scalp soften. Notice any tingling or warmth, without trying to change it.',
        durationMs: 48000,
      },
      {
        heading: 'Face and jaw',
        sub: 'Soften your forehead. Let your eyebrows release. Notice how much the jaw holds — let it drop slightly.',
        durationMs: 48000,
      },
      {
        heading: 'Neck and shoulders',
        sub: "A lot of us carry our stress here. Let your shoulders fall away from your ears. Feel the weight of your arms.",
        durationMs: 48000,
      },
      {
        heading: 'Arms and hands',
        sub: 'Travel down each arm to your fingertips. Notice warmth, heaviness, any tingling. Let them rest completely.',
        durationMs: 48000,
      },
      {
        heading: 'Chest and upper back',
        sub: 'Feel each breath rise and fall here. Notice your heartbeat if you can. Everything is doing its quiet work.',
        durationMs: 48000,
      },
      {
        heading: 'Belly and lower back',
        sub: 'Let your belly be soft. Feel it move with each breath. If you notice tension, just breathe into it gently.',
        durationMs: 48000,
      },
      {
        heading: 'Hips and pelvis',
        sub: 'Notice the contact between your body and the chair or floor. Feel held. Let that support you.',
        durationMs: 48000,
      },
      {
        heading: 'Thighs and knees',
        sub: 'Travel through each leg. Notice any sensation — pressure, warmth, stillness. Just observe.',
        durationMs: 48000,
      },
      {
        heading: 'Lower legs and feet',
        sub: 'Down to your ankles and the soles of your feet. Feel where they rest. Notice each toe if you can.',
        durationMs: 48000,
      },
      {
        heading: 'Your whole body at once',
        sub: "Take a moment to sense everything together. You're here, right now. Breathe into all of it.",
        durationMs: 48000,
      },
    ],
    completionMessage: 'Well done.',
    completionDetail: 'Eight minutes travelling through your whole body. Awareness is the first step to softening.',
    icon: <BodyIcon />,
    centerVisual: <BodyScanAnimation accentRgb="208,167,128" />,
  },

  'loving-kindness': {
    toolId: 'loving-kindness',
    title: 'Loving-kindness',
    accentRgb: '180,170,220',
    isBreathing: false,
    cycleLength: 1,
    steps: [
      {
        heading: 'Start with yourself',
        sub: "Rest one hand on your heart. Quietly, in your own mind, say: 'May I be safe. May I be well. May I be at ease.' Repeat as many times as feels right.",
        durationMs: 90000,
      },
      {
        heading: 'Someone you love',
        sub: "Bring to mind someone who makes you feel warm — a person, a pet, anyone. Offer them the same: 'May you be safe. May you be well. May you be at ease.'",
        durationMs: 90000,
      },
      {
        heading: 'Someone you barely know',
        sub: "Think of someone you see but don't know well. They have a whole inner world, just like you. Offer it gently: 'May you be safe. May you be well. May you be at ease.'",
        durationMs: 90000,
      },
      {
        heading: 'All beings, everywhere',
        sub: "Let the warmth expand outward — to everyone, near and far, known and unknown. 'May all beings be safe. May all beings be well. May all beings be at ease.'",
        durationMs: 90000,
      },
    ],
    completionMessage: 'That was generous.',
    completionDetail: 'Six minutes of compassion — including for yourself. That is not always easy, and you did it.',
    icon: <HeartIcon />,
    centerVisual: <LovingKindnessAnimation accentRgb="180,170,220" />,
  },

  'safe-place': {
    toolId: 'safe-place',
    title: 'Safe place',
    accentRgb: '180,170,220',
    isBreathing: false,
    cycleLength: 1,
    steps: [
      {
        heading: 'Find your place',
        sub: 'Close your eyes and let somewhere arise — a place where you feel completely safe. Real or imagined. A room, a garden, a hillside, anywhere.',
        durationMs: 60000,
      },
      {
        heading: 'Look around',
        sub: 'Explore it slowly with your mind. Notice the light, the colours, how far you can see. Take it in without rushing.',
        durationMs: 60000,
      },
      {
        heading: 'Listen',
        sub: 'What sounds exist here, or what quality of quiet? Wind, water, birds, stillness. Let them settle you deeper.',
        durationMs: 60000,
      },
      {
        heading: 'Feel yourself there',
        sub: 'Notice what being here does to your body. Maybe your breathing has slowed. Maybe your shoulders have dropped.',
        durationMs: 60000,
      },
      {
        heading: 'Rest a while',
        sub: "You don't need to do anything. Just stay. This place is always available to you — you can return whenever you need it.",
        durationMs: 60000,
      },
    ],
    completionMessage: 'That place is yours.',
    completionDetail: 'Five minutes in somewhere safe. You can return here whenever you need it — it takes less than a second to arrive.',
    icon: <HomeIcon />,
    centerVisual: <SafePlaceAnimation accentRgb="180,170,220" />,
  },
};

/* ─── Page ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const config = CONFIGS[tool as ToolId];
  return { title: config ? `${config.title} — Afia` : 'Calm tool — Afia' };
}

export default async function GuidedCalmPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const config = CONFIGS[tool as ToolId];
  if (!config) redirect('/calm-tool');

  return <GuidedSessionClient {...config} />;
}
