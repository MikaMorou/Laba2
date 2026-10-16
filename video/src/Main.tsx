import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import captions from './captions.json';
import * as I from './icons';

const FONT = 'Inter, "DejaVu Sans", sans-serif';
const BG = '#04060c';
const VIDEO_TOP = 256;

type Word = {w: string; start: number; end: number};
type Cap = {words: Word[]; start: number; end: number};
const caps = captions as Cap[];
const allWords: Word[] = caps.flatMap((c) => c.words);
const clean = (s: string) => s.toLowerCase().replace(/[.,]/g, '');

// Time (sec) of the first word starting with `text` at or after `after`.
const T = (text: string, after = 0): number => {
  const hit = allWords.find((w) => w.start >= after && clean(w.w).startsWith(text.toLowerCase()));
  if (!hit) throw new Error(`word not found: ${text} after ${after}`);
  return hit.start;
};

type Chip = {icon: React.FC<{size?: number; color?: string}>; label: string; t: number; cross?: number; color?: string};
type Scene = {start: number; end: number; title: string; subtitle: string; accent: string; chips?: Chip[]; counter?: {t0: number; t1: number; from: number; to: number; label: string}};

const BLUE = '#38bdf8';
const ORANGE = '#fbbf24';
const RED = '#f43f5e';
const GREEN = '#34d399';

const scenes: Scene[] = [
  {
    start: 0.1, end: 8.3, title: 'FBS', subtitle: 'Өзүңдүн склад', accent: BLUE,
    chips: [
      {icon: I.Warehouse, label: 'Өз складың', t: T('складыңар', 0)},
      {icon: I.Box, label: 'Товар', t: T('товар', 3)},
      {icon: I.Parcel, label: 'Упаковка', t: T('упаковка', 4.5)},
      {icon: I.Warehouse, label: 'WB склады', t: T('wildberries', 6), color: '#c084fc'},
    ],
  },
  {
    start: 8.4, end: 19.9, title: 'FBS', subtitle: 'Wildberries жеткирет', accent: BLUE,
    chips: [
      {icon: I.Parcel, label: 'Упаковка', t: T('упаковка', 10)},
      {icon: I.Warehouse, label: 'WB склады', t: T('wildberries', 12), color: '#c084fc'},
      {icon: I.Order, label: 'Заказ түшөт', t: T('заказ', 14)},
      {icon: I.Person, label: 'Клиентке', t: T('клиенттерге', 17.5), color: GREEN},
    ],
  },
  {
    start: 19.9, end: 28.9, title: 'FBS', subtitle: 'Эң жакшы жери', accent: GREEN,
    chips: [
      {icon: I.Box, label: 'Толтура товар', t: T('толтура', 22)},
      {icon: I.Snow, label: 'Заморозка', t: T('заморозка', 25), cross: T('заморозка', 25) + 0.8, color: RED},
      {icon: I.Warehouse, label: 'WB складына', t: T('wildberries-ке', 26), cross: T('киргизбейсиң', 26), color: RED},
    ],
  },
  {
    start: 29.0, end: 40.6, title: 'FBS', subtitle: 'Заказ болгондо гана', accent: GREEN,
    chips: [
      {icon: I.Order, label: 'Заказ түштү', t: T('заказ', 29)},
      {icon: I.Market, label: 'Рынокко барасың', t: T('рынокко', 35)},
      {icon: I.Person, label: 'Клиентке жөнөтөсүң', t: T('жөнөтөсүң', 36), color: GREEN},
    ],
  },
  {
    start: 40.7, end: 45.0, title: 'Мурун', subtitle: 'Рынокто карточкалар', accent: ORANGE,
    counter: {t0: T('толтура', 40), t1: T('карточка', 42), from: 0, to: 20000, label: 'карточка'},
  },
  {
    start: 45.1, end: 49.9, title: 'Мурун', subtitle: 'Бардыгын киргизчүбүз', accent: ORANGE,
    chips: [
      {icon: I.Market, label: 'Рыноктогу бардык товар', t: T('рынокто', 44.5)},
      {icon: I.Cards, label: 'Остаток коюлат', t: T('остаток', 47), color: ORANGE},
    ],
  },
  {
    start: 50.0, end: 59.2, title: 'Мурун', subtitle: 'Ар күнү эртең менен', accent: ORANGE,
    chips: [
      {icon: I.Sun, label: 'Эртең менен', t: T('эртең', 50)},
      {icon: I.Market, label: 'Рынокко барып', t: T('рынокко', 52)},
      {icon: I.Parcel, label: 'Упаковка', t: T('упаковка', 54)},
      {icon: I.Warehouse, label: 'WB склады', t: T('wildberries', 56), color: '#c084fc'},
    ],
  },
  {
    start: 59.3, end: 67.2, title: 'FBO', subtitle: 'Алдын ала сатып алуу', accent: '#fb923c',
    chips: [
      {icon: I.Cart, label: 'Сатып алуу', t: T('сатып', 61)},
      {icon: I.Parcel, label: 'Упаковка', t: T('упаковка', 62.5)},
      {icon: I.Warehouse, label: 'WB склады', t: T('wildberries', 63.4), color: '#c084fc'},
      {icon: I.Clock, label: 'Заказ күтөсүң', t: T('заказ', 64.5)},
    ],
  },
];

