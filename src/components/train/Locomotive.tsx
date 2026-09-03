export const Locomotive = ({ x, length, width, gradient }: { x: number, length: number, width: number, gradient: string }) => (
  <>
    <rect x={x} y={-width/2} width={length} height={width} fill={gradient} rx="3" stroke="#0f172a" strokeWidth="0.5" />
    <rect x={x + 4} y={-width/2 + 2} width={6} height={width - 4} fill="#0f172a" opacity="0.6" />
  </>
);
