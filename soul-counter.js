document.addEventListener("DOMContentLoaded", function () {
    const API = "https://abacus.jasoncameron.dev";
    const NAMESPACE = "vamlyktan-github-io-v1-6d9e52";
    const SOUL_KEY = "souls";
    const ECHO_KEY = "echoes";
    const LOCAL_MARK = "vlt_soul_counted_v1";

    const counter = document.createElement("aside");
    counter.id = "vlt-soul-counter";
    counter.setAttribute("aria-label", "Seelenzähler");
    counter.title = "Seelen ≈ einmal pro Browser · Echos = Seitenaufrufe";

    counter.innerHTML = `
        <div class="soul-art" aria-hidden="true">
            <span class="soul-wraith wraith-center"></span>
            <span class="soul-wraith wraith-left"></span>
            <span class="soul-wraith wraith-right"></span>
            <span class="soul-mist"></span>
        </div>

        <div class="soul-readout">
            <span class="soul-label">SEELEN</span>
            <strong class="soul-value" id="vlt-souls">---</strong>
            <span class="soul-divider" aria-hidden="true"></span>
            <span class="echo-label">ECHOS</span>
            <strong class="echo-value" id="vlt-echoes">---</strong>
        </div>`;

    document.body.appendChild(counter);

    const soulsElement = document.getElementById("vlt-souls");
    const echoesElement = document.getElementById("vlt-echoes");

    const positions = {
        main:   { x: 0.765, y: 0.050, width: 0.225 },
        gothic: { x: 0.745, y: 0.045, width: 0.240 },
        psycho: { x: 0.770, y: 0.055, width: 0.220 }
    };

    const heroImage = new Image();

    function getHeroFile() {
        const hero = document.body.dataset.hero;
        if (hero === "gothic") return "images/Gothic.png";
        if (hero === "psycho") return "images/Psycho.png";
        return "images/mainbackground.png";
    }

    function loadPositionImage() {
        heroImage.src = getHeroFile();
    }

    function positionCounter() {
        if (!heroImage.naturalWidth || !heroImage.naturalHeight) return;

        const hero = document.body.dataset.hero || "main";
        const pos = positions[hero] || positions.main;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const scale = Math.min(
            vw / heroImage.naturalWidth,
            vh / heroImage.naturalHeight
        );

        const rw = heroImage.naturalWidth * scale;
        const rh = heroImage.naturalHeight * scale;
        const ox = (vw - rw) / 2;
        const oy = (vh - rh) / 2;

        counter.style.left = `${ox + pos.x * rw}px`;
        counter.style.top = `${oy + pos.y * rh}px`;
        counter.style.width = `${pos.width * rw}px`;
    }

    heroImage.onload = positionCounter;
    window.addEventListener("resize", positionCounter);
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
