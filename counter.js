(() => {
  "use strict";

  const DESIGN_W = 1672;
  const DESIGN_H = 941;

  const SOCIAL = {
    facebook: "https://www.facebook.com/profile.php?id=100063754892757",
    instagram: "https://www.instagram.com/dj_vamlyktan/",
    youtube: "https://www.youtube.com/@vamlyktan7205",
    twitch: "https://www.twitch.tv/dj_vamlyktan",
    mixcloud: "https://www.mixcloud.com/vamlyktan/",
    email: "mailto:djvamlyktan@gmail.com"
  };

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
      glow: "rgba(255,16,45,.62)",
      hotspots: [
        { id: "facebook-gothic", href: SOCIAL.facebook, label: "Facebook", external: true, x: .8215, y: .0213, width: .0215, height: .0383 },
        { id: "instagram-gothic", href: SOCIAL.instagram, label: "Instagram", external: true, x: .8477, y: .0213, width: .0215, height: .0383 },
        { id: "mixcloud-gothic", href: SOCIAL.mixcloud, label: "Mixcloud", external: true, x: .8745, y: .0213, width: .0215, height: .0383 },
        { id: "twitch-gothic", href: SOCIAL.twitch, label: "Twitch", external: true, x: .8995, y: .0213, width: .0215, height: .0383 },
        { id: "email-gothic", href: SOCIAL.email, label: "E-Mail", x: .9255, y: .0213, width: .0215, height: .0383 },
        { id: "enter-gothic", action: "enter", label: "Enter", x: .4336, y: .8129, width: .1322, height: .0723 }
      ]
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
      glow: "rgba(255,16,45,.62)",
      hotspots: [
        { id: "projects-main", href: "projects/index.html", label: "Projekte", x: .472, y: .021, width: .057, height: .034 },
        { id: "facebook-main", href: SOCIAL.facebook, label: "Facebook", external: true, x: .7841, y: .0213, width: .0215, height: .0383 },
        { id: "instagram-main", href: SOCIAL.instagram, label: "Instagram", external: true, x: .8140, y: .0213, width: .0215, height: .0383 },
        { id: "youtube-main", href: SOCIAL.youtube, label: "YouTube", external: true, x: .8439, y: .0213, width: .0215, height: .0383 },
        { id: "twitch-main", href: SOCIAL.twitch, label: "Twitch", external: true, x: .8732, y: .0213, width: .0215, height: .0383 },
        { id: "mixcloud-main", href: SOCIAL.mixcloud, label: "Mixcloud", external: true, x: .9037, y: .0213, width: .0215, height: .0383 },
        { id: "email-main", href: SOCIAL.email, label: "E-Mail", x: .9342, y: .0213, width: .0215, height: .0383 }
      ]
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
      glow: "rgba(215,92,255,.55)",
      hotspots: [
        { id: "projects-psycho-nav", href: "projects/index.html", label: "Projekte", x: .426, y: .021, width: .060, height: .034 },
        { id: "projects-psycho-content", href: "projects/index.html", label: "Projekte", x: .335, y: .568, width: .068, height: .035 },
        { id: "facebook-psycho", href: SOCIAL.facebook, label: "Facebook", external: true, x: .8032, y: .0213, width: .0215, height: .0383 },
        { id: "instagram-psycho", href: SOCIAL.instagram, label: "Instagram", external: true, x: .8283, y: .0213, width: .0215, height: .0383 },
        { id: "youtube-psycho", href: SOCIAL.youtube, label: "YouTube", external: true, x: .8553, y: .0213, width: .0215, height: .0383 },
        { id: "twitch-psycho", href: SOCIAL.twitch, label: "Twitch", external: true, x: .8816, y: .0213, width: .0215, height: .0383 },
        { id: "mixcloud-psycho", href: SOCIAL.mixcloud, label: "Mixcloud", external: true, x: .9109, y: .0213, width: .0215, height: .0383 },
        { id: "email-psycho", href: SOCIAL.email, label: "E-Mail", x: .9384, y: .0213, width: .0215, height: .0383 }
      ]
    }
  };

  const stage = document.getElementById("stage");
  const image = document.getElementById("hero-image");
  const readout = document.getElementById("soul-readout");
  const soulsEl = document.getElementById("souls");
  const echoesEl = document.getElementById("echoes");
  const overlayEls = [1,2,3].map(n => document.getElementById(`overlay-${n}`));

  const style = document.createElement("style");
  style.textContent = `
    #action-hotspots { position:absolute; inset:0; z-index:30; pointer-events:none; }
    .action-hotspot { position:absolute; display:block; pointer-events:auto; cursor:pointer; text-decoration:none; background:transparent; outline:0; }
    .action-hotspot:focus-visible { outline:2px solid rgba(255,25,48,.95); outline-offset:2px; }
    .enter-hotspot { transition:background .22s ease, box-shadow .22s ease, outline-color .22s ease; }
    .enter-hotspot:hover { background:rgba(145,0,18,.10); outline:1px solid rgba(255,28,45,.72); box-shadow:inset 0 0 16px rgba(180,0,20,.14),0 0 18px rgba(170,0,20,.16); }
    body.hotspot-debug .action-hotspot { outline:1px dashed rgba(255,65,85,.86); background:rgba(255,0,35,.08); }
    #stage { transition:opacity .26s ease, filter .26s ease; }
    body.hero-switching #stage { opacity:.08; filter:brightness(.35); }
  `;
  document.head.appendChild(style);

  const hotspotLayer = document.createElement("div");
  hotspotLayer.id = "action-hotspots";
  stage.appendChild(hotspotLayer);

  let currentHeroId = "gothic";

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

  function rebuildHotspots(hero) {
    hotspotLayer.replaceChildren();

    for (const hotspot of hero.hotspots || []) {
      const link = document.createElement("a");
      link.className = "action-hotspot";
      link.dataset.actionId = hotspot.id;
      link.setAttribute("aria-label", hotspot.label);
      link.title = hotspot.label;

      link.style.left = `${hotspot.x * DESIGN_W}px`;
      link.style.top = `${hotspot.y * DESIGN_H}px`;
      link.style.width = `${hotspot.width * DESIGN_W}px`;
      link.style.height = `${hotspot.height * DESIGN_H}px`;

      if (hotspot.action === "enter") {
        link.href = "#";
        link.classList.add("enter-hotspot");
        link.addEventListener("click", event => {
          event.preventDefault();
          if (currentHeroId !== "gothic") return;

          const target = Math.random() < .5 ? "main" : "psycho";
          document.body.classList.add("hero-switching");

          window.setTimeout(() => {
            window.setHero(target);
            window.setTimeout(() => document.body.classList.remove("hero-switching"), 80);
          }, 260);
        });
      } else {
        link.href = hotspot.href;
        if (hotspot.external) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      }

      hotspotLayer.appendChild(link);
    }
  }

  window.setHero = function setHero(heroId) {
    const validId = Object.hasOwn(HEROES, heroId) ? heroId : "gothic";
    const hero = HEROES[validId];

    currentHeroId = validId;
    document.body.dataset.hero = validId;
    image.src = hero.base;
    applyOverlays(hero.overlays);
    rebuildHotspots(hero);

    readout.style.setProperty("--counter-x", `${hero.x}px`);
    readout.style.setProperty("--counter-y", `${hero.y}px`);
    readout.style.setProperty("--counter-width", `${hero.width}px`);

    document.documentElement.style.setProperty("--counter-accent", hero.accent);
    document.documentElement.style.setProperty("--counter-accent-glow", hero.glow);

    const heroSelect = document.getElementById("debug-hero");
    if (heroSelect) heroSelect.value = validId;

    window.dispatchEvent(new CustomEvent("vlt:herochange", {
      detail: { id: validId, file: hero.base }
    }));
  };

  window.VLTHero = {
    getCurrent() {
      const hero = HEROES[currentHeroId];
      return { id: currentHeroId, file: hero.base };
    },
    switchHero(heroId) {
      if (!Object.hasOwn(HEROES, heroId)) return false;
      window.setHero(heroId);
      return true;
    },
    positionHotspots: fitStage
  };

  const params = new URLSearchParams(window.location.search);
  const initialHero = params.get("hero") || "gothic";
  const initialSouls = params.has("souls") ? params.get("souls") : 0;
  const initialEchoes = params.has("echoes") ? params.get("echoes") : 0;

  window.setHero(initialHero);
  window.setSoulCounters(initialSouls, initialEchoes);

  if (params.get("debug") === "1") {
    document.body.classList.add("hotspot-debug");

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
