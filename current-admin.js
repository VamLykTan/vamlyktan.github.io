(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.get("debug") !== "1") return;

  const PASSKEY_ID_KEY = "vlt_current_passkey_id_v1";
  const DRAFT_KEY = "vlt_current_events_draft_v1";

  let workingEvents = [];
  let sourceEvents = [];
  let editingIndex = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function encodeBase64Url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function setStatus(message, type = "info") {
    const status = byId("admin-status");
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type;
  }

  function cloneEvents(events) {
    return JSON.parse(JSON.stringify(events || []));
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(workingEvents));
    } catch (_) {
      /* localStorage kann blockiert sein. */
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (_) {
      /* localStorage kann blockiert sein. */
    }
  }

  function syncPreview() {
    window.VLT_EVENTS = cloneEvents(workingEvents);
    if (typeof window.VLTRenderEvents === "function") {
      window.VLTRenderEvents();
    }
    renderAdminList();
  }

  function formatBerlinDateTimeLabel(startIso, endIso) {
    const zone = "Europe/Berlin";
    const start = new Date(startIso);
    const end = new Date(endIso);

    const date = new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: zone
    }).format(start);

    const timeFormatter = new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: zone
    });

    return `${date} · ${timeFormatter.format(start)}–${timeFormatter.format(end)} Uhr`;
  }

  function toBerlinLocalInput(iso) {
    if (!iso) return "";
    const parts = new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date(iso));

    const map = {};
    parts.forEach(part => {
      if (part.type !== "literal") map[part.type] = part.value;
    });

    return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
  }

  function parseLocalDateTime(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function resetForm() {
    editingIndex = null;
    const form = byId("event-editor-form");
    if (form) form.reset();

    byId("admin-submit").textContent = "Veranstaltung übernehmen";
    byId("admin-cancel-edit").hidden = true;
    byId("admin-date-label").placeholder = "Wird automatisch erzeugt";
  }

  function fillForm(index) {
    const event = workingEvents[index];
    if (!event) return;

    editingIndex = index;
    byId("admin-title").value = event.title || "";
    byId("admin-start").value = toBerlinLocalInput(event.start);
    byId("admin-end").value = toBerlinLocalInput(event.end);
    byId("admin-date-label").value = event.dateLabel || "";
    byId("admin-place").value = event.place || "";
    byId("admin-role").value = event.role || "";
    byId("admin-text").value = event.text || "";
    byId("admin-url").value = event.url || "";

    byId("admin-submit").textContent = "Änderung übernehmen";
    byId("admin-cancel-edit").hidden = false;
    byId("admin-title").focus();
    window.scrollTo({ top: byId("current-admin").offsetTop - 20, behavior: "smooth" });
  }

  function removeEvent(index) {
    const event = workingEvents[index];
    if (!event) return;

    if (!window.confirm(`„${event.title}“ wirklich aus dem Entwurf entfernen?`)) {
      return;
    }

    workingEvents.splice(index, 1);
    saveDraft();
    syncPreview();
    resetForm();
    setStatus("Veranstaltung aus dem lokalen Entwurf entfernt.", "ok");
  }

  function renderAdminList() {
    const list = byId("admin-event-list");
    if (!list) return;

    list.replaceChildren();

    const ordered = workingEvents
      .map((event, index) => ({ event, index }))
      .sort((a, b) => new Date(b.event.start) - new Date(a.event.start));

    for (const item of ordered) {
      const row = document.createElement("div");
      row.className = "admin-event-row";

      const info = document.createElement("div");
      info.className = "admin-event-info";

      const title = document.createElement("strong");
      title.textContent = item.event.title;

      const meta = document.createElement("span");
      meta.textContent = item.event.dateLabel || formatBerlinDateTimeLabel(item.event.start, item.event.end);

      info.append(title, meta);

      const actions = document.createElement("div");
      actions.className = "admin-event-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Bearbeiten";
      edit.addEventListener("click", () => fillForm(item.index));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "danger";
      remove.textContent = "Entfernen";
      remove.addEventListener("click", () => removeEvent(item.index));

      actions.append(edit, remove);
      row.append(info, actions);
      list.appendChild(row);
    }
  }

  function serializeEvents() {
    return `window.VLT_EVENTS = ${JSON.stringify(workingEvents, null, 2)};\n`;
  }

  async function copyEventsFile() {
    try {
      await navigator.clipboard.writeText(serializeEvents());
      setStatus("current-events.js wurde in die Zwischenablage kopiert.", "ok");
    } catch (_) {
      setStatus("Kopieren nicht möglich. Nutze stattdessen den Download.", "error");
    }
  }

  function downloadEventsFile() {
    const blob = new Blob([serializeEvents()], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "current-events.js";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("current-events.js wurde erzeugt. Für die dauerhafte Online-Änderung muss diese Datei ins Repository übernommen werden.", "ok");
  }

  async function deviceAuthAvailable() {
    if (!window.isSecureContext || !window.PublicKeyCredential || !navigator.credentials) {
      return false;
    }

    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function") {
      return true;
    }

    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (_) {
      return false;
    }
  }

  async function setupDeviceAuth() {
    if (!(await deviceAuthAvailable())) {
      setStatus("Auf diesem Gerät ist keine geeignete Geräteauthentifizierung verfügbar.", "error");
      return;
    }

    const button = byId("admin-device-auth");
    button.disabled = true;

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(32));

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "VamLykTan" },
          user: {
            id: userId,
            name: "vamlyktan-admin",
            displayName: "VamLykTan Admin"
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            residentKey: "preferred",
            userVerification: "required"
          },
          attestation: "none",
          timeout: 60000
        }
      });

      if (!credential) {
        throw new Error("Kein Credential erhalten");
      }

      localStorage.setItem(PASSKEY_ID_KEY, encodeBase64Url(credential.rawId));
      button.textContent = "Geräteanmeldung eingerichtet";
      setStatus("Geräteanmeldung eingerichtet. Beim nächsten Debug-Aufruf kann dein Gerät z. B. Fingerabdruck, Face ID oder Geräte-PIN verwenden.", "ok");
    } catch (_) {
      setStatus("Geräteanmeldung wurde nicht eingerichtet.", "error");
    } finally {
      button.disabled = false;
    }
  }

  async function updateDeviceButton() {
    const button = byId("admin-device-auth");
    if (!button) return;

    const available = await deviceAuthAvailable();
    if (!available) {
      button.hidden = true;
      return;
    }

    let enrolled = false;
    try {
      enrolled = Boolean(localStorage.getItem(PASSKEY_ID_KEY));
    } catch (_) {
      enrolled = false;
    }

    button.hidden = false;
    button.textContent = enrolled
      ? "Geräteanmeldung neu einrichten"
      : "Geräteanmeldung einrichten";
  }

  function handleSubmit(event) {
    event.preventDefault();

    const start = parseLocalDateTime(byId("admin-start").value);
    const end = parseLocalDateTime(byId("admin-end").value);

    if (!start || !end || end <= start) {
      setStatus("Bitte gültige Start- und Endzeiten eintragen. Das Ende muss nach dem Start liegen.", "error");
      return;
    }

    const entry = {
      title: byId("admin-title").value.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      dateLabel: byId("admin-date-label").value.trim() || formatBerlinDateTimeLabel(start.toISOString(), end.toISOString()),
      place: byId("admin-place").value.trim(),
      role: byId("admin-role").value.trim(),
      text: byId("admin-text").value.trim(),
      url: byId("admin-url").value.trim()
    };

    if (!entry.title || !entry.place || !entry.role || !entry.text) {
      setStatus("Titel, Ort, Rolle und Kurzbeschreibung sind Pflichtfelder.", "error");
      return;
    }

    if (editingIndex === null) {
      workingEvents.push(entry);
      setStatus("Veranstaltung zum lokalen Entwurf hinzugefügt.", "ok");
    } else {
      workingEvents[editingIndex] = entry;
      setStatus("Veranstaltung im lokalen Entwurf aktualisiert.", "ok");
    }

    saveDraft();
    syncPreview();
    resetForm();
  }

  function discardChanges() {
    if (!window.confirm("Alle lokalen Änderungen verwerfen und wieder den veröffentlichten Stand laden?")) {
      return;
    }

    workingEvents = cloneEvents(sourceEvents);
    clearDraft();
    syncPreview();
    resetForm();
    setStatus("Lokale Änderungen verworfen.", "ok");
  }

  function initAdmin() {
    if (window.VLT_DEBUG_AUTHORIZED !== true) return;

    const panel = byId("current-admin");
    if (!panel) return;

    panel.hidden = false;
    sourceEvents = cloneEvents(window.VLT_EVENTS || []);
    const draft = loadDraft();
    workingEvents = draft || cloneEvents(sourceEvents);

    byId("event-editor-form").addEventListener("submit", handleSubmit);
    byId("admin-cancel-edit").addEventListener("click", resetForm);
    byId("admin-copy").addEventListener("click", copyEventsFile);
    byId("admin-download").addEventListener("click", downloadEventsFile);
    byId("admin-discard").addEventListener("click", discardChanges);
    byId("admin-device-auth").addEventListener("click", setupDeviceAuth);

    if (draft) {
      setStatus("Ein lokaler Entwurf wurde geladen. Die öffentliche Datei ist dadurch noch nicht verändert.", "info");
      syncPreview();
    } else {
      renderAdminList();
      setStatus("Debug-Editor aktiv. Änderungen werden zunächst nur als lokaler Entwurf gespeichert.", "info");
    }

    updateDeviceButton();
  }

  if (window.VLT_CURRENT_AUTH_READY) {
    initAdmin();
  } else {
    window.addEventListener("vlt:current-auth-ready", initAdmin, { once: true });
  }
})();
