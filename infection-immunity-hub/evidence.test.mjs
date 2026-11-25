import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceGroups} from './evidence.mjs';

test('CBL context pages and supporting lecture pages retain their document identity',()=>{
 const q={lecture:'cbl',sourcePages:[2,3],extraSources:[{document:'tumor',pages:[12,18]}],lectureBasis:{pages:[3],extraSources:[{document:'tumor',pages:[18]}]}};
 assert.deepEqual(sourceGroups(q),[{document:'cbl',pages:[2,3]},{document:'tumor',pages:[12,18]}]);
 assert.deepEqual(sourceGroups(q,{basisOnly:true}),[{document:'cbl',pages:[3]},{document:'tumor',pages:[18]}]);
});
test('ordinary lecture questions keep their source and overlapping references are deduplicated',()=>{
 assert.deepEqual(sourceGroups({lecture:'a',sourcePages:[7,8],lectureBasis:{pages:[7]}}),[{document:'a',pages:[7,8]}]);
 assert.deepEqual(sourceGroups({lecture:'a',sourcePages:[3,1],extraSources:[{document:'a',pages:[2,3]},{document:'b',pages:[8,8]}]}),[{document:'a',pages:[1,2,3]},{document:'b',pages:[8]}]);
});
