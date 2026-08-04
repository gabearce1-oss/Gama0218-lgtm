import { Flame, Brain, Mic, BookOpen, AlertTriangle, CheckSquare } from 'lucide-react';

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <Icon className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Rule({ label, children }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
      <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-36">{label}</span>
      <span className="text-sm text-muted-foreground">{children}</span>
    </div>
  );
}

const CHARACTER_ENGINE = [
  { system: 'Acute Stress Physiology', desc: 'Pulse spikes, lungs shorten, hands sweat, attention narrows. The body triages survival — it is not hosting a poetry festival.' },
  { system: 'Inherited Family Ritual', desc: 'Prayer voice of mother/abuela, the imagined judgment of his father, family duty in his bones. Treat as his inheritance, not a stand-in for every household.' },
  { system: 'Identity Pressure', desc: '"Not Mexican enough / not American enough." In fiction this becomes overperformance: trains harder, volunteers earlier, bleeds quieter, chases paternal approval.' },
];

const THREE_CHANNELS = [
  { channel: 'External', examples: 'Muzzle flash, dust, metal, a boot skid', color: 'text-red-400' },
  { channel: 'Internal', examples: 'Breath catching, heart hammering, sweat in palms, stomach dropping', color: 'text-amber-400' },
  { channel: 'Inheritance', examples: 'Prayer fragment, family saying, the father-standard he can never quite satisfy', color: 'text-violet-400' },
];

const AGENCY_CHAIN = ['Trigger', 'Body flare', 'Inherited phrase', 'Decision', 'Immediate win', 'Hidden cost'];

const AGENCY_EXAMPLE = [
  { step: 'Trigger', line: 'He hears the crack.' },
  { step: 'Body flare', line: 'Chest locks. Palms go wet.' },
  { step: 'Inherited phrase', line: 'Virgencita, cúbreme.' },
  { step: 'Decision', line: 'He moves too early.' },
  { step: 'Immediate win', line: 'He saves the man.' },
  { step: 'Hidden cost', line: 'Now his position is exposed.' },
];

const FOUR_STATES = [
  { state: 'Calm', desc: 'Breath, heart, hands, hearing, thought speed, default prayer or self-talk' },
  { state: 'Ready', desc: 'What tightens first, what he scans first, what memory rises' },
  { state: 'Redline', desc: 'Where sweat appears, how vision narrows, whether sound dims, whether language shortens' },
  { state: 'Aftermath', desc: 'What shakes late, what smell lingers, what prayer returns, what he cannot say aloud' },
];

const FIVE_VOICES = [
  { voice: 'Home voice', desc: 'Words he uses with mother, abuela, cousins' },
  { voice: 'Public voice', desc: 'How he sounds when he wants to pass or stay unreadable' },
  { voice: 'Command voice', desc: 'Clipped or not, English-heavy or not, profanity threshold' },
  { voice: 'Shame voice', desc: 'What language he falls into when he feels not enough' },
  { voice: 'Prayer voice', desc: 'Does it come in Spanish, English, or a mix?' },
];

const SCENE_CARD = [
  { field: 'Objective', question: 'What must he accomplish right now?' },
  { field: 'Obstacle', question: 'What makes that hard right now?' },
  { field: 'Body tell', question: 'What betrays his stress physically?' },
  { field: 'Family echo', question: 'Whose voice enters his head?' },
  { field: 'Identity wound', question: 'What "not enough" belief gets activated?' },
  { field: 'Choice', question: 'What does he do because of that wound?' },
  { field: 'Price', question: 'Who or what pays for the choice?' },
];

const REVISION_PASS = [
  'Did the body appear before the analysis?',
  'Did one specific sensory channel dominate, instead of all of them shouting at once?',
  'Did the prayer or family script change the action, not just decorate the prose?',
  'Did the line of dialogue fit the speaker\'s actual neighborhood and generation?',
  'Did any slang term come from the right country and social setting?',
  'Does the scene leave a bruise after the bullets stop?',
];

