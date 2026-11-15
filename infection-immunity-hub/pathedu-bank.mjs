// Original clinical questions paired with selected teaching-library slides.
// Image identification and visible fields are verified separately during capture.
const LIBRARY_URL='https://pathedu.snu.ac.kr/library';
const src=(doc,...pages)=>({doc,pages});
const R={
 viral:[src('path1',25,29,30,32,33),src('lab',5,6,7,8,10,11,13,15,16)],
 tb:[src('path1',14,15),src('path2',19,21,22),src('lab',18)],
 ntm:[src('path1',15),src('path2',23),src('lab',19,20)],
 leprosy:[src('path2',24,25),src('lab',21,23,25)],
 actino:[src('path2',29,30),src('lab',26,27)],
 asper:[src('path2',37,41),src('lab',29,33,34)],
 mucor:[src('path2',37,42),src('lab',35,36,38)],
 candida:[src('path2',37,43),src('lab',39,40)],
 crypto:[src('path1',15),src('path2',37,44),src('lab',41,43,44,45)],
 pcp:[src('path2',45),src('lab',46,47,49)],
 cocci:[src('path2',38,39,44)]
};
const O={
 hsv:['HSV','다핵화·핵 molding·핵 내 변화와 반복 수포 병변을 연결한다.'],
 vzv:['VZV','수두·대상포진과 관련되며 조직 형태는 HSV와 겹칠 수 있다.'],
 cmv:['CMV','큰 감염세포와 핵 내 봉입체를 임상 맥락과 함께 해석한다.'],
 hpv:['HPV','사마귀성 상피 증식과 koilocytosis가 감별점이다.'],
 mcv:['Molluscum contagiosum virus','중앙 함몰 구진과 표피의 세포질 내 큰 봉입체가 특징이다.'],
 adeno:['Adenovirus','짙고 뭉개진 핵 내 변화와 호흡기 등의 임상 맥락을 연결한다.'],
 bk:['BK polyomavirus','신장이식·면역억제와 소변의 decoy cell을 연결한다.'],
 ebv:['EBV','B세포 감염과 반응성 비정형 CD8 T세포를 구분한다.'],
 tb:['M. tuberculosis complex','건락괴사성 육아종을 의심하되 직접 검사와 임상 맥락을 함께 해석한다.'],
 ntm:['비결핵항산균 (NTM)','결핵균 복합체와 M. leprae를 제외한 항산균군이며 형태만으로 균종을 확정하지 않는다.'],
 leprae:['M. leprae','피부·말초신경 침범과 숙주의 T세포 면역을 연결한다.'],
 nocardia:['Nocardia spp.','분지성 세균이며 약한 항산성을 보일 수 있어 임상·검사 맥락이 필요하다.'],
 actino:['Actinomyces spp.','분지성 세균 집락과 sulfur granule·화농·섬유화를 연결한다.'],
 asper:['Aspergillus spp.','상대적으로 가는 격막성 균사와 예각 분지가 대표 감별점이다.'],
 mucor:['Mucorales','넓고 불규칙한 균사·드문 격막·혈관 침범을 연결한다.'],
 candida:['Candida spp.','출아 효모와 가성균사를 점막 감염과 연결한다.'],
 crypto:['Cryptococcus spp.','피막성 효모·좁은 기저부 출아와 폐·중추신경계 감염을 연결한다.'],
 pcp:['Pneumocystis jirovecii','면역저하 폐렴의 폐포 내 거품성 물질과 낭 구조를 연결한다.'],
 cocci:['Coccidioides spp.','조직 내 구형체와 내부 endospore가 출아 효모와의 중요한 감별점이다.']
};
const captions=['피부 조직','자궁경부 조직','조직 표본','조직 표본 · 면역조직화학','피부 조직','소변 세포진','조직 표본','림프절 조직','림프절 조직 · 항산염색','피부 조직','피부 조직 · 항산염색','항산염색 대조표본','맹장 조직','폐 조직','폐 조직 · GMS','맹장 조직','맹장 조직 · GMS','맹장 조직 · PAS','자궁경부·질 세포진','조직 표본','조직 표본 · GMS','조직 표본 · PAS','폐 조직','기관지세척액','기관지세척액 · GMS','폐 조직'];
const questions=[];
const captureDimensions=[[900, 500], [900, 470], [800, 650], [800, 650], [900, 420], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [590, 430], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650]];
export const PATHEDU_PHOTOS=Object.fromEntries(captions.map((caption,index)=>{
 const n=String(index+1).padStart(2,'0');
 return ['edu-'+n,{src:'assets/pathology/edu-'+n+'.webp',alt:'병리교육 조직 표본 '+(index+1),caption,doc:'pathedu',page:index+1,slideNumber:index+1,width:captureDimensions[index][0],height:captureDimensions[index][1],sourceUrl:LIBRARY_URL,sourceTitle:'서울대학교 병리교육 라이브러리'}];
}));
function base(number,stem,refs,explanation){
 const n=String(number).padStart(2,'0');
 return {id:'path-edu-'+n,topic:'path-image',format:'mcq',kind:'integrated',stem,photos:['edu-'+n],explanation,keyClue:explanation,sourceRefs:refs,examRefs:[],refs:[],pages:refs[0].pages,externalRefs:[{title:'서울대학교 병리교육 라이브러리',url:LIBRARY_URL}]};
}
function organism(number,stem,keys,answerKey,explanation,refs){
 const q=base(number,stem,refs,explanation);q.ask='organism';q.choices=keys.map(k=>O[k][0]);q.answer=keys.indexOf(answerKey);q.choiceNotes=keys.map(k=>k===answerKey?explanation:O[k][1]);questions.push(q);
}
function statement(number,stem,pairs,explanation,refs){
 const q=base(number,stem,refs,explanation),offset=number%5;
 const rows=pairs.map(([trueStatement,falseStatement],i)=>({trueStatement,falseStatement,shownIsTrue:i===0,sourceRefs:refs,technique:'근접 사실 치환'}));
 const ordered=[...rows.slice(offset),...rows.slice(0,offset)];
 q.ask='correct';q.choiceEvidence=ordered;q.choices=ordered.map(e=>e.shownIsTrue?e.trueStatement:e.falseStatement);q.choiceNotes=ordered.map(e=>e.trueStatement);q.answer=ordered.findIndex(e=>e.shownIsTrue);questions.push(q);
}

