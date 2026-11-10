/* Öffentliche Testseite; Anmeldung nur nach Klick. */
(() => {
  'use strict';
  const api=window.NeoNetOnline;
  const $=id=>document.getElementById(id);
  const status=$('status-button'),frame=$('frame-button'),check=$('check-button'),clear=$('clear-button'),conn=$('online-connect-button');
  let lastBuild=null;
  const safeJSON=data=>JSON.stringify(data,(key,value)=>/token|authorization|secret|password/i.test(key)?'[VERDECKT]':value,2);
  const state=(id,text,kind)=>{const e=$(id);e.textContent=text;e.className='pill '+kind;};
  function buttons(busy=false){conn.disabled=busy;status.disabled=busy||!api.isConnected();frame.disabled=busy||!api.isConnected();check.disabled=busy||!api.isConnected()||!lastBuild;}
  async function run(kind) {
    buttons(true);state('result-state','ANFRAGE LÄUFT','unknown');
    $('response-output').textContent='Warte auf lokale API…';
    try {
      const data=kind==='connect'?await api.connect():kind==='status'?await api.status():kind==='build'?await api.buildTest():await api.check(lastBuild.sop,lastBuild.cop);
      if(kind==='connect'){lastBuild=null;$('response-output').textContent='Session erfolgreich. Token wird nicht angezeigt.';$('request-output').textContent='POST '+api.origin()+'/api/v1/session-token';}
      else {$('response-output').textContent=safeJSON(data);$('request-output').textContent=(kind==='status'?'GET':'POST')+' '+api.origin()+'/api/v1/'+(kind==='status'?'status':kind==='build'?'build':'check')+'\nAnmeldung: Bearer-Token (vertraulich; nicht angezeigt)';}
      if(kind==='build')lastBuild={sop:data.sop,cop:data.cop};
      state('result-state','ERFOLGREICH','online');state('connection-state','LOKALE SESSION','online');
      $('result-help').textContent='Lokale API-Antwort erhalten; keine NeoNet-Geräteerkennung nachgewiesen.';
      $('status-details').textContent='Token nur im Arbeitsspeicher; keine Speicherung.';
    } catch(e) {
      state('result-state',e.code==='expired'?'SESSION ABGELAUFEN':e.code==='unauthorized'?'HTTP 401':e.code==='forbidden'?'HTTP 403':e.code==='unavailable'?'FUNKTION FEHLT':'FEHLER','offline');
      $('response-output').textContent=e.message;
      $('result-help').textContent=e.message;
    } finally {buttons();}
  }
  if ($('original-frame').textContent !== api.TEST_FRAME)throw new Error('Referenzframe stimmt nicht überein.');
  conn.addEventListener('click',()=>run('connect'));
  status.addEventListener('click',()=>run('status'));
  frame.addEventListener('click',()=>run('build'));
  check.addEventListener('click',()=>{if(lastBuild)run('check');});
  clear.addEventListener('click',()=>{$('request-output').textContent='Noch keine Anfrage';$('response-output').textContent='Noch keine Antwort';});
  state('connection-state','NICHT VERBUNDEN','unknown');
  $('status-details').textContent='Öffentliche Web-Config: nur nach Klick Verbindung zum eigenen lokalen Dienst herstellen.';
  $('result-help').textContent='Die Moduldaten bleiben Simulation.';
  buttons();
})();
