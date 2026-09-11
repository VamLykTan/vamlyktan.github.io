document.addEventListener("DOMContentLoaded", function () {
    const API = "https://abacus.jasoncameron.dev";
    const NAMESPACE = "vamlyktan-github-io-v1-6d9e52";
    const SOUL_KEY = "souls";
    const ECHO_KEY = "echoes";
    const LOCAL_MARK = "vlt_soul_counted_v1";

    const soulLayer = document.createElement("div");
    soulLayer.id = "vlt-soul-layer";
    soulLayer.setAttribute("aria-hidden", "true");
    soulLayer.innerHTML = `
        <div class="soul-scene">
            <span class="scene-glow"></span>
            <span class="scene-halo"></span>
            <span class="soul-wraith wraith-center"></span>
            <span class="soul-wraith wraith-left"></span>
            <span class="soul-wraith wraith-right"></span>
            <span class="scene-mist"></span>
        </div>`;

    const counter = document.createElement("aside");
    counter.id = "vlt-soul-counter";
    counter.setAttribute("aria-label", "Seelenzähler");
    counter.title = "Seelen ≈ einmal pro Browser · Echos = Seitenaufrufe";
    counter.innerHTML = `
        <div class="soul-readout">
            <span class="soul-sigil" aria-hidden="true"></span>
            <span class="soul-label">SEELEN</span>
            <strong class="soul-value" id="vlt-souls">---</strong>
            <span class="soul-divider" aria-hidden="true"></span>
            <span class="echo-label">ECHOS</span>
            <strong class="echo-value" id="vlt-echoes">---</strong>
        </div>`;

    document.body.appendChild(soulLayer);
    document.body.appendChild(counter);

    const soulsElement = document.getElementById("vlt-souls");
    const echoesElement = document.getElementById("vlt-echoes");

    const positions = {
        main: {
            desktop: {
                scene:   { x: 0.705, y: 0.070, width: 0.240, height: 0.470 },
                counter: { x: 0.825, y: 0.175, width: 0.100 }
            },
            mobile: {
                scene:   { x: 0.650, y: 0.105, width: 0.270, height: 0.420 },
                counter: { x: 0.785, y: 0.180, width: 0.118 }
            }
        },
        gothic: {
            desktop: {
                scene:   { x: 0.695, y: 0.072, width: 0.248, height: 0.480 },
                counter: { x: 0.820, y: 0.178, width: 0.104 }
            },
            mobile: {
                scene:   { x: 0.642, y: 0.110, width: 0.275, height: 0.425 },
                counter: { x: 0.782, y: 0.182, width: 0.122 }
            }
        },
        psycho: {
            desktop: {
                scene:   { x: 0.675, y: 0.050, width: 0.245, height: 0.435 },
                counter: { x: 0.792, y: 0.140, width: 0.100 }
            },
            mobile: {
                scene:   { x: 0.628, y: 0.090, width: 0.260, height: 0.385 },
                counter: { x: 0.770, y: 0.150, width: 0.118 }
            }
        }
    };

    const heroImage = new Image();

    function getHeroFile() {
        const hero = document.body.dataset.hero;

        if (hero === "gothic") {
            return "images/Gothic.png";
        }

        if (hero === "psycho") {
            return "images/Psycho.png";
        }

        return "images/mainbackground.png";
    }

    function getActiveLayout(heroId) {
        const hero = positions[heroId] || positions.main;
        return window.innerWidth <= 900 ? hero.mobile : hero.desktop;
    }

    function applyBox(element, left, top, width, height) {
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.width = `${width}px`;

        if (typeof height === "number") {
            element.style.height = `${height}px`;
        }
    }

    function positionArtifacts() {
        if (!heroImage.naturalWidth || !heroImage.naturalHeight) {
            return;
        }

        const heroId = document.body.dataset.hero || "main";
        const layout = getActiveLayout(heroId);
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const scale = Math.min(
            vw / heroImage.naturalWidth,
            vh / heroImage.naturalHeight
        );

        const renderedWidth = heroImage.naturalWidth * scale;
        const renderedHeight = heroImage.naturalHeight * scale;
        const offsetX = (vw - renderedWidth) / 2;
        const offsetY = (vh - renderedHeight) / 2;

        const scene = layout.scene;
        const counterPos = layout.counter;

        const sceneLeft = offsetX + scene.x * renderedWidth;
        const sceneTop = offsetY + scene.y * renderedHeight;
        const sceneWidth = scene.width * renderedWidth;
        const sceneHeight = scene.height * renderedHeight;

        const counterCenterX = offsetX + counterPos.x * renderedWidth;
        const counterTop = offsetY + counterPos.y * renderedHeight;
        const counterWidth = counterPos.width * renderedWidth;

        applyBox(soulLayer, sceneLeft, sceneTop, sceneWidth, sceneHeight);
        applyBox(counter, counterCenterX, counterTop, counterWidth);
    }

    function loadPositionImage() {
        const nextSource = getHeroFile();

        if (heroImage.getAttribute("data-source") === nextSource && heroImage.complete) {
            positionArtifacts();
            return;
        }

        heroImage.setAttribute("data-source", nextSource);
        heroImage.src = nextSource;
    }

    heroImage.onload = positionArtifacts;

    window.addEventListener("resize", positionArtifacts);
    window.addEventListener("load", positionArtifacts);
    window.addEventListener("vlt:herochange", loadPositionImage);

    loadPositionImage();

    function storageAvailable() {
        try {
            const key = "__vlt_soul_test__";
            localStorage.setItem(key, "1");
            localStorage.removeItem(key);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    async function counterRequest(mode, key) {
        const response = await fetch(`${API}/${mode}/${NAMESPACE}/${key}`, {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`counter ${response.status}`);
        }

        const data = await response.json();
        const value = Number(data.value);

        if (!Number.isFinite(value)) {
            throw new Error("counter value invalid");
        }

        return value;
    }

    function formatValue(value) {
        return String(Math.max(0, Math.floor(value))).padStart(3, "0");
    }

    function animateValue(element, value) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduce || value < 2) {
            element.textContent = formatValue(value);
            return;
        }

        const duration = 950;
        const started = performance.now();

        function frame(now) {
            const progress = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = formatValue(Math.round(value * eased));

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    async function loadCounters() {
        const echoPromise = counterRequest("hit", ECHO_KEY);
        const canStore = storageAvailable();
        let soulPromise;

        if (canStore && !localStorage.getItem(LOCAL_MARK)) {
            soulPromise = counterRequest("hit", SOUL_KEY).then(function (value) {
                localStorage.setItem(LOCAL_MARK, "1");
                return value;
            });
        }
        else {
            soulPromise = counterRequest("get", SOUL_KEY);
        }

        const results = await Promise.allSettled([soulPromise, echoPromise]);

        if (results[0].status === "fulfilled") {
            animateValue(soulsElement, results[0].value);
        }
        else {
            soulsElement.textContent = "---";
        }

        if (results[1].status === "fulfilled") {
            animateValue(echoesElement, results[1].value);
        }
        else {
            echoesElement.textContent = "---";
        }
    }

    loadCounters();
});