organism(1,'손가락에 거친 표면의 구진이 생긴 환자다. 피부 상피의 유두상 증식과 핵 주변 투명 공간을 보이는 세포가 감별 단서다. 가장 관련된 바이러스는?',
 ['hpv','mcv','hsv','cmv','vzv'],'hpv','사마귀성 상피 증식과 koilocytosis를 HPV와 연결한다. 이 형태로 특정 HPV 유전형까지 구분하지는 않는다.',[src('path1',29),src('lab',5,6)]);
organism(2,'통증성 생식기 수포·궤양을 보인 환자의 자궁경부 표본이다. 다핵화·핵 molding과 ground-glass 핵 변화가 보고되었다. 임상과 형태를 함께 볼 때 가장 적절한 원인체는?',
 ['hsv','vzv','cmv','hpv','adeno'],'hsv','생식기 수포·궤양의 임상과 다핵화·핵 molding은 HSV를 지지한다. HSV와 VZV는 형태가 겹치므로 조직상 하나로 구분하지 않는다.',[src('path1',29,32),src('lab',13,15)]);
organism(3,'장기이식 후 면역억제 중인 환자다. 조직에서 주변보다 큰 감염세포와 clear halo를 동반한 핵 내 봉입체가 보고되었다. 가장 적절한 원인체는?',
 ['cmv','hsv','adeno','bk','ebv'],'cmv','세포 비대와 핵 내 큰 봉입체·clear halo는 면역저하 숙주의 CMV 감염을 지지하는 조합이다.',[src('path1',30),src('lab',7,8)]);
statement(4,'이식 환자의 조직에서 바이러스 감염이 의심되어 면역조직화학 검사를 시행했다. 이 검사와 결과 해석에 대한 설명으로 옳은 것은?',[
 ['IHC는 항원·항체 결합을 이용한다.','IHC는 핵산·탐침 결합을 이용한다.'],
 ['ISH는 핵산·탐침 결합을 이용한다.','ISH는 항원·항체 결합을 이용한다.'],
 ['CMV의 owl’s-eye 봉입체는 핵 내에 위치한다.','CMV의 owl’s-eye 봉입체는 세포질에 위치한다.'],
 ['IHC 결과는 조직 형태와 함께 해석한다.','IHC 결과는 표적 핵산의 분포로 해석한다.'],
 ['IHC 양성은 표적 항원의 위치를 나타낸다.','IHC 양성은 표적 핵산의 서열을 나타낸다.']
 ],'면역조직화학은 항원·항체 결합으로 표적 항원의 위치를 보여 준다. ISH의 핵산·탐침 결합과 구분하며, CMV의 고전적 owl’s-eye 봉입체는 핵 내에 위치한다.',[src('path1',15,30),src('lab',7,8)]);
