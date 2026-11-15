// High-level interpretation of the supplied lecture table; physical PDF pages 4–6.
const questions=[];
function add(key,section,pages,stem,answer,rows,explanation,extra={}){
 const choices=rows.map(([choice])=>choice);
 questions.push({id:'table-enteric-media-'+key,lecture:'261105_02',format:'mcq',kind:'table',topic:'table-enteric-media',recallSection:'261105_02:'+section,stem,choices,answer:choices.indexOf(answer),choiceNotes:rows.map(([,note])=>note),explanation,keyClue:explanation,sourceRefs:[{doc:'261105_02',pages}],examRefs:[],...extra});
}
const parts={};
function part(key,title,what,how,why){parts['261105_02:'+key]={id:'261105_02:'+key,lecture:'261105_02',title,what,how,why};}
part('transport','검체 이송·검사 목적','검체를 옮기는 배지와 성상을 판독하는 배지의 목적을 구분합니다.','Transport→이송, MacConkey→젖당 발효처럼 이름과 목적을 왕복 회상합니다.','배지가 등장했다는 이유로 이송·선택·감별 검사를 같은 단계로 외우지 않습니다.');
part('ss','SS 배지·성분의 역할','SS의 억제 성분과 젖당 발효·H₂S 검출 성분을 나눕니다.','Bile salts·brilliant green·citrate와 thiosulfate·철 성분을 다른 칸에 넣습니다.','같은 배지에 들어 있는 성분이라도 억제·산성화·흑변의 역할이 다릅니다.');
part('kia','KIA·흑변과 가스','KIA의 탄수화물 발효·H₂S·가스를 서로 다른 관찰 소견으로 연결합니다.','검은 침전과 균열·기포의 유무를 따로 표시한 뒤 두 결과를 조합합니다.','검은 침전을 가스 발생으로, 배지 균열을 H₂S 생성으로 뒤바꾸지 않습니다.');

add('transport-purpose','transport',[4],'Transport media와 가장 직접적으로 연결되는 목적은?','검체 이송',[
 ['검체 이송','검체가 실험실로 옮겨지는 단계와 연결한다.'],['젖당 발효 감별','MacConkey의 감별 목적과 연결한다.'],['H₂S 생성 감별','SS·KIA의 검출 항목과 연결한다.'],['혈청학적 항원 분류','O·H·K 항원 검사와 연결한다.'],['항균제 감수성 판정','항균제 감수성검사의 목적이다.']],
 'Transport는 검체 이송에, MacConkey·SS·KIA는 해당 성상 판독에 연결한다. 강의는 장내세균이 일반 배지에서도 잘 자란다고 설명한다.');
add('diagnostic-purpose','transport',[4,5],'일반 배지에서 자란 장내세균을 MacConkey의 감별 원리로 비교할 때 주된 항목은?','젖당 발효',[
 ['젖당 발효','Lactose와 neutral red로 감별하는 항목이다.'],['H₂S 생성','Thiosulfate와 철 성분의 흑변으로 판단한다.'],['가스 생성','KIA의 균열·기포 등과 연결한다.'],['O 항원형','혈청학적 분류와 연결한다.'],['항균제 감수성','약제에 대한 별도 검사 결과이다.']],
 '일반 배지에서의 성장과 MacConkey에서의 젖당 발효 감별은 서로 다른 정보이다.');

add('mac-inhibition','media',[5],'강의의 MacConkey에서 bile salts·crystal violet의 주된 역할은?','그람양성균 성장 억제',[
 ['그람양성균 성장 억제','강의에 제시된 선택 성분의 역할이다.'],['그람음성균 성장 억제','주된 억제 대상을 바꾼 보기이다.'],['젖당 발효 산성화 표시','Neutral red의 지시약 역할이다.'],['H₂S 생성 흑변 표시','Thiosulfate·철 성분의 검출과 연결한다.'],['가스 생성 균열 표시','KIA의 기포·균열 관찰과 연결한다.']],
 'Bile salts·crystal violet은 선택성, lactose·neutral red는 젖당 발효 감별에 연결한다.');
