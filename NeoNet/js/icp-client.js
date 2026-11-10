/* NeoNet / VLT-ICP, browserseitiger Same-Origin-Transport.
   Bootstrap exakt GET /api/v1/session – kein Query-Parameter, kein Token.
   HTTP-Port ist der Port, von dem der ICP die Webdateien ausliefert. */
(() => {
  'use strict';

  const TEST_FRAME = '$<00#01#TEST#544553544652414D4530313233343536#6F95>';
  const TEST_BUILD = Object.freeze({
    target: 'TEST', payload: '544553544652414D4530313233343536', qq: '00', zz: '01'
  });
  let sessionPromise = null;

  function assertLocalOrigin() {
    if (location.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(location.hostname)) {
      throw new Error('Die lokale Web-Config muss direkt vom VLT-ICP über http://127.0.0.1:<ICP-Port>/ geladen werden.');
    }
  }

  function connectionError(error) {
    return new Error('VLT-ICP unter ' + location.origin + ' nicht erreichbar: ' +
      ((error && error.message) || String(error)));
  }

  async function parseJSON(response, prefix) {
    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (_) {
      throw new Error(prefix + ': HTTP ' + response.status + ': Keine gültige JSON-Antwort.');
    }
    if (!response.ok || !data || data.ok === false) {
      const error = new Error(prefix + ': HTTP ' + response.status + ': ' +
        (data && data.error ? data.error : 'Anfrage fehlgeschlagen'));
      error.httpStatus = response.status;
      error.apiData = data;
      throw error;
    }
    return data;
  }

  // Vorgabe ICP-Bot: Dieser Aufruf MUSS exakt so ankommen.
  async function icpStartSession() {
    assertLocalOrigin();
    let response;
    try {
      response = await fetch('/api/v1/session', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store'
      });
    } catch (error) {
      throw connectionError(error);
    }
    const data = await parseJSON(response, 'Session');
    if (data.ok !== true) throw new Error('ICP-Sitzung wurde nicht bestätigt.');
    return data;
  }

  function session(force = false) {
    if (force || !sessionPromise) {
      sessionPromise = icpStartSession().catch(error => {
        sessionPromise = null;
        throw error;
      });
    }
    return sessionPromise;
  }

  async function request(path, body) {
    assertLocalOrigin();
    const hasBody = body !== undefined;
    const options = {
      method: hasBody ? 'POST' : 'GET',
      credentials: 'same-origin',
      cache: 'no-store'
    };
    if (hasBody) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    }
    let response;
    try {
      response = await fetch(path, options);
    } catch (error) {
      throw connectionError(error);
    }
    return parseJSON(response, 'ICP-API');
  }

  async function authorized(path, body) {
    // Session MUSS vor der eigentlichen API-Anfrage abgeschlossen sein.
    await session();
    try {
      return await request(path, body);
    } catch (error) {
      if (error.httpStatus !== 401) throw error;
      // Eine abgelaufene Sitzung einmal erneuern, danach genau einmal wiederholen.
      await session(true);
      return request(path, body);
    }
  }

  async function icpLoadStatus() {
    return authorized('/api/v1/status');
  }

  window.NeoNetICP = Object.freeze({
    TEST_FRAME, TEST_BUILD,
    session,
    status: icpLoadStatus,
    buildTest: () => authorized('/api/v1/build', TEST_BUILD),
    check: (sop, cop) => authorized('/api/v1/check', { sop, cop }),
    origin: () => location.origin
  });
})();
