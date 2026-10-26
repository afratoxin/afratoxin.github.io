/** Owns the lazy worker and ensures only the newest query can publish a result. */
export function createSemanticSearch({onStatus = () => {}, workerFactory, timeoutMs = 180000} = {}) {
  let worker, active, sequence = 0, ready = false, failed = false, disposed = false;
  const publish = status => { try { onStatus(status); } catch { /* A UI callback cannot stop search cleanup. */ } };
  const settle = (scores = new Map()) => {
    if (!active) return;
    clearTimeout(active.timer);
    const resolve = active.resolve;
    active = null;
    resolve(scores);
  };
  const fail = message => {
    if (disposed || failed) return;
    failed = true;
    worker?.terminate();
    worker = null;
    settle();
    publish({state: 'fallback', message});
  };
  const armTimeout = () => {
    if (!active) return;
    clearTimeout(active.timer);
    active.timer = setTimeout(() => fail('의미 검색 준비가 지연되어 관련 표현 검색을 사용합니다.'), Math.max(1, timeoutMs));
  };
  const receive = ({data}) => {
    if (disposed || failed || !active || data?.requestId !== active.id) return;
    if (data.type === 'status' && ['loading', 'searching'].includes(data.state)) {
      armTimeout();
      publish({state: data.state, ...(Number.isFinite(data.progress) ? {progress: Math.max(0, Math.min(100, data.progress))} : {}), ...(typeof data.message === 'string' ? {message: data.message} : {})});
    } else if (data.type === 'result') {
      if (!Array.isArray(data.scores) || data.scores.some(row => !Array.isArray(row) || row.length !== 2 || typeof row[0] !== 'string' || !/^(?:\d{4}|p\d{3})$/.test(row[0]) || !Number.isFinite(row[1]) || Math.abs(row[1]) > 1.001) || new Set(data.scores.map(row => row[0])).size !== data.scores.length) {
        fail('의미 검색 자료를 확인할 수 없어 관련 표현 검색을 사용합니다.');
        return;
      }
      ready = true;
      const scores=new Map(data.scores);
      if(data.evidence!==undefined){
        if(!Array.isArray(data.evidence)||data.evidence.length>scores.size||new Set(data.evidence.map(row=>row?.[0])).size!==data.evidence.length||data.evidence.some(row=>!Array.isArray(row)||row.length!==2||!scores.has(row[0])||!row[1]||typeof row[1].kind!=='string'||row[1].kind.length>40||typeof row[1].label!=='string'||!row[1].label||row[1].label.length>120||typeof row[1].text!=='string'||!row[1].text||row[1].text.length>800||!Number.isFinite(row[1].score)||Math.abs(row[1].score)>1.001)){
          fail('의미 검색 근거를 확인할 수 없어 관련 표현 검색을 사용합니다.');return;
        }
        scores.evidence=new Map(data.evidence);
        if([...scores.evidence.values()].some(p=>p.support!==undefined&&(!Array.isArray(p.support)||p.support.length>8||p.support.some(item=>typeof item?.label!=='string'||item.label.length>120||typeof item.text!=='string'||!item.text||item.text.length>1200)))){fail('의미 검색 근거를 확인할 수 없어 관련 표현 검색을 사용합니다.');return;}
      }
      settle(scores);
      publish({state: 'ready'});
    } else if (data.type === 'error') {
      fail('의미 검색을 준비하지 못해 관련 표현 검색을 사용합니다.');
    }
  };
  return {
    search(query) {
      sequence++;
      settle();
      const text = String(query ?? '').trim();
      if (!text || disposed || failed) return Promise.resolve(new Map());
      const promise = new Promise(resolve => { active = {id: sequence, resolve}; });
      publish({state: ready ? 'searching' : 'loading'});
      try {
        if (!worker) {
          const workerUrl = new URL('./semantic-worker.mjs', import.meta.url);
          workerUrl.search = new URL(import.meta.url).search;
          worker = workerFactory ? workerFactory() : new Worker(workerUrl, {type: 'module'});
          worker.addEventListener('message', receive);
          worker.addEventListener('error', event => { event.preventDefault?.(); fail('이 환경에서 의미 검색을 시작할 수 없어 관련 표현 검색을 사용합니다.'); });
          worker.addEventListener('messageerror', () => fail('의미 검색 응답을 읽지 못해 관련 표현 검색을 사용합니다.'));
        }
        armTimeout();
        worker.postMessage({type: 'search', requestId: sequence, query: text});
      } catch {
        fail('이 환경에서 의미 검색을 시작할 수 없어 관련 표현 검색을 사용합니다.');
      }
      return promise;
    },
    dispose() {
      disposed = true;
      sequence++;
      settle();
      worker?.terminate();
      worker = null;
    }
  };
}
