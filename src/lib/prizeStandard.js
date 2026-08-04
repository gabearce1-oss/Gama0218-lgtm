// Verbatim-sourced facts about the Pulitzer Prize process, used here as a governance guardrail —
// not as an entry, a claim of eligibility, or a scoring formula.
// Sources: pulitzer.org "Administration of the Prizes" and "Frequently Asked Questions";
// Stuckey (1981) via followingpulitzer.wordpress.com; Cunningham (2012, The New Yorker).

export const PRIZE_DISCLAIMER = {
  heading: 'Standing disclaimer',
  lines: [
    'This manuscript is not published and is not entered in, submitted to, or competing for the Pulitzer Prize or any other award.',
    'Nothing on this page claims eligibility, nomination, finalist status, or endorsement. Under the Prize board\u2019s own language, only announced finalists may be called nominees.',
    'The Pulitzer process appears here for one reason: it is a documented, human-held judging procedure, and it is the standard this project measures its own governance against.',
    'The Canon Chart and the prose measurements are read to state what the data says. A model did not set these numbers and does not rank this work.',
  ],
};

// Facts taken from the source documents, each held with the reason it matters as a guardrail.
export const PROCESS_FACTS = [
  {
    fact: 'There are no set criteria for judging.',
    detail:
      'The category definitions are the only guidelines. It is left to the nominating juries and the Board to determine what makes a work "distinguished."',
    guardrail: 'A published prize does not run on a formula. Any fixed score this project produces is an internal craft measurement, never a merit verdict.',
    source: 'pulitzer.org, FAQ #3',
  },
  {
    fact: 'Jurors agree on criteria before reviewing anything.',
    detail:
      'Before they begin reviewing submissions, jurors must agree upon a set of criteria used to assess the entries \u2014 difficulty, novelty and impact, for example.',
    guardrail: 'Procedure is published before data is executed. Criteria may not be written after the numbers are seen.',
    source: 'pulitzer.org, Administration of the Prizes',
  },
  {
    fact: 'Judgment is held by named, qualified humans.',
    detail:
      'More than 100 distinguished judges serve on 22 juries; book juries currently hold five judges per panel. Service is limited to a two-year term to keep new viewpoints flowing.',
    guardrail: 'Scoring custody stays with humans. A model is not certified to sit on a jury and is not certified to score here.',
    source: 'pulitzer.org, Administration of the Prizes',
  },
  {
    fact: 'Every entry is examined before nomination.',
    detail:
      'Jury members, working intensively, examine every entry before making their nominations. Board members do not vote on an award unless they have reviewed the entries.',
    guardrail: 'No ranking without full review of the source text. Sampled or inferred reads do not qualify as a read.',
    source: 'pulitzer.org, Administration of the Prizes',
  },
  {
    fact: 'Conflict of interest forces recusal.',
    detail:
      'Jurors may not judge submissions from their own organizations, friends or family. Board members recuse themselves where a conflict might exist.',
    guardrail: 'The author cannot be the scorer of his own manuscript. Independent operators, or the number does not stand.',
    source: 'pulitzer.org, Administration of the Prizes',
  },
  {
    fact: 'Deliberations are confidential.',
    detail:
      'Deliberations and reviews remain confidential to protect the process from outside interference or influence; juror names were historically withheld to avoid lobbying.',
    guardrail: 'Review records are sealed while a review is live and released only with the finding, so a result cannot be lobbied into place.',
    source: 'pulitzer.org, Administration of the Prizes',
  },
  {
    fact: 'Three finalists, unranked, with no jury recommendation.',
    detail:
      'Each jury offers three nominations in no order of preference; the Board is free to choose any of them, request another finalist, or select an unnominated entry by three-fourths vote.',
    guardrail: 'A shortlist is not an ordering. This project reports bands and standing, not a single winner-style rank.',
    source: 'pulitzer.org, Administration of the Prizes; Cunningham (2012)',
  },
  {
    fact: 'No award is a legitimate outcome.',
    detail:
      'If all competitors fail to gain a majority, the prize may be withheld. Fiction has gone unawarded in 12 years, most recently 2012.',
    guardrail: '"Not established" is a permitted result here too. A blank finding beats a manufactured one.',
    source: 'pulitzer.org, FAQ #17; Graf (2018)',
  },
  {
    fact: 'Criteria have drifted repeatedly over a century.',
    detail:
      'The fiction standard moved from "wholesome atmosphere of American life" (1917) through several revisions to "distinguished fiction by an American author, preferably dealing with American life."',
    guardrail: 'Standards are historical artifacts, not constants. Any baseline cited here carries its date and its wording.',
    source: 'Stuckey (1981), pp. 3\u201325, via Following Pulitzer',
  },
  {
    fact: 'Jurors were rarely working practitioners.',
    detail:
      'From 1917 to 1974, only 5 of 155 fiction jurors had real experience as professional novelists; most were academics.',
    guardrail: 'Who judges shapes what wins. That is a bias in the record to be documented, not a reason to replace judges with a model.',
    source: 'Stuckey (1981), via Following Pulitzer',
  },
  {
    fact: 'Self-published books are eligible; digital-only are not.',
    detail:
      'Self-published books are eligible. Books must be published in hardcover or paperback; digital-only publication is not currently accepted.',
    guardrail: 'Format eligibility is recorded as a fact about the field, with no inference drawn about this unpublished manuscript.',
    source: 'pulitzer.org, FAQ #6',
  },
];

export const APA_SOURCES = [
  'The Pulitzer Prizes. (n.d.). Administration of the prizes. Columbia University. https://www.pulitzer.org/page/administration-prizes',
  'The Pulitzer Prizes. (n.d.). Frequently asked questions. Columbia University. https://www.pulitzer.org/page/frequently-asked-questions',
  'Stuckey, W. A. (1981). The Pulitzer Prize novels: A critical backward look (pp. 3\u201325). University of Oklahoma Press.',
  'Cunningham, M. (2012, July). Letter from the Pulitzer fiction jury: What really happened this year. The New Yorker.',
  'Graf, R. (2018, July 3). How novels are chosen for the Pulitzer Prize. Renaissance Men and Women (Medium).',
];