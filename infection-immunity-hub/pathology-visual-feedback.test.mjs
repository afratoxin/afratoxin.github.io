import test from 'node:test';
import assert from 'node:assert/strict';
import {pathFeedback} from './pathology-ui.mjs';

const question={
 id:'visual-feedback-fixture',sourceScope:'library',choices:['CMV','HSV','HPV','VZV','Adenovirus'],answer:0,
 explanation:'이전의 중복 설명 문단',choiceNotes:['CMV 선지 근거','HSV 선지 근거','HPV 선지 근거','VZV 선지 근거','Adenovirus 선지 근거'],
 sourceRefs:[{doc:'path1',pages:[30]}],examRefs:[],externalRefs:[],
 imageClue:'커진 세포의 핵 내 봉입체와 halo',coreFact:'CMV → cytomegaly · owl’s-eye',contrast:'HPV의 halo는 핵 주변 세포질에 있다.'
};

test('library photo feedback presents the visible clue, core link and closest contrast without repeating the old paragraph',()=>{
 const html=pathFeedback(question,true);
 assert.match(html,/class="path-visual-feedback"/);
 assert.match(html,/<dt>사진 단서<\/dt>/);assert.match(html,/<dt>핵심 연결<\/dt>/);assert.match(html,/<dt>가장 헷갈리는 감별<\/dt>/);
 assert.ok(html.includes('<mark class="mark-yellow">'+question.imageClue+'</mark>'));
 assert.ok(html.includes(question.coreFact));
 assert.match(html,/HPV의 halo는 핵 주변/);
 assert.ok(!html.includes(question.explanation));
 assert.match(html,/선지별 해설/);assert.match(html,/병리 1 PDF 30쪽/);
});

test('visual feedback escapes photo text and ordinary pathology keeps its existing explanation',()=>{
 const html=pathFeedback({...question,imageClue:'<img src=x> 핵 & halo',coreFact:'핵 내 <tag>',contrast:'세포질 <script>'},false);
 assert.ok(html.includes('&lt;img src=x&gt; 핵 &amp; halo'));assert.doesNotMatch(html,/<img|<script|<tag>/);
 const ordinary=pathFeedback({...question,sourceScope:'lecture'},true);
 assert.ok(ordinary.includes(question.explanation));assert.doesNotMatch(ordinary,/path-visual-feedback/);
 const partial=pathFeedback({...question,contrast:''},true);
 assert.ok(partial.includes(question.explanation));assert.doesNotMatch(partial,/undefined/);
});