add('mac-color-pair','media',[4,5],'MacConkey에서 젖당 발효(+) / 발효(−)의 대표 집락 색 조합은?','붉은색 / 투명',[
 ['붉은색 / 투명','젖당 발효 산성화로 붉은색·분홍색이 나타난다.'],['투명 / 붉은색','발효 양성과 음성의 색을 뒤집었다.'],['검은색 / 투명','H₂S 관련 흑변을 젖당 발효 색으로 바꾸었다.'],['붉은색 / 검은색','젖당 비발효를 H₂S 생성과 같은 뜻으로 바꾸었다.'],['투명 / 검은색','젖당 발효 양성의 색과 H₂S 소견을 혼동했다.']],
 'MacConkey의 붉은색·분홍색은 젖당 발효, 투명·무색은 대표적인 비발효 소견이다. 흑변은 별도의 H₂S 검출과 구분한다.');
add('mac-lactose-pair','media',[4],'대표적인 젖당 발효 기회감염균 조합은?','Klebsiella · Enterobacter',[
 ['Klebsiella · Enterobacter','강의 표에서 젖당 발효 기회감염균으로 함께 제시된다.'],['Klebsiella · Proteus','Proteus는 강의 표의 젖당 비발효 칸이다.'],['Enterobacter · Shigella','Shigella는 대표적인 젖당 비발효균이다.'],['Proteus · Yersinia','두 균 모두 강의 표의 젖당 비발효 쪽이다.'],['Salmonella · Shigella','두 균은 젖당 비발효 장병원균의 대표 조합이다.']],
 'E. coli와 대표적인 Klebsiella·Enterobacter의 젖당 발효를 Salmonella·Shigella·Yersinia·Proteus의 비발효와 비교한다.');
add('serratiacitrobacter','media',[4],'첨부 강의표에서 Serratia·Citrobacter를 함께 배치한 칸은?','기회감염균 · 젖당 발효',[
 ['기회감염균 · 젖당 발효','첨부 표의 분류를 그대로 읽은 조합이다.'],['기회감염균 · 젖당 비발효','첨부 표의 Proteus 위치와 바꾼 조합이다.'],['장병원균 · 젖당 발효','첨부 표의 병원성 E. coli 위치와 바꾼 조합이다.'],['장병원균 · 젖당 비발효','첨부 표의 Salmonella·Shigella·Yersinia 위치이다.'],['장병원균 · H₂S 생성','표의 젖당 발효 축을 H₂S 축으로 바꾼 보기이다.']],
 '이 문항은 첨부 강의표의 배치를 묻는다. 실제 S. marcescens는 보통 젖당 비발효이며 Citrobacter는 균종·균주에 따른 차이가 있어, 두 속을 임상에서 일률적 젖당 양성으로 단정하지 않는다.',
 {note:'강의표 암기와 실제 검사 성상의 변이를 구분하세요. 표의 E. coli 표기는 병원성 대장균 맥락이며 모든 E. coli가 병원균이라는 뜻은 아닙니다.',externalRefs:[{title:'Thermo Fisher · 균종별 젖당 반응 해석표',url:'https://documents.thermofisher.com/TFS-Assets/MBD/Instructions/IFU21108.pdf'}]});
add('mac-enteropathogens','media',[4],'강의표의 젖당 비발효 장병원균 조합은?','Salmonella · Shigella · Yersinia',[
 ['Salmonella · Shigella · Yersinia','첨부 표의 비발효 장병원균 칸에 해당한다.'],['Salmonella · Shigella · E. coli','E. coli를 젖당 비발효 칸으로 바꾸었다.'],['Klebsiella · Enterobacter · E. coli','대표적인 젖당 발효 조합이다.'],['Proteus · Klebsiella · Enterobacter','기회감염균의 발효·비발효가 섞인 조합이다.'],['Yersinia · Klebsiella · E. coli','Yersinia와 대표 젖당 발효균을 섞은 조합이다.']],
 '강의표는 Salmonella·Shigella·Yersinia를 젖당 비발효 장병원균으로 묶고, Proteus는 비발효 기회감염균 칸으로 구분한다.');