questions.at(-1).externalRefs.push({title:'CDC PHIL · CMV owl’s-eye 핵 내 봉입체',url:'https://wwwn.cdc.gov/phil/Details.aspx?pid=23470'});
organism(5,'중앙이 함몰된 여러 개의 작은 구진이 있는 소아다. 표피 증식과 큰 세포질 내 봉입체를 임상 소견과 연결할 때 가장 적절한 바이러스는?',
 ['mcv','hpv','hsv','cmv','adeno'],'mcv','중앙 함몰 구진과 표피의 큰 세포질 내 molluscum body를 물사마귀의 poxvirus와 연결한다.',[src('path1',29),src('lab',10,11)]);
organism(6,'신장이식 후 면역억제 중인 환자의 소변 세포진이다. 악성세포와 감별이 필요한 decoy cell이 보고되었다. 강의에서 이 상황과 대표적으로 연결한 바이러스는?',
 ['bk','cmv','adeno','hpv','hsv'],'bk','신장이식·면역억제·소변 decoy cell은 BK polyomavirus 평가의 대표 맥락이다. 세포 모양만으로 확진을 대신하지는 않는다.',[src('path1',33),src('lab',16)]);
organism(7,'만성 기침과 체중 감소가 있고 흉막하 폐 병변과 폐문 림프절 병변이 함께 평가 중이다. 조직에서 건락괴사성 육아종이 보고되었다. 가장 먼저 연결할 원인균군은?',
 ['tb','ntm','leprae','actino','nocardia'],'tb','건락괴사성 육아종과 폐·폐문 림프절의 임상 맥락을 결핵과 연결한다. 육아종 자체가 균종 확정 검사는 아니다.',R.tb);
organism(8,'진행된 면역저하 환자의 림프절에서 다수의 항산균을 포함한 조직구가 보고되었다. 추가 동정에서 Mycobacterium 속으로 확인되었으며 결핵균 복합체와 M. leprae에는 속하지 않았다. 해당 범주는?',
 ['ntm','tb','leprae','nocardia','actino'],'ntm','NTM은 결핵균 복합체와 M. leprae를 제외한 항산균군이다. 조직 형태나 AFB 양성만으로 NTM의 개별 균종을 확정하지 않는다.',R.ntm);
questions.at(-1).externalRefs.push({title:'CDC · 비결핵항산균의 범위',url:'https://www.cdc.gov/nontuberculous-mycobacteria/about/index.html'});
statement(9,'림프절의 항산염색 결과를 숙주 상태 및 형태와 함께 해석하고 있다. 항산염색의 의미를 설명한 것으로 옳은 것은?',[
 ['AFB 양성 뒤 균종은 추가 검사로 구분한다.','AFB 양성 뒤 균종은 항산염색으로 구분한다.'],
 ['항산균은 항산염색에서 붉은 간균으로 보인다.','항산균은 항산염색에서 푸른 간균으로 보인다.'],
 ['MAC 감염의 조직구 안에 다수 AFB가 보일 수 있다.','MAC 감염의 림프구 안에 다수 AFB가 주로 보인다.'],
 ['면역저하 MAC 감염은 육아종 형성이 약할 수 있다.','면역저하 MAC 감염은 육아종 형성이 강해진다.'],
 ['AFB 염색은 항산성 미생물 평가에 이용한다.','AFB 염색은 항산균의 협막 평가에 이용한다.']
 ],'AFB는 항산성 미생물을 확인하는 단서다. 결핵균과 비결핵항산균의 구분에는 추가 동정 및 임상 정보가 필요하다.',R.ntm);
organism(10,'피부 감각 저하와 반복되는 무통성 상처가 있고, 다수의 피부 병변에서 포말성 조직구와 많은 항산균이 보고되었다. 약한 T세포 반응이라는 숙주 정보까지 연결할 원인균은?',
 ['leprae','tb','ntm','actino','nocardia'],'leprae','피부·말초신경 침범과 나종형의 약한 T세포 면역·많은 균·포말성 조직구를 M. leprae와 연결한다.',R.leprosy);
