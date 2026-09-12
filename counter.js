(() => {
  "use strict";

  const DESIGN_W = 1672;
  const DESIGN_H = 941;

  const HEROES = {
    gothic: {
      base: "images/Gothic.png",
      overlays: [
        { file: "images/Gothic_2-overlay-1.webp", x: 1246, y: 67, width: 199, height: 307 },
        { file: "images/Gothic_2-overlay-2.webp", x: 1445, y: 67, width: 199, height: 307 }
      ],
      x: 1265,
      y: 238,
      width: 242,
      accent: "#ff102d",
      glow: "rgba(255,16,45,.62)"
    },

    main: {
      base: "images/mainbackground.png",
      overlays: [
        { file: "images/mainbackground_2-overlay-1.webp", x: 1256, y: 81, width: 197, height: 304 },
        { file: "images/mainbackground_2-overlay-2.webp", x: 1453, y: 81, width: 197, height: 304 }
      ],
      x: 1270,
      y: 238,
      width: 242,
      accent: "#ff102d",
      glow: "rgba(255,16,45,.62)"
    },

    psycho: {
      base: "images/Psycho.png",
      overlays: [
        { file: "images/Psycho_2-overlay-1.webp", x: 1266, y: 72, width: 128, height: 304 },
        { file: "images/Psycho_2-overlay-2.webp", x: 1394, y: 72, width: 128, height: 304 },
        { file: "images/Psycho_2-overlay-3.webp", x: 1522, y: 72, width: 128, height: 304 }
      ],
      x: 1360,
      y: 220,
      width: 232,
      accent: "#d75cff",
      glow: "rgba(215,92,255,.55)"
    }
  };

  const stage = document.getElementById("stage");
  const image = document.getElementById("hero-image");
  const readout = document.getElementById("soul-readout");
  const soulsEl = document.getElementById("souls");
  const echoesEl = document.getElementById("echoes");
  const overlayEls = [1,2,3].map(n => document.getElementById(`overlay-${n}`));

  function fitStage() {
    const scale = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function formatCounter(value) {
    const safe = Math.max(0, Math.floor(Number(value) || 0));
    return String(safe).padStart(3, "0");
  }

  window.setSoulCounters = function setSoulCounters(souls, echoes) {
    soulsEl.textContent = formatCounter(souls);
    echoesEl.textContent = formatCounter(echoes);
  };

  function applyOverlays(parts) {
    overlayEls.forEach((el, index) => {
      const part = parts[index];

      if (!part) {
        el.style.display = "none";
        el.removeAttribute("src");
        return;
      }

      el.src = part.file;
      el.style.left = `${part.x}px`;
      el.style.top = `${part.y}px`;
      el.style.width = `${part.width}px`;
      el.style.height = `${part.height}px`;
      el.style.display = "block";
    });
  }

  window.setHero = function setHero(heroId) {
    const validId = Object.hasOwn(HEROES, heroId) ? heroId : "gothic";
    const hero = HEROES[validId];

    document.body.dataset.hero = validId;
    image.src = hero.base;
    applyOverlays(hero.overlays);

    readout.style.setProperty("--counter-x", `${hero.x}px`);
    readout.style.setProperty("--counter-y", `${hero.y}px`);
    readout.style.setProperty("--counter-width", `${hero.width}px`);

    document.documentElement.style.setProperty("--counter-accent", hero.accent);
    document.documentElement.style.setProperty("--counter-accent-glow", hero.glow);

    const heroSelect = document.getElementById("debug-hero");
    if (heroSelect) heroSelect.value = validId;
  };

  const params = new URLSearchParams(window.location.search);
  const initialHero = params.get("hero") || "gothic";
  const initialSouls = params.has("souls") ? params.get("souls") : 0;
  const initialEchoes = params.has("echoes") ? params.get("echoes") : 0;

  window.setHero(initialHero);
  window.setSoulCounters(initialSouls, initialEchoes);

  if (params.get("debug") === "1") {
    const panel = document.getElementById("debug-panel");
    const heroSelect = document.getElementById("debug-hero");
    const soulsInput = document.getElementById("debug-souls");
    const echoesInput = document.getElementById("debug-echoes");

    panel.hidden = false;
    heroSelect.value = document.body.dataset.hero;
    soulsInput.value = Number(initialSouls) || 0;
    echoesInput.value = Number(initialEchoes) || 0;

    heroSelect.addEventListener("change", () => window.setHero(heroSelect.value));

    panel.addEventListener("submit", event => {
      event.preventDefault();
      window.setSoulCounters(soulsInput.value, echoesInput.value);
    });
  }

  fitStage();
  window.addEventListener("resize", fitStage, { passive: true });
})();
