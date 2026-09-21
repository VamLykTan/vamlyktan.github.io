(() => {
  "use strict";

  const SESSION_KEY = "vlt_debug_auth_v1";
  const PASSKEY_ID_KEY = "vlt_current_passkey_id_v1";

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

      return Boolean(credential);
    } catch (_) {
      return false;
    }
  }

  async function loadPasswordHelper() {
    if (typeof window.VLTRequestPasswordAuthorization === "function") {
      return true;
    }

    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "debug-auth.js";
      script.onload = () => resolve(typeof window.VLTRequestPasswordAuthorization === "function");
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function requestCurrentAuthorization() {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
        window.VLT_DEBUG_AUTHORIZED = true;
        return true;
      }
    } catch (_) {
      /* sessionStorage kann blockiert sein. */
    }

    const deviceAuthorized = await tryDeviceAuth();
    if (deviceAuthorized) {
      window.VLT_DEBUG_AUTHORIZED = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch (_) {
        /* Freigabe gilt dann nur für diesen Seitenaufruf. */
      }
      return true;
    }

    const helperReady = await loadPasswordHelper();
    if (!helperReady) {
      window.VLT_DEBUG_AUTHORIZED = false;
      return false;
    }

    const passwordAuthorized = await window.VLTRequestPasswordAuthorization();
    window.VLT_DEBUG_AUTHORIZED = passwordAuthorized === true;

    if (passwordAuthorized) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch (_) {
        /* Freigabe gilt dann nur für diesen Seitenaufruf. */
      }
    }

    return passwordAuthorized === true;
  }

  window.VLTRequestCurrentAuthorization = requestCurrentAuthorization;
  window.VLT_CURRENT_AUTH_READY = true;
  window.dispatchEvent(new CustomEvent("vlt:current-auth-ready", {
    detail: { authorized: window.VLT_DEBUG_AUTHORIZED === true }
  }));
})();