statement(11,'피부의 감각 저하를 보이는 환자에서 조직과 항산염색을 함께 비교한다. 한센병의 면역 스펙트럼을 설명한 것으로 옳은 것은?',[
 ['나종형은 결핵양형보다 T세포 면역이 약하다.','나종형은 결핵양형보다 T세포 면역이 강하다.'],
 ['나종형은 결핵양형보다 균 수가 많다.','나종형은 결핵양형보다 균 수가 적다.'],
 ['결핵양형은 나종형보다 육아종이 뚜렷하다.','결핵양형은 나종형보다 육아종이 약하다.'],
 ['나종형은 포말성 조직구가 두드러진다.','결핵양형은 포말성 조직구가 두드러진다.'],
 ['한센병의 신경 병변은 말초신경과 연결된다.','한센병의 신경 병변은 중추신경과 연결된다.']
 ],'한센병에서는 숙주의 T세포 면역이 강한 결핵양형과 약한 나종형을 비교한다. 나종형은 많은 균과 포말성 조직구가 두드러진다.',R.leprosy);
statement(12,'환자 조직과 함께 항산염색의 양성 대조표본을 확인했다. 양성 대조표본의 역할을 설명한 것으로 옳은 것은?',[
 ['양성 대조는 염색 반응의 성립을 확인한다.','양성 대조는 환자 병원체의 균종을 확인한다.'],
 ['환자 감염 여부는 환자 검체와 함께 해석한다.','환자 감염 여부는 대조 검체의 색으로 해석한다.'],
 ['AFB 양성의 균종은 추가 동정으로 구분한다.','AFB 양성의 균종은 항산염색 소견으로 구분한다.'],
 ['AFB 염색은 항산성 평가에 이용한다.','AFB 염색은 항산균의 협막 평가에 이용한다.'],
 ['대조표본은 검사 과정의 적절성을 평가한다.','대조표본은 환자 검체의 항산균 수를 평가한다.']
 ],'양성 대조는 염색 반응이 적절히 성립했는지 확인하는 자료다. 환자 검체의 양성 여부나 균종을 대신 결정하는 검체는 아니다.',[src('path1',15),src('lab',25)]);
organism(13,'맹장 주위의 만성 염증성 종괴를 절제했다. 화농성 괴사와 섬유화 속에 분지성 세균 집락·sulfur granule이 보고되었다. 가장 적절한 원인체는?',
 ['actino','nocardia','asper','mucor','candida'],'actino','분지성 세균 집락과 sulfur granule·화농·섬유화를 복부 방선균증과 연결한다. 균사처럼 보여도 세균성 병변이다.',R.actino);
organism(14,'항암치료 후 호중구 감소가 있는 환자에게 폐 병변이 생겼다. 비교적 가는 격막성 균사와 예각 분지가 감별 단서다. 가장 가능성이 높은 원인균군은?',
 ['asper','mucor','candida','crypto','pcp'],'asper','호중구 감소 숙주에서 격막성 균사·예각 분지는 Aspergillus를 지지한다. 조직만으로 Aspergillus의 개별 종을 정하지 않는다.',R.asper);
statement(15,'면역저하 환자의 폐 표본에 GMS 염색을 추가했다. 이 염색과 균사 형태의 해석으로 옳은 것은?',[
 ['GMS는 진균의 세포벽 구조를 강조한다.','GMS는 진균의 세포막 구조를 강조한다.'],
 ['Aspergillus는 격막성 균사를 보인다.','Aspergillus는 비격막성 균사를 보인다.'],
 ['Aspergillus는 예각 분지가 흔하다.','Aspergillus는 직각 분지가 흔하다.'],
 ['Mucorales는 격막이 상대적으로 드물다.','Mucorales는 격막이 상대적으로 촘촘하다.'],
 ['GMS 형태는 임상 맥락과 함께 해석한다.','GMS 형태는 진균 핵의 분포로 해석한다.']
 ],'GMS는 진균 세포벽 구조를 강조한다. 검게 보이는 구조를 숙주세포의 핵과 혼동하지 않고 균사의 폭·격막·분지를 함께 해석한다.',[src('path1',15),...R.asper]);
organism(16,'면역저하 환자의 맹장 병변에서 괴사가 확인되었다. 조직 검사에서 넓고 불규칙한 리본형 균사와 드문 격막이 보고되었다. 가장 가능성이 높은 원인체군은?',
 ['mucor','asper','candida','crypto','pcp'],'mucor','넓고 불규칙한 균사·드문 격막은 Mucorales를 지지한다. 이 감염은 위장관에도 생길 수 있으며 혈관 침범을 함께 살핀다.',R.mucor);
