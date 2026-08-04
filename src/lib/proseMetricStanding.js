// PROSE METRIC STANDING
//
// A finer distinction than the frequency-count reclassification. The 99th/97th percentile
// figures did not all come from syllabus counts. Some of them almost certainly came from
// advanced prose statistics — pacing, sentence-level decisions, retention modeling — which
// IS a real measurement of prose. The error was never that prose statistics are worthless.
// The error was bundling a prose measurement and a canon claim into one unexplained number.

export const BUNDLING_ERROR = {
  headline: 'The number measured one thing and claimed another.',
  likely_origin:
    'The percentile figures were most plausibly produced by advanced prose statistics — pacing decisions, sentence-level construction, retention and fatigue modeling of the kind used to forecast how a reader moves through a text.',
  what_that_is_worth:
    'That is a legitimate object of measurement, and a useful one. Prose can be measured. Pacing can be measured. Reader attention can be modeled. None of that is in dispute and none of it is being discarded.',
  where_it_failed: [
    {
      failure: 'It was presented as canon placement',
      detail:
        'A prose-statistics output was reported in the vocabulary of canon standing. Those are two different questions, and the second one no instrument can answer.',
    },
    {
      failure: 'It was never explained',
      detail:
        'No construct definition, no component list, no weights, no n, no version. The procedure that produced the percentile was never published, so the percentile cannot be reproduced or audited.',
    },
    {
      failure: 'It was bundled',
      detail:
        'Prose measurement, reception data, and merit judgement were compressed into a single figure. Once bundled, no reader can tell which part of the number came from which source — including the reader who produced it.',
    },
  ],
  standing:
    'The percentile figures are withdrawn as claims and retained as unexplained artifacts. The underlying prose measurement is not withdrawn — it is separated out, and re-enters only with a published procedure attached.',
};

// The two questions, kept permanently apart.
export const TWO_QUESTIONS = [
  {
    id: 'Q-PROSE',
    question: 'How does this prose actually perform on a reader?',
    answerable: true,
    instrument:
      'Advanced prose statistics: pacing, beat structure, readability, retention and fatigue curves, engagement and attention capture.',
    class: 'DERIVED-INTERNAL — measurable, reproducible, admissible once the procedure is published.',
    note:
      'This is the question of genuine standing interest. It is craft measurement, and it is where the manuscript can legitimately be held to a standard and improved.',
    className: 'border-emerald-500/30 bg-emerald-500/5',
  },
  {
    id: 'Q-CANON',
    question: 'Where does this text land in the Vietnam War canon?',
    answerable: false,
    instrument:
      'None. Canon placement is a collective institutional judgement issued over decades by readers, teachers, and archives — not a computable quantity.',
    class: 'CLOSED CLAIM CLASS — not measurable by this system at any confidence level.',
    note:
      'The interest in the question is legitimate and stays on the record as an interest. What is barred is any number that purports to answer it. The frame can describe who is currently taught; it cannot rule on who belongs.',
    className: 'border-red-500/30 bg-red-500/5',
  },
];

// Retained interests — the metrics the author names as mattering, kept as an explicit lane.
export const RETAINED_METRICS = [
  {
    metric: 'Reader fatigue',
    measures: 'Where attention degrades across a chapter — sentence density, beat repetition, sustained load without release.',
    why_it_matters: 'Fatigue is where a reader leaves. Locating it is actionable at the paragraph level.',
  },
  {
    metric: 'Pacing decisions',
    measures: 'Beat-to-beat movement: scene length, dwell time on interior passages, rate of new information.',
    why_it_matters: 'The pacing figures already in the ledger are craft data and survive the reclassification.',
  },
  {
    metric: 'Engagement & attention capture',
    measures: 'Where a chapter takes hold — openings, turns, and the passages that carry a reader forward.',
    why_it_matters: 'This is the element the percentile language was gesturing at, stated plainly instead of bundled.',
  },
  {
    metric: 'Content density',
    measures: 'Information and image load per passage, against the reader\u2019s capacity to absorb it.',
    why_it_matters: 'Distinguishes prose that is rich from prose that is merely crowded.',
  },
];

// The bar these metrics must clear to re-enter the record.
export const ADMISSION_BAR = [
  'The construct is defined before the run: what it measures, and what it does not.',
  'Components and weights are published, so a human can recompute the figure by hand from the source text.',
  'Every stored figure carries its instrument version, n, and variable class.',
  'The output is reported as prose measurement only. It never appears in a sentence about canon standing.',
];

export const PERSPECTIVE_NOTE =
  'The correction is one of perspective, not of ambition. Prose, pacing, fatigue, and engagement remain the working milestones \u2014 they are measurable and they are where the manuscript improves. Canon standing is held as an interest, not a target, because no instrument in this system can issue that judgement without manufacturing it.';