import { Users } from 'lucide-react';
import CharacterVoiceCard from '@/components/voice/CharacterVoiceCard';
import CodeSwitchTriggerTable from '@/components/voice/CodeSwitchTriggerTable';
import SquadInteractionRules from '@/components/voice/SquadInteractionRules';
import SceneProtocol from '@/components/voice/SceneProtocol';
import VoiceTest from '@/components/voice/VoiceTest';
import { CHARACTERS, CODE_SWITCH_TRIGGERS, SQUAD_DYNAMICS, SCENE_PROTOCOLS, VOICE_TEST } from '@/lib/voiceProfiles';

export default function VoiceProfiles() {
  const tijuana = CHARACTERS.find(c => c.id === 'tijuana');
  const others = CHARACTERS.filter(c => c.id !== 'tijuana');

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Users className="w-4 h-4 text-amber-400" />
          Character Knowledge Base · Voice Profiles
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Squad Voice Bible</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Voice profiles, code-switch triggers, squad dynamics, and scene protocols for all four vectors. Regional voice is seasoning. Character is the meal.
        </p>
      </div>

      {/* Tijuana — featured profile */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">FEATURED</span>
          <h2 className="text-lg font-bold">Vector 4 — Tijuana</h2>
        </div>
        <CharacterVoiceCard character={tijuana} />
      </div>

      {/* Other squad members */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">Full Squad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {others.map(c => (
            <CharacterVoiceCard key={c.id} character={c} />
          ))}
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <CodeSwitchTriggerTable triggers={CODE_SWITCH_TRIGGERS} />
        <SquadInteractionRules dynamics={SQUAD_DYNAMICS} />
        <SceneProtocol protocols={SCENE_PROTOCOLS} />
        <VoiceTest criteria={VOICE_TEST} />
      </div>
    </div>
  );
}