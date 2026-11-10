/* NeoNet Web-Config: pure view-model functions. No transport, protocol or device commands. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NeoNetCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const knownStates = new Set(['online', 'offline', 'degraded', 'unknown']);
  const knownRoutes = new Set(['rs422', 'ethernet', 'mixed', 'unknown']);

  function clean(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }
  function status(state) { return knownStates.has(state) ? state : 'unknown'; }
  function routeType(type) { return knownRoutes.has(type) ? type : 'unknown'; }
  function uniqueBy(items, selector) {
    const seen = new Set();
    return items.filter(item => { const k = selector(item); if (seen.has(k)) return false; seen.add(k); return true; });
  }
  function deriveModules(observations) {
    const byKey = new Map();
    const conflicts = [];
    for (const obs of observations) {
      // Only an IDE-confirmed EEPROM identity may be used for deduplication.
      const id = obs.identity && obs.identity.confirmed === true ? clean(obs.identity.eepromId) : '';
      const observationId = clean(obs.observationId);
      if (!observationId) throw new Error('Mock observationId required');
      const key = id ? `id:${id}` : `observation:${observationId}`;
      const route = (obs.reachability || []).map(r => ({
        type: routeType(r.type), state: status(r.state), via: clean(r.via, 'Nicht gemeldet'),
        observationId
      }));
      if (!byKey.has(key)) {
        byKey.set(key, {
          key, eepromId: id || null, identityConfirmed: !!id,
          observationIds: [observationId], name: clean(obs.name, 'Unbenanntes Modul'),
          address: clean(obs.neonetAddress, 'Nicht gemeldet'),
          state: status(obs.state), hardware: clean(obs.hardware, 'Nicht gemeldet'),
          firmware: clean(obs.firmware, 'Nicht gemeldet'),
          membership: obs.membership && obs.membership.confirmed === true ? clean(obs.membership.group, '') : '',
          membershipConfirmed: !!(obs.membership && obs.membership.confirmed === true && clean(obs.membership.group)),
          mode: clean(obs.mode, 'Nicht gemeldet'), isGateway: obs.isGateway === true,
          gatewayState: clean(obs.gatewayState, 'Nicht gemeldet'),
          ipv4: obs.ipv4 || null, routes: route,
          activePath: clean(obs.activePath), sharedIpAccess: obs.sharedIpAccess || null
        });
      } else {
        const existing = byKey.get(key);
        existing.observationIds.push(observationId);
        existing.routes.push(...route);
        if (existing.state !== 'online' && status(obs.state) === 'online') existing.state = 'online';
        const claimedMembership = obs.membership && obs.membership.confirmed === true ? clean(obs.membership.group) : '';
        if (claimedMembership && existing.membershipConfirmed && claimedMembership !== existing.membership) {
          existing.membership = '';
          existing.membershipConfirmed = false;
          conflicts.push(`Widersprüchliche Verbundmeldung für ${existing.name}; Zuordnung nicht angezeigt.`);
        }
        if (clean(obs.neonetAddress) && existing.address !== clean(obs.neonetAddress)) {
          conflicts.push(`Unterschiedliche Adressmeldungen für ${existing.name}; IDE-Prüfung erforderlich.`);
        }
      }
    }
    const modules = [...byKey.values()].map(m => ({
      ...m, routes: uniqueBy(m.routes, r => [r.type, r.via, r.state].join('|'))
    }));
    const byAddress = new Map();
    for (const mod of modules) {
      if (mod.address === 'Nicht gemeldet') continue;
      if (!byAddress.has(mod.address)) byAddress.set(mod.address, []);
      byAddress.get(mod.address).push(mod);
    }
    for (const [address, group] of byAddress) {
      if (group.length > 1) {
        conflicts.push(`Adresse ${address} bei ${group.length} getrennten Geräteidentitäten gemeldet. Keine Zusammenführung; Adressraum durch IDE prüfen.`);
      }
    }
    return { modules, warnings: uniqueBy(conflicts, x => x) };
  }
  function dashboard(view) {
    const modules = view.modules;
    return {
      total: modules.length,
      online: modules.filter(m => m.state === 'online').length,
      offline: modules.filter(m => m.state === 'offline').length,
      degraded: modules.filter(m => m.state === 'degraded').length,
      gatewayCount: modules.filter(m => m.isGateway).length,
      confirmedLinks: view.links.filter(l => l.confirmation === 'confirmed').length,
      brokenLinks: view.links.filter(l => l.state === 'interrupted').length
    };
  }
  function buildView(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.observations) || !Array.isArray(snapshot.links)) {
      throw new Error('Ungültiger Mock-Snapshot');
    }
    const merged = deriveModules(snapshot.observations);
    const obsToKey = new Map();
    for (const mod of merged.modules) for (const id of mod.observationIds) obsToKey.set(id, mod.key);
    const links = snapshot.links.map((link, index) => ({
      id: clean(link.id, `link-${index}`),
      source: obsToKey.get(link.source) || '', target: obsToKey.get(link.target) || '',
      type: routeType(link.type), confirmation: link.confirmation === 'confirmed' ? 'confirmed' : 'unconfirmed',
      state: clean(link.state, 'unknown'), note: clean(link.note, 'Keine Detailmeldung')
    })).filter(l => l.source && l.target && l.source !== l.target);
    return {
      modules: merged.modules, warnings: merged.warnings,
      links, events: Array.isArray(snapshot.events) ? snapshot.events : [],
      sourceStatus: clean(snapshot.sourceStatus, 'Simulation'),
      updatedAt: clean(snapshot.updatedAt, 'Zeit unbekannt'),
      scenario: clean(snapshot.title, 'Simulation'),
      sharedAccess: snapshot.sharedAccess || null
    };
  }
  function validatedIpv4(ip) {
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return false;
    return ip.split('.').every(x => Number(x) <= 255);
  }
  function validateDraft(draft) {
    const errors = [];
    const modes = ['Standalone', 'NeoNet-Verbund / Gateway', 'Multi-Standalone'];
    if (!modes.includes(draft.mode)) errors.push('Betriebsart ist nicht gültig.');
    if (!['dhcp', 'static'].includes(draft.addressing)) errors.push('IPv4-Modus ist nicht gültig.');
    if (draft.addressing === 'static') {
      if (!validatedIpv4(draft.address)) errors.push('Ungültige IPv4-Adresse.');
      if (!validatedIpv4(draft.mask)) errors.push('Ungültige IPv4-Netzmaske.');
      if (draft.gateway && !validatedIpv4(draft.gateway)) errors.push('Ungültiges IPv4-Gateway.');
    }
    return errors;
  }
  return { deriveModules, dashboard, buildView, validateDraft, validatedIpv4 };
});
