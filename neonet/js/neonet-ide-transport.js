/* Gemeinsamer NeoNet-IDE-HTTP-Transport: bestaetigter Sendeweg POST /api/v1.
   Die HTTP-Antwort bestaetigt keinen Empfang durch den AVR. */
(() => {
  'use strict';
  const ORIGIN = 'http://127.0.0.1:8081';
  const SESSION_URL = ORIGIN + '/api/v1/session-token';
  const API_BASE_URL = ORIGIN + '/api/v1';
  const online = () => location.protocol === 'https:';
  let token = null;
  let expiresAt = 0;
  let pending = null;

  const clearSession = () => { token = null; expiresAt = 0; };
  const hasSession = () => Boolean(token && Date.now() + 5000 < expiresAt);

  async function probePort(origin) {
    if (origin !== ORIGIN) throw new Error('Unerlaubte NeoNet-IDE-Zieladresse.');
    // Same fixed local server; an opaque response counts as an HTTP reply even for / -> 404.
    // No response body, token or CORS-restricted data is inspected.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    try {
      await fetch(ORIGIN + '/', {
        method:'GET', mode:'no-cors', credentials:'omit', cache:'no-store',
        redirect:'error', ...(online()?{targetAddressSpace:'loopback',referrerPolicy:'no-referrer'}:{}), signal:controller.signal
      });
      return true;
    } finally { clearTimeout(timeout); }
  }

  async function establishSession(origin, options={}) {
    if (origin !== ORIGIN) throw new Error('Unerlaubte NeoNet-IDE-Zieladresse.');
    if (hasSession()) return {status:200, ok:true};
    if (pending) return pending;
    clearSession();
    pending = (async () => {
      // Deliberately no Authorization header, credentials, body, query, or cache buster.
      // Origin/CORS and permission remain enforced by browser and server.
      const response = await fetch(SESSION_URL, {
        method:'POST', mode:'cors', credentials:'omit', cache:'no-store', redirect:'error', ...(online()?{targetAddressSpace:'loopback',referrerPolicy:'no-referrer'}:{}), signal:options.signal
      });
      if (!response.ok) return response;
      let data;
      try { data = await response.json(); }
      catch { throw new Error('IDE-Session: HTTP-Antwort enthält kein gültiges JSON.'); }
      if (data?.ok !== true || data?.token_type !== 'Bearer' ||
          typeof data.token !== 'string' || data.token.length < 16 ||
          !Number.isFinite(Number(data.expires_in)) || Number(data.expires_in) <= 0)
        throw new Error('IDE-Session: Antwortformat unvollständig.');
      token = data.token;
      expiresAt = Date.now() + Number(data.expires_in) * 1000;
      return {status:response.status,ok:true};
    })();
    try { return await pending; }
    finally { pending = null; }
  }

  async function sendScan(command, options={}) {
    if (options.origin!==ORIGIN) throw new Error('Unerlaubte NeoNet-IDE-Zieladresse.');
    if (command!==window.NeoNetIDEScan.COMMAND) throw new Error('Unzulässiger Scanbefehl.');
    if (!hasSession()) {
      const session=await establishSession(ORIGIN,options);
      if (!session.ok) return session;
    }
    if (options.signal?.aborted) {const e=new Error('Sendeversuch abgebrochen.');e.name='AbortError';throw e;}
    options.report?.('attempt','HTTP-Sendeversuch an den bekannten IDE-API-Basispfad /api/v1 gestartet; noch keine Empfangsbestätigung.');
    return fetch(API_BASE_URL,{
      method:'POST', mode:'cors', credentials:'omit', cache:'no-store', redirect:'error',
      headers:{'Authorization':'Bearer '+token,'Content-Type':'text/plain;charset=UTF-8'},
      body:command, ...(online()?{targetAddressSpace:'loopback',referrerPolicy:'no-referrer'}:{}), signal:options.signal
    });
  }
  // Only this origin is trusted; token stays inside this closure.
  function sessionState() { return Object.freeze({connected:hasSession(),origin:ORIGIN}); }
  window.NeoNetIDETransport = Object.freeze({origin:ORIGIN,sessionState});
  window.NeoNetIDEScan.configure({
    origin:ORIGIN,
    probe:establishSession,
    portProbe:probePort,
    startSession:establishSession,
    sendScan:sendScan
  });
})();