const SLANG_TERMS = [
  { term: 'pendejo', gloss: 'idiot / dumbass / fool (sometimes contemptuous)', warning: 'Mexico-wide + Central America; not always full-strength "asshole"' },
  { term: 'pinche', gloss: 'damned / lousy / fucking (intensifier before a noun)', warning: 'Mexico, Guatemala, Honduras, El Salvador, Nicaragua' },
  { term: 'chingar', gloss: 'to bother, wreck, violate, break, beat up — context-dependent', warning: 'Most flexible profanity verb in Mexican Spanish; large semantic range' },
  { term: 'chingado/s', gloss: 'goddamn / what the hell / what the fuck (exclamation)', warning: 'Violent or surprised tone' },
  { term: 'me vale madre', gloss: "I don't give a damn at all", warning: 'DEM: valer(le) madre(s)' },
  { term: 'joto', gloss: 'Derogatory anti-gay slur; also "coward" in some contexts', warning: 'Use ONLY to expose speaker\'s prejudice. Never as neutral slang.' },
  { term: 'puto', gloss: 'Anti-gay slur or coward insult in Mexico; unstable across region', warning: 'Highly unstable: different meanings in Mexico vs. Central America. Check country.' },
  { term: 'chingadera', gloss: 'This fucking thing / bullshit / dirty move', warning: 'Object or action sense; Mexico + El Salvador' },
  { term: 'culero', gloss: 'Coward / asshole / shitty depending on context', warning: 'Mexico, Guatemala, Honduras, El Salvador' },
];

const DIALECT_NOTES = [
  { dialect: 'Southwest Chicano English', note: 'Native ethnic variety — not "bad English," not a Spanish accent. Real signature: rhythm, stance, discourse texture, and when Spanish enters the line. Do not sprinkle cartoon phonetics.' },
  { dialect: 'Texas Chicano / Tejano', note: 'Not "generic Chicano with cowboy dust." Texas-born Latinos embrace local Texas English as a way of being Tejano. Let some of the line be Texan, not just "Latino."' },
  { dialect: 'Puerto Rican Spanish', note: 'A different sound world from East LA. Aspiration of /s/, lateralization of /r/, uvular /r/. A PR character must not sound like a Mexican American from South Texas.' },
  { dialect: 'Philly Puerto Rican', note: 'Hybrid with local Black Philadelphia AAE features (TH-stopping). Mashing Chicano, Puerto Rican, and South Philly into one blended accent rings false.' },
  { dialect: 'African American English (AAE)', note: 'Rule-governed dialect, not slang or error. Philadelphia AAE participates in local sound change differently from white Philly. "Jawn" is a Philly-specific all-purpose noun rooted in Black Philly slang.' },
  { dialect: 'Farm boy', note: 'Not one dialect — it is region plus occupation. Decide the region first. The believable signature: tool vocabulary, weather logic, understatement, and task-based speech. No theatrical misspellings.' },
];

const IDENTITY_IGNITION = [
  'The prayer he hears under pressure',
  'The father-rule he cannot escape',
  'The family duty he feels in his bones',
  'The sentence that captures "not Mexican enough / not American enough"',
  'The thing he overdoes to prove belonging',
  'The cost of that overperformance',
];

