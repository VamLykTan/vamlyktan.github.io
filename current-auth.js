(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const debugMode = params.get("debug") === "1";
  const SESSION_KEY = "vlt_debug_auth_v1";
  const PASSKEY_ID_KEY = "vlt_current_passkey_id_v1";

  function signalReady() {
    window.dispatchEvent(new CustomEvent("vlt:current-auth-ready", {
      detail: { authorized: window.VLT_DEBUG_AUTHORIZED === true }
    }));
  }

  function decodeBase64Url(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, char => char.charCodeAt(0));
  }

  async function tryDeviceAuth() {
    if (!window.isSecureContext || !window.PublicKeyCredential || !navigator.credentials) {
      return false;
    }

    let credentialId;
    try {
      credentialId = window.localStorage.getItem(PASSKEY_ID_KEY);
    } catch (_) {
      return false;
    }

    if (!credentialId) return false;

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{
            type: "public-key",
            id: decodeBase64Url(credentialId)
          }],
          userVerification: "required",
          timeout: 60000
        }
      });

      if (!credential) return false;

      window.VLT_DEBUG_AUTHORIZED = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch (_) {
        /* Freigabe gilt dann nur für diesen Seitenaufruf. */
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  function loadPasswordFallback() {
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "debug-auth.js";
      script.onload = () => resolve(window.VLT_DEBUG_AUTHORIZED === true);
      script.onerror = () => {
        window.VLT_DEBUG_AUTHORIZED = false;
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  async function boot() {
    if (!debugMode) {
      window.VLT_CURRENT_AUTH_READY = true;
      signalReady();
      return;
    }

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
        window.VLT_DEBUG_AUTHORIZED = true;
        window.VLT_CURRENT_AUTH_READY = true;
        signalReady();
        return;
      }
    } catch (_) {
      /* sessionStorage kann blockiert sein. */
    }

    const deviceAuthorized = await tryDeviceAuth();
    if (!deviceAuthorized) {
      await loadPasswordFallback();
    }

    window.VLT_CURRENT_AUTH_READY = true;
    signalReady();
  }

  boot();
})();
