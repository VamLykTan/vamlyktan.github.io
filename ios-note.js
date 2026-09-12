(() => {
  "use strict";

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (!isIOS) return;

  function showIOSNote() {
    if (document.getElementById("ios-note")) return;

    const note = document.createElement("aside");
    note.id = "ios-note";
    note.setAttribute("role", "status");
    note.innerHTML = `
      <span class="ios-note-icon" aria-hidden="true">🍎</span>
      <span class="ios-note-text"><strong>iOS erkannt.</strong> Diese Seite bevorzugt offene Systeme – läuft aber trotzdem. 😉</span>
      <button class="ios-note-close" type="button" aria-label="Hinweis schließen">×</button>
    `;

    note.querySelector(".ios-note-close").addEventListener("click", () => note.remove());
    document.body.appendChild(note);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showIOSNote, { once: true });
  } else {
    showIOSNote();
  }
})();
