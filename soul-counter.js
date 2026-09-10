document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SEELENZÄHLER · SEELEN / ECHOS

       SEELEN:
       ungefähr einmal pro Browser.

       ECHOS:
       jeder Aufruf der Homepage.

       Die Optik basiert auf dem freigegebenen Seelenmotiv:
       körperlose Erscheinungen liegen hinter der Anzeige.
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
        <div class="soul-art" aria-hidden="true"></div>

        <div class="soul-readout">
            <span class="soul-label">SEELEN</span>
            <strong class="soul-value" id="vlt-souls">—</strong>

            <span class="soul-divider" aria-hidden="true"></span>

            <span class="echo-label">ECHOS</span>
            <strong class="echo-value" id="vlt-echoes">—</strong>
        </div>
    `;

    document.body.appendChild(counter);


    const soulsElement =
        document.getElementById("vlt-souls");

    const echoesElement =
        document.getElementById("vlt-echoes");


    /* =====================================================
       OPTIK
       ===================================================== */

    const style =
        document.createElement("style");

    style.textContent = `

        #vlt-soul-counter {
            --soul-accent: #f21b36;
            --soul-muted: #938d91;

            position: fixed;
            z-index: 48;

            aspect-ratio: 5 / 4;

            pointer-events: none;

            opacity: .92;
            transform: translateZ(0);

            transition:
                opacity .45s ease,
                transform .55s ease,
                filter .45s ease;

            filter:
                drop-shadow(0 0 18px rgba(0,0,0,.42));
        }

        #vlt-soul-counter .soul-art {
            position: absolute;
            inset: 0;

            background:
                url("images/soul-counter-bg.svg")
                center center / contain
                no-repeat;

            opacity: .94;

            transform-origin: 68% 48%;

            animation:
                vlt-soul-drift
                12s
                ease-in-out
                infinite;
        }

        #vlt-soul-counter .soul-readout {
            position: absolute;

            left: 56.0%;
            top: 38.0%;

            width: 28.5%;

            display: flex;
            flex-direction: column;
            align-items: center;

            text-align: center;

            font-family:
                Georgia,
                "Times New Roman",
                serif;

            text-transform: uppercase;

            text-shadow:
                0 2px 8px rgba(0,0,0,.95);
        }

        #vlt-soul-counter .soul-label,
        #vlt-soul-counter .echo-label {
            display: block;

            color: #e6dfe2;

            font-size:
                clamp(8px, .65vw, 12px);

            letter-spacing: .22em;
            line-height: 1;
        }

        #vlt-soul-counter .soul-value {
            display: block;

            margin-top: 10%;

            color: var(--soul-accent);

            font-size:
                clamp(25px, 2.25vw, 46px);

            font-weight: normal;
            line-height: .94;

            letter-spacing: .035em;

            text-shadow:
                0 0 8px rgba(255,20,45,.74),
                0 0 20px rgba(160,0,20,.42),
                0 2px 8px rgba(0,0,0,1);
        }

        #vlt-soul-counter .soul-divider {
            display: block;

            width: 68%;
            height: 1px;

            margin: 13% 0 10%;

            background:
                linear-gradient(
                    90deg,
                    transparent,
                    rgba(245,25,50,.94),
                    transparent
                );

            box-shadow:
                0 0 7px rgba(240,15,40,.36);
        }

        #vlt-soul-counter .soul-divider::after {
            content: "";

            display: block;

            width: 5px;
            height: 5px;

            margin: -2px auto 0;

            background: var(--soul-accent);

            transform: rotate(45deg);

            box-shadow:
                0 0 7px rgba(245,20,45,.55);
        }

        #vlt-soul-counter .echo-label {
            color: #aaa3a7;

            font-size:
                clamp(7px, .55vw, 10px);
        }

        #vlt-soul-counter .echo-value {
            display: block;

            margin-top: 7%;

            color: var(--soul-muted);

            font-size:
                clamp(16px, 1.45vw, 28px);

            font-weight: normal;
            line-height: 1;

            letter-spacing: .04em;

            text-shadow:
                0 2px 8px rgba(0,0,0,1),
                0 0 8px rgba(255,255,255,.08);
        }

        body[data-hero="psycho"]
        #vlt-soul-counter {
            --soul-accent: #a55cc4;
            --soul-muted: #9a8da0;

            filter:
                hue-rotate(18deg)
                drop-shadow(0 0 18px rgba(0,0,0,.42));
        }

        body.vlt-portal-active
        #vlt-soul-counter {
            opacity: .12;
            transform: scale(.97);
            filter: blur(2px);
        }

        @keyframes vlt-soul-drift {
            0%, 100% {
                transform:
                    translate3d(0,0,0)
                    scale(1);
            }

            50% {
                transform:
                    translate3d(1.4%, -1.2%, 0)
                    scale(1.012);
            }
        }

        @media (max-width: 700px) {
            #vlt-soul-counter {
                opacity: .82;
            }

            #vlt-soul-counter .soul-readout {
                left: 55.5%;
                width: 30%;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #vlt-soul-counter,
            #vlt-soul-counter .soul-art {
                transition: none;
                animation: none;
            }
        }
    `;

    document.head.appendChild(style);


    /* =====================================================
       POSITIONIERUNG RELATIV ZUM ORIGINALBILD

       Die Erscheinungen liegen rechts oben und die Ziffern
       schweben davor – wie im freigegebenen Entwurf.
       ===================================================== */

    const positions = {
        main: {
            x: 0.700,
            y: 0.071,
            width: 0.286
        },

        gothic: {
            x: 0.700,
            y: 0.071,
            width: 0.286
        },

        psycho: {
            x: 0.700,
            y: 0.071,
            width: 0.286
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

        const width =
            pos.width * renderedWidth;

        counter.style.left =
            `${offsetX + pos.x * renderedWidth}px`;

        counter.style.top =
            `${offsetY + pos.y * renderedHeight}px`;

        counter.style.width =
            `${width}px`;
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
       ZÄHLER
       ===================================================== */

    function storageAvailable() {
        try {
            const testKey =
                "__vlt_soul_test__";

            localStorage.setItem(testKey, "1");
            localStorage.removeItem(testKey);

            return true;
        }
        catch (error) {
            return false;
        }
    }

    async function counterRequest(mode, key) {
        const response =
            await fetch(
                `${API}/${mode}/${NAMESPACE}/${key}`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                `counter ${response.status}`
            );
        }

        const data =
            await response.json();

        const value =
            Number(data.value);

        if (!Number.isFinite(value)) {
            throw new Error(
                "counter value invalid"
            );
        }

        return value;
    }

    function formatValue(value) {
        return String(
            Math.max(
                0,
                Math.floor(value)
            )
        );
    }

    function animateValue(element, value) {
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
            const progress =
                Math.min(
                    1,
                    (now - started) / duration
                );

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                Math.round(value * eased);

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
            counterRequest(
                "hit",
                ECHO_KEY
            );

        let soulPromise;

        const canStore =
            storageAvailable();

        if (
            canStore &&
            !localStorage.getItem(LOCAL_MARK)
        ) {
            soulPromise =
                counterRequest(
                    "hit",
                    SOUL_KEY
                ).then(function (value) {
                    localStorage.setItem(
                        LOCAL_MARK,
                        "1"
                    );

                    return value;
                });
        }
        else {
            soulPromise =
                counterRequest(
                    "get",
                    SOUL_KEY
                );
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
            soulsElement.textContent = "—";
        }

        if (results[1].status === "fulfilled") {
            animateValue(
                echoesElement,
                results[1].value
            );
        }
        else {
            echoesElement.textContent = "—";
        }
    }

    loadCounters();

});