statement(17,'괴사성 맹장 병변의 GMS 표본에서 Mucorales 감염이 의심된다. 조직 손상과 형태를 설명한 것으로 옳은 것은?',[
 ['혈관 침범에 따른 혈전은 조직 관류를 낮춘다.','혈관 침범에 따른 혈전은 조직 관류를 높인다.'],
 ['Mucorales는 넓고 불규칙한 균사를 보인다.','Mucorales는 가늘고 불규칙한 균사를 보인다.'],
 ['Mucorales의 격막은 상대적으로 드물다.','Mucorales의 격막은 상대적으로 촘촘하다.'],
 ['당뇨는 침습성 Mucorales 감염의 위험 요인이다.','당뇨는 침습성 Mucorales 감염의 보호 요인이다.'],
 ['Mucorales는 진균으로 분류한다.','Mucorales는 조직에서 피막성 효모로 분류한다.']
 ],'침습성 Mucorales의 혈관 침범은 혈전·허혈·괴사와 연결된다. 괴사 조직과 균사 형태를 함께 평가한다.',R.mucor);
statement(18,'맹장 조직의 PAS 표본에서 진균 구조를 평가하고 있다. Mucorales와 다른 진균의 감별에 대한 설명으로 옳은 것은?',[
 ['Mucorales는 Aspergillus보다 균사가 넓다.','Mucorales는 Aspergillus보다 균사가 좁다.'],
 ['Mucorales는 격막이 상대적으로 드물다.','Mucorales는 격막이 상대적으로 촘촘하다.'],
 ['Aspergillus는 예각 분지가 흔하다.','Aspergillus는 직각 분지가 흔하다.'],
 ['Candida는 출아 효모와 가성균사를 보인다.','Candida는 넓은 리본형 균사를 보인다.'],
 ['PAS는 진균 세포벽 평가에 이용한다.','PAS는 진균 세포막 평가에 이용한다.']
 ],'진균 이름을 고를 때 염색 양성 여부뿐 아니라 균사 폭·격막·분지와 효모/가성균사 형태를 비교한다.',[src('path1',15),src('path2',37,41,42,43),src('lab',35,38)]);
organism(19,'질염 환자의 자궁경부·질 세포진이다. 출아 효모와 길게 연결된 가성균사가 함께 보고되었다. 가장 적절한 원인체군은?',
 ['candida','crypto','asper','mucor','pcp'],'candida','점막 감염에서 출아 효모와 가성균사를 함께 보이는 소견은 Candida를 지지한다. 세포진 형태로 개별 Candida 종을 확정하지 않는다.',R.candida);
organism(20,'면역저하 환자에게 폐 병변과 수막염이 동반되었다. 조직의 효모에서 피막과 좁은 기저부 출아가 감별 단서다. 가장 적절한 원인체군은?',
 ['crypto','candida','asper','mucor','pcp'],'crypto','피막성 효모·좁은 기저부 출아와 폐·중추신경계 감염을 Cryptococcus와 연결한다. C. neoformans와 C. gattii를 사진 하나로 구분하지 않는다.',R.crypto);
statement(21,'GMS에서 확인된 효모의 형태와 추가 피막 염색을 검토하고 있다. Cryptococcus 감별에 대한 설명으로 옳은 것은?',[
 ['Mucicarmine은 Cryptococcus 피막 평가에 도움된다.','Mucicarmine은 Aspergillus 격막 평가에 도움된다.'],
 ['GMS는 진균 세포벽을 강조한다.','GMS는 진균 세포막을 강조한다.'],
 ['Cryptococcus는 출아 효모 형태를 보인다.','Cryptococcus는 예각 분지 균사 형태를 보인다.'],
 ['Candida는 가성균사를 형성할 수 있다.','Candida는 격막이 드문 리본형 균사를 형성한다.'],
 ['Cryptococcus 형태는 임상 소견과 연결해 해석한다.','Cryptococcus 형태는 피막보다 격막을 기준으로 해석한다.']
 ],'Cryptococcus의 효모 형태를 확인한 뒤 피막 평가에는 mucicarmine이 도움이 된다. GMS로 보이는 진균 구조와 피막을 구분한다.',R.crypto);