export default function BattleMysticism() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Flame className="w-4 h-4 text-amber-400" />
          Chicano Lens Gate · Voice + War Sensory
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Battle Mysticism Workbook</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Every combat scene must carry outside pressure, body sensation, and identity pressure at the same time. Atmosphere without agency is just perfume on a battlefield.
        </p>
      </div>

      <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-bold">The Origin — What Battle Mysticism Is</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          War literature has been told by Anglo-Saxons the majority of the time — Hemingway, Tim O'Brien in Vietnam. Homer, two thousand years ago, asked the question: <em className="text-foreground">what is man's sacrifice for the greater war?</em> They all try to answer that question. Battle Mysticism does not answer it. It takes the opposite route.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          It does not change the laws of physics. Bullets kill. Helicopters crash. Bodies die like anybody else's. But in Chicano culture — Dia de los Muertos, La Llorona, the belief that our ancestors are with us, that our grandmothers are praying with us — there is a spiritual frequency embedded in the upbringing. Dia de los Muertos is celebrated November 3rd. We take lunch. We sit with the dead. That is not decoration. That is worldview.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Chicanos are not accepted by Mexicans. Chicanos are not accepted by Americans. So Chicanos are battle-tested. We carry a demeanor where code-switching becomes a shield — a barrier to keep our identity intact in a world that keeps trying to erase it. Battle Mysticism is born from that position: standing between two cultures that both reject you, and finding in that wound a way to see the dead, hear the prayers, and fight.
        </p>
        <p className="text-sm text-amber-200/90 font-medium">
          When you read these battle events, something spiritual is happening at that moment of death. They are death events. But they carry a frequency. They die like anybody else — but the mysticism is that the ancestors are there, the grandmother's prayer is there, the border wound is there, and the code-switch is the shield that kept the identity alive long enough to fight. That is why Battle Mysticism works. It is not fantasy. It is the cultural truth of how a Chicano soldier experiences war.
        </p>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-4 mb-6">
        <p className="text-sm font-bold text-amber-400 mb-1">The Dramatic Formula</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {['Threat hits the body.', 'The body triggers inherited ritual.', 'Inherited ritual sharpens or distorts the next choice.'].map((s, i) => (
            <div key={i} className="rounded-md border border-amber-500/20 bg-background/40 px-3 py-2 text-center">
              <div className="font-mono text-xs text-amber-400 mb-1">Step {i + 1}</div>
              <p className="text-sm font-medium">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">That last line matters most. If the prayer, the father wound, and the border wound do not alter the next action, you have atmosphere but not agency.</p>
      </div>

      <Section icon={Brain} title="The Character Engine" subtitle="Three simultaneous systems inside one body">
        <div className="space-y-3">
          {CHARACTER_ENGINE.map(s => (
            <div key={s.system} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-48">{s.system}</span>
              <span className="text-sm text-muted-foreground">{s.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Flame} title="The Body Under Fire" subtitle="Three simultaneous channels — not all five senses at maximum">
        <p className="text-sm text-muted-foreground mb-4">
          Real high-stress perception <strong className="text-foreground">narrows</strong>. NIJ research: 82% of officers report diminished sound, 51% report tunnel vision. People under extreme pressure get less philosophically articulate and more immediate, fragmentary, and procedural. The body speaks before the intellect does.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {THREE_CHANNELS.map(c => (
            <div key={c.channel} className="rounded-lg border border-border bg-background/50 p-4">
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${c.color}`}>{c.channel} cue</div>
              <p className="text-xs text-muted-foreground">{c.examples}</p>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border bg-background/50 p-4">
          <p className="text-xs font-bold text-amber-400 mb-1">Writing Rule</p>
          <p className="text-sm italic">The body speaks before the intellect does. If a round cracks past his ear, do not give the reader an essay. Give them the body first. Neck tightens. Breath snags. Sweat spikes. Vision locks. Memory flashes in one phrase. Then choice.</p>
          <p className="text-xs text-muted-foreground mt-2">Note: Prayer can steady him <em>or</em> accuse him. The same prayer can sound like shelter in one scene and judgment in another. That is gold on the page.</p>
        </div>
      </Section>

      <Section icon={CheckSquare} title="Agency Chain" subtitle="Every action beat must answer this sequence">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
          {AGENCY_CHAIN.map((step, i) => (
            <div key={step} className="rounded border border-border bg-background/50 p-2 text-center">
              <div className="font-mono text-xs text-amber-400 mb-1">{i + 1}</div>
              <div className="text-xs font-bold">{step}</div>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Example Skeleton</p>
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
          {AGENCY_EXAMPLE.map(a => (
            <div key={a.step} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-violet-400 w-28 shrink-0">{a.step}</span>
              <span className="text-sm font-medium">{a.line}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">That is character agency. Not because he "had feelings," but because the feeling altered the move. If you cannot fill the choice and price lines, the scene is probably all pressure and no story.</p>
      </Section>

      <Section icon={BookOpen} title="War Sensory Baseline" subtitle="Build four states — then stay consistent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {FOUR_STATES.map(s => (
            <div key={s.state} className="rounded-lg border border-border bg-background/50 p-4">
              <div className="font-mono text-xs font-bold text-amber-400 mb-1">{s.state}</div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">The goal is consistency. Once you know his redline pattern, readers believe him everywhere else.</p>
      </Section>

      <Section icon={BookOpen} title="Identity Ignition Page" subtitle="Fill these before drafting any battle scene">
        <p className="text-xs text-muted-foreground mb-3">A strong answer does not generalize. It specifies. Not "he wants approval." Better: "If he hesitates, he can hear his father calling it softness."</p>
        <div className="space-y-2">
          {IDENTITY_IGNITION.map((line, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className="font-mono text-xs text-amber-400 w-4 shrink-0">{i + 1}</span>
              <span className="text-sm">{line}</span>
              <div className="flex-1 border-b border-dashed border-border/50 mx-2" />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Mic} title="Voice Discipline — Five Settings, Not One Fake Accent" subtitle="Each setting gets only three markers: one rhythm trait, one lexical habit, one code-switch trigger">
        <div className="space-y-3 mb-4">
          {FIVE_VOICES.map(v => (
            <div key={v.voice} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-28">{v.voice}</span>
              <span className="text-sm text-muted-foreground">{v.desc}</span>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs font-bold text-amber-400 mb-1">Craft Rule</p>
          <p className="text-xs text-muted-foreground">Do not write "Latino voice" or "urban voice." Write neighborhood, generation, school peers, and family language. That is where the truth lives.</p>
        </div>
      </Section>

      <Section icon={AlertTriangle} title="Dialect & Voice Map" subtitle="These are not interchangeable systems">
        <div className="space-y-3">
          {DIALECT_NOTES.map(d => (
            <div key={d.dialect} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
              <span className="font-mono text-xs font-bold text-sky-400 shrink-0 w-44">{d.dialect}</span>
              <span className="text-sm text-muted-foreground">{d.note}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={BookOpen} title="Scene Card" subtitle="Use before drafting any combat passage">
        <div className="space-y-3">
          {SCENE_CARD.map(s => (
            <div key={s.field} className={`flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 ${s.field === 'Choice' || s.field === 'Price' ? 'border-amber-500/30' : ''}`}>
              <span className={`font-mono text-xs font-bold shrink-0 w-28 ${s.field === 'Choice' || s.field === 'Price' ? 'text-red-400' : 'text-amber-400'}`}>{s.field}</span>
              <span className="text-sm font-medium">{s.question}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">If you cannot fill the Choice and Price lines, the scene is probably all pressure and no story.</p>
      </Section>

      <Section icon={CheckSquare} title="Revision Pass — Six Questions in Order">
        <div className="space-y-2">
          {REVISION_PASS.map((q, i) => (
            <div key={i} className={`flex items-start gap-3 border-b border-border/50 pb-2 last:border-0 ${i === 5 ? 'border-amber-500/30' : ''}`}>
              <span className={`font-mono text-xs font-bold shrink-0 w-6 ${i === 5 ? 'text-amber-400' : 'text-muted-foreground'}`}>{i + 1}</span>
              <span className={`text-sm ${i === 5 ? 'font-bold text-amber-200' : 'text-muted-foreground'}`}>{q}</span>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 mt-4">
          <p className="text-xs text-muted-foreground">If the answer to the last question is no, the scene may be loud but not haunting. <strong className="text-amber-400">And haunting is what you want.</strong></p>
        </div>
      </Section>

      <Section icon={AlertTriangle} title="Slang Field Guide" subtitle="Mexico and Central America are not one slang market — country of origin is non-negotiable">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4">Term</th>
                <th className="py-2 pr-4">Best Writing Gloss</th>
                <th className="py-2">Region & Warning</th>
              </tr>
            </thead>
            <tbody>
              {SLANG_TERMS.map(s => (
                <tr key={s.term} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono font-bold text-amber-400 whitespace-nowrap">{s.term}</td>
                  <td className="py-2 pr-4 text-xs">{s.gloss}</td>
                  <td className="py-2 text-xs text-muted-foreground">{s.warning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-3 mt-4">
          <p className="text-xs font-bold text-red-400 mb-1">Slang Rule</p>
          <p className="text-xs text-muted-foreground">Same word, different battlefield. If the speaker is queer, religious, military, older, younger, U.S.-born, or code-switching across audiences, the social charge of each term can change fast. Country of origin is non-negotiable before assigning the line.</p>
        </div>
      </Section>
    </div>
  );
}