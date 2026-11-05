"""Question-specific graph definitions, with explicit curves and domains.

These are mathematical diagrams, never generated bitmap approximations.
Numerical examples are labelled as examples; solved graphs are labelled as such.
"""
import math

def poly(*c):return {'type':'poly','c':list(c)}
def curve(fn,label,color=None,**kw):
    return dict(fn=fn,label=label,**({'color':color} if color else {}),**kw)
def point(x,y,label,**kw):return dict(x=x,y=y,label=label,**kw)
def area(fn,a,b,color='#83b4df',bottom=None):
    return dict(top=fn,x=[a,b],color=color,**({'bottom':bottom} if bottom else {}))
def graph(title,x,y,curves,**kw):return dict(title=title,x=x,y=y,curves=curves,**kw)
def level(title,x,y,curves,lo,hi,v,presets,**kw):
    return graph(title,x,y,curves,level=dict(min=lo,max=hi,value=v,step=.05,presets=[dict(label=l,value=n) for l,n in presets]),**kw)

def plots():
    D={};pi=math.pi;sqrt=math.sqrt
    D['slope-secant']={'kind':'cubic-slopes','mode':'secant','title':'할선 AP와 평행한 두 접선'}
    D['slope-contacts']={'kind':'cubic-slopes','mode':'contacts','title':'접점 위치는 접선 기울기를 맞추어 고른다'}
    D['slope-branches']={'kind':'cubic-slopes','mode':'branches','title':'연속인 접점 위치는 한 가지를 계속 따라간다'}
    D['slope-minimum']={'kind':'cubic-slopes','mode':'minimum','title':'할선의 최소 기울기는 A를 지나는 접선 AT'}
    D['slope-inflection']={'kind':'cubic-slopes','mode':'inflection','title':'A, 변곡점 M, 접점 T의 위치 관계'}
    D['2023-11-22-final']=graph('조건으로 결정한 곡선과 대응하는 점',[0,4.6],[-4,15],[
        curve(poly(1,-6,12,-3),'$f(x)=(x-2)^3+5$'),curve(poly(3,1),'A에서의 접선','#bd5144',dash=True),curve(poly(3,-3),'입력 3에서의 평행한 접선','#3d8b7c',dash=True)],
        points=[point(1,4,'A'),point(3,6,'g(1)의 접점'),point(2,5,'M',dy=22),point(0,-3,'f(0)',dx=8,dy=-8),point(4,13,'f(4)')],caption='변곡점 입력 2와 마지막 함수값 조건으로 결정한 실제 그래프입니다.')
    D['2021-06-a-18']=graph('교점을 풀지 않고 높이의 대소로 위치 좁히기',[-1.3,1.3],[-1,3],[
        curve({'type':'exp','base':2},'$y=2^x$'),curve(poly(-2,0,2),'$y=2-2x^2$','#bd5144'),curve(poly(1,1),'비교 직선 $y=x+1$','#658a51',dash=True)],verticals=[-.5,.5],caption='세 곡선의 위아래와 교점의 구간을 비교합니다.')
    D['2021-06-b-19']=level('구간 안 실근은 수평선과의 교점',[-2,2],[-2,42],[curve(poly(2,6,0,0),'$2x^3+6x^2$')],-2,12,4,[('접합 최소 높이',0),('왼쪽 끝 높이',8),('중간 높이',4)],caption='높이는 -a입니다. 표시한 닫힌구간의 끝점 교점도 근에 포함합니다.')
    D['2021-06-b-26']=graph('평균변화율과 접선 기울기를 맞추기',[-.4,3.8],[-2,22],[curve(poly(1,-3,5,0),'$f(x)-f(0)$'),curve(poly(5,0),'원점에서 기울기 5인 직선','#bd5144')],points=[point(0,0,'O'),point(3,15,'교점')],caption='수직 평행이동으로 f(0)을 지운 그림입니다. 할선 기울기는 변하지 않습니다.')
    left=poly(-3,-6,0);right=poly(2/3,0,-6,0)
    D['2021-06-b-30']=graph('같은 높이의 근과 내부 극값을 함께 보기',[-2.5,4],[-8,5],[curve(left,'왼쪽 조각',range=[-2.5,0]),curve(right,'오른쪽 조각','#bd5144',range=[0,4])],points=[point(-2,0,'-2',dy=20),point(0,0,'0',dy=20),point(3,0,'3',dy=20),point(-1,3,'최대'),point(sqrt(3),-4*sqrt(3),'최소',dy=20)],caption='조건으로 정한 계수에서 공통 높이 h(0)을 뺀 그래프입니다.')
    p=poly(1,0,1);l=poly(3,-1);top={'type':'max','items':[p,l]}
    D['2021-09-b-20']=graph('큰 함수값을 고르면 위쪽 포락선이 된다',[-.2,2.4],[-2,7],[curve(p,'$x^2+1$'),curve(l,'$3x-1$','#bd5144'),curve(top,'둘 중 큰 값','#4b8750',width=3.5)],fills=[area(top,0,2)],verticals=[1,2],caption='만나는 입력 1, 2에서 위쪽 식이 바뀝니다.')
    D['2021-09-b-26']=level('삼차곡선에 닿으면 중근이 생긴다',[-3,4],[-18,18],[curve(poly(1,-1,-8,0),'$x^3-x^2-8x$')],-16,12,-12,[('양의 k에 해당하는 접선',-12),('세 교점 예시',0)],caption='수평선의 높이는 -k입니다. 접한 근은 한 개의 서로 다른 근으로 셉니다.')
    f=poly(-1,-4,5)
    D['2021-09-b-28']=graph('누적적분이 증가하려면 쌓는 높이가 음수가 아니어야 한다',[0,1.4],[-3,6],[curve(f,'경계 a=5에서의 적분함수')],fills=[area(f,0,1)],points=[point(1,0,'끝점에서만 0',dx=-95,dy=20)],caption='끝점의 높이가 영이어도 구간 내부 높이가 양수라 누적량은 계속 증가합니다.')
    D['2021-11-b-27']=graph('위쪽 직선과 아래쪽 포물선 사이 넓이',[-.5,6.5],[-4,13],[curve(poly(1,-7,10),'포물선'),curve(poly(-1,10),'직선','#bd5144')],fills=[area(poly(-1,10),0,6,bottom=poly(1,-7,10))],points=[point(0,10,'교점'),point(6,4,'교점')])
    D['2022-example-09']=graph('원점에서 그은 두 접선',[-1.4,1.1],[-1.8,2.2],[curve(poly(-1,-1,1,0),'삼차곡선'),curve(poly(1,0),'원점에서의 접선','#bd5144'),curve(poly(1.25,0),'다른 접선','#548850')],points=[point(0,0,'O'),point(-.5,-.625,'다른 접점',dx=8,dy=22)])
    u=poly(1,0,-3,2)
    D['2022-example-12']=graph('모든 작은 구간의 적분을 양수로 만드는 경계',[0,2.3],[-1,8],[curve(u,'경계 k=2에서의 함수')],fills=[area(u,0,2)],points=[point(1,0,'한 점만 0',dy=23)],caption='가로축 아래 구간이 없고, 한 점에서만 영입니다.')
    v=poly(1,-6,9,-4)
    D['2022-example-14']=graph('속도가 영이어도 방향은 바뀌지 않을 수 있다',[0,5],[-5,9],[curve(v,'$v(t)=(t-1)^2(t-4)$')],points=[point(1,0,'중근: 부호 유지'),point(4,0,'단순근: 방향 전환',dx=-150,dy=22)],xlabel='t',ylabel='속도')
    D['2022-06-20']=graph('두 부호 변화가 겹치면 극값 하나가 사라진다',[1,7],[-5,14],[curve(poly(3,-24,45),"$f'(x)=3(x-3)(x-5)$")],points=[point(3,0,'3',dy=22),point(5,0,'5',dy=22)],verticals=[3,5],caption='누적적분 인수는 x=a에서 부호를 바꿉니다. a를 3 또는 5에 두면 그 점의 두 전환이 상쇄됩니다.')
    D['2022-09-20']=level('왼쪽 직선 하나와 오른쪽 삼차곡선의 세 교점',[-4,8],[-30,18],[curve(poly(-7,0),'왼쪽 조각',range=[-4,0]),curve(poly(1,-9,15,0),'오른쪽 조각','#bd5144',range=[0,8])],-2,10,3,[('네 교점',3),('접하는 경계',7),('접합점 경계',0)])
    D['2022-09-22']=graph('절댓값은 단순근에서 꺾이고 중근에서는 매끄럽다',[-2.2,3.3],[-5,8],[curve(poly(1,0,-3,-2),'조건으로 정한 f'),curve({'type':'abs','of':poly(1,0,-3,-2)},'$|f|$','#bd5144')],points=[point(-1,0,'중근',dy=20),point(2,0,'단순근',dy=20)],caption='실제 g의 식 전체가 아니라 절댓값 인수의 꺾임을 보는 그림입니다.')
    D['2022-11-12']=graph('가능한 가지가 만나는 곳에서만 연속하게 갈아탈 수 있다',[-2.3,2.3],[-1.5,2],[curve(poly(1),'후보 1',dash=True,color='#a6b2c0'),curve(poly(1,0),'후보 x',dash=True,color='#a6b2c0'),curve(poly(-1,0),'후보 -x',dash=True,color='#a6b2c0'),curve(poly(1),'선택된 f',range=[-2.3,-1]),curve(poly(-1,0),'',range=[-1,0]),curve(poly(1,0),'',range=[0,1]),curve(poly(1),'',range=[1,2.3])],points=[point(-1,1,'-1'),point(0,0,'최소'),point(1,1,'1')])
    D['2022-11-22']=dict(kind='window',title='길이 2인 닫힌구간에 두 근을 함께 담기',x=[-1,5],y=[-3,10],curves=[curve(poly(1.5,-6,4.5),"$f'(x)$")],roots=[1,3],width=2,control=dict(label='구간 시작점 t',min=-.5,max=3.5,value=1,step=.05,presets=[dict(label='두 근을 모두 포함',value=1),dict(label='조금 오른쪽',value=1.1)]),caption='시작점이 정확히 1일 때만 두 근 1, 3을 함께 포함합니다.')
    D['2023-06-09']=graph('모든 입력의 상한 조건은 가장 낮은 높이로 정해진다',[0,2.4],[3,12],[curve(poly(1,-1,-1,6),'비교 함수 H')],points=[point(1,5,'최소 높이 5')],caption='상수 a가 모든 H(x) 이하이려면 이 최저 높이를 넘을 수 없습니다.')
    D['2023-06-20']=dict(kind='window',title='움직이는 단위구간에서 빠지는 높이와 들어오는 높이',x=[0,6],y=[0,15],curves=[curve({'type':'abs','of':poly(2,-12,13)},'$|f|$')],width=1,shadeFunction=True,control=dict(label='단위구간 시작점',min=0,max=5,value=1,step=.05,presets=[dict(label='왼쪽 극소 구간',value=1),dict(label='오른쪽 극소 구간',value=4),dict(label='중앙 구간',value=2.5)]),caption='조건으로 결정한 이차함수에서 확인하는 그림입니다. 양끝 높이가 같은 곳에서 넓이의 증가·감소가 바뀝니다.')
    D['2023-09-09']=level('같은 높이의 교점은 대칭축 양쪽에 놓인다',[0,12],[-2,3],[curve({'type':'cos','k':pi/6},'첫 곡선'),curve({'type':'cos','amp':-3,'k':pi/6,'v':-1},'둘째 곡선','#bd5144')],-.8,.8,.5,[('문제의 높이',.5)],verticals=[6],caption='한 주기의 가운데 x=6에 대하여 각 교점쌍이 대칭입니다.')
    D['2023-09-12']=level('두 교점의 입력을 이차곡선과 수평선으로 보기',[-1,2],[-.5,3],[curve(poly(1,-1,0),'$x^2-x$')],0,1.5,.5,[('작은 t',.05),('중간 t',.5)],caption='원래 y=x²와 y=x+t의 교점 입력은 이 곡선과 높이 t의 교점 입력과 같습니다.')
    D['2023-09-20']=graph('서로 다른 두 교점 중 오른쪽은 접점',[-1.5,1.7],[-1,10],[curve(poly(1,1,-1,3),'삼차곡선'),curve({'type':'abs','of':poly(4,0)},'$4|x|$','#bd5144')],fills=[area(poly(1,1,-1,3),-1,1,bottom={'type':'abs','of':poly(4,0)})],points=[point(-1,4,'왼쪽 교점'),point(1,4,'오른쪽 접점',dx=-95,dy=23)])
    D['2023-09-22']=dict(kind='reflection',title='경계를 옮기며 반사된 그래프의 영점 세기',x=[-2,9],y=[-20,45],fn=poly(1,-12,45,-46),control=dict(label='반사 경계 t',min=1,max=7,value=5,step=.025,presets=[dict(label='극소점 바로 왼쪽',value=4.9),dict(label='극소점에서',value=5),dict(label='극소점 바로 오른쪽',value=5.1)]),caption='조건으로 결정한 실제 삼차곡선입니다. 경계 왼쪽은 높이 f(t)에 대해 반사하고 오른쪽은 원래 곡선을 씁니다.')
    d=poly(1,2,0,-14/3)
    D['2023-11-10']=graph('넓이가 같으면 부호 있는 두 영역이 상쇄된다',[0,2],[-5.5,13],[curve(d,'두 곡선의 높이 차')],fills=[area(d,0,2)],caption='가로축 아래 넓이와 위 넓이가 같아 전체 정적분이 영입니다.')
    f=poly(4/3,-20/3,8,0)
    D['2024-06-10']=graph('넓이의 차를 하나의 부호 있는 적분으로 읽기',[0,3.3],[-2,5],[curve(f,'조건으로 정한 삼차함수')],fills=[area(f,0,2),area(f,2,3,'#d88a76')],points=[point(2,0,'부호가 바뀜',dy=22)])
    t=.7
    D['2024-06-11']=graph('가장 가까운 점에서 접선이 주어진 직선과 평행하다',[-.4,1.8],[-1.4,2.8],[curve(poly(1,0,0),'포물선'),curve(poly(2*t,-1),'주어진 직선','#bd5144'),curve(poly(2*t,-t*t),'P에서의 평행한 접선','#558d79',dash=True),curve(poly(t,0),'직선 OP','#9874aa',dash=True)],points=[point(t,t*t,'P'),point(1/t,1,'Q')],caption='허용 범위 안 t=0.7인 예시입니다. 거리 최소점의 논리는 모든 0<t<1에서 같습니다.')
    g=poly(1/3,-13/5,24/5,0)
    D['2024-06-20']=graph('g의 최저 높이와 |g|의 최저 높이는 다르다',[1,5.7],[-2,7],[curve(g,'$g$'),curve({'type':'abs','of':g},'$|g|$','#bd5144')],points=[point(4,-16/15,'g의 최소',dy=21),point(3,0,'|g|의 최소',dx=-95,dy=-14),point(4.8,0,'다른 영점',dx=8,dy=22)],caption='절댓값은 세로축 방향의 높이가 아니라 가로축까지 거리를 셉니다.')
    D['2024-06-21']=graph('매개변수가 커질 때 감소곡선과 증가곡선의 교점 이동',[.2,3.8],[-1,4],[curve({'type':'log','base':2,'k':-1,'v':1},'t=1의 감소곡선'),curve({'type':'exp','base':2,'h':1},'t=1의 증가곡선','#558d79'),curve({'type':'log','base':2,'k':-1,'v':2},'t=2의 감소곡선',dash=True),curve({'type':'exp','base':2,'h':2},'t=2의 증가곡선','#558d79',dash=True)],points=[point(1,1,'t=1'),point(2,1,'t=2',dy=22)])
    D['2024-06-22']=dict(kind='window',title='열린구간 안에 극점이 들어가는 정수 시작점',x=[-5,2],y=[-6,20],curves=[curve(poly(3,8,0),'조건으로 정한 도함수')],roots=[-8/3,0],width=1.5,openWindow=True,control=dict(label='정수 시작점 k',min=-5,max=1,value=-3,step=1),caption='a=-2의 실제 그래프입니다. 끝점에만 놓인 극점은 열린구간에 포함하지 않습니다.')
    D['2024-09-10']=graph('수평 접선과 외부점을 지나는 다른 접선',[-2.3,3],[-8,110],[curve(poly(1,4,-28,35),'조건으로 정한 f'),curve(poly(3),'수평 접선','#558d79'),curve(poly(-32,35),'다른 접선','#bd5144')],points=[point(2,3,'접점',dy=22),point(-2,99,'접점'),point(1,3,'외부점',dx=-65,dy=22)])
    v=poly(3,4,-7)
    D['2024-09-11']=graph('방향 전환점 양쪽의 속도 넓이를 더하기',[0,3],[-8,33],[curve(v,'P의 속도')],fills=[area(v,0,1,'#d88a76'),area(v,1,3)],points=[point(1,0,'방향 전환')],xlabel='t',ylabel='속도',caption='음수 부분도 이동거리에는 양의 넓이로 더합니다.')
    qv=poly(2,-7)
    D['2024-11-10']=graph('두 점 사이 거리의 증감과 Q의 운동 방향을 구별하기',[2,6],[-4,6],[curve(qv,'Q의 속도')],fills=[area(qv,2,3.5,'#d88a76'),area(qv,3.5,6)],points=[point(3.5,0,'Q의 방향 전환',dx=-90,dy=23)],xlabel='t',ylabel='속도',caption='거리의 증감 경계는 2, 6이지만 Q 자체의 방향은 그 사이 3.5에서 바뀝니다.')
    D['2024-11-12']=dict(kind='area-join',title='곡선 아래 영역과 직선 아래 삼각형을 함께 움직이기',x=[0,10],y=[0,8],fn=poly(1/9,-5/3,6,0),control=dict(label='접합점 t',min=.1,max=5.9,value=3,step=.05,presets=[dict(label='최대가 되는 접합점',value=3)]),caption='파랑 영역은 적분, 주황 영역은 밑변과 높이가 같은 직각삼각형입니다.')
    a=sqrt(2.5)
    D['2024-11-20']=graph('지름을 보는 원주각이 두 직선을 수직으로 만든다',[-1,9],[-4.5,4.5],[curve(poly(-1,a,2,0),'삼차곡선',range=[-.7,3.3]),curve(poly(2,0),'OA 직선','#558d79',range=[-.5,2.1]),curve(poly(-.5,2.5*a),'A에서의 접선','#bd5144')],circles=[dict(x=2.5*a,y=0,r=2.5*a)],points=[point(0,0,'O'),point(a,2*a,'A'),point(5*a,0,'B')],polygons=[dict(points=[[0,0],[a,2*a],[5*a,0]])],equalAspect=True,caption='조건으로 결정한 실제 도형입니다. 각 OAB는 직각입니다.')
    fc=poly(1,-3/8,-5/8,0)
    D['2024-11-22']=graph('정수 입력 사이에 부호 변화가 놓이는 방식',[-1.5,2],[-2,4],[curve(fc,'조건으로 결정한 삼차함수')],points=[point(-1,-.75,'-1',dy=22),point(-5/8,0,'비정수근',dx=-70),point(0,0,'0',dy=22),point(1,0,'1',dy=22)],caption='서로 두 칸 떨어진 정수 입력끼리 반대 부호를 가지면 안 됩니다. 정수근이 그 부호 연결을 끊습니다.')
    D['2024-11-30']=dict(kind='window',title='같은 길이 구간은 평균에 가까울수록 더 많은 확률을 담는다',x=[-3,4.5],y=[0,.43],curves=[curve({'type':'normal'},'표준정규밀도')],width=2,centered=True,shadeFunction=True,control=dict(label='구간 중심 t',min=.2,max=2.5,value=.2,step=.05),caption='왼쪽에서 빠지는 영역이 오른쪽에서 새로 들어오는 영역보다 높아 확률이 감소합니다.')
    D['2025-06-11']=graph('극한에서 읽은 높이와 기울기가 접점을 정한다',[-2,1.5],[-6,10],[curve(poly(1,-2,-4,0),'조건으로 결정한 f'),curve(poly(3,4),'기울기 3, 절편 4인 접선','#bd5144')],points=[point(-1,1,'접점'),point(0,4,'절편')])
    u=math.log2(3);v=math.log2(2/3)
    D['2025-06-12']=graph('같은 가로·세로 좌표를 따라 사다리꼴의 네 점 잇기',[-1.1,2.1],[-1.1,4.1],[curve({'type':'exp','base':2},'$y=2^x$'),curve({'type':'exp','base':2,'k':-1,'amp':-1,'v':1},'$y=1-2^{-x}$','#bd5144')],points=[point(u,2/3,'A',dy=22),point(u,3,'B'),point(v,2/3,'C'),point(v,-.5,'D',dy=22)],polygons=[dict(points=[[u,2/3],[u,3],[v,2/3],[v,-.5]])],caption='조건으로 높이를 결정한 뒤의 실제 네 점입니다. 두 세로변 사이 가로 거리가 넓이의 높이입니다.')
    quartic=poly(1,-8/3,-2,8,0)
    D['2025-06-21']=level('두 골짜기 중 높은 쪽에 닿을 때 처음 세 교점',[-2.5,4],[-8,8],[curve(quartic,'조건으로 결정한 사차곡선')],-7,6,8/3,[('오른쪽 극솟값',8/3),('그보다 조금 위',3),('왼쪽 극솟값',-19/3)],caption='서로 다른 교점 수를 셉니다. 접하는 점은 한 점입니다.')
    fl=poly(-1,-2,6);fr=poly(-1,2,6);r=1+sqrt(7)
    D['2025-09-13']=graph('대칭인 넓이의 절반과 오른쪽 음수 넓이 비교',[-5,6],[-19,8],[curve(fl,'왼쪽 조각',range=[-5,0]),curve(fr,'오른쪽 조각',range=[0,6])],fills=[area(fr,0,r),area(fr,r,6,'#d88a76')],verticals=[0],caption='왼쪽 전체 넓이 A는 파랑 부분의 두 배입니다. A=2B이면 파랑 넓이와 빨강 넓이가 같습니다.')
    D['2025-09-20']=level('경계 높이에서 교점 두 개가 하나로 합쳐진다',[0,2*pi],[-1.3,.7],[curve({'type':'sin','v':-1},'첫 조각',range=[0,pi]),curve({'type':'sin','amp':-sqrt(2),'v':-1},'둘째 조각','#bd5144',range=[pi,2*pi],openLeft=True)],-1.2,.5,0,[('높이 -1',-1),('높이 0',0),('중간 높이',-.5)],caption='정의역의 끝점도 포함하되 접합점을 두 번 세지 않습니다.')
    prod=poly(1,3,2)
    D['2025-09-21']=graph('실수에서 음수인 구간이 있어도 정수에서는 음수가 아니다',[-3.5,1.5],[-.5,9],[curve(prod,'$(x+1)(x+2)$')],points=[point(k,(k+1)*(k+2),str(k),dy=20) for k in range(-3,2)],caption='두 근 -2, -1 사이에서는 음수지만 그 사이에 정수 입력은 없습니다.')
    f=poly(3,-16,-20);root=(16+sqrt(496))/6
    D['2025-11-09']=graph('정적분이 영이어도 구간이 사라지는 것은 아니다',[0,10],[-45,130],[curve(f,'적분 안의 다항함수')],fills=[area(f,0,root,'#d88a76'),area(f,root,10)],caption='a=10에서는 음수 넓이와 양수 넓이가 같아 적분이 영입니다.')
    D['2025-11-11']=graph('속도 부호가 바뀌는 곳에서 운동 방향이 바뀐다',[0,3.2],[-7,18],[curve(poly(3,-3,-6),'속도')],points=[point(2,0,'방향 전환',dy=22)],xlabel='t',ylabel='속도')
    f=poly(1,0,-7,6);l=poly(4,0)
    D['2025-11-13']=graph('두 넓이의 차는 위아래를 유지한 정적분',[0,3],[-4,13],[curve(f,'삼차곡선'),curve(l,'원점과 P를 잇는 직선','#bd5144')],fills=[area(l,0,3,bottom=f)],points=[point(3,12,'P')],caption='중간 교점의 정확한 값 없이 전체 부호 있는 넓이 차를 적분합니다.')
    D['2025-11-15']=graph('도함수 영점 집합을 가로로 4만큼 옮겨 겹치기',[-7,9],[-35,85],[curve(poly(3,18,15),"$g'$의 왼쪽 조각",range=[-7,0]),curve(poly(-5,15),"$g'$의 오른쪽 조각",range=[0,9]),curve(poly(3,-6,-9),'4만큼 이동한 왼쪽 조각','#bd5144',range=[-7,4],dash=True),curve(poly(-5,35),'4만큼 이동한 오른쪽 조각','#bd5144',range=[4,9],dash=True)],points=[point(-5,0,'-5',dy=22),point(-1,0,'겹침 -1'),point(3,0,'겹침 3',dy=22),point(7,0,'7')],caption='세 근씩인 두 집합이 두 점에서 겹쳐 합집합에는 네 근만 남습니다.')
    D['2025-11-21']=graph('근을 옮기는 일차변환은 고정점 하나만 갖는다',[-2.5,3],[-4,7],[curve(poly(2,1),'근을 보내는 변환 $y=2x+1$'),curve(poly(1,0),'고정점 비교 $y=x$','#bd5144',dash=True)],points=[point(-1,-1,'고정점 -1')],caption='교점 이외의 값은 변환을 반복할수록 -1에서의 거리가 두 배가 되어 서로 다른 값이 무한히 생깁니다.')
    a=3**(sqrt(3)/6)
    D['2026-06-10']=graph('대칭인 로그곡선과 정삼각형',[-2.8,2.8],[-3,7],[curve({'type':'log','base':a,'h':-3},'왼쪽으로 이동한 로그곡선'),curve({'type':'log','base':a,'h':-3,'inputK':-1},'반사된 로그곡선','#bd5144')],points=[point(0,2*sqrt(3),'A'),point(-2,0,'B',dy=22),point(2,0,'C',dy=22)],polygons=[dict(points=[[-2,0],[2,0],[0,2*sqrt(3)]])],equalAspect=True,caption='밑을 결정한 실제 그래프입니다. 두 가로축 절편의 거리가 삼각형의 한 변입니다.')
    D['2026-06-11']=graph('위치가 영인 시각과 속도가 영인 시각을 구별하기',[0,2],[-2,9],[curve(poly(3,-2,-1),'속도')],points=[point(1,0,'정지 후 방향 전환',dx=-120,dy=22)],xlabel='t',ylabel='속도')
    f=poly(3,-22/3,8/3)
    D['2026-06-13']=graph('양쪽 양수 넓이와 가운데 음수 넓이가 상쇄된다',[0,3],[-2,8],[curve(f,'곡선에서 직선을 뺀 높이')],fills=[area(f,0,4/9),area(f,4/9,2,'#d88a76'),area(f,2,8/3)],points=[point(4/9,0,'첫 교점',dy=22),point(2,0,'둘째 교점',dy=22)],caption=r'교점 입력은 $\frac49$와 2입니다. 넓이 조건은 0부터 k까지의 부호 있는 적분이 영이라는 뜻입니다.')
    D['2026-06-15']=level('점프 위쪽 끝에서 두 교점이 가능한 최고 높이',[-3,3],[-20,26],[curve(poly(-2,0,6,1),'왼쪽 조각',range=[-3,-1],openRight=True),curve(poly(2,0,-6,9),'가운데 조각','#bd5144',range=[-1,1]),curve(poly(-2,0,6,1),'오른쪽 조각',range=[1,3],openLeft=True)],-5,18,13,[('최고 허용 높이',13),('조금 위',13.2),('조금 아래',12.8)],points=[point(-1,-3,'왼쪽 극한',open=True,dx=-95,dy=22),point(-1,13,'실제 값')])
    lo,hi=1.,15.
    for _ in range(70):
        k=(lo+hi)/2
        if k+math.log2(k)<35/3:lo=k
        else:hi=k
    k=(lo+hi)/2;ax=math.log2(k/2)
    D['2026-06-22']=graph('같은 방향으로 평행이동한 교점',[-.5,6.2],[-4,14],[curve({'type':'exp','base':2,'h':-1},'A가 놓인 지수곡선'),curve({'type':'exp','base':2,'h':2,'v':-3},'B가 놓인 지수곡선','#bd5144'),curve(poly(-1,32/3),'AB 직선','#558d79',dash=True)],points=[point(ax,k,'A'),point(ax+3,k-3,'B'),point(0,0,'O')],polygons=[dict(points=[[0,0],[ax,k],[ax+3,k-3]])],caption='좌표값은 넓이 조건으로 결정한 실제 예입니다. 대응점의 이동은 항상 (3, -3)입니다.')
    f=poly(3,-10,7)
    D['2026-09-11']=graph('한 번 돌아선 두 구간의 넓이를 더하기',[0,2],[-2,8],[curve(f,'속도')],fills=[area(f,0,1),area(f,1,2,'#d88a76')],points=[point(1,0,'방향 전환',dy=22)],xlabel='t',ylabel='속도')
    D['2026-09-15']=graph('절댓값 높이 1을 통과하는 곳이 도함수 부호를 정한다',[-.7,6.7],[-2,3],[curve(poly(.25,-1.5,1),'조건으로 정한 H'),curve(poly(1),'높이 1','#bd5144',dash=True),curve(poly(-1),'높이 -1','#558d79',dash=True)],points=[point(0,1,'0'),point(2,-1,'2',dy=22),point(4,-1,'4',dy=22),point(6,1,'6')],caption='g의 도함수는 |x|(|H|-1)입니다. 원점의 영점은 부호 변화 여부를 별도로 확인합니다.')
    D['2026-09-29']=graph('반복 횟수 경계의 표준점수는 평균에서 오른쪽 2',[ -3.5,4.5],[0,.43],[curve({'type':'normal'},'표준정규밀도')],fills=[area({'type':'normal'},2,4.5)],verticals=[2],xlabel='z',caption='오른쪽 꼬리이므로 평균부터 2까지의 넓이를 0.5에서 뺍니다.')
    D['2026-11-09']=level('수평 접선은 극값 높이에 닿는 수평선',[-2,2.3],[2,16],[curve(poly(1,1,-1,4),'조건으로 정한 삼차함수')],3.2,6,5,[('목표 높이 5',5),('다른 극값 높이',4-5/27)],points=[point(-1,5,'가능한 접점'),point(1/3,4-5/27,'낮은 극값',dx=8,dy=22)])
    D['2026-11-10']=graph('점근선까지 거리와 삼각형의 가로 높이',[-.5,5],[-3,4],[curve({'type':'exp','base':sqrt(2),'v':-2},'조건으로 정한 지수곡선'),curve(poly(-2),'수평 점근선','#bd5144',dash=True)],points=[point(4,2,'A'),point(4,0,'B',dy=22),point(4,-2,'C',dy=22),point(0,0,'O')],polygons=[dict(points=[[0,0],[4,2],[4,-2]])])
    f=poly(1,-5,4)
    D['2026-11-11']=graph('속도의 적분과 속도 절댓값의 적분',[0,2],[-2.5,4.5],[curve(f,'k=5일 때의 속도')],fills=[area(f,0,1),area(f,1,2,'#d88a76')],points=[point(1,0,'방향 전환')],xlabel='t',ylabel='속도')
    D['2026-11-13']=graph('세로 절편 사이를 밑변으로 잡기',[-1,8],[-21,13],[curve(poly(-2,-4),'접선 l'),curve(poly(-4,10),'접선 m','#bd5144')],points=[point(0,-4,'-4',dx=8,dy=20),point(0,10,'10'),point(7,-18,'교점',dx=-48,dy=20)],polygons=[dict(points=[[0,-4],[0,10],[7,-18]])],caption='밑변은 14이고, 세로축에 수직인 가로 높이는 7입니다.')
    D['2026-11-22']=graph('로그의 좌표를 뒤집고 두 배 하면 지수곡선 위에 놓인다',[0,18],[0,36],[curve({'type':'log','base':4,'inputK':2,'h':-.5,'k':.5,'v':.5},'A의 로그곡선'),curve({'type':'exp','base':4,'h':1,'v':-.5},'B의 지수곡선','#bd5144'),curve(poly(9,0),'직선 OB','#558d79',dash=True)],points=[point(63/4,7/4,'A'),point(7/2,63/2,'B',dx=9,dy=18),point(77/8,133/8,'중점')],polygons=[dict(points=[[63/4,7/4],[7/2,63/2]])],caption='조건으로 좌표를 결정한 실제 그래프입니다. B=(2b, 2a)의 대응을 확인합니다.')
    D['2027-06-09']=graph('다시 만날 때 상대 속도의 양·음 넓이가 같아진다',[0,3.5],[-1.3,5.5],[curve(poly(1,-2,0),'상대 속도')],fills=[area(poly(1,-2,0),0,2,'#d88a76'),area(poly(1,-2,0),2,3)],points=[point(2,0,'속도 일치',dy=22)],verticals=[3],xlabel='t',ylabel='속도 차',caption='t=2는 속도가 같아지는 시각이고, t=3은 두 부호 넓이가 상쇄되어 다시 만나는 시각입니다.')
    f=poly(1,-2,2)
    D['2027-06-13']=graph('공통 구간을 지우면 나머지 두 영역이 대칭이다',[-2.5,4.5],[0,12],[curve(f,'두 곡선의 높이 차')],fills=[area(f,-2,0),area(f,2,4,'#dfa16e')],verticals=[1],caption='대칭축 x=1에 대해 [-2, 0]과 [2, 4]의 넓이가 같습니다. 두 적분의 공통 부분 [0, 2]는 그대로 일치합니다.')
    D['2027-06-14']=level('목표 높이가 바닥에 닿으면 한 주기의 두 해가 하나가 된다',[0,2],[-1.3,1.3],[curve({'type':'cos','k':5*pi},'b=5인 코사인곡선')],-1.2,.8,-1,[('첫 인수의 높이',.5),('a=2의 경계 높이',-1),('경계보다 위',-.8),('치역 바깥',-1.1)],caption='다섯 주기에서 높이 0.5의 해는 10개, 높이 -1의 해는 5개입니다.')
    D['2027-06-15']=dict(kind='window',title='열린 길이 3 구간에 부호 변화근이 들어가는 때',x=[-1,7],y=[-2,40],curves=[curve(poly(.25,-.75,0,0),'조건으로 정한 f')],roots=[3],width=3,openWindow=True,countLabel='부호 변화근',control=dict(label='구간 시작점',min=-1,max=4,value=1,step=.05,presets=[dict(label='왼쪽 경계',value=0),dict(label='내부',value=1),dict(label='오른쪽 경계',value=3)]),caption='원점은 중근이어서 부호를 바꾸지 않습니다. 세 번째 근만 적분 상쇄를 만듭니다.')
    beta=3**.25;alpha=beta/3;base=math.exp(math.log(3)/(4*beta/3))
    D['2027-06-20']=graph('증가 지수곡선과 감소 로그곡선의 교점',[.08,2.2],[-2,4],[curve({'type':'exp','base':base},'지수곡선'),curve({'type':'log','base':base,'k':-1},'감소 로그곡선','#bd5144'),curve(poly(3,0),'좌표비를 나타내는 직선','#558d79',dash=True)],points=[point(alpha,beta,'교점')],caption='곱 조건으로 밑과 좌표를 결정한 실제 그래프입니다. 좌표를 로그로 읽으면 서로의 입력이 연결됩니다.')
    D['2027-06-21']=level('가장 오른쪽 교점은 오른쪽 골짜기 생성 순간에 뛴다',[-6.5,4.5],[-7,44],[curve(poly(1,3,-9,9),'조건으로 정한 f')],0,12,4,[('극솟값 바로 아래',3.9),('극솟값 높이',4),('조금 위',4.1)],points=[point(1,4,'오른쪽 극소점',dx=8,dy=22)],caption='교점 수보다 가장 오른쪽 교점의 위치가 중요합니다.')
    D['2027-06-21']['level']['rightmost']=True
    D['2027-09-09']=graph('속도 일치는 상대 위치의 수평 접선',[0,2.5],[-28,6],[curve(poly(4,-3,-18,-3),'상대 위치'),curve(poly(-23.25),'속도 일치 시각의 수평 접선','#bd5144',dash=True)],points=[point(1.5,-23.25,'속도 일치',dx=8,dy=22)],xlabel='t',ylabel='위치 차',caption='상대 위치가 영인 조건이 아닙니다. 상대 위치의 기울기가 영인 시각을 찾습니다.')
    f=poly(6,-6,0)
    D['2027-09-13']=graph('음수 부분을 뒤집으면 그 넓이의 두 배가 추가된다',[0,2],[-2,13],[curve(f,'$f(x)=6x(x-1)$'),curve({'type':'abs','of':f},'$|f(x)|$','#bd5144',dash=True)],fills=[area(f,0,1,'#d88a76'),area(f,1,2)],points=[point(1,0,'부호 변화')],caption='부호 있는 적분은 4지만 이동한 음수 넓이 때문에 절댓값 적분은 6입니다.')
    D['2027-09-15']=dict(kind='shift-sum',title='분모의 두 영점이 합쳐졌다 사라지는 경계',x=[-3,2],y=[-2,8],control=dict(label='이동량 t',min=.2,max=2.5,value=1.5,step=.025,presets=[dict(label='서로 다른 두 근',value=1),dict(label='중근 경계',value=1.5),dict(label='실근 없음',value=2)]),caption='조건으로 결정한 f에서 분모 f(x)+f(x-t)를 그립니다. 경계 중근을 지우려면 분자에서도 두 번 영이 되어야 합니다.')
    f=poly(1,-7,16,-12);p=poly(1,-5,7,-3);g={'type':'sum','terms':[dict(a=3,fn=f),dict(a=-4,fn={'type':'abs','of':f})]};ab={'type':'abs','of':p};total={'type':'sum','terms':[dict(fn=g),dict(fn=ab)]}
    D['2027-09-21']=graph('같은 위치의 반대 기울기 점프가 상쇄된다',[2.2,3.7],[-3,5],[curve(g,'첫 함수의 꺾임','#8a63a5'),curve(ab,'절댓값 항의 꺾임','#558d79'),curve(total,'두 함수의 합','#2b68ae',width=3.2),curve(poly(3,-9),'합함수의 접선','#bd5144',dash=True)],points=[point(3,0,'상쇄 위치',dy=23)],caption='허용 후보 a=1, 중근 2인 경우의 실제 그림입니다. 성분 둘은 꺾여도 합은 매끄럽습니다.')
    base=(81/16)**(1/3)
    A=[.75,1.5];B=[1.5,2.25];C=[2.5,1.25];E=[1.75,.5]
    D['2027-09-22']=graph('포물선의 평행이동과 지수·로그 대칭이 같은 직사각형을 만든다',[.2,2.9],[0,3],[curve(poly(2,-3.5,3),'첫 포물선'),curve(poly(2,-7.5,7.5),'이동한 포물선','#bd5144'),curve({'type':'exp','base':base},'지수곡선','#558d79'),curve({'type':'log','base':base,'h':.25,'v':-.25},'로그곡선','#8a63a5'),curve(poly(1,-.25),'대칭축','#8b97a4',dash=True)],points=[point(*A,'A',dx=-20),point(*B,'B'),point(*C,'C'),point(*E,'D',dy=22)],polygons=[dict(points=[A,B,C,E])],equalAspect=True,caption='좌표와 밑을 조건으로 결정한 실제 도형입니다. 두 포물선의 대응점 이동은 (1, -1)입니다.')
    return D