statement(22,'PAS에서 효모 형태가 확인된 표본이다. 출아 방식과 균사 형태를 이용한 감별 설명으로 옳은 것은?',[
 ['Cryptococcus는 좁은 기저부의 출아를 보인다.','Cryptococcus는 넓은 기저부의 출아를 보인다.'],
 ['Candida는 출아 효모와 가성균사를 보인다.','Candida는 넓은 리본형 균사를 보인다.'],
 ['Aspergillus는 격막성 균사를 보인다.','Aspergillus는 비격막성 균사를 보인다.'],
 ['Mucorales는 격막이 상대적으로 드물다.','Mucorales는 격막이 상대적으로 촘촘하다.'],
 ['Pneumocystis 폐렴은 폐포 거품성 물질과 연결된다.','Pneumocystis 폐렴은 폐포 중격의 거품성 물질과 연결된다.']
 ],'PAS 양성인 진균을 구분할 때 효모의 출아·피막, 가성균사, 균사의 격막·폭을 각각 비교한다.',[...R.crypto,src('path2',41,42,43,45)]);
organism(23,'진행된 HIV 감염 환자가 마른기침과 호흡곤란을 보인다. 병리 보고서에 폐포 공간의 거품성 물질과 특수염색의 낭 구조가 기재되어 있다. 가장 적절한 원인체는?',
 ['pcp','crypto','candida','asper','mucor'],'pcp','면역저하 숙주의 폐포 내 거품성 삼출물과 낭 구조는 Pneumocystis 폐렴의 대표 조합이다.',R.pcp);
organism(24,'면역저하 환자의 호흡곤란을 평가하기 위해 기관지세척액을 검사했다. 폐포 내 거품성 물질과 병원체의 낭 형태가 감별 단서로 보고되었다. 가장 적절한 원인체는?',
 ['pcp','crypto','candida','asper','mucor'],'pcp','기관지세척액의 형태와 임상 맥락을 Pneumocystis 폐렴과 연결한다. 검체의 구조물을 숙주세포 핵으로 오인하지 않는다.',R.pcp);
statement(25,'면역저하 폐렴 환자의 기관지세척액 GMS 표본을 해석하고 있다. Pneumocystis의 구조와 병변을 설명한 것으로 옳은 것은?',[
 ['GMS의 낭 구조는 병원체 구조에 해당한다.','GMS의 낭 구조는 감염 숙주의 핵에 해당한다.'],
 ['거품성 물질은 폐포 공간에 모인다.','거품성 물질은 폐포 중격에 모인다.'],
 ['P. jirovecii는 진균으로 분류한다.','P. jirovecii는 격막성 균사형 진균으로 분류한다.'],
 ['HIV 면역저하는 PCP 위험을 높인다.','HIV 면역저하는 PCP 위험을 낮춘다.'],
 ['GMS에서 낭 구조는 검게 강조된다.','GMS에서 낭 구조는 붉게 강조된다.']
 ],'GMS에서 강조되는 낭 구조는 Pneumocystis의 구조다. 숙주 핵·폐포 공간의 거품성 물질과 구분해 해석한다.',R.pcp);
organism(26,'폐 병변을 평가 중인 환자다. 조직에서 내부에 여러 endospore를 포함한 두꺼운 벽의 구형체가 감별 단서로 보고되었다. 가장 적절한 원인체군은?',
 ['cocci','crypto','candida','asper','mucor'],'cocci','조직 내 endospore를 포함한 spherule은 Coccidioides의 중요한 단서다. 출아 효모나 분지하는 균사와 구분한다.',R.cocci);
questions.at(-1).externalRefs.push({title:'CDC PHIL · 구형체와 endospore 형태',url:'https://wwwn.cdc.gov/phil/Details.aspx?pid=29232'});
const pairedTeachingFields={3:4,8:9,10:11,14:15,16:17,20:21};
for(const [a,b] of Object.entries(pairedTeachingFields)){const q=questions.find(q=>q.id==='path-edu-'+String(a).padStart(2,'0'));q.photos.push('edu-'+String(b).padStart(2,'0'));}
questions.find(q=>q.id==='path-edu-19').photos.push('p21');
questions.find(q=>q.id==='path-edu-23').photos.push('p24');
questions.find(q=>q.id==='path-edu-25').photos.push('p24');
export const PATHEDU_QUESTIONS=Object.freeze(questions.map(q=>Object.freeze(q)));
