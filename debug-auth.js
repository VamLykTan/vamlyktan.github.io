(() => {
  "use strict";

  const EXPECTED_HASH = "574838cd0a8a23adef82b077ad900b4453323eaeb9454be2ea4720d861407bbd";
  const SESSION_KEY = "vlt_debug_auth_v1";

  const params = new URLSearchParams(window.location.search);
  if (params.get("debug") !== "1") return;

  function sha256(ascii) {
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let i, j;
    let result = "";
    let hash = sha256.h = sha256.h || [];
    const k = sha256.k = sha256.k || [];
    let primeCounter = k.length;
    const isComposite = {};

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += "\x80";
    while (ascii.length % 64 - 56) ascii += "\x00";

    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }

    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (j = 0; j < words.length;) {
      const w = words.slice(j, j += 16);
      const oldHash = hash.slice(0);
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15];
        const w2 = w[i - 2];
        const a = hash[0];
        const e = hash[4];

        const temp1 = hash[7]
          + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = i < 16 ? w[i] : (
              w[i - 16]
              + ((w15 >>> 7 | w15 << 25) ^ (w15 >>> 18 | w15 << 14) ^ (w15 >>> 3))
              + w[i - 7]
              + ((w2 >>> 17 | w2 << 15) ^ (w2 >>> 19 | w2 << 13) ^ (w2 >>> 10))
            ) | 0);

        const temp2 = ((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        const byte = (hash[i] >> (j * 8)) & 255;
        result += (byte < 16 ? "0" : "") + byte.toString(16);
      }
    }

    return result;
  }

  function clearDebugFromUrl() {
    params.delete("debug");
    params.delete("souls");
    params.delete("echoes");

    const query = params.toString();
    const cleanUrl = window.location.pathname
      + (query ? `?${query}` : "")
      + window.location.hash;

    window.history.replaceState(null, "", cleanUrl);
  }

  try {
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      window.VLT_DEBUG_AUTHORIZED = true;
      return;
    }
  } catch (_) {
    /* sessionStorage kann blockiert sein; dann wird erneut gefragt. */
  }

  const entered = window.prompt("Debug-Modus – Passwort:");

  if (entered !== null && sha256(entered) === EXPECTED_HASH) {
    window.VLT_DEBUG_AUTHORIZED = true;

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch (_) {
      /* Freigabe gilt dann nur fuer diesen Seitenaufruf. */
    }

    return;
  }

  window.VLT_DEBUG_AUTHORIZED = false;
  clearDebugFromUrl();

  if (entered !== null) {
    window.alert("Falsches Passwort.");
  }
})();
