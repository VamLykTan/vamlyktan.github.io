document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DEBUG
       ===================================================== */

    const HOTSPOT_DEBUG = false;


    /* =====================================================
       EXTERNE LINKS
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

       Gewichtung:
           Gothic  50 %
           Main    25 %
           Psycho  25 %

       x / y / width / height beziehen sich auf
       das jeweilige ORIGINALBILD.
       ===================================================== */

    const heroes = [

        {
            id: "main",
            file: "images/mainbackground.png",
            weight: 25,

            hotspots: [

                {
                    id: "projects-main",
                    href: "projects/index.html",
                    label: "Projekte",
                    x: 0.472,
                    y: 0.021,
                    width: 0.057,
                    height: 0.034
                },

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


        {
            id: "gothic",
            file: "images/Gothic.png",
            weight: 50,

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


        {
            id: "psycho",
            file: "images/Psycho.png",
            weight: 25,

            hotspots: [

                {
                    id: "projects-psycho-nav",
                    href: "projects/index.html",
                    label: "Projekte",
                    x: 0.426,
                    y: 0.021,
                    width: 0.060,
                    height: 0.034
                },

                {
                    id: "projects-psycho-content",
                    href: "projects/index.html",
                    label: "Projekte",
                    x: 0.335,
                    y: 0.568,
                    width: 0.068,
                    height: 0.035
                },

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
       ===================================================== */

    function selectHero() {

        const totalWeight =
            heroes.reduce(
                (sum, hero) =>
                    sum + hero.weight,
                0
            );

        const random =
            Math.random() * totalWeight;

        let sum = 0;


        for (const hero of heroes) {

            sum += hero.weight;

            if (random < sum) {
                return hero;
            }

        }


        return heroes[0];
    }


    let selectedHero =
        selectHero();


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


    if (HOTSPOT_DEBUG) {

        document.body.classList.add(
            "hotspot-debug"
        );

    }


    let hotspotElements = [];


    /* =====================================================
       ORIGINALBILD
       ===================================================== */

    const image =
        new Image();


    image.onload =
        positionHotspots;


    /* =====================================================
       HERO AKTIVIEREN
       ===================================================== */

    function applyHero(
        hero,
        dispatchEvent = true
    ) {

        selectedHero =
            hero;


        document.documentElement.style.setProperty(
            "--hero-image",
            `url("${selectedHero.file}")`
        );


        document.body.dataset.hero =
            selectedHero.id;


        rebuildHotspots();


        image.src =
            selectedHero.file;


        if (
            image.complete &&
            image.naturalWidth
        ) {

            positionHotspots();

        }


        if (dispatchEvent) {

            window.dispatchEvent(
                new CustomEvent(
                    "vlt:herochange",
                    {
                        detail: {
                            id:
                                selectedHero.id,

                            file:
                                selectedHero.file
                        }
                    }
                )
            );

        }

    }


    /* =====================================================
       HOTSPOTS ERZEUGEN
       ===================================================== */

    function rebuildHotspots() {

        hotspotLayer.replaceChildren();

        hotspotElements = [];


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


        updateHotspotState();

    }


    /* =====================================================
       HOTSPOTS POSITIONIEREN
       background-size: contain
       background-position: center center
       ===================================================== */

    function positionHotspots() {

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

        const imageWidth =
            image.naturalWidth;

        const imageHeight =
            image.naturalHeight;


        const scale =
            Math.min(
                viewportWidth / imageWidth,
                viewportHeight / imageHeight
            );


        const renderedWidth =
            imageWidth * scale;

        const renderedHeight =
            imageHeight * scale;


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


        for (
            const hotspot
            of hotspotElements
        ) {

            const data =
                hotspot.data;

            const element =
                hotspot.element;


            element.style.left =
                `${
                    offsetX +
                    data.x *
                    renderedWidth
                }px`;

            element.style.top =
                `${
                    offsetY +
                    data.y *
                    renderedHeight
                }px`;

            element.style.width =
                `${
                    data.width *
                    renderedWidth
                }px`;

            element.style.height =
                `${
                    data.height *
                    renderedHeight
                }px`;

        }

    }


    window.addEventListener(
        "resize",
        positionHotspots
    );


    /* =====================================================
       HOTSPOTS BEIM SCROLLEN DEAKTIVIEREN
       ===================================================== */

    function updateHotspotState() {

        const limit =
            window.innerHeight * 0.20;


        hotspotLayer.classList.toggle(
            "inactive",
            window.scrollY > limit
        );

    }


    window.addEventListener(
        "scroll",
        updateHotspotState,
        {
            passive: true
        }
    );


    /* =====================================================
       ÖFFENTLICHE HERO-SCHNITTSTELLE

       gothic-enter.js kann damit unter dichtem Nebel
       kontrolliert auf Main/Psycho umschalten.
       ===================================================== */

    window.VLTHero = {

        getCurrent:
            function () {

                return {
                    id:
                        selectedHero.id,

                    file:
                        selectedHero.file
                };

            },


        switchHero:
            function (heroId) {

                const hero =
                    heroes.find(
                        item =>
                            item.id === heroId
                    );


                if (!hero) {
                    return false;
                }


                applyHero(
                    hero,
                    true
                );


                return true;

            },


        positionHotspots:
            positionHotspots

    };


    /* =====================================================
       START
       ===================================================== */

    applyHero(
        selectedHero,
        false
    );


    updateHotspotState();

});