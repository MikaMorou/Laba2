import React from 'react';

type P = {size?: number; color?: string};
const base = (size: number) => ({width: size, height: size, viewBox: '0 0 64 64', fill: 'none', strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

export const Box: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><path d="M32 6 56 18v28L32 58 8 46V18z" /><path d="M8 18l24 12 24-12M32 30v28" /></svg>
);
export const Parcel: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><path d="M32 6 56 18v28L32 58 8 46V18z" /><path d="M20 12l24 12v10M8 18l24 12 24-12M32 30v28" /></svg>
);
export const Warehouse: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><path d="M6 26 32 8l26 18v30H6z" /><path d="M20 56V36h24v20M20 44h24M20 50h24" /></svg>
);
export const Order: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><rect x="12" y="8" width="40" height="50" rx="5" /><path d="M22 8v-2h20v2M21 26l5 5 9-10M21 44h22M21 36h6" /></svg>
);
export const Person: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><circle cx="32" cy="20" r="11" /><path d="M10 58c2-14 10-20 22-20s20 6 22 20" /></svg>
);
export const Market: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><path d="M6 24 12 8h40l6 16c0 5-4 8-8 8s-8-3-8-8c0 5-4 8-8 8s-8-3-8-8c0 5-4 8-8 8s-8-3-8-8z" /><path d="M12 34v22h40V34M26 56V44h12v12" /></svg>
);
export const Snow: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><path d="M32 6v52M9.5 19l45 26M9.5 45l45-26M26 10l6 6 6-6M26 54l6-6 6 6" /></svg>
);
export const Cards: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><rect x="6" y="14" width="34" height="42" rx="4" /><rect x="22" y="8" width="34" height="42" rx="4" fill="#0b1020" /><path d="M30 20h18M30 28h18M30 36h10" /></svg>
);
export const Sun: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><circle cx="32" cy="32" r="11" /><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.6 5.6M44.8 44.8l5.6 5.6M13.6 50.4l5.6-5.6M44.8 19.2l5.6-5.6" /></svg>
);
export const Cart: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><path d="M6 10h8l7 30h30l5-22H17" /><circle cx="26" cy="52" r="4" /><circle cx="46" cy="52" r="4" /></svg>
);
export const Clock: React.FC<P> = ({size = 96, color = '#fff'}) => (
  <svg {...base(size)} stroke={color}><circle cx="32" cy="32" r="25" /><path d="M32 16v16l11 7" /></svg>
);
export const Arrow: React.FC<P> = ({size = 48, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M8 24h30M28 12l12 12-12 12" /></svg>
);
