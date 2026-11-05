"""Polish calculation narration without touching a mathematical expression.

Reasoning bridges and geometric readings are authored separately per question.
This final pass makes the retained calculation sentences use the same register.
"""
import re

VERBS={
 '한다':'해요','않는다':'않아요','된다':'돼요','얻는다':'얻어요','하자':'해 볼게요',
 '있다':'있어요','없다':'없어요','같다':'같아요','불가능하다':'불가능해요',
 '곱한다':'곱해요','센다':'세어요','바뀐다':'바뀌어요','탈락한다':'제외해요',
 '만족한다':'만족해요','생긴다':'생겨요','남는다':'남아요','놓는다':'놓을게요',
 '더한다':'더해요','아니다':'아니에요','가능하다':'가능해요','증가한다':'증가해요',
 '뺀다':'빼요','고른다':'골라요','필요하다':'필요해요','정해진다':'정해져요',
 '쓴다':'쓸게요','바꾼다':'바꿔요','갖는다':'가져요','성립한다':'성립해요',
 '작다':'작아요','제외한다':'제외해요','확인한다':'확인해 볼게요',
 '다르다':'달라요','넣는다':'넣어요','묶는다':'묶어 볼게요','만난다':'만나요',
 '둔다':'둘게요','해당한다':'해당해요','준다':'줘요','크다':'커요',
 '배분한다':'나눠 넣어요','남긴다':'남겨 둘게요','반복된다':'반복돼요',
 '맞는다':'맞아요','감소한다':'감소해요','결정된다':'정해져요','도달한다':'도달해요',
 '제외된다':'제외돼요','존재한다':'존재해요','발산한다':'발산해요',
 '대응한다':'대응해요','통과한다':'통과해요','놓인다':'놓여요','보정한다':'보정해요',
 '들어간다':'들어가요','사용한다':'사용해요','앉힌다':'앉혀요','고정한다':'고정할게요',
 '나눈다':'나눠요','나온다':'나와요','떨어진다':'떨어져요','유일하다':'하나뿐이에요',
 '머문다':'머물러요','늘린다':'늘려요','돌아온다':'돌아와요','실패한다':'실패해요',
 '달라진다':'달라져요','보자':'살펴볼게요','확보된다':'생겨요','합쳐진다':'합쳐져요',
 '설명된다':'설명할 수 있어요','선택한다':'선택해요','못한다':'못해요',
 '강제된다':'정해져요','나열된다':'나열돼요','커진다':'커져요',
 '추가된다':'추가돼요','달성된다':'얻어져요','취한다':'취해요','고정된다':'고정돼요',
 '이룬다':'이뤄요','추가한다':'추가해요','나타난다':'나타나요',
 '따라간다':'따라가요','대입한다':'대입해요','지워진다':'지워져요',
 '배열한다':'배열해요','포함된다':'포함돼요','줄었다':'줄었어요',
 '구별된다':'구별돼요','사라진다':'사라져요','벗어난다':'벗어나요',
 '상쇄된다':'서로 지워져요','미분가능하다':'미분가능해요','줄어든다':'줄어들어요',
 '돌려준다':'돌려줘요','표시한다':'표시해요','적용한다':'적용해요','가깝다':'가까워요',
 '정한다':'정할게요','뽑는다':'뽑아요','낸다':'내요','이긴다':'이겨요',
 '같아진다':'같아져요','보낸다':'보내요','이동한다':'이동해요',
 '찾는다':'찾아볼게요','단순해진다':'간단해져요','옮긴다':'옮겨요',
 '본다':'살펴볼게요','만든다':'만들어요','없앤다':'없애요','보인다':'보여요',
 '읽는다':'읽을 수 있어요','평행하다':'평행해요','주어진다':'주어져요',
 '줄인다':'줄일 수 있어요','좁혀진다':'줄어들어요','많아진다':'많아져요',
 '맞춘다':'정할게요','이어진다':'이어져요','켜진다':'양수가 돼요',
 '합친다':'합쳐 볼게요','드러난다':'나와요','가른다':'구별해요',
 '되돌아간다':'되돌아가요','묶인다':'묶여요','만들어진다':'만들어져요',
 '간단하다':'간단해요','따른다':'달려 있어요','겹친다':'겹쳐요',
 '명확해진다':'분명해져요','막는다':'막을 수 있어요','움직인다':'움직여요',
 '되찾는다':'구할게요','푼다':'풀어요',
}
NOUNS='양수 음수 하나 가지 개 정수 경우 형태 배수 기울기 최소 삼차함수 거리 짝함수 분포 수 홀수 홀짝 문제 둘 관계 짝수 개수 오른쪽 때 동치 까지 그대로 주기 반대 비 영점에서 차'.split()
END=r'(?=[.!?](?:\s|$)|$)'

