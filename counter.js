(() => {
  "use strict";

  const DESIGN_W = 1672;
  const DESIGN_H = 941;

  const SOCIAL = {
    facebook: "https://www.facebook.com/profile.php?id=100063754892757",
    instagram: "https://www.instagram.com/_dj_vamlyktan/",
    youtube: "https://www.youtube.com/@vamlyktan7205",
    twitch: "https://www.twitch.tv/dj_vamlyktan",
    mixcloud: "https://www.mixcloud.com/vamlyktan/",
    email: "mailto:djvamlyktan@gmail.com"
  };

  const HEROES = {
    gothic: {
      base: "images/Gothic.png",
      soul: "images/Gothic_Soul.png",
      x: 1265,
      y: 238,
      width: 242,
      accent: "#ff102d",
      glow: "rgba(255,16,45,.62)",
      hotspots: [
        { id: "about-gothic", href: "about.html", label: "About VamLykTan", 						 x: .287,  y: .510,  width: .398, height: .145 },
        { id: "aktuell-gothic-top", label: "Aktuell", 													 x: .0525, y: .0255, width: .08,  height: .03, visible: true, visualOnly: true },
        { id: "listen-gothic-top", href: SOCIAL.mixcloud, label: "Listen", external: true, 	 x: .15,   y: .0255, width: .08,  height: .03, visible: true },
        { id: "kontakt-gothic-top", href: SOCIAL.email, label: "Kontakt", 							 x: .7025, y: .0255, width: .08,  height: .03, visible: true },
        { id: "facebook-gothic", href: SOCIAL.facebook, label: "Facebook", external: true, 	 x: .8215, y: .0213, width: .0215, height: .0383 },
        { id: "instagram-gothic", href: SOCIAL.instagram, label: "Instagram", external: true, x: .8477, y: .0213, width: .0215, height: .0383 },
        { id: "mixcloud-gothic", href: SOCIAL.mixcloud, label: "Mixcloud", external: true,    x: .8745, y: .0213, width: .0215, height: .0383 },
        { id: "twitch-gothic", href: SOCIAL.twitch, label: "Twitch", external: true,          x: .8995, y: .0213, width: .0215, height: .0383 },
        { id: "email-gothic", href: SOCIAL.email, label: "E-Mail", 									 x: .9255, y: .0213, width: .0215, height: .0383 },
        { id: "aktuell-gothic-mid", label: "Aktuell", 													 x: .3845, y: .7620, width: .0706, height: .0372, visible: true, visualOnly: true },
        { id: "listen-gothic-mid", href: SOCIAL.mixcloud, label: "Listen", external: true, 	 x: .47,   y: .7620, width: .0556, height: .0374, visible: true },
        { id: "kontakt-gothic-mid", href: SOCIAL.email, label: "Kontakt", 							 x: .545,  y: .7620, width: .07,   height: .0372, visible: true },
        { id: "enter-gothic", action: "enter", label: "Enter", 										 x: .4312, y: .8098, width: .1202, height: .0595}
      ]
    },

    main: {
      base: "images/mainbackground.png",
      soul: "images/mainbackground_Soul.png",
      x: 1270,
      y: 238,
      width: 242,
      accent: "#ff102d",
      glow: "rgba(255,16,45,.62)",
      hotspots: [
        { id: "about-main", href: "about.html", label: "About VamLykTan", 							x: .300,  y: .522,  width: .382,  height: .155 },
        { id: "home-main", href: "index.html", label: "Home", 											x: .262,  y: .0210, width: .0347, height: .0368, visible: true },
        { id: "aktuell-main", label: "Aktuell", 															x: .3250, y: .0213, width: .049,  height: .0368, visible: true, visualOnly: true },
        { id: "events-main", href: "current.html", label: "Events", 									x: .4, 	 y: .0213, width: .0449, height: .0368, visible: true },
        { id: "projects-main", href: "projects/index.html", label: "Projekte", 					x: .4725, y: .0213, width: .0526, height: .0368, visible: true },
        { id: "media-main", href: SOCIAL.mixcloud, label: "Media", external: true, 				x: .5525, y: .0213, width: .0407, height: .0368, visible: true },
        { id: "kontakt-main", href: SOCIAL.email, label: "Kontakt", 									x: .6175, y: .0213, width: .0550, height: .0368, visible: true },
        { id: "facebook-main", href: SOCIAL.facebook, label: "Facebook", external: true, 		x: .7841, y: .0213, width: .0215, height: .0383 },
        { id: "instagram-main", href: SOCIAL.instagram, label: "Instagram", external: true, 	x: .8140, y: .0213, width: .0215, height: .0383 },
        { id: "youtube-main", href: SOCIAL.youtube, label: "YouTube", external: true, 			x: .8439, y: .0213, width: .0215, height: .0383 },
        { id: "twitch-main", href: SOCIAL.twitch, label: "Twitch", external: true, 				x: .8732, y: .0213, width: .0215, height: .0383 },
        { id: "mixcloud-main", href: SOCIAL.mixcloud, label: "Mixcloud", external: true, 		x: .9037, y: .0213, width: .0215, height: .0383 },
        { id: "email-main", href: SOCIAL.email, label: "E-Mail", 										x: .9342, y: .0213, width: .0215, height: .0383 }
      ]
    },

    psycho: {
      base: "images/Psycho.png",
      soul: "images/Psycho_Soul.png",
      x: 1360,
      y: 220,
      width: 232,
      accent: "#d75cff",
      glow: "rgba(215,92,255,.55)",
      hotspots: [
        { id: "about-psycho", href: "about.html", label: "About VamLykTan", 					 		x: .064,  y: .255,  width: .500,  height: .225 },
        { id: "home-psycho-nav", href: "index.html", label: "Home", 								 		x: .2380, y: .0231, width: .0389, height: .0320, visible: true },
        { id: "events-psycho-nav", href: "current.html", label: "Events", 						 		x: .3665, y: .0231, width: .0442, height: .0320, visible: true },
        { id: "projects-psycho-nav", href: "projects/index.html", label: "Projekte", 		 		x: .4310, y: .0231, width: .0535, height: .0320, visible: true },
        { id: "kontakt-psycho-nav", href: SOCIAL.email, label: "Kontakt", 						 		x: .5641, y: .0231, width: .0506, height: .0320, visible: true },
        { id: "events-psycho-content", href: "current.html", label: "Events", 				 		x: .2595, y: .5735, width: .0558, height: .0372, visible: true },
        { id: "projects-psycho-content", href: "projects/index.html", label: "Projekte", 	 		x: .3333, y: .5735, width: .0686, height: .0372, visible: true },
        { id: "facebook-psycho", href: SOCIAL.facebook, label: "Facebook", external: true, 		x: .8032, y: .0213, width: .0215, height: .0383 },
        { id: "instagram-psycho", href: SOCIAL.instagram, label: "Instagram", external: true, 	x: .8283, y: .0213, width: .0215, height: .0383 },
        { id: "youtube-psycho", href: SOCIAL.youtube, label: "YouTube", external: true, 			x: .8553, y: .0213, width: .0215, height: .0383 },
        { id: "twitch-psycho", href: SOCIAL.twitch, label: "Twitch", external: true, 				x: .8816, y: .0213, width: .0215, height: .0383 },
        { id: "mixcloud-psycho", href: SOCIAL.mixcloud, label: "Mixcloud", external: true, 		x: .9109, y: .0213, width: .0215, height: .0383 },
        { id: "email-psycho", href: SOCIAL.email, label: "E-Mail", 										x: .9384, y: .0213, width: .0215, height: .0383 }
      ]
    }
  };

  const stage = document.getElementById("stage");
  const image = document.getElementById("hero-image");
  const soulImage = document.getElementById("soul-overlay");
  const readout = document.getElementById("soul-readout");
  const soulsEl = document.getElementById("souls");
  const echoesEl = document.getElementById("echoes");

  const style = document.createElement("style");
  style.textContent = `
    #action-hotspots { position:absolute; inset:0; z-index:30; pointer-events:none; }
    .action-hotspot { position:absolute; display:block; pointer-events:auto; cursor:pointer; text-decoration:none; background:transparent; outline:0; }
    .action-hotspot:focus-visible { outline:2px solid rgba(255,25,48,.95); outline-offset:2px; }
    .visual-hotspot { pointer-events:none; cursor:default; }
    .visible-hotspot { border-radius:3px; transition:border-color .22s ease, box-shadow .22s ease, background .22s ease, opacity .22s ease, transform .22s ease; }
    .visible-hotspot-main,
    .visible-hotspot-gothic { border:1px solid rgba(255,35,55,.38); background:rgba(255,24,40,.03); box-shadow:inset 0 0 8px rgba(255,35,55,.05), 0 0 12px rgba(255,35,55,.12); }
    .visible-hotspot-main:hover,
    .visible-hotspot-main:focus-visible,
    .visible-hotspot-gothic:hover,
    .visible-hotspot-gothic:focus-visible { border-color:rgba(255,85,100,.76); background:rgba(255,30,48,.07); box-shadow:inset 0 0 12px rgba(255,95,110,.12), 0 0 16px rgba(255,45,70,.24); }
    .visible-hotspot-psycho { border:1px solid rgba(215,92,255,.44); background:rgba(215,92,255,.05); box-shadow:inset 0 0 10px rgba(215,92,255,.08), 0 0 12px rgba(215,92,255,.14); }
    .visible-hotspot-psycho:hover, .visible-hotspot-psycho:focus-visible { border-color:rgba(229,140,255,.82); background:rgba(215,92,255,.10); box-shadow:inset 0 0 12px rgba(238,168,255,.16), 0 0 18px rgba(215,92,255,.32); }
    .enter-hotspot { transition:background .22s ease, box-shadow .22s ease, outline-color .22s ease; }
    .enter-hotspot {outline: none !important;box-shadow: none !important;background: transparent !important;}
    body.hotspot-debug .action-hotspot { outline:1px dashed rgba(255,65,85,.86); background:rgba(255,0,35,.08); }
    body.hotspot-debug .visible-hotspot-main,
    body.hotspot-debug .visible-hotspot-gothic { outline:1px dashed rgba(255,110,130,.92); background:rgba(255,35,55,.12); }
    body.hotspot-debug .visible-hotspot-psycho { outline:1px dashed rgba(229,140,255,.92); background:rgba(215,92,255,.12); }
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

  function rebuildHotspots(hero) {
    hotspotLayer.replaceChildren();

    for (const hotspot of hero.hotspots || []) {
      const link = document.createElement(hotspot.visualOnly ? "span" : "a");
      link.className = "action-hotspot";
      link.dataset.actionId = hotspot.id;

      if (hotspot.visualOnly) {
        link.classList.add("visual-hotspot");
        link.setAttribute("aria-hidden", "true");
      } else {
        link.setAttribute("aria-label", hotspot.label);
        link.title = hotspot.label;
      }

      if (hotspot.visible) {
        link.classList.add("visible-hotspot", `visible-hotspot-${currentHeroId}`);
      }

      link.style.left = `${hotspot.x * DESIGN_W}px`;
      link.style.top = `${hotspot.y * DESIGN_H}px`;
      link.style.width = `${hotspot.width * DESIGN_W}px`;
      link.style.height = `${hotspot.height * DESIGN_H}px`;

      if (hotspot.visualOnly) {
        hotspotLayer.appendChild(link);
        continue;
      }

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
    soulImage.src = hero.soul;
    rebuildHotspots(hero);

    readout.style.setProperty("--counter-x", `${hero.x}px`);
    readout.style.setProperty("--counter-y", `${hero.y}px`);
    readout.style.setProperty("--counter-width", `${hero.width}px`);

    document.documentElement.style.setProperty("--counter-accent", hero.accent);
    document.documentElement.style.setProperty("--counter-accent-glow", hero.glow);

    const heroSelect = document.getElementById("debug-hero");
    if (heroSelect) heroSelect.value = validId;

    window.dispatchEvent(new CustomEvent("vlt:herochange", {
      detail: {
        id: validId,
        file: hero.base,
        soul: hero.soul
      }
    }));
  };

  window.VLTHero = {
    getCurrent() {
      const hero = HEROES[currentHeroId];
      return {
        id: currentHeroId,
        file: hero.base,
        soul: hero.soul
      };
    },
    switchHero(heroId) {
      if (!Object.hasOwn(HEROES, heroId)) return false;
      window.setHero(heroId);
      return true;
    },
    positionHotspots: fitStage
  };

  const params = new URLSearchParams(window.location.search);
  const initialHero = params.get("hero") || "main";
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