scenes.forEach((sc) => {
  if (sc.chips) sc.chips[0].t = sc.start + 0.4;
});

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const Backdrop: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const blobs = [0, 1, 2].map((i) => {
    const x = 540 + Math.sin(frame / 70 + i * 2.1) * 380;
    const y = 280 + Math.cos(frame / 90 + i * 1.7) * 150;
    return <div key={i} style={{position: 'absolute', left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, ${accent}22 0%, transparent 68%)`}} />;
  });
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 14; c++) {
      const pulse = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(frame / 18 + c * 0.7 + r * 0.9));
      dots.push(<div key={`${r}-${c}`} style={{position: 'absolute', left: 30 + c * 78, top: 30 + r * 70, width: 5, height: 5, borderRadius: 3, background: '#fff', opacity: pulse}} />);
    }
  }
  return (
    <AbsoluteFill style={{height: 760, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(#000 55%, transparent)', maskImage: 'linear-gradient(#000 55%, transparent)'}}>
      {blobs}
      {dots}
    </AbsoluteFill>
  );
};

const ChipView: React.FC<{chip: Chip; n: number; index: number; accent: string}> = ({chip, n, index, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - chip.t * fps;
  if (f < -2) return <div style={{width: 0}} />;
  const sp = spring({frame: f, fps, config: {damping: 12, stiffness: 140}});
  const op = interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const gap = n <= 3 ? 70 : 54;
  const w = (960 - (n - 1) * gap) / n;
  const col = chip.color ?? accent;
  const pulse = interpolate(f, [0, 30], [1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const crossP = chip.cross !== undefined ? interpolate(frame - chip.cross * fps, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const L = 120;
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {index > 0 && (
        <div style={{width: gap, display: 'flex', justifyContent: 'center', opacity: op, transform: `translateX(${(1 - sp) * -20}px)`}}>
          <I.Arrow size={n <= 3 ? 46 : 38} color="#94a3b8" />
        </div>
      )}
      <div
        style={{
          width: w, height: 300, borderRadius: 32, position: 'relative', opacity: op,
          transform: `translateY(${(1 - sp) * 40}px) scale(${0.7 + 0.3 * sp})`,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
          border: `2px solid ${col}`, boxShadow: `0 0 ${20 + 40 * pulse}px ${col}${pulse > 0.3 ? 'aa' : '44'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 12, boxSizing: 'border-box',
        }}
      >
        <div style={{opacity: crossP > 0 ? 0.55 : 1}}><chip.icon size={n <= 3 ? 118 : 100} color={col} /></div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: n <= 3 ? 34 : 31, lineHeight: 1.15, color: '#fff', textAlign: 'center', textDecoration: crossP > 0.9 ? 'line-through' : 'none', textDecorationColor: RED, textDecorationThickness: 4}}>
          {chip.label}
        </div>
        {crossP > 0 && (
          <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M12 12 L88 88" stroke={RED} strokeWidth={2.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{strokeWidth: 12}} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, crossP * 2)} />
            <path d="M88 12 L12 88" stroke={RED} strokeWidth={2.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{strokeWidth: 12}} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, Math.min(1, crossP * 2 - 1))} />
          </svg>
        )}
      </div>
    </div>
  );
};

