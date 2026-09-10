document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GOTHIC · ENTER

       Nur aktiv, wenn script.js den Gothic-Hintergrund
       ausgewählt hat.

       Das sichtbare ENTER ist Teil von Gothic.png.
       Hier kommt nur die echte Klickfläche + Animation dazu.
       ===================================================== */

    if (document.body.dataset.hero !== "gothic") {
        return;
    }


    const imageFile = "images/Gothic.png";


    /* =====================================================
       CSS DIREKT EINHÄNGEN
       ===================================================== */

    const style = document.createElement("style");

    style.textContent = `

        #gothic-enter-hotspot {
            position: fixed;
            z-index: 60;
            display: block;
            pointer-events: auto;
            cursor: pointer;
            text-decoration: none;
            outline: 1px solid rgba(150, 0, 0, 0.65);
            background: rgba(100, 0, 0, 0.10);
            box-shadow:
                0 0 6px rgba(180, 0, 0, 0.35),
                0 0 14px rgba(120, 0, 0, 0.18);
            transition:
                opacity 0.2s ease,
                background 0.2s ease,
                box-shadow 0.2s ease,
                outline-color 0.2s ease;
        }

        #gothic-enter-hotspot:hover {
            outline-color: #ff1a1a;
            background: rgba(170, 0, 0, 0.28);
            box-shadow:
                0 0 8px rgba(255, 20, 20, 0.85),
                0 0 18px rgba(180, 0, 0, 0.55);
        }

        #gothic-enter-hotspot.inactive {
            pointer-events: none;
            opacity: 0;
        }

        #gothic-enter-hotspot.running {
            animation: gothic-enter-button-pulse 1.15s ease-out 1;
        }

        #gothic-enter-ritual {
            position: fixed;
            inset: 0;
            z-index: 55;
            overflow: hidden;
            pointer-events: none;
            opacity: 0;
        }

        #gothic-enter-ritual.running,
        #gothic-enter-ritual.awake {
            opacity: 1;
        }

        .gothic-ritual-image,
        .gothic-ritual-fog,
        .gothic-ritual-signal,
        .gothic-ritual-rune,
        .gothic-ritual-vignette {
            position: absolute;
            pointer-events: none;
        }

        .gothic-ritual-image {
            inset: 0;
            background-image: url("${imageFile}");
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center center;
            opacity: 0;
            transform: scale(1);
        }

        .gothic-ritual-fog {
            bottom: -10%;
            width: 76%;
            height: 48%;
            opacity: 0;
            filter: blur(34px);
            background:
                radial-gradient(
                    ellipse at center,
                    rgba(190, 194, 202, 0.14),
                    rgba(90, 98, 110, 0.06) 42%,
                    transparent 72%
                );
        }

        .gothic-ritual-fog.left {
            left: -18%;
        }

        .gothic-ritual-fog.right {
            right: -18%;
        }

        .gothic-ritual-signal {
            top: 0;
            left: 50%;
            width: 1px;
            height: 100%;
            opacity: 0;
            transform: translateX(-50%) scaleY(0);
            transform-origin: center top;
            background:
                linear-gradient(
                    to bottom,
                    transparent 0%,
                    rgba(210, 0, 22, 0.18) 7%,
                    rgba(255, 25, 38, 0.75) 34%,
                    rgba(170, 0, 16, 0.45) 70%,
                    transparent 100%
                );
            box-shadow:
                0 0 9px rgba(220, 0, 22, 0.42),
                0 0 22px rgba(120, 0, 10, 0.24);
        }

        .gothic-ritual-rune {
            position: fixed;
            width: 22px;
            height: 22px;
            border: 1px solid rgba(255, 25, 40, 0.90);
            border-radius: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
            box-shadow:
                0 0 8px rgba(255, 0, 22, 0.80),
                inset 0 0 8px rgba(255, 0, 22, 0.28);
        }

        .gothic-ritual-vignette {
            inset: 0;
            opacity: 0;
            background:
                radial-gradient(
                    ellipse at center,
                    transparent 30%,
                    rgba(0, 0, 0, 0.18) 58%,
                    rgba(0, 0, 0, 0.64) 100%
                );
        }

        #gothic-enter-ritual.running .gothic-ritual-image {
            animation: gothic-enter-breath 3.6s ease-in-out forwards;
        }

        #gothic-enter-ritual.running .gothic-ritual-rune {
            animation: gothic-enter-rune 2.15s cubic-bezier(.16,.78,.22,1) forwards;
        }

        #gothic-enter-ritual.running .gothic-ritual-signal {
            animation: gothic-enter-signal 2.4s .35s ease-out forwards;
        }

        #gothic-enter-ritual.running .gothic-ritual-fog.left {
            animation: gothic-enter-fog-left 3.6s ease-out forwards;
        }

        #gothic-enter-ritual.running .gothic-ritual-fog.right {
            animation: gothic-enter-fog-right 3.6s ease-out forwards;
        }

        #gothic-enter-ritual.running .gothic-ritual-vignette {
            animation: gothic-enter-vignette 3.6s ease-in-out forwards;
        }

        #gothic-enter-ritual.awake .gothic-ritual-image {
            opacity: 0.026;
            animation: gothic-enter-idle-breath 11s ease-in-out infinite;
        }

        #gothic-enter-ritual.awake .gothic-ritual-fog {
            opacity: 0.075;
            animation: gothic-enter-idle-fog 16s ease-in-out infinite alternate;
        }

        #gothic-enter-ritual.awake .gothic-ritual-rune {
            animation: gothic-enter-idle-rune 9s 2.5s ease-out infinite;
        }

        @keyframes gothic-enter-button-pulse {
            0% {
                outline-color: rgba(255,20,20,.70);
                background: rgba(120,0,0,.08);
            }
            36% {
                outline-color: rgba(255,45,45,1);
                background: rgba(170,0,0,.28);
                box-shadow:
                    0 0 12px rgba(255,20,20,.95),
                    0 0 36px rgba(190,0,0,.68);
            }
            100% {
                outline-color: rgba(150,0,0,.65);
                background: rgba(100,0,0,.10);
            }
        }

        @keyframes gothic-enter-rune {
            0% {
                opacity: 0;
                transform: translate(-50%,-50%) scale(.18);
            }
            12% {
                opacity: 1;
            }
            62% {
                opacity: .72;
                transform: translate(-50%,-50%) scale(7);
            }
            100% {
                opacity: 0;
                transform: translate(-50%,-50%) scale(17);
            }
        }

        @keyframes gothic-enter-breath {
            0% {
                opacity: 0;
                transform: scale(1);
                filter: brightness(1) contrast(1) saturate(1);
            }
            18% {
                opacity: .045;
            }
            42% {
                opacity: .14;
                transform: scale(1.012);
                filter: brightness(1.13) contrast(1.05) saturate(1.16);
            }
            66% {
                opacity: .055;
                transform: scale(1.005);
            }
            100% {
                opacity: .024;
                transform: scale(1);
                filter: brightness(1.02) contrast(1.01) saturate(1.04);
            }
        }

        @keyframes gothic-enter-signal {
            0% {
                opacity: 0;
                transform: translateX(-50%) scaleY(0);
            }
            14% {
                opacity: .72;
            }
            62% {
                opacity: .48;
                transform: translateX(-50%) scaleY(1);
            }
            100% {
                opacity: 0;
                transform: translateX(-50%) scaleY(1);
            }
        }

        @keyframes gothic-enter-fog-left {
            0% {
                opacity: 0;
                transform: translateX(-12%) translateY(8%);
            }
            50% {
                opacity: .13;
            }
            100% {
                opacity: .055;
                transform: translateX(13%) translateY(-3%);
            }
        }

        @keyframes gothic-enter-fog-right {
            0% {
                opacity: 0;
                transform: translateX(12%) translateY(8%);
            }
            50% {
                opacity: .11;
            }
            100% {
                opacity: .05;
                transform: translateX(-13%) translateY(-3%);
            }
        }

        @keyframes gothic-enter-vignette {
            0%, 100% { opacity: 0; }
            38% { opacity: .50; }
            62% { opacity: .20; }
        }

        @keyframes gothic-enter-idle-breath {
            0%, 100% {
                opacity: .018;
                transform: scale(1);
            }
            50% {
                opacity: .045;
                transform: scale(1.004);
            }
        }

        @keyframes gothic-enter-idle-rune {
            0%, 79%, 100% {
                opacity: 0;
                transform: translate(-50%,-50%) scale(.3);
            }
            82% { opacity: .42; }
            91% {
                opacity: 0;
                transform: translate(-50%,-50%) scale(4.5);
            }
        }

        @keyframes gothic-enter-idle-fog {
            from { transform: translateX(-3%); }
            to   { transform: translateX(3%); }
        }

        @media (prefers-reduced-motion: reduce) {
            #gothic-enter-ritual {
                display: none;
            }
            #gothic-enter-hotspot {
                animation: none !important;
            }
        }
    `;

    document.head.appendChild(style);


    /* =====================================================
       ENTER-HOTSPOT

       Direkt am sichtbaren roten Button in Gothic.png.
       Koordinaten beziehen sich auf das Originalbild.
       ===================================================== */

    const enter = document.createElement("a");

    enter.id = "gothic-enter-hotspot";
    enter.href = "#aktuell";
    enter.setAttribute("aria-label", "Enter");
    enter.title = "Enter";

    document.body.appendChild(enter);


    /* =====================================================
       RITUAL-EBENE
       ===================================================== */

    const ritual = document.createElement("div");

    ritual.id = "gothic-enter-ritual";
    ritual.setAttribute("aria-hidden", "true");

    ritual.innerHTML = `
        <div class="gothic-ritual-image"></div>
        <div class="gothic-ritual-fog left"></div>
        <div class="gothic-ritual-fog right"></div>
        <div class="gothic-ritual-signal"></div>
        <div class="gothic-ritual-rune"></div>
        <div class="gothic-ritual-vignette"></div>
    `;

    document.body.appendChild(ritual);

    const rune = ritual.querySelector(".gothic-ritual-rune");


    /* =====================================================
       POSITIONIERUNG · IDENTISCH ZU background-size: contain
       ===================================================== */

    const image = new Image();
    image.src = imageFile;


    function positionEnter() {

        if (!image.naturalWidth || !image.naturalHeight) {
            return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const scale = Math.min(
            viewportWidth / image.naturalWidth,
            viewportHeight / image.naturalHeight
        );

        const renderedWidth = image.naturalWidth * scale;
        const renderedHeight = image.naturalHeight * scale;

        const offsetX = (viewportWidth - renderedWidth) / 2;
        const offsetY = (viewportHeight - renderedHeight) / 2;


        /* ENTER: leicht größer als der sichtbare rote Rahmen */

        enter.style.left = `${offsetX + 0.4336 * renderedWidth}px`;
        enter.style.top = `${offsetY + 0.8129 * renderedHeight}px`;
        enter.style.width = `${0.1322 * renderedWidth}px`;
        enter.style.height = `${0.0723 * renderedHeight}px`;


        /* Zentrum des roten Symbols über der Figur */

        rune.style.left = `${offsetX + 0.5000 * renderedWidth}px`;
        rune.style.top = `${offsetY + 0.0840 * renderedHeight}px`;
    }


    image.onload = positionEnter;
    window.addEventListener("resize", positionEnter);


    /* =====================================================
       HOTSPOT BEIM SCROLLEN AUSBLENDEN
       ===================================================== */

    function updateEnterState() {

        const inactive = window.scrollY > window.innerHeight * 0.20;

        enter.classList.toggle("inactive", inactive);
    }


    window.addEventListener("scroll", updateEnterState, { passive: true });
    updateEnterState();


    /* =====================================================
       ENTER · AKTIVIERUNG
       ===================================================== */

    let running = false;


    enter.addEventListener("click", function (event) {

        event.preventDefault();

        if (running) {
            return;
        }


        const target = document.getElementById("aktuell");


        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

            if (target) {
                target.scrollIntoView();
            }

            return;
        }


        running = true;

        enter.classList.remove("running");
        ritual.classList.remove("running", "awake");

        void ritual.offsetWidth;

        enter.classList.add("running");
        ritual.classList.add("running");


        window.setTimeout(function () {

            enter.classList.remove("running");
            ritual.classList.remove("running");
            ritual.classList.add("awake");

            running = false;

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        }, 3600);
    });

});
