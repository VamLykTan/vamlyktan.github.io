document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GOTHIC · ENTER PORTAL

       Gothic ist das Eingangstor.

       ENTER:
       1. Nebel baut sich in mehreren Schichten auf.
       2. Gothic wird vollständig vom Nebel verschluckt.
       3. Hinter dem Nebel wird Main ODER Psycho (50/50)
          aktiviert.
       4. Der Nebel zieht ab und das neue Bild bleibt stehen.

       Kein Scroll zu "Aktuell".
       ===================================================== */

    if (
        document.body.dataset.hero !==
        "gothic"
    ) {

        return;

    }


    if (
        !window.VLTHero
    ) {

        return;

    }


    const imageFile =
        "images/Gothic.png";


    /* =====================================================
       CSS
       ===================================================== */

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        /* -------------------------------------------------
           ENTER-HOTSPOT
           ------------------------------------------------- */

        #gothic-enter-hotspot {
            position: fixed;
            z-index: 70;
            display: block;
            pointer-events: auto;
            cursor: pointer;
            text-decoration: none;

            outline: 1px solid rgba(150, 0, 0, 0.58);
            background: rgba(90, 0, 0, 0.06);

            box-shadow:
                0 0 7px rgba(180, 0, 0, 0.25),
                0 0 18px rgba(110, 0, 0, 0.12);

            transition:
                opacity 0.35s ease,
                background 0.25s ease,
                box-shadow 0.25s ease,
                outline-color 0.25s ease;
        }

        #gothic-enter-hotspot:hover {
            outline-color: rgba(255, 35, 35, 0.95);
            background: rgba(160, 0, 0, 0.20);

            box-shadow:
                0 0 10px rgba(255, 20, 20, 0.65),
                0 0 28px rgba(155, 0, 0, 0.35);
        }

        #gothic-enter-hotspot.running {
            pointer-events: none;

            animation:
                vlt-enter-pulse
                1.20s
                ease-out
                forwards;
        }

        #gothic-enter-hotspot.hidden {
            pointer-events: none;
            opacity: 0;
        }


        /* -------------------------------------------------
           PORTAL-BÜHNE
           ------------------------------------------------- */

        #gothic-portal {
            position: fixed;
            inset: 0;
            z-index: 62;
            overflow: hidden;
            pointer-events: none;
            visibility: hidden;
            opacity: 0;

            background:
                transparent;
        }

        #gothic-portal.running {
            visibility: visible;
            opacity: 1;
        }


        /*
         * Alte Gothic-Kopie liegt über dem Hintergrund.
         * Dadurch kann Gothic wegsterben, während darunter
         * bereits das neue Hero-Bild umgeschaltet wird.
         */

        .portal-old-hero {
            position: absolute;
            inset: 0;
            z-index: 1;

            background-image:
                url("${imageFile}");

            background-repeat:
                no-repeat;

            background-size:
                contain;

            background-position:
                center center;

            opacity: 1;

            transform:
                scale(1);

            filter:
                brightness(1)
                contrast(1)
                saturate(1);

            animation:
                vlt-gothic-dissolve
                5.4s
                ease-in-out
                forwards;
        }


        /* -------------------------------------------------
           ORGANISCHER NEBEL

           Jede Ebene benutzt SVG-Fractal-Noise als Textur.
           Dadurch ist es keine simple Blur-Fläche.
           ------------------------------------------------- */

        .portal-fog {
            position: absolute;
            z-index: 4;

            width: 145%;
            height: 86%;

            left: -22%;

            opacity: 0;

            background-image:
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='520' viewBox='0 0 900 520'%3E%3Cfilter id='n' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.009 .022' numOctaves='4' seed='23'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='gamma' amplitude='1.25' exponent='1.4' offset='-.12'/%3E%3CfeFuncG type='gamma' amplitude='1.25' exponent='1.4' offset='-.12'/%3E%3CfeFuncB type='gamma' amplitude='1.25' exponent='1.4' offset='-.12'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23aeb4bc' filter='url(%23n)' opacity='.92'/%3E%3C/svg%3E");

            background-size:
                58%
                100%;

            background-repeat:
                repeat-x;

            mix-blend-mode:
                screen;

            filter:
                blur(11px)
                contrast(1.32);

            -webkit-mask-image:
                radial-gradient(
                    ellipse at center,
                    black 0 42%,
                    rgba(0,0,0,.90) 56%,
                    rgba(0,0,0,.28) 76%,
                    transparent 100%
                );

            mask-image:
                radial-gradient(
                    ellipse at center,
                    black 0 42%,
                    rgba(0,0,0,.90) 56%,
                    rgba(0,0,0,.28) 76%,
                    transparent 100%
                );

            will-change:
                transform,
                opacity;
        }


        .portal-fog.back {
            bottom: -24%;

            opacity: 0;

            filter:
                blur(18px)
                contrast(1.10);

            animation:
                vlt-fog-back
                5.6s
                ease-in-out
                forwards;
        }


        .portal-fog.mid-a {
            bottom: -18%;

            transform:
                translateX(-18%)
                scale(1.12);

            animation:
                vlt-fog-mid-a
                5.6s
                cubic-bezier(.18,.70,.20,1)
                forwards;
        }


        .portal-fog.mid-b {
            bottom: -12%;

            transform:
                translateX(20%)
                scale(1.18);

            animation:
                vlt-fog-mid-b
                5.6s
                cubic-bezier(.18,.70,.20,1)
                forwards;
        }


        .portal-fog.front {
            bottom: -31%;

            height: 96%;

            background-size:
                48%
                100%;

            filter:
                blur(8px)
                contrast(1.45);

            animation:
                vlt-fog-front
                5.6s
                cubic-bezier(.14,.72,.20,1)
                forwards;
        }


        /*
         * Seitliche Rauchzungen. Sie sorgen dafür, dass der
         * Nebel nicht nur von unten als horizontale Wand kommt.
         */

        .portal-smoke-wing {
            position: absolute;
            z-index: 5;

            top: 8%;

            width: 58%;
            height: 88%;

            opacity: 0;

            background:
                radial-gradient(
                    ellipse at center,
                    rgba(178,185,192,.28) 0%,
                    rgba(91,97,105,.16) 34%,
                    rgba(35,38,43,.08) 55%,
                    transparent 76%
                );

            filter:
                blur(38px);

            will-change:
                transform,
                opacity;
        }


        .portal-smoke-wing.left {
            left: -25%;

            animation:
                vlt-smoke-wing-left
                5.4s
                ease-in-out
                forwards;
        }


        .portal-smoke-wing.right {
            right: -25%;

            animation:
                vlt-smoke-wing-right
                5.4s
                ease-in-out
                forwards;
        }


        /*
         * Rote Glut bleibt nur im Kern des Rituals.
         * Kein roter Kreis.
         */

        .portal-red-core {
            position: absolute;
            z-index: 3;

            left: 50%;
            top: 48%;

            width: min(46vw, 650px);
            aspect-ratio: 1 / 1;

            opacity: 0;

            transform:
                translate(-50%, -50%)
                scale(.72);

            background:
                radial-gradient(
                    circle,
                    rgba(190,0,18,.18) 0%,
                    rgba(130,0,13,.10) 25%,
                    rgba(70,0,8,.035) 48%,
                    transparent 70%
                );

            filter:
                blur(17px);

            animation:
                vlt-red-core
                5.4s
                ease-in-out
                forwards;
        }


        /*
         * Schwarzer Schleier: am Höhepunkt ist genug Deckung
         * vorhanden, um den Hero-Wechsel unsichtbar zu machen.
         */

        .portal-veil {
            position: absolute;
            inset: 0;
            z-index: 6;

            opacity: 0;

            background:
                radial-gradient(
                    ellipse at center,
                    rgba(8,8,10,.54) 0%,
                    rgba(3,3,5,.70) 48%,
                    rgba(0,0,0,.90) 100%
                );

            animation:
                vlt-veil
                5.6s
                ease-in-out
                forwards;
        }


        /*
         * Am Ende ein ganz kurzer Lichtsaum des neuen Bildes.
         */

        .portal-arrival {
            position: absolute;
            inset: 0;
            z-index: 7;

            opacity: 0;

            background:
                radial-gradient(
                    ellipse at center,
                    rgba(170,30,45,.08),
                    transparent 58%
                );

            animation:
                vlt-arrival
                5.6s
                ease-in-out
                forwards;
        }


        /* -------------------------------------------------
           KEYFRAMES
           ------------------------------------------------- */

        @keyframes vlt-enter-pulse {

            0% {
                outline-color:
                    rgba(180,0,0,.55);

                box-shadow:
                    0 0 8px
                    rgba(180,0,0,.28);
            }

            32% {
                outline-color:
                    rgba(255,40,40,1);

                background:
                    rgba(150,0,0,.24);

                box-shadow:
                    0 0 13px
                    rgba(255,20,20,.92),
                    0 0 42px
                    rgba(180,0,0,.52);
            }

            100% {
                outline-color:
                    rgba(150,0,0,.20);

                background:
                    rgba(70,0,0,.02);

                box-shadow:
                    0 0 0
                    rgba(0,0,0,0);
            }
        }


        @keyframes vlt-gothic-dissolve {

            0% {
                opacity: 1;

                transform:
                    scale(1);

                filter:
                    brightness(1)
                    contrast(1)
                    saturate(1);
            }

            34% {
                opacity: 1;

                transform:
                    scale(1.006);

                filter:
                    brightness(.93)
                    contrast(1.04)
                    saturate(.90);
            }

            50% {
                opacity: .82;

                transform:
                    scale(1.014);

                filter:
                    brightness(.72)
                    contrast(1.08)
                    saturate(.72);
            }

            66% {
                opacity: .15;

                transform:
                    scale(1.020);

                filter:
                    brightness(.48)
                    contrast(1.10)
                    saturate(.54);
            }

            100% {
                opacity: 0;

                transform:
                    scale(1.024);
            }
        }


        @keyframes vlt-fog-back {

            0% {
                opacity: 0;

                transform:
                    translateY(28%)
                    scale(1.04);
            }

            34% {
                opacity: .30;
            }

            54% {
                opacity: .62;

                transform:
                    translateY(-7%)
                    scale(1.12);
            }

            72% {
                opacity: .46;
            }

            100% {
                opacity: 0;

                transform:
                    translateY(-30%)
                    scale(1.18);
            }
        }


        @keyframes vlt-fog-mid-a {

            0% {
                opacity: 0;

                transform:
                    translate(-24%, 34%)
                    scale(1.05);
            }

            30% {
                opacity: .36;
            }

            52% {
                opacity: .78;

                transform:
                    translate(7%, -4%)
                    scale(1.17);
            }

            72% {
                opacity: .50;
            }

            100% {
                opacity: 0;

                transform:
                    translate(27%, -35%)
                    scale(1.28);
            }
        }


        @keyframes vlt-fog-mid-b {

            0% {
                opacity: 0;

                transform:
                    translate(25%, 32%)
                    scale(1.05);
            }

            26% {
                opacity: .30;
            }

            55% {
                opacity: .72;

                transform:
                    translate(-9%, -8%)
                    scale(1.19);
            }

            74% {
                opacity: .46;
            }

            100% {
                opacity: 0;

                transform:
                    translate(-31%, -38%)
                    scale(1.27);
            }
        }


        @keyframes vlt-fog-front {

            0% {
                opacity: 0;

                transform:
                    translateY(36%)
                    scale(1.04);
            }

            30% {
                opacity: .32;
            }

            50% {
                opacity: .86;

                transform:
                    translateY(-4%)
                    scale(1.20);
            }

            63% {
                opacity: .78;
            }

            80% {
                opacity: .36;
            }

            100% {
                opacity: 0;

                transform:
                    translateY(-46%)
                    scale(1.32);
            }
        }


        @keyframes vlt-smoke-wing-left {

            0% {
                opacity: 0;

                transform:
                    translateX(-30%)
                    rotate(-8deg)
                    scale(.82);
            }

            40% {
                opacity: .36;
            }

            60% {
                opacity: .48;

                transform:
                    translateX(58%)
                    rotate(4deg)
                    scale(1.14);
            }

            100% {
                opacity: 0;

                transform:
                    translateX(88%)
                    rotate(11deg)
                    scale(1.28);
            }
        }


        @keyframes vlt-smoke-wing-right {

            0% {
                opacity: 0;

                transform:
                    translateX(30%)
                    rotate(8deg)
                    scale(.82);
            }

            40% {
                opacity: .33;
            }

            60% {
                opacity: .46;

                transform:
                    translateX(-58%)
                    rotate(-4deg)
                    scale(1.14);
            }

            100% {
                opacity: 0;

                transform:
                    translateX(-88%)
                    rotate(-11deg)
                    scale(1.28);
            }
        }


        @keyframes vlt-red-core {

            0%,
            100% {
                opacity: 0;

                transform:
                    translate(-50%, -50%)
                    scale(.72);
            }

            24% {
                opacity: .16;
            }

            52% {
                opacity: .80;

                transform:
                    translate(-50%, -50%)
                    scale(1.18);
            }

            69% {
                opacity: .30;

                transform:
                    translate(-50%, -50%)
                    scale(1.42);
            }
        }


        @keyframes vlt-veil {

            0%,
            24% {
                opacity: 0;
            }

            49% {
                opacity: .42;
            }

            56% {
                opacity: .94;
            }

            64% {
                opacity: .90;
            }

            78% {
                opacity: .30;
            }

            100% {
                opacity: 0;
            }
        }


        @keyframes vlt-arrival {

            0%,
            62% {
                opacity: 0;
            }

            76% {
                opacity: .42;
            }

            100% {
                opacity: 0;
            }
        }


        @media (prefers-reduced-motion: reduce) {

            #gothic-portal {
                display: none;
            }

            #gothic-enter-hotspot {
                animation: none !important;
            }

        }

    `;


    document.head.appendChild(
        style
    );


    /* =====================================================
       ENTER-HOTSPOT
       ===================================================== */

    const enter =
        document.createElement(
            "a"
        );


    enter.id =
        "gothic-enter-hotspot";

    enter.href =
        "#";

    enter.setAttribute(
        "aria-label",
        "Enter"
    );

    enter.title =
        "Enter";


    document.body.appendChild(
        enter
    );


    /* =====================================================
       PORTAL
       ===================================================== */

    const portal =
        document.createElement(
            "div"
        );


    portal.id =
        "gothic-portal";

    portal.setAttribute(
        "aria-hidden",
        "true"
    );


    portal.innerHTML = `
        <div class="portal-old-hero"></div>

        <div class="portal-red-core"></div>

        <div class="portal-fog back"></div>
        <div class="portal-fog mid-a"></div>
        <div class="portal-fog mid-b"></div>
        <div class="portal-fog front"></div>

        <div class="portal-smoke-wing left"></div>
        <div class="portal-smoke-wing right"></div>

        <div class="portal-veil"></div>
        <div class="portal-arrival"></div>
    `;


    document.body.appendChild(
        portal
    );


    /* =====================================================
       ENTER-POSITION
       background-size: contain
       ===================================================== */

    const image =
        new Image();


    image.src =
        imageFile;


    function positionEnter() {

        if (
            !image.naturalWidth ||
            !image.naturalHeight
        ) {

            return;

        }


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


        /*
         * Sichtbarer ENTER-Rahmen in Gothic.png.
         */

        enter.style.left =
            `${
                offsetX +
                0.4336 *
                renderedWidth
            }px`;

        enter.style.top =
            `${
                offsetY +
                0.8129 *
                renderedHeight
            }px`;

        enter.style.width =
            `${
                0.1322 *
                renderedWidth
            }px`;

        enter.style.height =
            `${
                0.0723 *
                renderedHeight
            }px`;

    }


    image.onload =
        positionEnter;


    window.addEventListener(
        "resize",
        positionEnter
    );


    /* =====================================================
       BEIM SCROLLEN DEAKTIVIEREN
       ===================================================== */

    function updateEnterState() {

        const inactive =
            window.scrollY >
            window.innerHeight *
            0.20;


        enter.classList.toggle(
            "hidden",
            inactive
        );

    }


    window.addEventListener(
        "scroll",
        updateEnterState,
        {
            passive: true
        }
    );


    updateEnterState();


    /* =====================================================
       RITUAL
       ===================================================== */

    let running =
        false;


    function choosePortalTarget() {

        return (
            Math.random() < 0.5
            ? "main"
            : "psycho"
        );

    }


    enter.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (running) {
                return;
            }


            running =
                true;


            const targetHero =
                choosePortalTarget();


            /*
             * Reduced Motion:
             * Kein Ritual, aber trotzdem Portal-Funktion.
             */

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {

                window.VLTHero.switchHero(
                    targetHero
                );


                enter.remove();
                portal.remove();


                return;

            }


            document.body.classList.add(
                "vlt-portal-active"
            );


            enter.classList.add(
                "running"
            );


            portal.classList.remove(
                "running"
            );


            void portal.offsetWidth;


            portal.classList.add(
                "running"
            );


            /*
             * Der eigentliche Bildwechsel findet am dichtesten
             * Punkt des Nebels statt.
             */

            window.setTimeout(
                function () {

                    window.VLTHero.switchHero(
                        targetHero
                    );


                    enter.classList.add(
                        "hidden"
                    );

                },
                3050
            );


            /*
             * Nebel vollständig abziehen lassen.
             */

            window.setTimeout(
                function () {

                    document.body.classList.remove(
                        "vlt-portal-active"
                    );


                    portal.classList.remove(
                        "running"
                    );


                    portal.style.visibility =
                        "hidden";


                    enter.remove();


                    running =
                        false;

                },
                5750
            );

        }
    );


    /* =====================================================
       Falls ein Hero-Wechsel von außen ausgelöst wird,
       verschwindet ENTER ebenfalls.
       ===================================================== */

    window.addEventListener(
        "vlt:herochange",
        function (event) {

            if (
                event.detail &&
                event.detail.id !==
                "gothic"
            ) {

                enter.classList.add(
                    "hidden"
                );

            }

        }
    );

});