export * from '../question-label.mjs';
export * from '../answer-notes.mjs';
export * from '../source-image.mjs';
export * from '../research-store.mjs';
export * from '../research-workspace.mjs';
export * from '../writer-tools.mjs';
export * from '../design-profile.mjs';
export * from '../reference-search.mjs';
export * from '../semantic-search.mjs';
export * from '../year-analysis.mjs';

// These unrelated assets must never receive a question archive as mock data.
export function writerFixtureResponse(path) {
 if(String(path).includes('image-bounds.json'))return {ok:true,json:async()=>({items:{}})};
 if(String(path).includes('answer-exceptions.json'))return {ok:true,json:async()=>({records:[]})};
 return null;
}
