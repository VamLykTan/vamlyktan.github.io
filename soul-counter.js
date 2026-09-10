document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SEELENZÄHLER · SEELEN / ECHOS

       SEELEN:
       ungefähr ein Zähler pro Browser, der die Homepage seit
       Aktivierung dieses Zählers besucht hat. Dafür wird nur
       lokal ein Marker gespeichert.

       ECHOS:
       jeder Seitenaufruf der Homepage seit Aktivierung.

       Es werden keine Namen, Mailadressen oder sonstigen
       persönlichen Angaben gespeichert.

       Der externe Zähler ist absichtlich nur dekorative
       Seitenstatistik, keine belastbare Analytics-Lösung.
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
        document.createElement(
            "aside"
        );


    counter.id =
        "vlt-soul-counter";


    counter.setAttribute(
        "aria-label",
        "Seelenzähler"
    );


    counter.title =
        "Seelen ≈ einmal pro Browser · Echos = Seitenaufrufe";


    counter.innerHTML = `
        <span class="soul-mark" aria-hidden="true"></span>

        <span class="soul-pair">
            <span class="soul-label">SEELEN</span>
            <strong id="vlt-souls">------</strong>
        </span>

        <span class="soul-divider" aria-hidden="true"></span>

        <span class="soul-pair">
            <span class="soul-label">ECHOS</span>
            <strong id="vlt-echoes">------</strong>
        </span>
    `;


    document.body.appendChild(
        counter
    );


    const soulsElement =
        document.getElementById(
            "vlt-souls"
        );

    const echoesElement =
        document.getElementById(
            "vlt-echoes"
        );


    /* =====================================================
       OPTIK
       ===================================================== */

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        #vlt-soul-counter {

            --soul-accent:
                #9c0715;

            --soul-accent-soft:
                rgba(156,7,21,.32);

            position:
                fixed;

            z-index:
                48;

            min-width:
                190px;

            display:
                grid;

            grid-template-columns:
                14px
                1fr
                1px
                1fr;

            align-items:
                center;

            gap:
                9px;

            padding:
                8px
                11px;

            color:
                #aaa4a6;

            background:
                linear-gradient(
                    90deg,
                    rgba(0,0,0,.76),
                    rgba(4,3,5,.55)
                );

            border-top:
                1px solid
                rgba(255,255,255,.08);

            border-bottom:
                1px solid
                rgba(120,0,12,.36);

            box-shadow:
                inset 0 0 18px
                rgba(0,0,0,.58),
                0 0 20px
                rgba(0,0,0,.18);

            backdrop-filter:
                blur(3px);

            font-family:
                "Courier New",
                "Liberation Mono",
                monospace;

            line-height:
                1;

            opacity:
                .78;

            transition:
                opacity .25s ease,
                border-color .25s ease,
                box-shadow .25s ease,
                transform .35s ease;

        }


        #vlt-soul-counter::before,
        #vlt-soul-counter::after {

            content:
                "";

            position:
                absolute;

            width:
                18px;

            height:
                1px;

            background:
                var(--soul-accent);

            box-shadow:
                0 0 8px
                var(--soul-accent-soft);

        }


        #vlt-soul-counter::before {

            left:
                -8px;

            top:
                -1px;

        }


        #vlt-soul-counter::after {

            right:
                -8px;

            bottom:
                -1px;

        }


        #vlt-soul-counter:hover {

            opacity:
                1;

            border-bottom-color:
                var(--soul-accent);

            box-shadow:
                inset 0 0 18px
                rgba(0,0,0,.62),
                0 0 18px
                var(--soul-accent-soft);

        }


        #vlt-soul-counter
        .soul-mark {

            position:
                relative;

            width:
                11px;

            height:
                11px;

            border:
                1px solid
                var(--soul-accent);

            transform:
                rotate(45deg);

            box-shadow:
                0 0 7px
                var(--soul-accent-soft);

        }


        #vlt-soul-counter
        .soul-mark::before {

            content:
                "";

            position:
                absolute;

            left:
                50%;

            top:
                -6px;

            width:
                1px;

            height:
                21px;

            background:
                var(--soul-accent);

            transform:
                translateX(-50%);

            opacity:
                .68;

        }


        #vlt-soul-counter
        .soul-pair {

            display:
                grid;

            gap:
                4px;

        }


        #vlt-soul-counter
        .soul-label {

            color:
                #666267;

            font-size:
                clamp(
                    7px,
                    .47vw,
                    9px
                );

            letter-spacing:
                .18em;

        }


        #vlt-soul-counter
        strong {

            color:
                #c6bec1;

            font-size:
                clamp(
                    10px,
                    .72vw,
                    13px
                );

            font-weight:
                normal;

            letter-spacing:
                .12em;

            text-shadow:
                0 0 8px
                rgba(255,255,255,.08);

        }


        #vlt-soul-counter
        .soul-divider {

            align-self:
                stretch;

            width:
                1px;

            background:
                linear-gradient(
                    transparent,
                    rgba(150,0,15,.42),
                    transparent
                );

        }


        body[data-hero="gothic"]
        #vlt-soul-counter {

            --soul-accent:
                #a80b18;

            --soul-accent-soft:
                rgba(168,11,24,.34);

        }


        body[data-hero="main"]
        #vlt-soul-counter {

            --soul-accent:
                #ba0d1c;

            --soul-accent-soft:
                rgba(186,13,28,.34);

        }


        body[data-hero="psycho"]
        #vlt-soul-counter {

            --soul-accent:
                #7a438f;

            --soul-accent-soft:
                rgba(122,67,143,.38);

            border-bottom-color:
                rgba(122,67,143,.44);

        }


        /*
         * Beim Gothic-Portal wird der Zähler mit verschluckt.
         */

        body.vlt-portal-active
        #vlt-soul-counter {

            opacity:
                .08;

            transform:
                scale(.98);

        }


        @media (max-width: 700px) {

            #vlt-soul-counter {

                min-width:
                    164px;

                gap:
                    7px;

                padding:
                    7px
                    9px;

            }

        }


        @media (prefers-reduced-motion: reduce) {

            #vlt-soul-counter {

                transition:
                    none;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    /* =====================================================
       POSITIONIERUNG RELATIV ZUM ORIGINALBILD

       Der Zähler sitzt unterhalb der Social-Icon-Zone.
       ===================================================== */

    const positions = {

        main: {
            x: 0.795,
            y: 0.090,
            width: 0.158
        },

        gothic: {
            x: 0.795,
            y: 0.082,
            width: 0.158
        },

        psycho: {
            x: 0.795,
            y: 0.090,
            width: 0.158
        }

    };


    const image =
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

        image.src =
            getHeroFile();

    }


    function positionCounter() {

        if (
            !image.naturalWidth ||
            !image.naturalHeight
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
                viewportWidth /
                    image.naturalWidth,

                viewportHeight /
                    image.naturalHeight
            );


        const renderedWidth =
            image.naturalWidth *
            scale;

        const renderedHeight =
            image.naturalHeight *
            scale;


        const offsetX =
            (
                viewportWidth -
                renderedWidth
            ) / 2;

        const offsetY =
            (
                viewportHeight -
                renderedHeight
            ) / 2;


        const width =
            pos.width *
            renderedWidth;


        counter.style.left =
            `${
                offsetX +
                pos.x *
                renderedWidth
            }px`;

        counter.style.top =
            `${
                offsetY +
                pos.y *
                renderedHeight
            }px`;

        counter.style.width =
            `${width}px`;

    }


    image.onload =
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
       API
       ===================================================== */

    function storageAvailable() {

        try {

            const testKey =
                "__vlt_soul_test__";


            localStorage.setItem(
                testKey,
                "1"
            );


            localStorage.removeItem(
                testKey
            );


            return true;

        }

        catch (error) {

            return false;

        }

    }


    async function counterRequest(
        mode,
        key
    ) {

        const response =
            await fetch(
                `${API}/${mode}/${NAMESPACE}/${key}`,
                {
                    method:
                        "GET",

                    cache:
                        "no-store"
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
            Number(
                data.value
            );


        if (
            !Number.isFinite(
                value
            )
        ) {

            throw new Error(
                "counter value invalid"
            );

        }


        return value;

    }


    function formatValue(
        value
    ) {

        return String(
            Math.max(
                0,
                Math.floor(
                    value
                )
            )
        ).padStart(
            6,
            "0"
        );

    }


    function animateValue(
        element,
        value
    ) {

        const reduceMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        if (
            reduceMotion ||
            value < 2
        ) {

            element.textContent =
                formatValue(
                    value
                );


            return;

        }


        const duration =
            950;

        const started =
            performance.now();


        function frame(now) {

            const progress =
                Math.min(
                    1,
                    (
                        now -
                        started
                    ) /
                    duration
                );


            const eased =
                1 -
                Math.pow(
                    1 -
                    progress,
                    3
                );


            const current =
                Math.round(
                    value *
                    eased
                );


            element.textContent =
                formatValue(
                    current
                );


            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    frame
                );

            }

        }


        requestAnimationFrame(
            frame
        );

    }


    async function loadCounters() {

        /*
         * ECHOS:
         * jeder Homepage-Aufruf.
         */

        const echoPromise =
            counterRequest(
                "hit",
                ECHO_KEY
            );


        /*
         * SEELEN:
         * nur einmal pro Browser, solange LocalStorage
         * nicht gelöscht wird.
         */

        let soulPromise;


        const canStore =
            storageAvailable();


        if (
            canStore &&
            !localStorage.getItem(
                LOCAL_MARK
            )
        ) {

            soulPromise =
                counterRequest(
                    "hit",
                    SOUL_KEY
                ).then(
                    value => {

                        localStorage.setItem(
                            LOCAL_MARK,
                            "1"
                        );


                        return value;

                    }
                );

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


        if (
            results[0].status ===
            "fulfilled"
        ) {

            animateValue(
                soulsElement,
                results[0].value
            );

        }

        else {

            soulsElement.textContent =
                "------";

        }


        if (
            results[1].status ===
            "fulfilled"
        ) {

            animateValue(
                echoesElement,
                results[1].value
            );

        }

        else {

            echoesElement.textContent =
                "------";

        }

    }


    loadCounters();

});