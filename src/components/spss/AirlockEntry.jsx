import { useEffect, useState } from 'react';
import { Beaker } from 'lucide-react';

const LINES = [
  'Sealing air gap',
  'Mounting Vault II case file',
  'Model access: denied by charter',
  'Bench live',
];

/** Brief airlock sequence played once when the analyst enters the Lit Lab. */
export default function AirlockEntry() {
  const [step, setStep] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timers = LINES.map((_, i) => setTimeout(() => setStep(i + 1), 260 * (i + 1)));
    timers.push(setTimeout(() => setGone(true), 1700));
    return () => timers.forEach(clearTimeout);
  }, []);

  if (gone) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#03090d] transition-opacity duration-500 ${
        step >= LINES.length ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <Beaker className="mx-auto h-8 w-8 animate-pulse text-cyan-300" />
        <div className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-cyan-200">The Lit Lab</div>
        <ul className="mt-5 space-y-1">
          {LINES.map((l, i) => (
            <li
              key={l}
              className={`font-mono text-[10px] uppercase tracking-wider transition-opacity duration-200 ${
                i < step ? 'text-cyan-400/70 opacity-100' : 'opacity-0'
              }`}
            >
              › {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}