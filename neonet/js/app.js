/* View layer. No fetch(), WebSocket, protocol messages or device writes. */
(function () {
  'use strict';
  const { buildView, dashboard, validateDraft } = window.NeoNetCore;
  const state = { page:'dashboard', scenario:'seven', role:'user', selectedModule:null, selectedNetwork:null, search:'', filter:'all' };
  const pageMeta = {
    dashboard:['SYSTEMÜBERSICHT','Dashboard','Erkannte Geräteidentitäten, Übertragungswege und Diagnose – aus simulierten IDE-Meldungen.'],
    modules:['GERÄTEVERWALTUNG','Module','Ein Modul bleibt ein Modul – auch wenn die IDE mehrere Zugriffswege meldet.'],
    network:['KONFIGURATION / ENTWURF','Netzwerk','Anzeige gemeldeter Netzparameter; lokale Entwurfsprüfung ohne Übertragung an Geräte.'],
    topology:['PHYSIK / LOGIK','Topologie','Bestätigte und unbestätigte Verbindungen werden strikt getrennt dargestellt.'],
    diagnostics:['STATUS / FEHLER','Diagnose','Beispielhafte Fehler, Erreichbarkeit und Schnittstellenmeldungen.']
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dot = s => `<span class="status-dot ${esc(s)}"></span>`;
  const labelState = {online:'Online',offline:'Offline',degraded:'Eingeschränkt',unknown:'Unbekannt'};
  const routeName = {rs422:'RS422',ethernet:'Ethernet',mixed:'Gemischt',unknown:'Unbekannt'};
  const pill = (name, kind='') => `<span class="pill ${esc(kind)}">${esc(name)}</span>`;
  const statusPill = s => `<span class="pill ${esc(s)}">${dot(s)}${esc(labelState[s] || 'Unbekannt')}</span>`;
  const routes = mod => mod.routes.length ? `<div class="route-list">${mod.routes.map(r => pill(`${routeName[r.type]} · ${r.via}`,r.type==='rs422'?'violet':r.type==='ethernet'?'cyan':'')).join('')}</div>` : '<span class="small-muted">Kein Weg gemeldet</span>';
  const membership = mod => mod.membershipConfirmed ? esc(mod.membership) : '<span class="small-muted">Nicht bestätigt</span>';
  const panel = (heading, kicker, body, side='') => `<section class="panel"><div class="panel-header"><div><div class="panel-kicker">${esc(kicker)}</div><h2 class="panel-heading">${esc(heading)}</h2></div>${side}</div><div class="panel-body">${body}</div></section>`;
  function current() { return buildView(window.NeoNetMocks.get(state.scenario)); }
  function notice(text, style='') { return `<div class="notice ${esc(style)}">${esc(text)}</div>`; }

  function sharedAccessPanel(view) {
    const info=view.sharedAccess;
    if (!info) return '';
    const count=view.modules.filter(m=>m.sharedIpAccess?.address===info.ip).length;
    return panel('Ein IP-Zugang, sieben Module','MOCK / ANGENOMMENER VERBUND',
      `<div class="access-overview"><div><span class="small-kicker">GEMEINSAMER IP-ZUGANG</span><strong class="access-ip">${esc(info.ip)}</strong><span class="small-muted">Ein Ethernet-Endpunkt – keine sieben IP-Adressen</span></div>`+
      `<div><span class="small-kicker">ETHERNET / RS422-ÜBERGANG</span><strong>${esc(info.gatewayName)}</strong><span class="small-muted">Gateway-Funktion nur für dieses Beispiel angenommen</span></div>`+
      `<div><span class="small-kicker">HINTER DEM ZUGANG</span><strong>${count} eigenständige NeoNet-Module</strong><span class="small-muted">Jedes mit eigener EEPROM-ID und NeoNet-Adresse</span></div></div>`+
      notice('Topologie und aktiver Weg sind hier ausdrücklich simulierte Vorgaben, keine echte IDE-Erkennung.','info'));
  }
  function accessLabel(m) {
    if (!m.sharedIpAccess?.address) return '<span class="small-muted">Nicht gemeldet</span>';
    return `${esc(m.sharedIpAccess.address)}<div class="id-text">${m.sharedIpAccess.kind==='endpoint'?'Eigene Ethernet-Schnittstelle':'Über Pixel Controller A · keine eigene IP'}</div>`;
  }
  function pathLabel(m) {
    return m.activePath ? `<strong>${esc(m.activePath)}</strong><div class="small-muted">Beispielweg (Mock)</div>` : '<span class="small-muted">Aktiver Weg nicht gemeldet</span>';
  }
  function renderDashboard(view) {
    const s = dashboard(view);
    const metrics = [
      ['GERÄTEIDENTITÄTEN',s.total,'Verschiedene Module (kein Doppeltzählen)',''],
      ['ONLINE',s.online,'Erreichbar laut Mock-Meldung','violet'],
      ['EINGESCHRÄNKT',s.degraded,'Teilweise Kommunikationsprobleme','yellow'],
      ['OFFLINE',s.offline,'Keine Erreichbarkeit gemeldet','red']
    ].map(([label,value,detail,cls]) => `<div class="panel metric ${cls}"><div class="metric-label">${esc(label)}</div><div class="metric-value">${value}</div><div class="metric-detail">${esc(detail)}</div></div>`).join('');
    const allWarnings = view.warnings.concat(view.links.filter(l=>l.state==='interrupted').map(l=>`Unterbrochene Verbindung: ${linkNames(l,view)}.`));
    const gateway = view.modules.find(m=>m.isGateway);
    const left = panel('Modulstatus','IDENTITÄT / AUTO-DETECT',`<div class="module-mini">${view.modules.slice(0,7).map(m=>`<div class="module-mini-item"><div><div class="module-mini-name">${dot(m.state)} ${esc(m.name)}</div><div class="module-mini-meta">${esc(m.address)} · ${m.identityConfirmed?esc(m.eepromId):'Identität offen'}</div></div><div class="module-row-actions">${statusPill(m.state)}<button class="text-link" type="button" data-open-module="${esc(m.key)}">Details →</button></div></div>`).join('')}</div>`,pill(`${view.modules.length} MODULE`));
    const right = panel('Gateway & Verbindung','TRANSPORTSTATUS',`<div class="info-pair"><div><span class="small-kicker">GATEWAY</span><strong>${gateway ? esc(gateway.name)+' · '+esc(gateway.gatewayState) : 'Nicht gemeldet'}</strong></div><div><span class="small-kicker">ERFASSTE KANTEN</span><strong>${s.confirmedLinks} bestätigt · ${view.links.length-s.confirmedLinks} unbestätigt · ${s.brokenLinks} unterbrochen</strong></div><div><span class="small-kicker">ÜBERTRAGUNGSWEGE</span><strong>Nur von der IDE gemeldete Wege – keine Browsererkennung</strong></div></div>`);
    const warningBox = panel('Hinweise','KONSISTENZ / DIAGNOSE',allWarnings.length ? allWarnings.map(w=>notice(w)).join('') : notice('Keine zusätzlichen Hinweise im aktuellen Mock-Szenario.','info'));
    const latest = panel('Letzte Ereignisse','EREIGNISPROTOKOLL',renderEvents(view.events.slice(0,4)));
    return `<div class="metrics">${metrics}</div>${sharedAccessPanel(view)}<div class="panel-grid section-space">${left}${right}</div><div class="panel-grid section-space">${warningBox}${latest}</div>`;
  }
  function renderEvents(events) {
    return events.length ? `<div class="event-list">${events.map(e => `<div class="event-item"><span class="event-time">${esc(e.time)}</span><span class="event-source">${esc(e.source)}</span><span class="event-message"><span class="event-level ${esc(e.level)}">${esc(e.level.toUpperCase())}</span>${esc(e.message)}</span></div>`).join('')}</div>` : '<p class="empty">Keine Ereignisse gemeldet.</p>';
  }
  function renderModules(view) {
    if (!state.selectedModule || !view.modules.some(m=>m.key===state.selectedModule)) state.selectedModule=view.modules[0]?.key || null;
    const filtered=view.modules.filter(m => {
      const txt=[m.name,m.eepromId,m.address,m.membership,m.hardware,m.firmware].join(' ').toLowerCase();
      return txt.includes(state.search.toLowerCase()) && (state.filter==='all' || m.state===state.filter);
    });
    const rows = filtered.map(m=>`<tr><td><strong>${esc(m.name)}</strong><div class="id-text">${m.identityConfirmed?esc(m.eepromId):'EEPROM-ID unbestätigt'}</div></td><td>${esc(m.address)}</td><td>${statusPill(m.state)}</td><td>${pathLabel(m)}<div class="route-list">${m.routes.map(r=>pill(routeName[r.type],r.type==='rs422'?'violet':'cyan')).join(' ')||'–'}</div></td><td>${accessLabel(m)}</td><td>${membership(m)}</td><td><button type="button" data-open-module="${esc(m.key)}">Öffnen →</button></td></tr>`).join('');
    const table=panel('Erfasste Module','EEPROM-ID / ADRESSE / VERBUND',`<div class="table-wrap"><table class="data-table"><thead><tr><th>Modul / Identität</th><th>NeoNet-Adresse</th><th>Status</th><th>Weg / aktiver Zugriff</th><th>IPv4-Zugang</th><th>Verbund</th><th>Details</th></tr></thead><tbody>${rows || '<tr><td colspan="7">Keine passenden Module.</td></tr>'}</tbody></table></div>`,`<div class="table-tools"><input id="module-search" class="search-input" aria-label="Module suchen" placeholder="Module suchen …" value="${esc(state.search)}"><select id="module-filter" class="filter-select" aria-label="Statusfilter"><option value="all" ${state.filter==='all'?'selected':''}>Alle Status</option><option value="online" ${state.filter==='online'?'selected':''}>Online</option><option value="offline" ${state.filter==='offline'?'selected':''}>Offline</option><option value="degraded" ${state.filter==='degraded'?'selected':''}>Eingeschränkt</option><option value="unknown" ${state.filter==='unknown'?'selected':''}>Unbekannt</option></select></div>`);
    const m=view.modules.find(m=>m.key===state.selectedModule);
    const details=m? panel(m.name,'GERÄTEDETAILS / GEMELDET',`<dl class="details-grid"><div><dt>EEPROM-Identität</dt><dd>${m.identityConfirmed?esc(m.eepromId):'Nicht bestätigt'}</dd></div><div><dt>NeoNet-Adresse</dt><dd>${esc(m.address)}</dd></div><div><dt>Status</dt><dd>${statusPill(m.state)}</dd></div><div><dt>Verbund</dt><dd>${membership(m)}</dd></div><div><dt>Betriebsart</dt><dd>${esc(m.mode)}</dd></div><div><dt>Gateway</dt><dd>${m.isGateway?'Ja · '+esc(m.gatewayState):'Nein'}</dd></div><div><dt>Hardware</dt><dd>${esc(m.hardware)}</dd></div><div><dt>Firmware</dt><dd>${esc(m.firmware)}</dd></div><div><dt>Beobachtungen</dt><dd>${m.observationIds.length} · IDs ${m.observationIds.map(esc).join(', ')}</dd></div><div><dt>Eigene IPv4-Adresse</dt><dd>${m.ipv4?esc(m.ipv4.address || 'Nicht gemeldet')+' · '+esc((m.ipv4.mode || '').toUpperCase()):'Keine eigene IPv4-Adresse gemeldet'}</dd></div><div><dt>Gemeinsamer IP-Zugang</dt><dd>${accessLabel(m)}</dd></div><div><dt>Aktiver Weg</dt><dd>${pathLabel(m)}</dd></div></dl><div class="section-space"><div class="small-kicker">GEMELDETE ERREICHBARKEIT</div>${routes(m)}</div>`):'';
    const scanPanel=panel('NeoNet-Scan','NEONET-IDE / HTTP-SCAN',
      `<div class="neonet-scan"><div class="scan-facts"><div><span class="small-kicker">ZIELANWENDUNG</span><strong id="neonet-scan-target">Noch nicht freigegeben</strong></div><div><span class="small-kicker">HTTP-PORT 8081</span><strong id="neonet-scan-port">Nicht geprüft</strong></div><div><span class="small-kicker">IDE-SESSION</span><strong id="neonet-scan-connection">Nicht geprüft</strong></div></div><p class="small-muted">Verbindlicher Scanbefehl: <code>$&lt;FE#FF#CFG#LOAD&gt;</code> – Übertragung ausschließlich durch die NeoNet-IDE, nicht durch den Browser an die Hardware.</p><div class="actions"><button class="btn" id="neonet-scan-start" type="button">Module scannen</button><button class="btn secondary" id="neonet-scan-probe" type="button">Port und Sitzung prüfen</button></div><p id="neonet-scan-message" class="scan-message" role="status" aria-live="polite">Der Scan-Klick startet einen HTTP-Sendeversuch an den bekannten IDE-API-Basispfad. Nach 5 Sekunden ohne IDE-Antwort erscheint eine Zeitüberschreitung. Ein Hardwareempfang ist dadurch nicht bestätigt.</p><details class="scan-response"><summary>Empfangsstatus / IDE-Antwort</summary><pre id="neonet-scan-response">Noch keine echte IDE-Antwort.</pre></details><p class="small-muted">Die nachfolgende Modultabelle enthält ausschließlich Mock-Daten. Ohne freigegebenes IDE-Antwortformat werden keine realen Module daraus abgeleitet.</p></div>`);
    return `<div class="stack">${scanPanel}${sharedAccessPanel(view)}${view.warnings.map(w=>notice(w)).join('')}${table}${details}</div>`;
  }
  function renderNetwork(view) {
    const devices=view.modules;
    if (!state.selectedNetwork || !devices.some(m=>m.key===state.selectedNetwork)) state.selectedNetwork=devices[0]?.key;
    const m=devices.find(mod=>mod.key===state.selectedNetwork);
    if (!m) return '<p class="empty">Keine Geräte vorhanden.</p>';
    const admin=state.role==='admin';
    const deviceSelect=`<select id="network-device" class="filter-select" aria-label="Zu konfigurierendes Modul">${devices.map(d=>`<option value="${esc(d.key)}" ${d.key===state.selectedNetwork?'selected':''}>${esc(d.name)} (${esc(d.address)})</option>`).join('')}</select>`;
    const modeAllowed=['Standalone','NeoNet-Verbund / Gateway','Multi-Standalone'];
    const mode=modeAllowed.includes(m.mode)?m.mode:'Standalone';
    const ipv4=m.ipv4 || {};
    const addressMode=ipv4.mode==='static'?'static':'dhcp';
    const dis=admin?'':'disabled';
    const options=modeAllowed.map(x=>`<option ${x===mode?'selected':''} value="${esc(x)}">${esc(x)}</option>`).join('');
    const form=`<form id="network-form" novalidate><div class="field-grid"><div class="field full"><label for="network-mode">Betriebsart (Entwurf)</label><select id="network-mode" name="mode" ${dis}>${options}</select></div><div class="field"><label for="ip-mode">IPv4-Adressvergabe</label><select id="ip-mode" name="addressing" ${dis}><option value="dhcp" ${addressMode==='dhcp'?'selected':''}>DHCP</option><option value="static" ${addressMode==='static'?'selected':''}>Statisch</option></select></div><div class="field"><label for="ip-address">IPv4-Adresse</label><input id="ip-address" name="address" value="${esc(ipv4.address||'')}" placeholder="192.168.20.10" ${dis}></div><div class="field"><label for="ip-mask">Netzmaske</label><input id="ip-mask" name="mask" value="${esc(ipv4.mask||'')}" placeholder="255.255.255.0" ${dis}></div><div class="field"><label for="ip-gateway">IPv4-Gateway (optional)</label><input id="ip-gateway" name="gateway" value="${esc(ipv4.gateway||'')}" placeholder="192.168.20.1" ${dis}></div></div><div class="actions"><button type="submit" class="btn" ${dis}>Entwurf lokal prüfen</button><button type="reset" class="btn secondary" ${dis}>Zurücksetzen</button>${pill('ÜBERTRAGUNG GESPERRT','violet')}</div><div id="draft-result" role="status"></div></form>`;
    return `<div class="stack">${sharedAccessPanel(view)}${notice('Gemeldete Verbindungsart und Modulzuordnung stammen ausschließlich aus dem Mock-Snapshot. Weder Ethernet-Link noch gleiche Adresse beweisen einen Verbund.','info')}${panel('Modul auswählen','KONFIGURATIONSKONTEXT',`<div class="info-pair"><div><span class="small-kicker">AUSGEWÄHLTES MODUL</span><strong>${esc(m.name)} · ${esc(m.eepromId||'Identität nicht bestätigt')}</strong></div><div><span class="small-kicker">VERBUNDZUORDNUNG</span><strong>${m.membershipConfirmed?esc(m.membership):'Keine bestätigte Zuordnung'}</strong></div><div><span class="small-kicker">EIGENE NETZPARAMETER</span><strong>${m.ipv4?esc(m.ipv4.mode||'Nicht gemeldet')+' · '+esc(m.ipv4.address||'Nicht gemeldet'):'Keine eigene IPv4 gemeldet'}</strong></div><div><span class="small-kicker">ERREICHBAR ÜBER</span><strong>${m.sharedIpAccess?esc(m.sharedIpAccess.address)+' · '+(m.sharedIpAccess.kind==='endpoint'?'Direkt':'via '+esc(m.sharedIpAccess.through)):'Nicht gemeldet'}</strong></div></div>`,deviceSelect)}${panel('Netzwerk-Entwurf',admin?'ADMINISTRATOR / REINE SIMULATION':'BENUTZER / LESEZUGRIFF',`${notice(admin?'Admin-Rollenansicht: Eingaben prüfen nur die Syntax; keine Speicherung oder Übertragung. Dies ist keine Authentifizierung.':'Benutzeransicht: Konfigurationsfelder sind gesperrt. Keine Rechteprüfung findet im Browser als Sicherheitsentscheidung statt.','info')}${form}`)}${panel('Freigabegrenzen','TECHNISCHE VORAUSSETZUNGEN','<div class="info-pair"><div><span class="small-kicker">SCHREIBOPERATIONEN</span><strong>Nicht implementiert – Schnittstelle, Authentifizierung und Freigabe offen</strong></div><div><span class="small-kicker">VERBUND / GATEWAY</span><strong>Keine automatische Mitgliedschaft aus LAN-Link oder Adressgleichheit</strong></div><div><span class="small-kicker">NETZWERKPARAMETER</span><strong>Nur nach Rückmeldung und Freigabe der IDE verbindlich</strong></div></div>')}</div>`;
  }
  function linkNames(l,view){return [view.modules.find(m=>m.key===l.source)?.name||'?',view.modules.find(m=>m.key===l.target)?.name||'?'].join(' ↔ ');}
  function graphSvgShared(view) {
    const info=view.sharedAccess;
    const gateway=view.modules.find(m=>m.eepromId===info.gatewayEepromId);
    const others=view.modules.filter(m=>m!==gateway);
    const gatewayBox=`<g class="graph-node gateway online" transform="translate(315,241)"><rect width="209" height="78" rx="7"/><circle class="state-indicator" cx="15" cy="17" r="4"/><text x="27" y="22">${esc(gateway?.name||info.gatewayName)}</text><text class="secondary" x="12" y="43">${esc(gateway?.address||'?')} · GATEWAY (MOCK)</text><text class="secondary" x="12" y="60">${esc(info.ip)}</text></g>`;
    const ethernet=`<g class="graph-node online" transform="translate(20,245)"><rect width="166" height="68" rx="7"/><text x="15" y="29">IDE / ETHERNET</text><text class="secondary" x="15" y="48">Zugriff (Beispiel)</text></g><line class="graph-line ethernet uncertain" x1="186" y1="279" x2="315" y2="279"/><text class="graph-tag" x="208" y="260">ETHERNET</text>`;
    const rest=others.map((m,i)=>{
      const y=35+i*86,cy=y+34;
      return `<line class="graph-line rs422 uncertain" x1="620" y1="${cy}" x2="665" y2="${cy}"/><g class="graph-node ${esc(m.state)}" transform="translate(665,${y})"><rect width="270" height="68" rx="7"/><circle class="state-indicator" cx="15" cy="18" r="4"/><text x="27" y="24">${esc(m.name)}</text><text class="secondary" x="12" y="46">${esc(m.address)} · ${esc(m.eepromId||'ID offen')}</text></g>`;
    }).join('');
    return `<div class="topology-canvas"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 565" role="img" aria-label="Hypothetischer Verbund mit sieben NeoNet-Modulen über einen gemeinsamen IP-Zugang"><title>Sieben Modulidentitäten über 192.168.188.55 – nicht bestätigte Musterverkabelung</title><text class="graph-tag" x="21" y="23">MUSTER / NICHT VON IDE ERKANNTE TOPOLOGIE</text>${ethernet}<text class="graph-tag" x="547" y="31">RS422-BUS (SCHEMATISCH)</text><line class="graph-line rs422 uncertain" x1="524" y1="280" x2="620" y2="280"/><line class="graph-line rs422 uncertain" x1="620" y1="69" x2="620" y2="499"/>${rest}${gatewayBox}</svg></div>`;
  }
  function graphSvg(view) {
    if (view.sharedAccess) return graphSvgShared(view);
    const modules=view.modules.slice(0,8);
    const positions=[[410,180],[110,90],[705,90],[110,300],[705,305],[405,350],[700,430],[100,430]];
    // The mock uses a fixed layout. Position is never interpreted as a detected physical route.
    const coords=new Map(); const gateway=modules.find(m=>m.isGateway);
    const ordered=gateway?[gateway,...modules.filter(m=>m!==gateway)]:modules;
    ordered.forEach((m,i)=>coords.set(m.key,positions[i]));
    const lines=view.links.filter(l=>coords.has(l.source)&&coords.has(l.target)).map(l=>{
      const a=coords.get(l.source),b=coords.get(l.target),x1=a[0]+65,y1=a[1]+31,x2=b[0]+65,y2=b[1]+31;
      return `<line class="graph-line ${esc(l.type)} ${l.confirmation==='unconfirmed'?'uncertain':''} ${l.state==='interrupted'?'interrupted':''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><title>${esc(linkNames(l,view))}: ${esc(l.confirmation==='confirmed'?'Von IDE bestätigt (Mock)':'Nicht bestätigt')} · ${esc(l.note)}</title></line>`;
    }).join('');
    const nodes=ordered.map(m=>{
      const [x,y]=coords.get(m.key),short=m.name.length>20?m.name.slice(0,19)+'…':m.name;
      return `<g class="graph-node ${m.isGateway?'gateway':''} ${esc(m.state)}" transform="translate(${x},${y})"><rect width="135" height="63" rx="7"/><circle class="state-indicator" cx="13" cy="17" r="4"/><text x="23" y="21">${esc(short)}</text><text class="secondary" x="12" y="44">${esc(m.address)} ${m.isGateway?'· GATEWAY':''}</text><title>${esc(m.name)}; ${esc(m.eepromId||'Identität unbekannt')}; Status ${esc(labelState[m.state])}</title></g>`;
    }).join('');
    return `<div class="topology-canvas"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 510" role="img" aria-label="Topologieskizze aus IDE-Mock-Meldungen; gestrichelte Linien sind nicht bestätigt"><title>NeoNet-Netzwerkskizze (Simulation)</title><text class="graph-tag" x="22" y="29">TOPOLOGIE / IDE-GEMELDETE KANTEN · MOCK</text>${lines}${nodes}</svg></div>`;
  }
  function renderTopology(view) {
    const links=view.links.map(l=>`<li>${pill(routeName[l.type],l.type==='rs422'?'violet':'cyan')} <strong>${esc(linkNames(l,view))}</strong> · ${l.confirmation==='confirmed'?'Bestätigt (Mock)':'Nicht bestätigt'} · ${esc(l.state)}<div class="small-muted">${esc(l.note)}</div></li>`).join('');
    return `<div class="stack">${sharedAccessPanel(view)}${notice('Positionen in der Skizze dienen nur der Lesbarkeit. Physische und logische Verbindungen dürfen nur nach ausdrücklicher Bestätigung durch die IDE als gesichert gelten.','info')}${panel('Netzwerkskizze','RS422 / ETHERNET / GEMISCHT',`${graphSvg(view)}<div class="legend"><span><i class="legend-line rs"></i> RS422</span><span><i class="legend-line"></i> Ethernet</span><span><i class="legend-line broken"></i> Unterbrochen</span><span><i class="legend-line unsure"></i> Nicht bestätigt</span></div>`)}${panel('Verbindungsnachweise','GEMELDETE KANTEN',`<ul class="edge-list">${links || '<li>Keine Kanten gemeldet.</li>'}</ul>`)}${panel('Abgrenzung','VERBUNDZUORDNUNG','<p class="panel-subtitle">Ein Ethernet-Link belegt keine NeoNet-Verbundzugehörigkeit. Ein mehrmals über unterschiedliche Transportwege gefundenes Modul bleibt bei bestätigter EEPROM-Identität ein Gerät. Gleiche NeoNet-Adressen verschiedener Identitäten führen zu keiner Zusammenführung.</p>')}</div>`;
  }
  function renderDiagnostics(view) {
    const routeRows=view.modules.flatMap(m => m.routes.map(r=>`<tr><td><strong>${esc(m.name)}</strong></td><td>${pill(routeName[r.type],r.type==='rs422'?'violet':'cyan')}</td><td>${esc(r.via)}</td><td>${statusPill(r.state)}</td></tr>`)).join('');
    const warnings=view.warnings.map(w=>notice(w)).join('');
    return `<div class="stack">${sharedAccessPanel(view)}${warnings}${panel('Ereignisse','STATUS / WARNUNGEN / FEHLER',renderEvents(view.events),'<button id="copy-diagnostics" class="btn secondary" type="button">Mock-Bericht kopieren</button>')}${panel('Schnittstellenstatus','ERREICHBARKEIT NACH IDE-MELDUNG',`<div class="table-wrap"><table class="data-table"><thead><tr><th>Modul</th><th>Gemeldeter Weg</th><th>Schnittstelle</th><th>Status</th></tr></thead><tbody>${routeRows||'<tr><td colspan="4">Keine Transportdaten gemeldet.</td></tr>'}</tbody></table></div>`)}${panel('Debug & Protokoll','FREIGABE NOCH OFFEN','<div class="info-pair"><div><span class="small-kicker">VLT-ICP / PROTOKOLLTRACES</span><strong>Keine Befehle, Traces oder Dekodierung implementiert</strong></div><div><span class="small-kicker">DATENHERKUNFT</span><strong>Lokale JavaScript-Mock-Datei, nicht IDE oder Hardware</strong></div><div><span class="small-kicker">SICHERHEIT</span><strong>Keine Kommunikation zum Netzwerk; spätere Diagnoseausgaben benötigen Freigabe</strong></div></div>')}</div>`;
  }
  function render() {
    const view=current(); const [kicker,title,subtitle]=pageMeta[state.page];
    document.getElementById('page-kicker').textContent='NEONET / '+kicker;
    document.getElementById('page-title').innerHTML=esc(title)+'<span class="title-accent">.</span>';
    document.getElementById('page-subtitle').textContent=subtitle;
    document.getElementById('breadcrumb').innerHTML='SYSTEM <span>/</span> '+esc(title.toUpperCase());
    document.getElementById('source-status').textContent=view.sourceStatus;
    document.getElementById('source-updated').textContent=view.updatedAt;
    document.querySelectorAll('[data-page]').forEach(btn=>{const active=btn.dataset.page===state.page;btn.classList.toggle('active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
    const pages={dashboard:renderDashboard,modules:renderModules,network:renderNetwork,topology:renderTopology,diagnostics:renderDiagnostics};
    document.getElementById('view').innerHTML=pages[state.page](view);
    const icpPanel=document.querySelector('.icp-live-panel');
    if (icpPanel) icpPanel.hidden=state.page==='modules';
    bindPage(view);
    if (window.NeoNetIDEScan) {
      if (state.page==='modules') window.NeoNetIDEScan.mount();
      else window.NeoNetIDEScan.leave();
    }
  }
  function bindPage(view) {
    document.querySelectorAll('[data-open-module]').forEach(btn=>btn.addEventListener('click',()=>{
      state.selectedModule=btn.dataset.openModule;state.page='modules';render();document.getElementById('view').scrollIntoView({behavior:'smooth',block:'start'});
    }));
    const search=document.getElementById('module-search');
    if (search) search.addEventListener('input',()=>{
      const cursor=search.selectionStart;state.search=search.value;render();const next=document.getElementById('module-search');next.focus();next.setSelectionRange(cursor,cursor);
    });
    const filter=document.getElementById('module-filter');if(filter)filter.addEventListener('change',()=>{state.filter=filter.value;render();});
    const networkDevice=document.getElementById('network-device');if(networkDevice)networkDevice.addEventListener('change',()=>{state.selectedNetwork=networkDevice.value;render();});
    const form=document.getElementById('network-form');
    if(form) {
      form.addEventListener('submit',e=>{
        e.preventDefault();if(state.role!=='admin')return;
        const data=Object.fromEntries(new FormData(form));const errors=validateDraft(data);const out=document.getElementById('draft-result');
        out.className='preview-output'+(errors.length?' errors':'');
        out.textContent=errors.length?`Entwurf nicht valide:\n• ${errors.join('\n• ')}\nKeine Änderung vorgenommen.`:`Lokale Prüfung erfolgreich.\nBetriebsart: ${data.mode}\nIPv4-Modus: ${data.addressing}\n${data.addressing==='static'?'IP: '+data.address+' / '+data.mask+'\n':''}Keine Änderung gespeichert oder gesendet. Freigaben fehlen.`;
      });
      form.addEventListener('reset',()=>{const out=document.getElementById('draft-result');out.textContent='';out.className='';});
    }
    const copy=document.getElementById('copy-diagnostics');
    if(copy)copy.addEventListener('click',async()=>{
      const result=JSON.stringify({simulation:true,scenario:view.scenario,modules:view.modules,links:view.links,warnings:view.warnings,events:view.events},null,2);
      try {if(!navigator.clipboard)throw new Error('Clipboard nicht verfügbar');await navigator.clipboard.writeText(result);copy.textContent='Mock-Bericht kopiert';}
      catch {copy.textContent='Kopieren nicht möglich';const output=document.createElement('pre');output.className='preview-output';output.textContent=result;copy.closest('.panel-body').appendChild(output);}
    });
  }
  document.getElementById('nav').addEventListener('click',e=>{const btn=e.target.closest('[data-page]');if(!btn)return;state.page=btn.dataset.page;render();document.getElementById('main').focus();});
  document.getElementById('scenario').addEventListener('change',e=>{state.scenario=e.target.value;state.selectedModule=null;state.selectedNetwork=null;render();});
  document.getElementById('role').addEventListener('change',e=>{state.role=e.target.value;render();});
  render();
})();