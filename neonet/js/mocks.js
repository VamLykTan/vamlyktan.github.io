/* Illustrative test observations, NOT the future Web↔IDE API contract. */
window.NeoNetMocks = (function () {
  const observation = (observationId, eepromId, name, address, state, routes, options = {}) => ({
    observationId, identity: { eepromId, confirmed: !!eepromId }, name, neonetAddress: address,
    state, hardware: options.hardware || 'Pixel Board 2.00',
    firmware: options.firmware || 'NeoDMX 1.90 (Mock)',
    membership: { group: options.group || '', confirmed: !!options.group },
    mode: options.mode || 'Standalone', isGateway: !!options.gateway,
    gatewayState: options.gatewayState || 'Nicht zutreffend', ipv4: options.ipv4 || null,
    reachability: routes,
    // Illustrative presentation facts, not a defined IDE API schema.
    activePath: options.activePath || '',
    sharedIpAccess: options.sharedIpAccess || null
  });
  const r = (type, via, state = 'online') => ({ type, via, state });
  function base() {
    return {
      title: 'Normalbetrieb', sourceStatus: 'Mock-Daten – kein IDE-Kontakt', updatedAt: 'Simulation · 03.11.2026',
      observations: [
        observation('scan-a-rs', 'EEP-NEO-0001', 'Pixel Controller A', '0x12', 'online', [r('rs422','RS-Bus 1')], {group:'Verbund Bühne', mode:'NeoNet-Verbund / Gateway'}),
        observation('scan-a-lan', 'EEP-NEO-0001', 'Pixel Controller A', '0x12', 'online', [r('ethernet','LAN 1')], {group:'Verbund Bühne', mode:'NeoNet-Verbund / Gateway'}),
        observation('scan-g', 'EEP-NEO-0002', 'NeoNet Gateway', '0x01', 'online', [r('mixed','RS ↔ Ethernet')], {group:'Verbund Bühne', mode:'NeoNet-Verbund / Gateway', gateway:true, gatewayState:'Online (Mock)', hardware:'Gateway-Prototyp (Mock)',ipv4:{mode:'static',address:'192.168.20.10',mask:'255.255.255.0',gateway:''}}),
        observation('scan-b', 'EEP-NEO-0003', 'Standalone B', '0x12', 'online', [r('ethernet','LAN 2')], {mode:'Standalone',ipv4:{mode:'dhcp', address:'192.168.20.81'}}),
        observation('scan-c', 'EEP-NEO-0004', 'Standalone C', '0x22', 'degraded', [r('ethernet','LAN 3','degraded')], {mode:'Multi-Standalone'}),
        observation('scan-d', 'EEP-NEO-0005', 'Pixel Controller D', '0x15', 'offline', [], {group:'Verbund Bühne',mode:'NeoNet-Verbund / Gateway'}),
        observation('scan-unknown', null, 'Unbestätigter Teilnehmer', 'Nicht gemeldet', 'unknown', [r('unknown','Quelle ungeklärt','unknown')], {hardware:'Nicht gemeldet',firmware:'Nicht gemeldet'})
      ],
      links: [
        {id:'link-rs',source:'scan-a-rs',target:'scan-g',type:'rs422',confirmation:'confirmed',state:'online',note:'Verbindung durch IDE bestätigt (Mock)'},
        {id:'link-eth',source:'scan-g',target:'scan-c',type:'ethernet',confirmation:'confirmed',state:'degraded',note:'Ethernet-Schnittstelle meldet Fehler (Mock)'},
        {id:'link-down',source:'scan-g',target:'scan-d',type:'rs422',confirmation:'confirmed',state:'interrupted',note:'RS-Verbindung unterbrochen (Mock)'},
        {id:'link-unknown',source:'scan-b',target:'scan-c',type:'ethernet',confirmation:'unconfirmed',state:'unknown',note:'Vermutete Kante – nicht als Topologie bestätigt'}
      ],
      events: [
        {level:'warn',time:'17:46:12',source:'RS-Bus 1',message:'Verbindung zu Pixel Controller D unterbrochen (Mock)'},
        {level:'warn',time:'17:46:07',source:'Standalone C',message:'Kommunikationsqualität eingeschränkt (Mock)'},
        {level:'info',time:'17:45:58',source:'AutoDetect',message:'Pixel Controller A über zwei Wege erreichbar, Identität bestätigt (Mock)'},
        {level:'info',time:'17:45:55',source:'Topologie',message:'Unbestätigte Ethernet-Kante bleibt gesondert gekennzeichnet'}
      ]
    };
  }
  // Seven distinct NeoNet EEPROM identities, one Ethernet entry point, no duplicate addresses.
  // Pixel Controller A is a *hypothetical* combined Ethernet/RS422 gateway in this illustration.
  // The six peripheral modules have NO independent IPv4 address; they are reachable *via* that IP.
  function sevenModulesOneIp() {
    const entryIp = '192.168.188.55';
    const group = 'Verbund Bühne – Beispiel';
    const access = (kind) => ({ address: entryIp, through: 'Pixel Controller A', kind });
    const items = [
      ['scan-pixel-a','EEP-NEO-0001','Pixel Controller A','0x12','Pixel Board 2.00','NeoDMX 1.90 (Mock)'],
      ['scan-dmx','EEP-NEO-0002','DMX Controller','0x13','DMX – Planung / Mock','Nicht gemeldet'],
      ['scan-audio-1','EEP-NEO-0003','Audio Einheit 1','0x14','Audio – Mock','Nicht gemeldet'],
      ['scan-audio-2','EEP-NEO-0004','Audio Einheit 2','0x15','Audio – Mock','Nicht gemeldet'],
      ['scan-pixel-b','EEP-NEO-0005','Pixel Einheit B','0x16','Pixel – Mock','Nicht gemeldet'],
      ['scan-pixel-c','EEP-NEO-0006','Pixel Einheit C','0x17','Pixel – Mock','Nicht gemeldet'],
      ['scan-pixel-d','EEP-NEO-0007','Pixel Einheit D','0x18','Pixel – Mock','Nicht gemeldet']
    ];
    const observations = items.map(([obsId,id,name,address,hardware,firmware],i) => observation(
      obsId,id,name,address,'online',
      i===0 ? [r('ethernet',`LAN · ${entryIp}`)] : [r('rs422','RS-Bus 1 · über Pixel Controller A')],
      {
        hardware,firmware,group,mode:'NeoNet-Verbund / Gateway',
        gateway:i===0,gatewayState:i===0?'Online (Mock)':'Nicht zutreffend',
        ipv4:i===0?{mode:'static',address:entryIp,mask:'255.255.255.0',gateway:''}:null,
        sharedIpAccess:access(i===0?'endpoint':'via-gateway'),
        activePath:i===0?'Ethernet (direkt)':'Ethernet → Pixel A → RS422'
      }
    ));
    return {
      title:'7 Module · 1 IP',
      sourceStatus:'MOCK: Beispiel-Verbund · keine IDE-Verbindung',
      updatedAt:'Simulation · 03.11.2026',
      sharedAccess:{ip:entryIp,gatewayEepromId:'EEP-NEO-0001',gatewayName:'Pixel Controller A',assumed:true},
      observations,
      links:items.slice(1).map(([target],i) => ({
        id:`illustrative-rs-${i+1}`,source:'scan-pixel-a',target,type:'rs422',
        confirmation:'unconfirmed',state:'online',
        note:'Angenommene RS422-Busanbindung für die Visualisierung, NICHT von der IDE bestätigt'
      })),
      events:[
        {level:'info',time:'18:49:00',source:'Mock',message:'7 unterschiedliche EEPROM-Identitäten, NeoNet-Adressen 0x12 bis 0x18 (Beispiel)'},
        {level:'info',time:'18:48:59',source:'IP-Zugang',message:'Nur Pixel Controller A besitzt in dieser Skizze die IPv4-Adresse 192.168.188.55'},
        {level:'warn',time:'18:48:58',source:'Topologie',message:'RS422-Anbindung der 6 weiteren Module ist angenommen, nicht hardwareseitig bestätigt'},
        {level:'info',time:'18:48:57',source:'DMX',message:'DMX ist ausschließlich als geplantes Mock-Modul dargestellt'}
      ]
    };
  }
  const scenarios = {
    seven: {label:'7 Module / 1 IP (Beispiel)',create:sevenModulesOneIp},
    normal: {label:'Ursprungs-Mock (N: Adresskonflikt)', create:base},
    gateway: {label:'Gateway offline', create() { const s=base();s.title='Gateway offline';const g=s.observations.find(o=>o.observationId==='scan-g');g.state='offline';g.gatewayState='Offline (Mock)';g.reachability=[];s.events.unshift({level:'error',time:'17:50:10',source:'Gateway',message:'Gateway nicht erreichbar (Mock)'});return s;}},
    unknown: {label:'Topologie unklar', create() {const s=base();s.title='Topologie unklar';s.links.forEach(l=>{l.confirmation='unconfirmed';l.state='unknown';l.note='Keine bestätigte physikalische Verbindung verfügbar';});s.events.unshift({level:'warn',time:'17:51:00',source:'Topologie',message:'Keine Verbindungskante bestätigt – Darstellung ist ungesichert (Mock)'});return s;}},
    addresses: {label:'Gleiche Adresse im Verbund', create(){const s=base();s.title='Adressgleichheit im Verbund';const x=s.observations.find(o=>o.observationId==='scan-d');x.neonetAddress='0x12';x.state='online';x.reachability=[r('rs422','RS-Bus 1')];s.events.unshift({level:'warn',time:'17:52:10',source:'IDE-Analyse',message:'Gleiche NeoNet-Adresse von getrennten Identitäten im Verbund gemeldet (Mock)'});return s;}}
  };
  return {scenarios, get(key) {return (scenarios[key] || scenarios.normal).create();}};
})();