add('mac-proteus','media',[4],'첨부 강의표에서 Proteus의 분류 조합은?','기회감염균 · 투명 집락',[
 ['기회감염균 · 투명 집락','강의표의 젖당 비발효 기회감염균 위치이다.'],['기회감염균 · 붉은 집락','젖당 발효 기회감염균 위치와 바꾸었다.'],['장병원균 · 투명 집락','젖당 비발효 장병원균 위치와 바꾸었다.'],['장병원균 · 붉은 집락','첨부 표의 병원성 E. coli 위치와 바꾸었다.'],['기회감염균 · 검은 집락','젖당 비발효 판독을 H₂S 흑변으로 바꾸었다.']],
 'Proteus는 강의의 MacConkey 분류에서 젖당 비발효에 따른 투명 집락과 연결한다. 투명 집락은 H₂S의 유무를 뜻하지 않는다.');

add('ss-inhibitors','ss',[5],'SS 배지에서 강의가 제시한 억제 성분 조합은?','Bile salts · brilliant green · citrate',[
 ['Bile salts · brilliant green · citrate','SS의 선택 성분 조합이다.'],['Bile salts · crystal violet · neutral red','MacConkey 선택 성분과 젖당 발효 지시약을 섞었다.'],['Thiosulfate · ferric citrate · neutral red','H₂S 검출 성분과 산성화 지시약이다.'],['Lactose · neutral red · phenol red','발효 기질과 지시약을 억제 성분으로 바꾸었다.'],['Crystal violet · thiosulfate · citrate','MacConkey 억제 성분과 H₂S 관련 성분을 섞었다.']],
 'SS는 bile salts·brilliant green·citrate의 선택성과 thiosulfate·철 성분의 H₂S 검출 역할을 나누어 외운다.');
add('ss-h2s-components','ss',[5],'SS에서 H₂S 검출과 연결되는 성분 쌍은?','Sodium thiosulfate · ferric citrate',[
 ['Sodium thiosulfate · ferric citrate','황화수소 관련 검은 중심 소견의 검출 성분이다.'],['Bile salts · crystal violet','강의의 MacConkey 선택 성분이다.'],['Lactose · neutral red','젖당 발효 감별에 연결되는 기질·지시약이다.'],['Brilliant green · sodium citrate','SS의 억제 성분에 연결된다.'],['Peptone · sodium chloride','영양·삼투 환경과 연결되는 성분이다.']],
 'SS의 H₂S 검출 성분은 sodium thiosulfate·ferric citrate이며, neutral red를 통한 젖당 발효 색과 구분한다.');
add('ss-black','ss',[5],'SS에서 집락 중심이 검게 보이는 결과가 시사하는 것은?','H₂S 생성',[
 ['H₂S 생성','강의는 H₂S 관련 검은 중심 집락 소견을 설명한다.'],['젖당 발효','산성화에 따른 붉은색과 연결한다.'],['가스 생성','KIA의 균열·기포 등과 연결한다.'],['Indole 생성','별도의 생화학 반응이다.'],['Urease 활성','요소 분해와 관련된 별도 반응이다.']],
 'SS의 검은 중심은 H₂S 생성과 연결한다. 젖당 발효의 붉은색이나 KIA 배지의 가스 균열로 바꾸어 읽지 않는다.');
