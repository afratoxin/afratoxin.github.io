import { integerSumSpec } from './engines/integer-sum.mjs?v=20261026-structure';
import { countingSpecs } from './engines/counting.mjs?v=20261026-structure';
import { statisticsSpecs } from './engines/statistics.mjs?v=20261026-structure';
import { createExamSpec } from './engines/exam-limits.mjs?v=20261026-limits';
import { countingLimitProfiles } from './engines/counting-limits.mjs?v=20261026-limits';
import { statisticsLimitProfiles } from './engines/statistics-limits.mjs?v=20261026-limits';

// Keep the mathematical modules independently testable. Every model exposed by
// the application passes through the same exam-sized input and result policy.
const profiles={...countingLimitProfiles,...statisticsLimitProfiles};
export const specs=[integerSumSpec,...countingSpecs,...statisticsSpecs]
  .map(spec=>createExamSpec(spec,profiles[spec.id]));
export const specById=new Map(specs.map(spec=>[spec.id,spec]));
