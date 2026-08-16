export default function AppLoading() {
  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Header skeleton */}
      <div className="px-6 py-9 lg:px-10">
        <div className="h-[12px] w-[110px] rounded-full bg-[#EAE4DB] animate-pulse mb-3" />
        <div className="h-[30px] w-[240px] rounded-full bg-[#EAE4DB] animate-pulse mb-7" />

        {/* Hero card skeleton */}
        <div
          className="rounded-[20px] mb-[22px] animate-pulse"
          style={{ height: 180, background: 'linear-gradient(115deg, #D8E8E2 0%, #C8DED7 100%)' }}
        />

        {/* Three tile skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-[22px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#F0EDE8] rounded-[16px] animate-pulse"
              style={{ height: 112, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Gentle note skeleton */}
        <div
          className="rounded-[18px] animate-pulse"
          style={{ height: 130, background: 'linear-gradient(115deg, #E6EFE9 0%, #EEE9E0 100%)', animationDelay: '200ms' }}
        />
      </div>
    </div>
  );
}
