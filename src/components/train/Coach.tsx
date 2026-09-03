export const Coach = ({ x, length, width, gradient, isFreight, gap }: any) => (
  <g>
    {/* Coupler */}
    <rect x={x + length} y={-2} width={gap} height={4} fill="#475569" />
    {/* Coach Body */}
    <rect x={x} y={-width/2} width={length} height={width} fill={gradient} rx="2" stroke="#0f172a" strokeWidth="0.5" />
    
    {/* Roof Details */}
    {!isFreight && (
      <rect x={x + 2} y={-1} width={length - 4} height={2} fill="#0f172a" opacity="0.4" />
    )}
    {isFreight && (
      <>
        <line x1={x + 2} y1={-width/2 + 2} x2={x + length - 2} y2={-width/2 + 2} stroke="#0f172a" strokeWidth="1" opacity="0.4" />
        <line x1={x + 2} y1={width/2 - 2} x2={x + length - 2} y2={width/2 - 2} stroke="#0f172a" strokeWidth="1" opacity="0.4" />
      </>
    )}
  </g>
);
