/* Gemeinsamer Reiter Module: HTTP-Sendeversuch an die NeoNet-IDE; IDE-/Hardwareempfang nicht unterstellt. */
(() => {
  'use strict';
  const COMMAND='$<FE#FF#CFG#LOAD>';
  let adapter=null, visible=false, probing=false, busy=false, reachable=false, scanEpoch=0;
  let portState="Nicht geprüft", portDetail="HTTP-Port 8081 wurde noch nicht geprüft.";
  let phase='Nicht konfiguriert', detail='IDE-Endpunkt und Session-Schnittstelle noch nicht freigegeben.';
  let received='Noch keine echte IDE-Antwort.', sessionReady=false;
  const safe=str=>String(str||'').replace(/(Bearer\s+)\S+/gi,'$1[VERDECKT]').replace(/("(?:access_)?token"\s*:\s*")[^"]+/gi,'$1[VERDECKT]').slice(0,4096);
  const isIPv4=host=>/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) && host.split('.').every(p=>String(Number(p))===p && Number(p)<=255);
  function originOf(value) {
    const raw=String(value||'');
    let url;
    try { url=new URL(raw); } catch (_) { throw new Error('Eine freigegebene IPv4-Zieladresse fehlt.'); }
    if (!['http:','https:'].includes(url.protocol) || !isIPv4(url.hostname) ||
        !url.port || url.origin!==raw || url.username || url.password || url.hash || url.search ||
        url.pathname!=='/') throw new Error('Die IDE-Zieladresse muss eine vollständige HTTP(S)-IPv4-Origin mit Port sein.');
    if (url.origin==='http://127.0.0.1:8080' ||
        (window.NeoNetDeployment?.icpEnabled===true && url.origin===location.origin))
      throw new Error('Das bisherige ICP-Ziel ist als NeoNet-IDE-Ziel nicht erlaubt.');
    return url.origin;
  }
  function paint() {
    if (!visible) return;
    const get=id=>document.getElementById(id);
    if (!get('neonet-scan-start')) return;
    get('neonet-scan-target').textContent=adapter?adapter.origin:'Nicht freigegeben';
    if (get('neonet-scan-port')) get('neonet-scan-port').textContent=portState;
    get('neonet-scan-connection').textContent=phase;
    get('neonet-scan-message').textContent=detail;
    get('neonet-scan-response').textContent=received;
    // Der Scan-Klick bleibt als echter Diagnose-Einstieg auch ohne Scan-API verfügbar.
    get('neonet-scan-start').disabled=busy;
    get('neonet-scan-probe').disabled=!adapter||busy||probing;
  }
  function setState(nextPhase,nextDetail) { phase=nextPhase;detail=nextDetail;paint(); }
  function setPort(nextPort,nextDetail) { portState=nextPort;portDetail=nextDetail;paint(); }
  function configure(config) {
    if (busy||probing) throw new Error('IDE-Verbindung wird gerade benutzt.');
    if (!config || ['probe','startSession'].some(k=>typeof config[k]!=='function') ||
        (config.sendScan != null && typeof config.sendScan!=='function') ||
        (config.portProbe != null && typeof config.portProbe!=='function'))
      throw new Error('Der freigegebene IDE-HTTP-Adapter ist unvollständig.');
    const origin=originOf(config.origin);
    adapter=Object.freeze({origin,probe:config.probe,startSession:config.startSession,sendScan:config.sendScan||null,portProbe:config.portProbe||null});
    reachable=false;sessionReady=false;received='Noch keine echte IDE-Antwort.';
    portState='Nicht geprüft';portDetail='HTTP-Port 8081 wurde noch nicht geprüft.';
    setState('IDE-Ziel konfiguriert','IDE-Adresse ist festgelegt. Die Verbindung muss separat geprüft werden.');
  }
  function httpError(response,action) {
    const code=Number(response?.status)||0;
    let message;
    if (code===401) message='HTTP 401 – Sitzung ungültig oder nicht autorisiert.';
    else if (code===403) message='HTTP 403 – Zugriff durch die IDE verweigert.';
    else if (code===404||code===501) message='IDE-API-Funktion nicht verfügbar (HTTP '+code+').';
    else message=action+' fehlgeschlagen (HTTP '+(code||'unbekannt')+').';
    const e=new Error(message);e.status=code;return e;
  }
  function checkedResponse(response,action) {
    if (!response || typeof response.status!=='number' || typeof response.ok!=='boolean')
      throw new Error(action+': Keine auswertbare IDE-HTTP-Antwort.');
    if (!response.ok) throw httpError(response,action);
    return response;
  }
  function describeError(error,action) {
    const message=String(error?.message||error||'Unbekannter Fehler');
    if (error?.name==='TimeoutError') return action+': Zeitüberschreitung nach 5 Sekunden ohne IDE-Antwort.';
    if (error?.name==='AbortError') return action+' abgebrochen.';
    if (error?.status) return safe(message);
    if (/CORS|Origin/i.test(message)) return 'CORS-/Origin-Ablehnung: '+safe(message);
    if (/permission|denied|blocked|notallowed|network access/i.test(message))
      return 'Browserzugriff auf lokalen Dienst verweigert: '+safe(message);
    return action+': Server nicht erreichbar oder Anfrage gescheitert. '+safe(message);
  }
  async function probe() {
    if (!adapter || probing || busy) return false;
    probing=true;reachable=false;sessionReady=false;
    const epoch=scanEpoch;
    setPort('Prüfung läuft','HTTP-Erreichbarkeit wird unabhängig von der IDE-Sitzung geprüft.');
    setState('Sitzung wird geprüft','Prüfe zuerst den HTTP-Port und anschließend die Session-Schnittstelle.');
    try {
      if (adapter.portProbe) {
        try {
          await adapter.portProbe(adapter.origin);
          if (epoch!==scanEpoch) return false;
          setPort('HTTP antwortet','Eine HTTP-Antwort auf Port 8081 wurde erreicht; das beweist noch keine IDE-Identität.');
        } catch (_) {
          if (epoch!==scanEpoch) return false;
          setPort('Nicht feststellbar','Keine lesbare Portprobe: Dienst nicht erreichbar oder Browserzugriff blockiert.');
        }
      } else setPort('Portprobe fehlt','Nur die freigegebene Session-Schnittstelle kann geprüft werden.');
      const sessionResponse=await adapter.probe(adapter.origin);
      if (epoch!==scanEpoch) return false;
      if (sessionResponse && typeof sessionResponse.status==='number')
        setPort('HTTP antwortet','Der Session-Endpunkt hat eine HTTP-Antwort geliefert.');
      checkedResponse(sessionResponse,'IDE-Sitzung');
      reachable=true;sessionReady=true;
      if (!busy) setState('Sitzung bereit',adapter.sendScan ?
        'Port 8081 antwortet; IDE-Session ist bestätigt. Scan kann manuell gestartet werden.' :
        'Port 8081 antwortet; Session ist bestätigt. Scan-Endpunkt noch nicht freigegeben.');
      return true;
    } catch(error) {
      if (epoch!==scanEpoch) return false;
      const code=Number(error?.status)||0;
      if (code) setPort('HTTP antwortet','HTTP-Antwort des Session-Endpunkts: '+code+'.');
      if (busy) return false;
      if (code===404 || code===501)
        setState('Session-Endpunkt fehlt','Port 8081 antwortet, aber POST /api/v1/session-token ist nicht verfügbar (HTTP '+code+').');
      else if (code===401 || code===403)
        setState('Session abgewiesen',describeError(error,'IDE-Sitzung'));
      else setState('Session fehlgeschlagen',
        portState==='HTTP antwortet' ?
        'HTTP-Port 8081 antwortet; die Session-Anfrage scheiterte (z. B. CORS, Browserfreigabe oder Session deaktiviert).' :
        describeError(error,'Verbindungsprüfung'));
      return false;
    } finally { probing=false;paint(); }
  }
  async function scan() {
    if (busy) return false;
    if (!adapter) {
      received='Kein Scan-Auftrag gesendet: NeoNet-IDE-Adapter nicht konfiguriert.';
      setState('IDE-Adapter fehlt','Für den Scan ist ein NeoNet-IDE-Adapter erforderlich.');
      return false;
    }
    if (!adapter.sendScan) {
      received='Kein Scan-Auftrag gesendet: HTTP-Sendeadapter nicht vorhanden.';
      setState('HTTP-Sendeadapter fehlt','Die IDE-Session allein stellt noch keinen HTTP-Sendeweg für den Scan bereit.');
      return false;
    }
    scanEpoch++;busy=true;received='HTTP-Sendeversuch läuft; warte höchstens 5 Sekunden auf die IDE-Antwort.';
    setState('Sendeversuch läuft','Der Befehl wird an die NeoNet-IDE übergeben. Keine vorgeschaltete Portprüfung.');
    const controller=new AbortController();
    let timeoutId,timedOut=false;
    const timeout=new Promise((_,reject)=>{
      timeoutId=setTimeout(()=>{
        timedOut=true;
        const e=new Error('5 Sekunden ohne IDE-Antwort.');e.name='TimeoutError';reject(e);
        controller.abort();
      },5000);
    });
    const action=(async()=>{
      const session=await adapter.startSession(adapter.origin,{signal:controller.signal});
      checkedResponse(session,'IDE-Sitzung');
      if (controller.signal.aborted) return false;
      sessionReady=true;
      const report=(stage,message='')=>{
        if (!busy||controller.signal.aborted) return;
        const labels={attempt:'HTTP-Sendeversuch gestartet',transferred:'Scan-Auftrag übertragen',accepted:'Von IDE angenommen',hardware_sent:'Hardwareübertragung bestätigt',hardware_reply:'Hardwareantwort empfangen',aborted:'Scan abgebrochen'};
        if (Object.hasOwn(labels,stage)) setState(labels[stage],safe(message)||'Nur nach ausdrücklicher Rückmeldung der IDE.');
      };
      const response=checkedResponse(await adapter.sendScan(COMMAND,{origin:adapter.origin,signal:controller.signal,report}),'NeoNet-Scan');
      if (controller.signal.aborted) return false;
      const body=typeof response.text==='function'?await response.text():'';
      received='HTTP '+response.status+(body?'\n'+body.length+' Zeichen IDE-Antwort empfangen; ohne Antwortvertrag keine Modulauswertung.':'\nKeine Antwortdaten.');
      if (!['Von IDE angenommen','Hardwareübertragung bestätigt','Hardwareantwort empfangen'].includes(phase))
        setState('HTTP-Antwort erhalten','HTTP '+response.status+' von der IDE. Annahme des Hardwarebefehls und Hardwareerfolg nicht bestätigt.');
      return true;
    })();
    try { return await Promise.race([action,timeout]); }
    catch(error) {
      if (error?.status===401) {reachable=false;sessionReady=false;}
      const failure=timedOut?Object.assign(new Error('5 Sekunden ohne IDE-Antwort.'),{name:'TimeoutError'}):error;
      setState(failure?.name==='TimeoutError'?'Zeitüberschreitung':'Scan fehlgeschlagen',describeError(failure,'NeoNet-Scan'));
      received='Kein bestätigter Hardwareempfang. Ob die IDE den HTTP-Auftrag erhalten hat, ist damit nicht nachgewiesen.';
      return false;
    } finally {clearTimeout(timeoutId);busy=false;paint();}
  }
  function mount() {
    const wasVisible=visible;
    visible=true;
    document.getElementById('neonet-scan-probe')?.addEventListener('click',()=>{void probe();});
    document.getElementById('neonet-scan-start')?.addEventListener('click',()=>{void scan();});
    paint();
    if (!wasVisible && adapter) void probe();
  }
  function leave() { visible=false; }
  function snapshot() {return {phase,detail,portState,portDetail,origin:adapter?.origin||null,busy,probing,reachable,sessionReady,received};}
  window.NeoNetIDEScan=Object.freeze({COMMAND,configure,mount,leave,probe,scan,snapshot});
})();