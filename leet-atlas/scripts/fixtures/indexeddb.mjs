// Test-only IndexedDB fixture. Requests run asynchronously and writes commit
// together only when the transaction completes; abort discards every change.
export function createIndexedDBFixture(options = {}) {
  let stored = new Map((options.records || []).map(record => [record.id, structuredClone(record)]));
  let initialized = false;
  const waiting = new Set();
  const control = {
    ...options,
    records: () => [...stored.values()].map(record => structuredClone(record)),
    releaseCommits() {
      control.holdCommits = false;
      for (const finish of [...waiting]) finish();
    },
  };
  const emit = (target, type) => target[`on${type}`]?.({target, type});
  const fail = name => new DOMException(name, name);
  function transaction(_name, mode) {
    if (control.failTransaction) throw fail('InvalidStateError');
    let working = new Map([...stored].map(([key, record]) => [key, structuredClone(record)]));
    let pending = 0, finished = false, puts = 0;
    const tx = {
      error:null,
      objectStore(name) {
        if (name !== 'questions') throw fail('NotFoundError');
        const request = (operation, write = false) => {
          if (finished) throw fail('TransactionInactiveError');
          if (write && mode !== 'readwrite') throw fail('ReadOnlyError');
          const req = {result:undefined,error:null};
          pending++;
          queueMicrotask(() => {
            if (finished) return;
            try { req.result = operation(); emit(req,'success'); }
            catch (error) {
              req.error = error;
              tx.error = error;
              emit(req,'error');
              emit(tx,'error');
              tx.abort();
            }
            pending--;
            queueMicrotask(finish);
          });
          return req;
        };
        return {
          clear: () => request(() => {working.clear();},true),
          put: value => {
            if (control.throwPut) throw fail('DataCloneError');
            const record = structuredClone(value);
            return request(() => {
              if (++puts === control.failPutAt) throw fail('QuotaExceededError');
              working.set(record.id,record);
              return record.id;
            },true);
          },
          getAll: () => request(() => {
            if (control.failRead) throw fail('UnknownError');
            return [...working.values()].map(record => structuredClone(record));
          }),
        };
      },
      abort() {
        if (finished) throw fail('InvalidStateError');
        finished = true;
        waiting.delete(finish);
        queueMicrotask(() => emit(tx,'abort'));
      },
    };
    function finish() {
      if (finished || pending) return;
      if (control.holdCommits) {waiting.add(finish);return;}
      waiting.delete(finish);
      if (control.abortOnCommit) {
        tx.error = fail('AbortError');
        tx.abort();
        return;
      }
      finished = true;
      if (mode === 'readwrite') stored = working;
      emit(tx,'complete');
    }
    queueMicrotask(finish);
    return tx;
  }
  const database = {
    objectStoreNames:{contains:name => initialized && name === 'questions'},
    createObjectStore(name,config) {
      if (name !== 'questions' || config.keyPath !== 'id') throw fail('DataError');
      initialized = true;
    },
    transaction,
    close() {},
  };
  control.indexedDB = {
    open(name, version) {
      if (control.throwOpen) throw fail('SecurityError');
      const request = {result:undefined,error:null};
      queueMicrotask(() => {
        if (name !== 'leet-atlas:local-sources:v1' || version !== 1 || control.failOpen) {
          request.error = fail('UnknownError');emit(request,'error');return;
        }
        if (control.blocked) {emit(request,'blocked');return;}
        request.result = database;
        if (!initialized) emit(request,'upgradeneeded');
        emit(request,'success');
      });
      return request;
    },
  };
  return control;
}
