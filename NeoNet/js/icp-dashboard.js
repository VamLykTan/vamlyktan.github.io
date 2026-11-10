/* Live ICP status is independent of the mock NeoNet module data. */
(() => {
  'use strict';
  const api=window.NeoNetICP;
  const $=id=>document.getElementById(id);
  const status=$('icp-live-status');
  const details=$('icp-live-details');
  const output=$('icp-live-output');
  const refresh=$('icp-live-refresh');
  const test=$('icp-live-test');
  const check=$('icp-live-check');
  let lastBuild=null;
  if (window.NeoNetDeployment?.icpEnabled === false) {
    status.textContent='ONLINE-VORSCHAU';
    status.className='pill unknown';
    details.textContent='Keine lokale ICP-Verbindung in dieser öffentlichen Vorschau. Modulansichten sind simuliert.';
    output.textContent='Online-Modus: ICP-Session und HTTP-Befehle sind deaktiviert.';
    [refresh,test,check].forEach(button=>button.disabled=true);
    return;
  }
  async function run(kind) {
    [refresh,test,check].forEach(b=>b.disabled=true);
    status.textContent='VERBINDUNG LÄUFT';
    status.className='pill unknown';
    try {
      const response = kind==='test' ? await api.buildTest() : kind==='check' && lastBuild ? await api.check(lastBuild.sop,lastBuild.cop) : await api.status();
      status.textContent='ICP VERBUNDEN'; status.className='pill online';
      if(kind==='test') {
        lastBuild={sop:response.sop,cop:response.cop};
        details.textContent='TEST-Build vom ICP erfolgreich verarbeitet. SOP und COP erstellt.';
        output.textContent=JSON.stringify(response,null,2);
      } else if(kind==='check') {
        details.textContent='SOP/COP-Prüfung abgeschlossen.';
        output.textContent=JSON.stringify(response,null,2);
      } else {
        const icp=response.icp||{};
        details.textContent=`Version ${icp.version||'unbekannt'} · TCP-Client ${icp.ide_connected?'verbunden':'nicht verbunden'} · ICP erreichbar: ${icp.reachable===true?'ja':'unbekannt'}`;
        output.textContent=JSON.stringify(response,null,2);
      }
    } catch(err) {
      status.textContent='ICP NICHT ERREICHBAR'; status.className='pill offline';
      details.textContent=err.message||String(err);
      output.textContent='';
    } finally {
      refresh.disabled=false;
      test.disabled=false;
      check.disabled=!lastBuild;
    }
  }
  refresh.addEventListener('click',()=>run('status'));
  test.addEventListener('click',()=>run('test'));
  check.addEventListener('click',()=>run('check'));
  run('status');
})();
