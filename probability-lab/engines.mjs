import { integerSumSpec } from './engines/integer-sum.mjs';
import { countingSpecs } from './engines/counting.mjs';
import { statisticsSpecs } from './engines/statistics.mjs';

export const specs=[integerSumSpec,...countingSpecs,...statisticsSpecs];
export const specById=new Map(specs.map(spec=>[spec.id,spec]));
