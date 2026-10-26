import { integerSumSpec } from './engines/integer-sum.mjs?v=20261026-structure';
import { countingSpecs } from './engines/counting.mjs?v=20261026-structure';
import { statisticsSpecs } from './engines/statistics.mjs?v=20261026-structure';

export const specs=[integerSumSpec,...countingSpecs,...statisticsSpecs];
export const specById=new Map(specs.map(spec=>[spec.id,spec]));
