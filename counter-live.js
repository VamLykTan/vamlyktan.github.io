(() => {
  "use strict";

  const API = "https://abacus.jasoncameron.dev";

  /*
   * Neuer Namespace = sauberer Neustart der beiden Zaehler.
   * ECHOS: jeder normale Seitenaufruf.
   * SEELEN: einmal pro Browser (localStorage).
   * ?debug=1 liest nur und zaehlt NICHT hoch.
   */
  const NAMESPACE = "vamlyktan-github-io-v2-20260912";
  const SOUL_KEY = "souls";
  const ECHO_KEY = "echoes";
  const LOCAL_MARK = "vlt_soul_counted_v2";

  const params = new URLSearchParams(window.location.search);
  const debugMode = params.get("debug") === "1";

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

  function setDebugFields(souls, echoes) {
    const soulsInput = document.getElementById("debug-souls");
    const echoesInput = document.getElementById("debug-echoes");

    if (soulsInput) soulsInput.value = souls;
    if (echoesInput) echoesInput.value = echoes;
  }

  function showCounters(souls, echoes) {
    if (typeof window.setSoulCounters === "function") {
      window.setSoulCounters(souls, echoes);
    }

    if (debugMode) {
      setDebugFields(souls, echoes);
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
      let soulPromise;
      let echoPromise;

      if (debugMode) {
        /* Debug-Aufrufe duerfen die Statistik nicht veraendern. */
        soulPromise = counterRequest("get", SOUL_KEY);
        echoPromise = counterRequest("get", ECHO_KEY);
      } else {
        echoPromise = counterRequest("hit", ECHO_KEY);

        const canStore = storageAvailable();

        if (canStore && !localStorage.getItem(LOCAL_MARK)) {
          soulPromise = counterRequest("hit", SOUL_KEY).then(value => {
            localStorage.setItem(LOCAL_MARK, "1");
            return value;
          });
        } else {
          soulPromise = counterRequest("get", SOUL_KEY);
        }
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
