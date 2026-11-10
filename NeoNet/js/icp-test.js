(() => {
  'use strict';
  const api = window.NeoNetICP;
  const $ = id => document.getElementById(id);
  const buttons = [$('status-button'), $('frame-button'), $('check-button')];
  let lastBuild = null;
  if (window.NeoNetDeployment?.icpEnabled === false) {
    $('connection-state').textContent='ONLINE-VORSCHAU';
    $('connection-state').className='pill unknown';
    $('result-state').textContent='DEAKTIVIERT';
    $('result-state').className='pill unknown';
    $('status-details').textContent='ICP-Zugriff ist in dieser öffentlichen Vorschau nicht freigegeben.';
    $('result-help').textContent='Die lokale TEST-Schnittstelle ist ausschließlich in der vom ICP ausgelieferten Web-Config aktiv.';
    $('response-output').textContent='Keine HTTP-Anfrage an VLT-ICP ausgeführt.';
    [...buttons, $('clear-button')].forEach(button=>button.disabled=true);
    return;
  }
  const states = {ok:'online',fail:'offline',neutral:'unknown'};
  function state(el,text,kind) { el.textContent=text; el.className='pill '+(states[kind]||states.neutral); }
  function display(method,path,body) {
    $('request-output').textContent = `${method} ${location.origin}${path}\nAnmeldung: ICP-Sitzungscookie (HttpOnly, automatisch)` +
      (body === undefined ? '' : '\nContent-Type: application/json\n\n'+JSON.stringify(body,null,2));
  }
  async function run(title,path,body,action) {
    buttons.forEach(b=>b.disabled=true);
    state($('result-state'),'ANFRAGE LÄUFT','neutral');
    $('result-help').textContent=title;
    $('response-output').textContent='Warte auf ICP-Antwort…';
    display(body === undefined ? 'GET' : 'POST',path,body);
    try {
      const result=await action();
      $('response-output').textContent='HTTP 200 OK\n\n'+JSON.stringify(result,null,2);
      state($('connection-state'),'ICP VERBUNDEN','ok');
      state($('result-state'),'HTTP OK','ok');
      $('result-help').textContent= path === '/api/v1/build' ?
        'TEST wurde vom ICP-Core verarbeitet. Der vollständige originale TCP-Frame wurde nicht direkt eingespeist.' :
        path === '/api/v1/check' ? 'Der ICP-Core hat SOP und COP überprüft.' : 'Echte Statusdaten vom ICP empfangen.';
      if(path==='/api/v1/build') {
        lastBuild = result && result.sop && result.cop ? {sop:result.sop,cop:result.cop}:null;
        $('check-button').disabled = !lastBuild;
      }
      if(path==='/api/v1/status') {
        const icp = result.icp || {};
        $('status-details').textContent=`ICP ${icp.version || 'Version unbekannt'} · TCP-Client ${icp.ide_connected ? 'verbunden':'nicht verbunden'} · letzte Meldung ${icp.last_update||'unbekannt'}`;
      }
    } catch(err) {
      const msg=err.message||String(err);
      $('response-output').textContent='Fehler: '+msg;
      state($('result-state'),'FEHLER','fail');
      state($('connection-state'),'NICHT ERREICHBAR','fail');
      $('result-help').textContent=msg;
    } finally {
      buttons.forEach(b=>b.disabled=false);
      $('check-button').disabled=!lastBuild;
    }
  }
  if ($('original-frame').textContent !== api.TEST_FRAME) throw new Error('Referenzframe stimmt nicht überein.');
  $('status-button').addEventListener('click',()=>run('Status wird abgefragt','/api/v1/status',undefined,api.status));
  $('frame-button').addEventListener('click',()=>run('TEST wird erzeugt','/api/v1/build',api.TEST_BUILD,api.buildTest));
  $('check-button').addEventListener('click',()=>{
    if(lastBuild) run('SOP / COP werden geprüft','/api/v1/check',lastBuild,()=>api.check(lastBuild.sop,lastBuild.cop));
  });
  $('clear-button').addEventListener('click',()=>{
    $('request-output').textContent='Noch keine Anfrage';
    $('response-output').textContent='Noch keine Antwort';
    $('result-help').textContent='Ausgabe gelöscht.';
    state($('result-state'),'BEREIT','neutral');
  });
  $('result-help').textContent='Automatische Sitzungsanmeldung und ICP-Statusabfrage laufen…';
  run('Automatische ICP-Statusabfrage','/api/v1/status',undefined,api.status);
})();
