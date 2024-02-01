export function ArrowIcon({
  height,
  width,
  direction,
}: {
  direction: 'right' | 'left';
  width: string;
  height: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      style={{ transform: `rotate(${direction === 'right' ? '180' : '0'}deg)` }}
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}
