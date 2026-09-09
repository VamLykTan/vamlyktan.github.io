document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DEBUG
       =====================================================

       true  = Hotspots sichtbar
       false = Hotspots unsichtbar

       Farbe und Darstellung kommen aus der CSS.
       ===================================================== */

    const HOTSPOT_DEBUG = false;


    /* =====================================================
       HERO-DEFINITIONEN

       x / y / width / height beziehen sich immer auf
       das ORIGINALBILD.

       Beispiel:
       x: 0.50 = 50 % der Bildbreite

       Dadurch bleiben die Hotspots auch bei anderen
       Fenstergrößen an derselben Stelle des Bildes.
       ===================================================== */

    const heroes = [

        /* -------------------------------------------------
           STANDARD / KOMBINATION
           60 %
           ------------------------------------------------- */

        {
            id: "main",

            file: "images/mainbackground.png",

            weight: 60,

            hotspots: [

                /*
                 * PROJEKTE
                 * obere Navigation
                 */

                {
                    id: "projects-main",

                    href: "projects/index.html",

                    label: "Projekte",

                    x: 0.472,
                    y: 0.021,

                    width: 0.057,
                    height: 0.034
                }

            ]
        },


        /* -------------------------------------------------
           GOTHIC
           10 %

           Dort existiert aktuell kein Projekte-Element.
           ------------------------------------------------- */

        {
            id: "gothic",

            file: "images/Gothic.png",

            weight: 10,

            hotspots: []
        },


        /* -------------------------------------------------
           PSYCHO
           30 %
           ------------------------------------------------- */

        {
            id: "psycho",

            file: "images/Psycho.png",

            weight: 30,

            hotspots: [

                /*
                 * PROJEKTE
                 * obere Navigation
                 */

                {
                    id: "projects-psycho-nav",

                    href: "projects/index.html",

                    label: "Projekte",

                    x: 0.426,
                    y: 0.021,

                    width: 0.060,
                    height: 0.034
                },


                /*
                 * Projekte
                 *
                 * Aktuell · Events · Projekte
                 */

                {
                    id: "projects-psycho-content",

                    href: "projects/index.html",

                    label: "Projekte",

                    x: 0.335,
                    y: 0.568,

                    width: 0.068,
                    height: 0.035
                }

            ]
        }

    ];


    /* =====================================================
       HERO AUSWÄHLEN
       60 / 10 / 30
       ===================================================== */

    function selectHero() {

        const random =
            Math.random() * 100;

        let sum = 0;


        for (const hero of heroes) {

            sum += hero.weight;


            if (random < sum) {

                return hero;

            }

        }


        /*
         * Sicherheits-Fallback
         */

        return heroes[0];
    }


    const selectedHero =
        selectHero();


    /* =====================================================
       HINTERGRUNDBILD SETZEN
       ===================================================== */

    document.documentElement.style.setProperty(

        "--hero-image",

        `url("${selectedHero.file}")`

    );


    /*
     * Aktiven Hero am BODY merken.
     *
     * Kann später auch für CSS benutzt werden:
     *
     * body[data-hero="psycho"]
     */

    document.body.dataset.hero =
        selectedHero.id;


    /* =====================================================
       HOTSPOT-EBENE
       ===================================================== */

    const hotspotLayer =
        document.createElement("div");


    hotspotLayer.id =
        "background-hotspots";


    document.body.appendChild(
        hotspotLayer
    );


    /* =====================================================
       DEBUG-MODUS
       ===================================================== */

    if (HOTSPOT_DEBUG) {

        document.body.classList.add(
            "hotspot-debug"
        );

    }


    /* =====================================================
       HOTSPOTS ERZEUGEN
       ===================================================== */

    const hotspotElements = [];


    for (
        const hotspot
        of selectedHero.hotspots
    ) {

        const link =
            document.createElement("a");


        link.className =
            "background-hotspot";


        link.href =
            hotspot.href;


        link.setAttribute(
            "aria-label",
            hotspot.label
        );


        link.title =
            hotspot.label;


        hotspotLayer.appendChild(
            link
        );


        hotspotElements.push({

            element: link,

            data: hotspot

        });

    }


    /* =====================================================
       ORIGINALBILD LADEN
       ===================================================== */

    const image =
        new Image();


    image.src =
        selectedHero.file;


    image.onload =
        positionHotspots;


    /* =====================================================
       HOTSPOTS POSITIONIEREN

       WICHTIG:

       CSS benutzt jetzt:

           background-size: contain

       Deshalb benutzen wir hier ebenfalls Math.min().

       Damit wird exakt dieselbe Skalierung berechnet,
       die der Browser für das Hintergrundbild benutzt.
       ===================================================== */

    function positionHotspots() {

        if (
            !image.naturalWidth ||
            !image.naturalHeight
        ) {

            return;

        }


        /*
         * Sichtbares Browserfenster
         */

        const viewportWidth =
            window.innerWidth;


        const viewportHeight =
            window.innerHeight;


        /*
         * Originalgröße des Bildes
         */

        const imageWidth =
            image.naturalWidth;


        const imageHeight =
            image.naturalHeight;


        /* -------------------------------------------------
           CONTAIN

           Der entscheidende Unterschied zu vorher:

           COVER:
               Math.max()

           CONTAIN:
               Math.min()
           ------------------------------------------------- */

        const scale =
            Math.min(

                viewportWidth / imageWidth,

                viewportHeight / imageHeight

            );


        /*
         * Tatsächliche Darstellungsgröße
         * des Bildes im Browser.
         */

        const renderedWidth =
            imageWidth * scale;


        const renderedHeight =
            imageHeight * scale;


        /* -------------------------------------------------
           background-position: center center

           Wenn schwarze Balken entstehen, liegen sie
           gleichmäßig links/rechts bzw. oben/unten.
           ------------------------------------------------- */

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


        /* -------------------------------------------------
           Hotspots auf das dargestellte Bild umrechnen
           ------------------------------------------------- */

        for (
            const hotspot
            of hotspotElements
        ) {

            const data =
                hotspot.data;


            const element =
                hotspot.element;


            const left =
                offsetX +
                (
                    data.x *
                    renderedWidth
                );


            const top =
                offsetY +
                (
                    data.y *
                    renderedHeight
                );


            const width =
                data.width *
                renderedWidth;


            const height =
                data.height *
                renderedHeight;


            element.style.left =
                `${left}px`;


            element.style.top =
                `${top}px`;


            element.style.width =
                `${width}px`;


            element.style.height =
                `${height}px`;

        }

    }


    /* =====================================================
       FENSTERGRÖSSE ÄNDERT SICH
       ===================================================== */

    window.addEventListener(

        "resize",

        positionHotspots

    );


    /* =====================================================
       HOTSPOTS BEIM SCROLLEN DEAKTIVIEREN

       Das Bild bleibt stehen.

       Die klickbaren Bereiche sollen aber nicht später
       unsichtbar über den scrollenden Texten liegen.
       ===================================================== */

    function updateHotspotState() {

        const limit =
            window.innerHeight * 0.20;


        if (
            window.scrollY >
            limit
        ) {

            hotspotLayer.classList.add(
                "inactive"
            );

        }

        else {

            hotspotLayer.classList.remove(
                "inactive"
            );

        }

    }


    window.addEventListener(

        "scroll",

        updateHotspotState,

        {
            passive: true
        }

    );


    updateHotspotState();

});