import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
import {profileFingerprint,validateProfile} from '../search-profile-format.mjs';
const root=new URL('../',import.meta.url),work=new URL('../../.search-work/',import.meta.url);
const source=await readFile(new URL('data/archive.json',root));const {questions}=JSON.parse(source);
const inputs=process.argv.slice(2),importParts=inputs.includes('--import-parts');
const files=importParts?['profiles-early.json','profiles-middle.json','profiles-recent.json','profiles-final.json'].map(name=>new URL(name,work)):inputs.length?inputs.map(path=>pathToFileURL(resolve(path))):[new URL('data/search-profiles.json',root)];
const records=(await Promise.all(files.map(path=>readFile(path,'utf8').then(JSON.parse)))).flat();
const profiles={};
for(const record of records){
 const question=questions.find(q=>q.id===record.id);if(!question||profiles[record.id])throw new Error('Unknown or duplicate profile '+record.id);
 if(record.fingerprint&&record.fingerprint!==profileFingerprint(question))throw new Error('Profile source changed; review its description and evidence: '+record.id);
 const profile={...record,fingerprint:record.fingerprint||profileFingerprint(question)};
 if(!validateProfile(question,profile))throw new Error('Invalid source evidence '+record.id);
 profiles[record.id]=profile;
}
if(records.length!==questions.length||questions.some(q=>!profiles[q.id]))throw new Error('Search profiles must cover every public question');
const metadata={formatVersion:1,questionCount:questions.length,sourceSha256:createHash('sha256').update(source).digest('hex'),profiles};
if(importParts)await writeFile(new URL('data/search-profiles.json',root),JSON.stringify(questions.map(q=>profiles[q.id]),null,2)+'\n');
await writeFile(new URL('search-profile-data.mjs',root),'// Source-backed descriptions for every public question; independent of search queries.\nexport const profileData='+JSON.stringify(metadata)+';\n');
console.log(`Validated ${records.length} source-backed search profiles`);
