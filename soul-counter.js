document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SEELENZÄHLER · SEELEN / ECHOS

       Freigegebene Darstellung:
       - körperlose Erscheinungen aus Nebel
       - dunkle Gesichter / keine Comic-Augen
       - rote bzw. bei Psycho violette Energie
       - Zahlen liegen direkt über den Seelen

       SEELEN:
       ungefähr einmal pro Browser.

       ECHOS:
       jeder Aufruf der Homepage.
       ===================================================== */

    const API =
        "https://abacus.jasoncameron.dev";

    const NAMESPACE =
        "vamlyktan-github-io-v1-6d9e52";

    const SOUL_KEY =
        "souls";

    const ECHO_KEY =
        "echoes";

    const LOCAL_MARK =
        "vlt_soul_counted_v1";


    /* =====================================================
       CSS LADEN
       ===================================================== */

    if (!document.querySelector('link[data-vlt-soul-counter-css]')) {

        const css =
            document.createElement("link");

        css.rel =
            "stylesheet";

        css.href =
            "soul-counter.css?v=20260910-2";

        css.dataset.vltSoulCounterCss =
            "1";

        document.head.appendChild(css);
    }


    /* =====================================================
       ANZEIGE
       ===================================================== */

    const counter =
        document.createElement("aside");

    counter.id =
        "vlt-soul-counter";

    counter.setAttribute(
        "aria-label",
        "Seelenzähler"
    );

    counter.title =
        "Seelen ≈ einmal pro Browser · Echos = Seitenaufrufe";

    counter.innerHTML = `
        <div class="soul-visual" aria-hidden="true">

            <svg
                class="soul-ghosts"
                viewBox="0 0 760 920"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet">

                <defs>

                    <linearGradient id="vltSoulBodyMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#e4dded" stop-opacity="0.74"/>
                        <stop offset="23%" stop-color="#c7bed5" stop-opacity="0.57"/>
                        <stop offset="57%" stop-color="#9388a5" stop-opacity="0.28"/>
                        <stop offset="100%" stop-color="#6e6678" stop-opacity="0"/>
                    </linearGradient>

                    <linearGradient id="vltSoulBodySide" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#d5cedf" stop-opacity="0.63"/>
                        <stop offset="42%" stop-color="#a097b0" stop-opacity="0.34"/>
                        <stop offset="100%" stop-color="#6a6275" stop-opacity="0"/>
                    </linearGradient>

                    <linearGradient id="vltSoulRedMist" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ff2344" stop-opacity="0"/>
                        <stop offset="38%" stop-color="#e8072d" stop-opacity="0.62"/>
                        <stop offset="70%" stop-color="#8c0018" stop-opacity="0.34"/>
                        <stop offset="100%" stop-color="#4c000d" stop-opacity="0"/>
                    </linearGradient>

                    <radialGradient id="vltSoulFace" cx="50%" cy="38%" r="68%">
                        <stop offset="0%" stop-color="#09080d" stop-opacity="1"/>
                        <stop offset="64%" stop-color="#0d0b13" stop-opacity="0.96"/>
                        <stop offset="100%" stop-color="#17131c" stop-opacity="0.62"/>
                    </radialGradient>

                    <filter id="vltSoulSoft" x="-35%" y="-35%" width="170%" height="170%">
                        <feGaussianBlur stdDeviation="11"/>
                    </filter>

                    <filter id="vltSoulMist" x="-40%" y="-40%" width="180%" height="180%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.010 0.022"
                            numOctaves="3"
                            seed="19"
                            result="noise"/>

                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="26"
                            xChannelSelector="R"
                            yChannelSelector="G"/>

                        <feGaussianBlur stdDeviation="4.4"/>
                    </filter>

                    <filter id="vltSoulGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="9" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>

                </defs>

                <g class="soul-red-halo">
                    <path
                        d="M197 332 A208 208 0 0 1 602 300"
                        fill="none"
                        stroke="#e20a2e"
                        stroke-width="5"
                        stroke-linecap="round"
                        opacity="0.72"
                        filter="url(#vltSoulGlow)"/>

                    <path
                        d="M175 348 A228 228 0 0 1 620 330"
                        fill="none"
                        stroke="#740014"
                        stroke-width="18"
                        opacity="0.19"
                        filter="url(#vltSoulSoft)"/>
                </g>

                <g class="soul-wraith wraith-left">
                    <path
                        d="M116 342 C93 374 83 420 90 470 C98 526 77 581 56 631 C91 610 105 648 138 628 C165 612 177 651 206 631 C226 617 246 647 270 627 C251 577 250 527 250 476 C250 421 231 375 198 343 C173 320 138 316 116 342 Z"
                        fill="url(#vltSoulBodySide)"
                        opacity="0.73"
                        filter="url(#vltSoulMist)"/>

                    <path
                        d="M116 342 C128 310 181 303 202 342 C215 366 211 392 199 411 C181 439 137 440 119 411 C105 389 105 363 116 342 Z"
                        fill="#d5cddd"
                        opacity="0.26"
                        filter="url(#vltSoulSoft)"/>

                    <ellipse
                        cx="160"
                        cy="374"
                        rx="42"
                        ry="58"
                        fill="url(#vltSoulFace)"/>
                </g>

                <g class="soul-wraith wraith-main">
                    <path
                        d="M265 155 C222 197 194 260 192 337 C190 415 219 469 199 548 C187 596 158 639 144 689 C190 657 213 710 255 676 C290 648 308 709 351 677 C389 649 412 711 457 675 C493 646 519 687 554 660 C528 600 518 544 522 485 C527 409 548 349 528 276 C510 211 468 163 411 142 C356 122 302 126 265 155 Z"
                        fill="url(#vltSoulBodyMain)"
                        opacity="0.90"
                        filter="url(#vltSoulMist)"/>

                    <path
                        d="M277 178 C301 123 410 108 455 174 C482 213 478 261 455 299 C420 356 324 360 285 304 C257 264 255 218 277 178 Z"
                        fill="#e4ddea"
                        opacity="0.24"
                        filter="url(#vltSoulSoft)"/>

                    <ellipse
                        cx="368"
                        cy="224"
                        rx="74"
                        ry="96"
                        fill="url(#vltSoulFace)"/>

                    <path
                        d="M316 157 C344 126 405 126 436 157 C421 142 400 136 377 136 C352 136 332 143 316 157 Z"
                        fill="#b4a8c1"
                        opacity="0.32"
                        filter="url(#vltSoulSoft)"/>
                </g>

                <g class="soul-wraith wraith-right">
                    <path
                        d="M508 382 C485 418 480 463 487 513 C495 569 476 618 460 663 C493 642 509 680 540 659 C566 642 580 681 610 659 C634 642 652 672 678 649 C658 600 659 558 662 509 C665 454 650 414 619 383 C590 354 533 351 508 382 Z"
                        fill="url(#vltSoulBodySide)"
                        opacity="0.77"
                        filter="url(#vltSoulMist)"/>

                    <path
                        d="M520 384 C540 345 607 343 630 383 C646 411 641 441 626 463 C600 501 548 501 520 463 C503 439 505 408 520 384 Z"
                        fill="#d7d0df"
                        opacity="0.25"
                        filter="url(#vltSoulSoft)"/>

                    <ellipse
                        cx="575"
                        cy="414"
                        rx="45"
                        ry="61"
                        fill="url(#vltSoulFace)"/>
                </g>

                <g
                    fill="none"
                    stroke-linecap="round"
                    filter="url(#vltSoulSoft)">

                    <path
                        class="soul-wisp-a"
                        d="M54 561 C120 514 176 518 223 552 C274 589 330 591 378 557 C433 519 489 521 546 563"
                        stroke="#d1c7dd"
                        stroke-width="19"
                        opacity="0.17"/>

                    <path
                        class="soul-wisp-b"
                        d="M89 650 C175 612 235 642 291 683 C350 725 432 721 512 675 C576 638 632 638 700 665"
                        stroke="#b8aec6"
                        stroke-width="25"
                        opacity="0.13"/>

                    <path
                        class="soul-wisp-c"
                        d="M178 483 C241 449 291 460 338 491 C392 528 441 525 494 485"
                        stroke="url(#vltSoulRedMist)"
                        stroke-width="17"
                        opacity="0.34"/>

                    <path
                        d="M122 273 C194 245 245 267 282 305"
                        stroke="#d9d1e2"
                        stroke-width="15"
                        opacity="0.12"/>

                    <path
                        d="M448 235 C511 248 552 278 584 326"
                        stroke="#ff183a"
                        stroke-width="12"
                        opacity="0.16"/>
                </g>

                <g filter="url(#vltSoulSoft)">
                    <ellipse
                        cx="372"
                        cy="690"
                        rx="316"
                        ry="92"
                        fill="#b7afc3"
                        opacity="0.10"/>

                    <ellipse
                        cx="389"
                        cy="742"
                        rx="265"
                        ry="74"
                        fill="#817789"
                        opacity="0.11"/>
                </g>

            </svg>

        </div>

        <div class="soul-readout">

            <div class="soul-rune" aria-hidden="true">
                <span class="soul-rune-core"></span>
            </div>

            <span class="soul-label">SEELEN</span>

            <strong
                class="soul-value"
                id="vlt-souls">---</strong>

            <span
                class="soul-divider"
                aria-hidden="true"></span>

            <span class="echo-label">ECHOS</span>

            <strong
                class="echo-value"
                id="vlt-echoes">---</strong>

        </div>
    `;

    document.body.appendChild(counter);

    const soulsElement =
        document.getElementById("vlt-souls");

    const echoesElement =
        document.getElementById("vlt-echoes");


    /* =====================================================
       POSITIONIERUNG RELATIV ZUM ORIGINALBILD
       ===================================================== */

    const positions = {
        main: {
            x: 0.735,
            y: 0.055,
            width: 0.255
        },
        gothic: {
            x: 0.735,
            y: 0.055,
            width: 0.255
        },
        psycho: {
            x: 0.735,
            y: 0.055,
            width: 0.255
        }
    };

    const heroImage =
        new Image();

    function getHeroFile() {
        const hero =
            document.body.dataset.hero;

        if (hero === "gothic") {
            return "images/Gothic.png";
        }

        if (hero === "psycho") {
            return "images/Psycho.png";
        }

        return "images/mainbackground.png";
    }

    function loadPositionImage() {
        heroImage.src =
            getHeroFile();
    }

    function positionCounter() {
        if (
            !heroImage.naturalWidth ||
            !heroImage.naturalHeight
        ) {
            return;
        }

        const hero =
            document.body.dataset.hero ||
            "main";

        const pos =
            positions[hero] ||
            positions.main;

        const viewportWidth =
            window.innerWidth;

        const viewportHeight =
            window.innerHeight;

        const scale =
            Math.min(
                viewportWidth / heroImage.naturalWidth,
                viewportHeight / heroImage.naturalHeight
            );

        const renderedWidth =
            heroImage.naturalWidth * scale;

        const renderedHeight =
            heroImage.naturalHeight * scale;

        const offsetX =
            (viewportWidth - renderedWidth) / 2;

        const offsetY =
            (viewportHeight - renderedHeight) / 2;

        counter.style.left =
            `${offsetX + pos.x * renderedWidth}px`;

        counter.style.top =
            `${offsetY + pos.y * renderedHeight}px`;

        counter.style.width =
            `${pos.width * renderedWidth}px`;
    }

    heroImage.onload =
        positionCounter;

    window.addEventListener(
        "resize",
        positionCounter
    );

    window.addEventListener(
        "vlt:herochange",
        function () {
            loadPositionImage();
        }
    );

    loadPositionImage();


    /* =====================================================
       COUNTER API
       ===================================================== */

    function storageAvailable() {
        try {
            const testKey =
                "__vlt_soul_test__";

            localStorage.setItem(testKey,"1");
            localStorage.removeItem(testKey);

            return true;
        }
        catch (error) {
            return false;
        }
    }

    async function counterRequest(mode,key) {
        const response =
            await fetch(
                `${API}/${mode}/${NAMESPACE}/${key}`,
                {
                    method:"GET",
                    cache:"no-store"
                }
            );

        if (!response.ok) {
            throw new Error(`counter ${response.status}`);
        }

        const data =
            await response.json();

        const value =
            Number(data.value);

        if (!Number.isFinite(value)) {
            throw new Error("counter value invalid");
        }

        return value;
    }

    function formatValue(value) {
        return String(
            Math.max(
                0,
                Math.floor(value)
            )
        ).padStart(3,"0");
    }

    function animateValue(element,value) {
        const reduceMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (reduceMotion || value < 2) {
            element.textContent =
                formatValue(value);
            return;
        }

        const duration = 950;
        const started = performance.now();

        function frame(now) {
            const progress = Math.min(1,(now-started)/duration);
            const eased = 1-Math.pow(1-progress,3);
            const current = Math.round(value*eased);

            element.textContent =
                formatValue(current);

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    async function loadCounters() {
        const echoPromise =
            counterRequest("hit",ECHO_KEY);

        let soulPromise;
        const canStore = storageAvailable();

        if (
            canStore &&
            !localStorage.getItem(LOCAL_MARK)
        ) {
            soulPromise =
                counterRequest("hit",SOUL_KEY)
                    .then(function(value) {
                        localStorage.setItem(LOCAL_MARK,"1");
                        return value;
                    });
        }
        else {
            soulPromise =
                counterRequest("get",SOUL_KEY);
        }

        const results =
            await Promise.allSettled([
                soulPromise,
                echoPromise
            ]);

        if (results[0].status === "fulfilled") {
            animateValue(
                soulsElement,
                results[0].value
            );
        }
        else {
            soulsElement.textContent = "---";
        }

        if (results[1].status === "fulfilled") {
            animateValue(
                echoesElement,
                results[1].value
            );
        }
        else {
            echoesElement.textContent = "---";
        }
    }

    loadCounters();

});