def batchim(word):
    for c in reversed(word):
        if '가'<=c<='힣':return (ord(c)-0xac00)%28!=0
        if c.isdigit():return c in '013678'
        if c.isascii() and c.isalpha():return c.lower() in 'flmnrsx'
    return True

def math_batchim(expression):
    s=expression.strip('$ ').replace('\\left','').replace('\\right','')
    # A fractional exponent is still pronounced as a power (…제곱).
    if re.search(r'\^(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\d+)\s*$',s):return True
    # A Korean fraction ends with its numerator: denominator-분의-numerator.
    fractions=[]
    for m in re.finditer(r'\\d?frac',s):
        pos=m.end();args=[]
        for _ in range(2):
            while pos<len(s) and s[pos].isspace():pos+=1
            if pos>=len(s):break
            if s[pos]=='{':
                start=pos+1;depth=1;pos+=1
                while pos<len(s) and depth:
                    depth+=(s[pos]=='{')-(s[pos]=='}');pos+=1
                args.append(s[start:pos-1])
            else:args.append(s[pos]);pos+=1
        if len(args)==2 and not s[pos:].strip():fractions.append(args[0])
    if fractions:return math_batchim(fractions[-1])
    if s.endswith('\\pi') or s.endswith('\\infty'):return False
    return batchim(re.sub(r'\\[A-Za-z]+','',s))

def speak(text):
    maths=[]
    def hide(m):
        maths.append(m[0]);return '\x01'+str(len(maths)-1)+'\x02'
    s=re.sub(r'\$[^$]*\$',hide,text)
    # Naming a variable is different from asking the reader to calculate.
    s=s.replace('이라 하자','이라고 둘게요').replace('라 하자','라고 둘게요')
    s=s.replace('극한이 실패한다','극한이 존재하지 않아요')
    for old,new in [('않습니다','않아요'),('있습니다','있어요'),('없습니다','없어요'),('합니다','해요'),('됩니다','돼요'),('셉니다','세어요'),('만납니다','만나요')]:s=s.replace(old,new)
    s=re.sub(r'([가-힣]+)입니다'+END,lambda m:m[1]+('이에요' if batchim(m[1]) else '예요'),s)
    pattern='|'.join(map(re.escape,sorted(VERBS,key=len,reverse=True)))
    s=re.sub('(?:'+pattern+')'+END,lambda m:VERBS[m[0]],s)
    def math_copula(m):
        n=int(m[1]);return '\x01'+str(n)+'\x02'+('이에요' if math_batchim(maths[n]) else '예요')
    s=re.sub(r'\x01(\d+)\x02이다'+END,math_copula,s)
    s=re.sub(r'([가-힣]+)이다'+END,lambda m:m[1]+('이에요' if batchim(m[1]) else '예요'),s)
    s=re.sub(r'([ㄱ-ㅎ①-⑳])이다'+END,lambda m:m[1]+'이에요',s)
    for noun in sorted(NOUNS,key=len,reverse=True):
        s=re.sub(re.escape(noun)+'다'+END,noun+('이에요' if batchim(noun) else '예요'),s)
    s=re.sub(r'(뿐|씩|하나씩|가지뿐|개뿐|둘뿐)이다'+END,lambda m:m[1]+('이에요' if batchim(m[1]) else '예요'),s)
    s=re.sub(r'\x01(\d+)\x02다'+END,math_copula,s)
    s=s.replace('이므로','이니까')
    s=re.sub(r'\x01(\d+)\x02',lambda m:maths[int(m[1])],s)
    assert re.findall(r'\$[^$]*\$',s)==maths,(text,s)
    return s
