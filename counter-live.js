(() => {
  "use strict";

  const API = "https://abacus.jasoncameron.dev";

  /*
   * Neuer Namespace = sauberer Neustart der beiden Zaehler.
   * ECHOS: jeder normale Seitenaufruf.
   * SEELEN: einmal pro Browser (localStorage).
   * ?debug=1 arbeitet ausschliesslich lokal und greift NICHT auf die Counter-API zu.
   */
  const NAMESPACE = "vamlyktan-github-io-v2-20260912";
  const SOUL_KEY = "souls";
  const ECHO_KEY = "echoes";
  const LOCAL_MARK = "vlt_soul_counted_v2";

  const params = new URLSearchParams(window.location.search);
  const debugMode = params.get("debug") === "1";

  /*
   * Im Debug-Modus werden Seelen/Echos von counter.js aus localStorage geladen
   * und dort beim manuellen Setzen gespeichert. Keine API-Anfrage = keine Echos.
   */
  if (debugMode) {
    return;
  }

  function storageAvailable() {
    try {
      const key = "__vlt_counter_test__";
      localStorage.setItem(key, "1");
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function counterRequest(mode, key) {
    const response = await fetch(`${API}/${mode}/${NAMESPACE}/${key}`, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`counter ${response.status}`);
    }

    const data = await response.json();
    const value = Number(data.value);

    if (!Number.isFinite(value)) {
      throw new Error("invalid counter value");
    }

    return Math.max(0, Math.floor(value));
  }

  function showCounters(souls, echoes) {
    if (typeof window.setSoulCounters === "function") {
      window.setSoulCounters(souls, echoes);
    }
  }

  function animateCounters(souls, echoes) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showCounters(souls, echoes);
      return;
    }

    const duration = 850;
    const started = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      showCounters(
        Math.round(souls * eased),
        Math.round(echoes * eased)
      );

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  async function loadCounters() {
    try {
      const echoPromise = counterRequest("hit", ECHO_KEY);
      let soulPromise;

      const canStore = storageAvailable();

      if (canStore && !localStorage.getItem(LOCAL_MARK)) {
        soulPromise = counterRequest("hit", SOUL_KEY).then(value => {
          localStorage.setItem(LOCAL_MARK, "1");
          return value;
        });
      } else {
        soulPromise = counterRequest("get", SOUL_KEY);
      }

      const [soulResult, echoResult] = await Promise.allSettled([
        soulPromise,
        echoPromise
      ]);

      const souls = soulResult.status === "fulfilled"
        ? soulResult.value
        : 0;

      const echoes = echoResult.status === "fulfilled"
        ? echoResult.value
        : 0;

      animateCounters(souls, echoes);
    } catch (_) {
      showCounters(0, 0);
    }
  }

  loadCounters();
})();
