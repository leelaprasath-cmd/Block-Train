export const BrakeGlow = ({ totalLen, bodyWidth }: { totalLen: number, bodyWidth: number }) => (
  <g>
    <rect x={-totalLen/2 - 2} y={-bodyWidth/2 - 4} width={totalLen + 4} height={bodyWidth + 8} fill="#ef4444" opacity="0.18" rx="4" />
    <rect x={-totalLen/2 - 1} y={-bodyWidth/2 - 2} width={totalLen + 2} height={bodyWidth + 4} fill="#ef4444" opacity="0.3" rx="3" />
  </g>
);
