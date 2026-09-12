(() => {
  "use strict";

  const BUILD_MS = 10000;
  const CLEAR_MS = 4000;
  let running = false;
  let buildTimer = null;
  let clearTimer = null;

  const style = document.createElement("style");
  style.textContent = `
    #vlt-gothic-portal {
      position: fixed;
      inset: 0;
      z-index: 62;
      overflow: hidden;
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
    }

    #vlt-gothic-portal.building,
    #vlt-gothic-portal.clearing {
      visibility: visible;
      opacity: 1;
    }

    #vlt-gothic-portal .portal-fog {
      position: absolute;
      z-index: 4;
      left: -24%;
      width: 148%;
      height: 92%;
      opacity: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='520' viewBox='0 0 900 520'%3E%3Cfilter id='n' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.009 .022' numOctaves='4' seed='23'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='gamma' amplitude='1.25' exponent='1.4' offset='-.12'/%3E%3CfeFuncG type='gamma' amplitude='1.25' exponent='1.4' offset='-.12'/%3E%3CfeFuncB type='gamma' amplitude='1.25' exponent='1.4' offset='-.12'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23aeb4bc' filter='url(%23n)' opacity='.92'/%3E%3C/svg%3E");
      background-repeat: repeat-x;
      background-size: 58% 100%;
      mix-blend-mode: screen;
      filter: blur(12px) contrast(1.28);
      -webkit-mask-image: radial-gradient(ellipse at center, #000 0 42%, rgba(0,0,0,.9) 57%, rgba(0,0,0,.28) 77%, transparent 100%);
      mask-image: radial-gradient(ellipse at center, #000 0 42%, rgba(0,0,0,.9) 57%, rgba(0,0,0,.28) 77%, transparent 100%);
      will-change: transform, opacity;
    }

    #vlt-gothic-portal .portal-fog.back {
      bottom: -26%;
      filter: blur(20px) contrast(1.08);
    }

    #vlt-gothic-portal .portal-fog.mid-a { bottom: -20%; }
    #vlt-gothic-portal .portal-fog.mid-b { bottom: -13%; }

    #vlt-gothic-portal .portal-fog.front {
      bottom: -33%;
      height: 102%;
      background-size: 48% 100%;
      filter: blur(9px) contrast(1.42);
    }

    #vlt-gothic-portal .portal-smoke-wing {
      position: absolute;
      z-index: 5;
      top: 5%;
      width: 62%;
      height: 94%;
      opacity: 0;
      background: radial-gradient(ellipse at center,
        rgba(188,194,201,.34) 0%,
        rgba(98,104,112,.19) 34%,
        rgba(38,41,46,.09) 57%,
        transparent 78%);
      filter: blur(40px);
      will-change: transform, opacity;
    }

    #vlt-gothic-portal .portal-smoke-wing.left { left: -29%; }
    #vlt-gothic-portal .portal-smoke-wing.right { right: -29%; }

    #vlt-gothic-portal .portal-red-core {
      position: absolute;
      z-index: 3;
      left: 50%;
      top: 49%;
      width: min(52vw, 720px);
      aspect-ratio: 1 / 1;
      opacity: 0;
      transform: translate(-50%, -50%) scale(.70);
      background: radial-gradient(circle,
        rgba(190,0,18,.20) 0%,
        rgba(125,0,14,.10) 25%,
        rgba(68,0,8,.035) 48%,
        transparent 72%);
      filter: blur(20px);
      will-change: transform, opacity;
    }

    #vlt-gothic-portal .portal-veil {
      position: absolute;
      inset: 0;
      z-index: 6;
      opacity: 0;
      background: radial-gradient(ellipse at center,
        rgba(12,12,15,.26) 0%,
        rgba(4,4,7,.50) 48%,
        rgba(0,0,0,.88) 100%);
      will-change: opacity;
    }

    #vlt-gothic-portal .portal-switch-cover {
      position: absolute;
      inset: 0;
      z-index: 7;
      opacity: 0;
      background:
        radial-gradient(ellipse at 50% 54%, rgba(48,49,54,.25), rgba(5,5,8,.78) 58%, rgba(0,0,0,.94) 100%);
      will-change: opacity;
    }

    #vlt-gothic-portal .portal-arrival {
      position: absolute;
      inset: 0;
      z-index: 8;
      opacity: 0;
      background: radial-gradient(ellipse at center, rgba(165,25,40,.08), transparent 60%);
      will-change: opacity;
    }

    #vlt-gothic-portal.building .portal-fog.back {
      animation: vlt-fog-back-build 10s ease-in-out forwards;
    }
    #vlt-gothic-portal.building .portal-fog.mid-a {
      animation: vlt-fog-mid-a-build 10s cubic-bezier(.18,.70,.20,1) forwards;
    }
    #vlt-gothic-portal.building .portal-fog.mid-b {
      animation: vlt-fog-mid-b-build 10s cubic-bezier(.18,.70,.20,1) forwards;
    }
    #vlt-gothic-portal.building .portal-fog.front {
      animation: vlt-fog-front-build 10s cubic-bezier(.14,.72,.20,1) forwards;
    }
    #vlt-gothic-portal.building .portal-smoke-wing.left {
      animation: vlt-wing-left-build 10s ease-in-out forwards;
    }
    #vlt-gothic-portal.building .portal-smoke-wing.right {
      animation: vlt-wing-right-build 10s ease-in-out forwards;
    }
    #vlt-gothic-portal.building .portal-red-core {
      animation: vlt-red-core-build 10s ease-in-out forwards;
    }
    #vlt-gothic-portal.building .portal-veil {
      animation: vlt-veil-build 10s ease-in-out forwards;
    }
    #vlt-gothic-portal.building .portal-switch-cover {
      animation: vlt-switch-cover-build 10s ease-in forwards;
    }

    #vlt-gothic-portal.clearing .portal-fog.back {
      animation: vlt-fog-back-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-fog.mid-a {
      animation: vlt-fog-mid-a-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-fog.mid-b {
      animation: vlt-fog-mid-b-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-fog.front {
      animation: vlt-fog-front-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-smoke-wing.left {
      animation: vlt-wing-left-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-smoke-wing.right {
      animation: vlt-wing-right-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-red-core {
      animation: vlt-red-core-clear 3.2s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-veil {
      animation: vlt-veil-clear 4s ease-in-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-switch-cover {
      animation: vlt-switch-cover-clear 3.4s ease-out forwards;
    }
    #vlt-gothic-portal.clearing .portal-arrival {
      animation: vlt-arrival-clear 4s ease-in-out forwards;
    }

    @keyframes vlt-fog-back-build {
      0%   { opacity:0;   transform:translateY(30%) scale(1.02); }
      35%  { opacity:.20; }
      68%  { opacity:.48; transform:translateY(2%) scale(1.10); }
      100% { opacity:.72; transform:translateY(-13%) scale(1.18); }
    }
    @keyframes vlt-fog-mid-a-build {
      0%   { opacity:0;   transform:translate(-27%,35%) scale(1.03); }
      30%  { opacity:.18; }
      65%  { opacity:.56; transform:translate(3%,3%) scale(1.14); }
      100% { opacity:.88; transform:translate(11%,-13%) scale(1.24); }
    }
    @keyframes vlt-fog-mid-b-build {
      0%   { opacity:0;   transform:translate(28%,34%) scale(1.03); }
      28%  { opacity:.16; }
      67%  { opacity:.54; transform:translate(-4%,1%) scale(1.15); }
      100% { opacity:.84; transform:translate(-13%,-15%) scale(1.25); }
    }
    @keyframes vlt-fog-front-build {
      0%   { opacity:0;   transform:translateY(39%) scale(1.03); }
      32%  { opacity:.18; }
      64%  { opacity:.58; transform:translateY(4%) scale(1.16); }
      100% { opacity:.96; transform:translateY(-13%) scale(1.29); }
    }
    @keyframes vlt-wing-left-build {
      0%   { opacity:0; transform:translate(-24%,18%) scale(.94); }
      45%  { opacity:.16; }
      100% { opacity:.58; transform:translate(30%,-4%) scale(1.18); }
    }
    @keyframes vlt-wing-right-build {
      0%   { opacity:0; transform:translate(24%,16%) scale(.94); }
      43%  { opacity:.15; }
      100% { opacity:.56; transform:translate(-30%,-5%) scale(1.18); }
    }
    @keyframes vlt-red-core-build {
      0%,25% { opacity:0; transform:translate(-50%,-50%) scale(.70); }
      70%    { opacity:.11; }
      100%   { opacity:.18; transform:translate(-50%,-50%) scale(1.08); }
    }
    @keyframes vlt-veil-build {
      0%,35% { opacity:0; }
      72%    { opacity:.24; }
      100%   { opacity:.78; }
    }
    @keyframes vlt-switch-cover-build {
      0%,72% { opacity:0; }
      88%    { opacity:.24; }
      100%   { opacity:.86; }
    }

    @keyframes vlt-fog-back-clear {
      0%   { opacity:.72; transform:translateY(-13%) scale(1.18); }
      100% { opacity:0;   transform:translateY(-42%) scale(1.25); }
    }
    @keyframes vlt-fog-mid-a-clear {
      0%   { opacity:.88; transform:translate(11%,-13%) scale(1.24); }
      100% { opacity:0;   transform:translate(37%,-44%) scale(1.34); }
    }
    @keyframes vlt-fog-mid-b-clear {
      0%   { opacity:.84; transform:translate(-13%,-15%) scale(1.25); }
      100% { opacity:0;   transform:translate(-39%,-45%) scale(1.34); }
    }
    @keyframes vlt-fog-front-clear {
      0%   { opacity:.96; transform:translateY(-13%) scale(1.29); }
      38%  { opacity:.68; }
      100% { opacity:0;   transform:translateY(-48%) scale(1.38); }
    }
    @keyframes vlt-wing-left-clear {
      0%   { opacity:.58; transform:translate(30%,-4%) scale(1.18); }
      100% { opacity:0;   transform:translate(55%,-22%) scale(1.30); }
    }
    @keyframes vlt-wing-right-clear {
      0%   { opacity:.56; transform:translate(-30%,-5%) scale(1.18); }
      100% { opacity:0;   transform:translate(-55%,-23%) scale(1.30); }
    }
    @keyframes vlt-red-core-clear {
      0%   { opacity:.18; transform:translate(-50%,-50%) scale(1.08); }
      100% { opacity:0;   transform:translate(-50%,-50%) scale(1.18); }
    }
    @keyframes vlt-veil-clear {
      0%   { opacity:.78; }
      46%  { opacity:.46; }
      100% { opacity:0; }
    }
    @keyframes vlt-switch-cover-clear {
      0%   { opacity:.86; }
      32%  { opacity:.66; }
      100% { opacity:0; }
    }
    @keyframes vlt-arrival-clear {
      0%,24% { opacity:0; }
      52%    { opacity:.16; }
      100%   { opacity:0; }
    }
  `;
  document.head.appendChild(style);

  const portal = document.createElement("div");
  portal.id = "vlt-gothic-portal";
  portal.setAttribute("aria-hidden", "true");
  portal.innerHTML = `
    <div class="portal-red-core"></div>
    <div class="portal-fog back"></div>
    <div class="portal-fog mid-a"></div>
    <div class="portal-fog mid-b"></div>
    <div class="portal-fog front"></div>
    <div class="portal-smoke-wing left"></div>
    <div class="portal-smoke-wing right"></div>
    <div class="portal-veil"></div>
    <div class="portal-switch-cover"></div>
    <div class="portal-arrival"></div>
  `;
  document.body.appendChild(portal);

  function currentHeroId() {
    return window.VLTHero?.getCurrent?.().id || document.body.dataset.hero || "gothic";
  }

  function finish() {
    window.clearTimeout(buildTimer);
    window.clearTimeout(clearTimer);
    buildTimer = null;
    clearTimer = null;
    portal.classList.remove("building", "clearing");
    document.body.classList.remove("gothic-ritual-running");
    running = false;
  }

  function start() {
    if (running || currentHeroId() !== "gothic" || typeof window.setHero !== "function") {
      return false;
    }

    const target = Math.random() < 0.5 ? "main" : "psycho";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setHero(target);
      return true;
    }

    running = true;
    document.body.classList.add("gothic-ritual-running");
    portal.classList.remove("clearing");
    void portal.offsetWidth;
    portal.classList.add("building");

    buildTimer = window.setTimeout(() => {
      window.setHero(target);
      portal.classList.remove("building");
      void portal.offsetWidth;
      portal.classList.add("clearing");

      clearTimer = window.setTimeout(finish, CLEAR_MS + 80);
    }, BUILD_MS);

    return true;
  }

  window.VLTGothicRitual = {
    start,
    isRunning() {
      return running;
    },
    timing: {
      buildMs: BUILD_MS,
      clearMs: CLEAR_MS
    }
  };

  document.addEventListener("click", event => {
    const trigger = event.target.closest?.('[data-action-id="enter-gothic"]');
    if (!trigger) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    start();
  }, true);
})();