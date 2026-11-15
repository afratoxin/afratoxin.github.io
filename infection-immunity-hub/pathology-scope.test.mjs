import test from 'node:test';
import assert from 'node:assert/strict';
import {LECTURE_QUESTIONS,TABLE_QUESTIONS} from './study-bank.mjs';
import {PATHOLOGY_TABLES} from './reference-tables.mjs';
const pathology=new Set(['261104_02','261104_03','261104_05']);
const excluded=/원충|기생충|절지동물|아메바|Entamoeba|Trichomonas|Paragonimus|Taenia|Demodex|Sarcoptes|낭미충|폐흡충|연충/i;
test('pathology lecture and recall practice omit the excluded organisms',()=>{
 const rows=[...LECTURE_QUESTIONS,...TABLE_QUESTIONS].filter(q=>pathology.has(q.lecture));
 assert.ok(rows.length>40);
 for(const q of rows)assert.doesNotMatch([q.stem,...q.choices,q.explanation].join(' '),excluded,q.id);
 assert.ok(!TABLE_QUESTIONS.some(q=>q.recallSection?.endsWith(':parasites')));
});
test('pathology reference tables contain only the requested infection scope',()=>{
 assert.ok(PATHOLOGY_TABLES.length>=5);
 assert.doesNotMatch(JSON.stringify(PATHOLOGY_TABLES),excluded);
});
