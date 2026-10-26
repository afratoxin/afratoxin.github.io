import { ballDrawSpec, distributionSpec, coloredBallProfiles } from './engines/colored-balls.mjs?v=20261026-challenge-grid';
import { integerSumSpec } from './engines/integer-sum.mjs?v=20261026-challenge-grid';
import { countingSpecs } from './engines/counting.mjs?v=20261026-challenge-grid';
import { statisticsSpecs } from './engines/statistics.mjs?v=20261026-challenge-grid';
import { createExamSpec } from './engines/exam-limits.mjs?v=20261026-challenge-grid';
import { countingLimitProfiles } from './engines/counting-limits.mjs?v=20261026-challenge-grid';
import { statisticsLimitProfiles } from './engines/statistics-limits.mjs?v=20261026-challenge-grid';

// Keep the mathematical modules independently testable. Every model exposed by
// the application passes through the same exam-sized input and result policy.
const profiles={...countingLimitProfiles,...statisticsLimitProfiles,...coloredBallProfiles};
export const specs=[integerSumSpec,...countingSpecs.filter(spec=>spec.id!=='selection'),ballDrawSpec,distributionSpec,...statisticsSpecs]
  .map(spec=>createExamSpec(spec,profiles[spec.id]));
export const specById=new Map(specs.map(spec=>[spec.id,spec]));
