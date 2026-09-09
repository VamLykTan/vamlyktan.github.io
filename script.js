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
       EXTERNE LINKS

       Die sichtbaren Social-Media-Symbole sind Bestandteil
       der drei Hintergrundbilder.

       Deshalb werden hier echte Klickflächen darübergelegt.

       WICHTIG:
       YouTube und E-Mail sind auf Linktree vorhanden, aber
       Linktree liefert deren direkte Ziel-URL in der öffentlich
       auslesbaren Ansicht nicht mit aus. Bis die Direktziele
       eingetragen sind, führen diese beiden Symbole auf Linktree.

       Das Wolken-Symbol in den Grafiken ist optisch SoundCloud.
       Auf deinem aktuellen Linktree ist jedoch Mixcloud gelistet.
       Deshalb führt dieses Symbol momentan zu Mixcloud.
       ===================================================== */

    const SOCIAL = {

        facebook:
            "https://www.facebook.com/profile.php?id=100063754892757",

        instagram:
            "https://www.instagram.com/dj_vamlyktan/",

        youtube:
            "https://www.youtube.com/@vamlyktan7205",

        twitch:
            "https://www.twitch.tv/dj_vamlyktan",

        mixcloud:
            "https://www.mixcloud.com/vamlyktan/",

        email:
            "mailto:djvamlyktan@gmail.com"

    };


    /* =====================================================
       HERO-DEFINITIONEN

       x / y / width / height beziehen sich immer auf
       das ORIGINALBILD.

       Alle drei Bilder:
           1672 × 941 Pixel

       Die Social-Hotspots wurden direkt anhand der
       hochgeladenen Originalbilder vermessen.

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
                },


                /*
                 * SOCIAL MEDIA
                 * obere rechte Icon-Leiste
                 */

                {
                    id: "facebook-main",

                    href: SOCIAL.facebook,

                    label: "Facebook",

                    external: true,

                    x: 0.7841,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "instagram-main",

                    href: SOCIAL.instagram,

                    label: "Instagram",

                    external: true,

                    x: 0.8140,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "youtube-main",

                    href: SOCIAL.youtube,

                    label: "YouTube",

                    external: true,

                    x: 0.8439,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "twitch-main",

                    href: SOCIAL.twitch,

                    label: "Twitch",

                    external: true,

                    x: 0.8732,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "mixcloud-main",

                    href: SOCIAL.mixcloud,

                    label: "Mixcloud",

                    external: true,

                    x: 0.9037,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "email-main",

                    href: SOCIAL.email,

                    label: "E-Mail",

                    external: true,

                    x: 0.9342,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                }

            ]
        },


        /* -------------------------------------------------
           GOTHIC
           10 %

           Dort existiert aktuell kein Projekte-Element.

           Sichtbare Icons:
           Facebook · Instagram · Cloud · Twitch · E-Mail
           ------------------------------------------------- */

        {
            id: "gothic",

            file: "images/Gothic.png",

            weight: 10,

            hotspots: [

                {
                    id: "facebook-gothic",

                    href: SOCIAL.facebook,

                    label: "Facebook",

                    external: true,

                    x: 0.8215,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "instagram-gothic",

                    href: SOCIAL.instagram,

                    label: "Instagram",

                    external: true,

                    x: 0.8477,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "mixcloud-gothic",

                    href: SOCIAL.mixcloud,

                    label: "Mixcloud",

                    external: true,

                    x: 0.8745,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "twitch-gothic",

                    href: SOCIAL.twitch,

                    label: "Twitch",

                    external: true,

                    x: 0.8995,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "email-gothic",

                    href: SOCIAL.email,

                    label: "E-Mail",

                    external: true,

                    x: 0.9255,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                }

            ]
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
                },


                /*
                 * SOCIAL MEDIA
                 * obere rechte Icon-Leiste
                 */

                {
                    id: "facebook-psycho",

                    href: SOCIAL.facebook,

                    label: "Facebook",

                    external: true,

                    x: 0.8032,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "instagram-psycho",

                    href: SOCIAL.instagram,

                    label: "Instagram",

                    external: true,

                    x: 0.8283,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "youtube-psycho",

                    href: SOCIAL.youtube,

                    label: "YouTube",

                    external: true,

                    x: 0.8553,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "twitch-psycho",

                    href: SOCIAL.twitch,

                    label: "Twitch",

                    external: true,

                    x: 0.8816,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "mixcloud-psycho",

                    href: SOCIAL.mixcloud,

                    label: "Mixcloud",

                    external: true,

                    x: 0.9109,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
                },

                {
                    id: "email-psycho",

                    href: SOCIAL.email,

                    label: "E-Mail",

                    external: true,

                    x: 0.9384,
                    y: 0.0213,

                    width: 0.0215,
                    height: 0.0383
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


        /*
         * Externe Seiten in neuem Tab öffnen.
         */

        if (
            hotspot.external
        ) {

            link.target =
                "_blank";


            link.rel =
                "noopener noreferrer";

        }


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

       CSS benutzt:

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