const Counter: React.FC<{sc: Scene}> = ({sc}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = sc.counter!;
  const p = interpolate(frame / fps, [c.t0, c.t1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v = Math.round((c.from + (c.to - c.from) * p) / 10) * 10;
  const txt = v.toLocaleString('ru-RU').replace(/ /g, ' ');
  const s = spring({frame: frame - c.t0 * fps, fps, config: {damping: 14}});
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, height: 300, transform: `scale(${0.8 + 0.2 * s})`, opacity: Math.min(1, s * 2)}}>
      <I.Cards size={150} color={sc.accent} />
      <div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: `0 0 40px ${sc.accent}`}}>{txt}</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: sc.accent, marginTop: 6}}>{c.label}</div>
      </div>
    </div>
  );
};

const SceneView: React.FC<{sc: Scene}> = ({sc}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < sc.start - 0.05 || t > sc.end + 0.5) return null;
  const inP = interpolate(t, [sc.start, sc.start + 0.45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const outP = interpolate(t, [sc.end, sc.end + 0.35], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 60, top: 54, width: 960, opacity: inP * outP, transform: `translateY(${(1 - inP) * 30 - (1 - outP) * 20}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 28, height: 130}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 92, color: '#05070d', background: sc.accent, padding: '2px 36px', borderRadius: 26, boxShadow: `0 0 50px ${sc.accent}99`, letterSpacing: 2}}>{sc.title}</div>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: '#e2e8f0', lineHeight: 1.1}}>{sc.subtitle}</div>
      </div>
      <div style={{marginTop: 36, height: 300, display: 'flex', alignItems: 'center', justifyContent: sc.counter ? 'center' : 'flex-start'}}>
        {sc.counter ? <Counter sc={sc} /> : sc.chips!.map((ch, i) => <ChipView key={i} chip={ch} n={sc.chips!.length} index={i} accent={sc.accent} />)}
      </div>
    </div>
  );
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let idx = -1;
  for (let i = 0; i < caps.length; i++) {
    const next = caps[i + 1]?.start ?? 1e9;
    const showUntil = Math.min(next, caps[i].end + 0.5);
    if (t >= caps[i].start - 0.04 && t < showUntil) idx = i;
  }
  if (idx < 0) return null;
  const cap = caps[idx];
  const sp = spring({frame: frame - (cap.start - 0.04) * fps, fps, config: {damping: 14, stiffness: 220}});
  return (
    <div style={{position: 'absolute', left: 60, width: 960, top: 1560, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 30px', transform: `translateY(${(1 - sp) * 22}px) scale(${0.9 + 0.1 * sp})`, opacity: Math.min(1, sp * 1.5)}}>
        {cap.words.map((w, i) => {
          const active = t >= w.start && t < (cap.words[i + 1]?.start ?? cap.end + 0.5);
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT, fontWeight: 900, fontSize: 70, lineHeight: 1.18, color: active ? '#ffe14d' : '#fff',
                transform: active ? 'scale(1.04)' : 'scale(1)', display: 'inline-block',
                WebkitTextStroke: '9px #000', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.6)',
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cur = scenes.find((s) => t >= s.start - 0.05 && t <= s.end + 0.4) ?? scenes[0];
  const zoom = interpolate(frame, [0, 2016], [1, 1.035]);
  return (
    <AbsoluteFill style={{background: BG}}>
      <Backdrop accent={cur.accent} />
      <div style={{position: 'absolute', left: 0, top: VIDEO_TOP, width: 1080, height: 1664, overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile('source.mp4')} style={{width: 1080, height: 1664, transform: `scale(${zoom})`, transformOrigin: '50% 30%'}} />
        <AbsoluteFill style={{background: 'rgba(0,0,0,0.22)'}} />
        <AbsoluteFill style={{background: `linear-gradient(${BG} 0%, rgba(4,6,12,0.85) 8%, transparent 26%)`}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(transparent 1380px, rgba(0,0,0,0.78) 1560px, rgba(0,0,0,0.9) 100%)'}} />
      {scenes.map((s, i) => <SceneView key={i} sc={s} />)}
      <Subtitles />
    </AbsoluteFill>
  );
};
