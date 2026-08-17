'use client';

import { AnimatedNumber } from '@/components/motion';

export function AnimatedStatTiles({
  tiles,
}: {
  tiles: { value: number; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px] mb-[22px]">
      {tiles.map((tile, i) => (
        <div
          key={tile.label}
          className="bg-white border border-[#E7E2DA] rounded-[14px] px-[18px] py-4 animate-fade-up"
          style={{ animationDelay: `${280 + i * 55}ms` }}
        >
          <div className="font-heading text-[26px] font-semibold text-[#2F5049]">
            <AnimatedNumber value={tile.value} duration={0.9} />
          </div>
          <div className="text-[12.5px] text-[#767D79] mt-0.5">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}
