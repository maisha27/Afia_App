import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'mark' | 'wordmark' | 'full';
  href?: string;
  className?: string;
  priority?: boolean;
}

const configs = {
  mark: {
    src: '/Images/Official_Logo.png',
    alt: 'Afia',
    width: 45,
    height: 45,
  },
  wordmark: {
    src: '/Images/Official_WordMark.png',
    alt: 'Afia — Calm in Mind',
    width: 120,
    height: 40,
  },
  full: {
    src: '/Images/Official_Logo_with_wordmark.png',
    alt: 'Afia — Calm in Mind',
    width: 160,
    height: 64,
  },
};

export function Logo({
  variant = 'full',
  href = '/',
  className,
  priority = false,
}: LogoProps) {
  const config = configs[variant];

  const img = (
    <Image
      src={config.src}
      alt={config.alt}
      width={config.width}
      height={config.height}
      priority={priority}
      className={cn('object-contain', className)}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
      {img}
    </Link>
  );
}