add('ss-role-pair','ss',[5],'SS의 neutral red / thiosulfate·철 성분에 대응하는 검사 항목은?','젖당 발효 / H₂S 생성',[
 ['젖당 발효 / H₂S 생성','지시약에 따른 산성화와 흑변을 구분한 조합이다.'],['H₂S 생성 / 젖당 발효','두 검출 성분의 역할을 뒤집었다.'],['가스 생성 / H₂S 생성','Neutral red의 역할을 가스 검출로 바꾸었다.'],['젖당 발효 / 가스 생성','Thiosulfate·철 성분의 역할을 가스 검출로 바꾸었다.'],['그람양성균 억제 / 젖당 발효','선택 성분과 감별 성분의 역할을 혼동했다.']],
 '같은 SS 배지 안에서도 neutral red는 산성화, thiosulfate·철 성분은 H₂S 관련 흑변을 읽는 역할이다.');

const gasResults=[['H₂S − · Gas +','검은 침전은 없고 가스 소견은 관찰된 조합이다.'],['H₂S + · Gas −','검은 침전은 있고 가스 소견은 없는 조합이다.'],['H₂S + · Gas +','흑변과 가스 소견이 함께 관찰된 조합이다.'],['H₂S − · Gas −','흑변과 가스 소견이 모두 없는 조합이다.'],['H₂S 판독 불가 · Gas +','흑변 유무가 주어지지 않았을 때와 구분한다.']];
add('kia-gas-only','kia',[6],'KIA에서 검은 침전은 없고 균열·기포가 관찰됐다. 판독 조합은?','H₂S − · Gas +',gasResults,
 'KIA의 검은 침전은 H₂S, 균열·기포는 가스 생성 소견으로 각각 판독한다.');
add('kia-h2s-only','kia',[6],'KIA에서 검은 침전이 있고 가스를 시사하는 균열·기포는 없다. 판독 조합은?','H₂S + · Gas −',gasResults,
 '제시된 관찰 결과는 H₂S 양성·가스 음성이다. 흑변 자체를 가스 발생 소견으로 판단하지 않는다.');
add('kia-indicator-pair','kia',[5,6],'MacConkey / KIA의 탄수화물 발효 지시약 조합은?','Neutral red / Phenol red',[
 ['Neutral red / Phenol red','MacConkey와 KIA의 지시약을 바르게 연결했다.'],['Phenol red / Neutral red','두 배지의 지시약을 뒤집었다.'],['Crystal violet / Phenol red','MacConkey의 억제 성분을 지시약으로 바꾸었다.'],['Neutral red / Ferric citrate','H₂S 검출 철 성분을 발효 지시약으로 바꾸었다.'],['Brilliant green / Crystal violet','두 선택 성분을 발효 지시약으로 바꾸었다.']],
 'MacConkey의 neutral red와 KIA의 phenol red를 구분하고, 두 지시약 모두 H₂S 검출 철 성분과는 다른 역할로 외운다.');
add('kia-observation-pair','kia',[6],'KIA의 검은 침전 / butt의 균열에 각각 대응하는 것은?','H₂S 생성 / 가스 생성',[
 ['H₂S 생성 / 가스 생성','서로 다른 두 판독 소견의 대응 관계이다.'],['가스 생성 / H₂S 생성','흑변과 균열의 의미를 뒤집었다.'],['젖당 발효 / H₂S 생성','검은 침전을 젖당 발효 색으로 바꾸었다.'],['H₂S 생성 / Indole 생성','균열의 의미를 별도 생화학 반응으로 바꾸었다.'],['가스 생성 / 젖당 발효','흑변과 균열을 각각 다른 검사 항목으로 바꾸었다.']],
 'KIA의 흑변과 가스 균열은 분리해서 읽는다. SS에서는 H₂S를 검은 중심 집락으로 표현하지만, KIA에서는 배지 내 검은 침전·흑변으로 표현한다.');

export const ENTERIC_MEDIA_QUESTIONS=Object.freeze(questions);
export const ENTERIC_MEDIA_PARTS=Object.freeze(parts);
