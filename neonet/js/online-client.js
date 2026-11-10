/* NeoNet Online – freigegebene Loopback-API, Token ausschließlich im Arbeitsspeicher. */
(() => {
  'use strict';
  const CONFIG = Object.freeze({base: 'http://127.0.0.1:8080', session: '/api/v1/session-token'});
  const TEST_BUILD = Object.freeze({target:'TEST',payload:'544553544652414D4530313233343536',qq:'00',zz:'01'});
  const TEST_FRAME = '$<00#01#TEST#544553544652414D4530313233343536#6F95>';
  let token = null;
  let expiresAt = 0;
  let connected = false;
  let pending = null;
  function problem(code, message, status = 0) {
    const e = new Error(message);
    e.code = code; e.httpStatus = status;
    return e;
  }
  function ensureTarget() {
    const url = new URL(CONFIG.base);
    if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.port !== '8080' || url.pathname !== '/' || url.username || url.password) {
      throw problem('invalid_target', 'Es ist ausschließlich der konfigurierte Loopback-Dienst auf Port 8080 freigegeben.');
    }
    if (location.protocol !== 'https:') {
      throw problem('insecure_page', 'Die Online-Web-Config muss über HTTPS geöffnet werden.');
    }
  }
  async function permissionDenied() {
    if (!navigator.permissions || !navigator.permissions.query) return false;
    try {
      const permission = await navigator.permissions.query({name:'loopback-network'});
      return permission.state === 'denied';
    } catch (_) { return false; }
  }
  function clear() { token = null; expiresAt = 0; connected = false; }
  async function transport(path, options) {
    ensureTarget();
    if (!/^\/api\/v1\/(session-token|status|build|check)$/.test(path)) {
      throw problem('invalid_path','Unbekannter API-Endpunkt.');
    }
    const opts = {
      method:options.method, mode:'cors', credentials:'omit', cache:'no-store',
      redirect:'error', referrerPolicy:'no-referrer', targetAddressSpace:'loopback'
    };
    if (options.authorization) opts.headers = {'Authorization':'Bearer ' + options.authorization};
    if (options.body !== undefined) {
      opts.headers = Object.assign({}, opts.headers, {'Content-Type':'application/json'});
      opts.body = JSON.stringify(options.body);
    }
    let response;
    try { response = await fetch(CONFIG.base + path, opts); }
    catch (_) {
      if (await permissionDenied()) throw problem('browser_denied','Der Browser hat den Loopback-Netzwerkzugriff verweigert. Freigabe in den Website-Berechtigungen prüfen.');
      throw problem('network_or_cors','Der lokale Dienst antwortet nicht oder der Browser blockiert die Verbindung (z. B. CORS, CSP oder Browserfreigabe). Diese Ursachen lassen sich aus JavaScript nicht immer eindeutig unterscheiden.');
    }
    let data;
    try { data = await response.json(); }
    catch (_) { throw problem('invalid_response','Der lokale Dienst liefert keine gültige JSON-Antwort.',response.status); }
    if (!response.ok || !data || data.ok !== true) {
      if (response.status === 401) throw problem('unauthorized','HTTP 401: Sitzung ungültig oder nicht autorisiert. Verbindung bitte erneut herstellen.',401);
      if (response.status === 403) throw problem('forbidden','HTTP 403: Zugriff vom lokalen Dienst verweigert (Origin, Host oder Berechtigung prüfen).',403);
      if ([404,405,501].includes(response.status)) throw problem('unavailable','HTTP '+response.status+': Die angeforderte Funktion ist in dieser Serveranwendung nicht verfügbar.',response.status);
      if (path === CONFIG.session) throw problem('bootstrap_failed','Session-Bootstrap fehlgeschlagen (HTTP '+response.status+').',response.status);
      throw problem('api_error','HTTP '+response.status+': Der lokale Dienst konnte die Anfrage nicht verarbeiten.',response.status);
    }
    return data;
  }
  async function connect() {
    if (pending) return pending;
    // Keine automatische Wiederholung nach Fehlern; neue Sitzung nur durch Nutzeraktion.
    pending = (async () => {
      clear();
      const data = await transport(CONFIG.session,{method:'POST'});
      if (typeof data.token !== 'string' || !/^[A-Za-z0-9_\-+.\/=]{16,512}$/.test(data.token) ||
          data.token_type !== 'Bearer' || !Number.isFinite(data.expires_in) || data.expires_in <= 0) {
        throw problem('invalid_session','Ungültiges Sitzungsantwortformat.');
      }
      token = data.token;
      expiresAt = Date.now() + data.expires_in * 1000;
      connected = true;
      return {ok:true,expires_in:data.expires_in};
    })().catch(e=>{clear();throw e;}).finally(()=>{pending=null;});
    return pending;
  }
  async function request(path, body) {
    if (!connected || !token) throw problem('not_connected','Zuerst die lokale Verbindung herstellen.');
    if (Date.now() >= expiresAt) {
      clear();
      throw problem('expired','Die Sitzung ist abgelaufen. Bitte die Verbindung erneut herstellen.');
    }
    const auth = token;
    try {return await transport(path,{method:body===undefined?'GET':'POST',authorization:auth,body});}
    catch(e) {if (e.httpStatus===401) clear(); throw e;}
  }
  // Der Token ist nur im privaten Closure enthalten. Kein Storage, kein Export, kein Log.
  window.NeoNetOnline = Object.freeze({
    connect, disconnect:clear, isConnected:()=>connected && Date.now()<expiresAt,
    status:()=>request('/api/v1/status'),
    buildTest:()=>request('/api/v1/build',TEST_BUILD),
    check:(sop,cop)=>request('/api/v1/check',{sop,cop}),
    TEST_FRAME, TEST_BUILD, origin:()=>CONFIG.base
  });
})();
