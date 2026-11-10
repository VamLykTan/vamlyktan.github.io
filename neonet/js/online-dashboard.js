/* Online-Vorschau: Mock-Module bleiben unverändert, lokale API nur nach Benutzeraktion. */
(() => {
  'use strict';
  const api=window.NeoNetOnline;
  const $=id=>document.getElementById(id);
  const state=$('icp-live-status'), details=$('icp-live-details'), output=$('icp-live-output');
  const connect=$('icp-live-connect'), refresh=$('icp-live-refresh'), test=$('icp-live-test'), check=$('icp-live-check');
  let lastBuild=null;
  const safeJSON=data=>JSON.stringify(data,(key,value)=>/token|authorization|secret|password/i.test(key)?'[VERDECKT]':value,2);
  function buttons(busy=false) {
    connect.disabled=busy;
    refresh.disabled=busy || !api.isConnected();
    test.disabled=busy || !api.isConnected();
    check.disabled=busy || !api.isConnected() || !lastBuild;
  }
  function show(status,message,kind) {state.textContent=status;state.className='pill '+kind;details.textContent=message;}
  async function run(kind) {
    buttons(true);
    show('ANFRAGE LÄUFT','Kommunikation mit dem lokalen Dienst…','unknown');
    try {
      const result=kind==='connect' ? await api.connect() : kind==='test' ? await api.buildTest() : kind==='check' ? await api.check(lastBuild.sop,lastBuild.cop) : await api.status();
      if (kind==='connect') {
        lastBuild=null;
        show('SITZUNG AKTIV','Token-Session hergestellt. Die NeoNet-Module bleiben Mock-Daten.','online');
        output.textContent='Session erfolgreich. Token wird nicht angezeigt.';
        // Nicht automatisch in einer endlosen Schleife erneut anmelden.
        try {
          const s=await api.status();
          show('API ERREICHBAR','Status von der Serveranwendung empfangen; keine Hardwareerkennung nachgewiesen.','online');
          output.textContent=safeJSON(s);
        } catch(e) {
          show(e.code==='unavailable'?'FUNKTION FEHLT':'API-FEHLER',e.message,'unknown');
          output.textContent='';
        }
      } else if(kind==='test') {
        lastBuild={sop:result.sop,cop:result.cop};
        show('TEST ERFOLGREICH','SOP und COP von der API erzeugt. Keine Hardwareverbindung nachgewiesen.','online');
        output.textContent=safeJSON(result);
      } else {
        show('API ERREICHBAR',kind==='check'?'SOP/COP-Prüfung abgeschlossen.':'Statusdaten der lokalen Anwendung empfangen.','online');
        output.textContent=safeJSON(result);
      }
    } catch(e) {
      show(e.code==='expired'?'SESSION ABGELAUFEN':e.code==='browser_denied'?'BROWSER SPERRT':e.code==='forbidden'?'ZUGRIFF VERWEIGERT':e.code==='unauthorized'?'HTTP 401':e.code==='unavailable'?'FUNKTION FEHLT':e.code==='bootstrap_failed'?'SESSION-FEHLER':'VERBINDUNGSFEHLER',e.message,'offline');
      output.textContent='';
    } finally {buttons();}
  }
  connect.addEventListener('click',()=>run('connect'));
  refresh.addEventListener('click',()=>run('status'));
  test.addEventListener('click',()=>run('test'));
  check.addEventListener('click',()=>{if(lastBuild)run('check');});
  show('NICHT VERBUNDEN','Online-Vorschau: Für eine Sitzung auf „Lokalen Dienst verbinden“ klicken. Der Browser kann eine Freigabe für Loopback verlangen.','unknown');
  output.textContent='Keine Anfrage ausgeführt. Die NeoNet-Module bleiben Mock-Daten.';
  buttons();
})();
