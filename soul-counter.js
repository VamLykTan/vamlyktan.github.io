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
        <div class="soul-visual" aria-hidden="true">
            <svg class="soul-ghosts" viewBox="0 0 460 560" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="ghostBlur" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="8" />
                    </filter>
                    <radialGradient id="mistGlow" cx="50%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.38" />
                        <stop offset="40%" stop-color="#c8beff" stop-opacity="0.16" />
                        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
                    </radialGradient>
                    <linearGradient id="ghostBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#e6e1ff" stop-opacity="0.72" />
                        <stop offset="35%" stop-color="#cdc6eb" stop-opacity="0.42" />
                        <stop offset="80%" stop-color="#8782a5" stop-opacity="0.12" />
                        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
                    </linearGradient>
                </defs>

                <ellipse cx="240" cy="286" rx="188" ry="190" fill="url(#mistGlow)" opacity="0.55" filter="url(#ghostBlur)"/>

                <g class="ghost back-left" opacity="0.74">
                    <path d="M120 175 C90 198,78 244,90 292 C98 325,84 352,82 380 C114 356,126 398,152 382 C174 369,177 410,204 397 C189 350,203 316,201 276 C199 238,180 195,150 174 C141 168,130 166,120 175 Z" fill="url(#ghostBody)"/>
                    <ellipse cx="146" cy="222" rx="28" ry="38" fill="#12121c" fill-opacity="0.82"/>
                    <circle cx="137" cy="214" r="5.5" fill="#000000" fill-opacity="0.92"/>
                    <circle cx="154" cy="214" r="5.5" fill="#000000" fill-opacity="0.92"/>
                </g>

                <g class="ghost main" opacity="0.92">
                    <path d="M210 94 C165 129,145 197,162 280 C173 333,149 384,146 432 C194 396,208 467,253 443 C286 425,302 472,345 445 C318 384,339 339,336 276 C333 200,301 127,248 94 C237 87,221 86,210 94 Z" fill="url(#ghostBody)"/>
                    <ellipse cx="246" cy="172" rx="47" ry="63" fill="#0e0e18" fill-opacity="0.88"/>
                    <circle cx="228" cy="162" r="8.5" fill="#000000" fill-opacity="0.96"/>
                    <circle cx="262" cy="162" r="8.5" fill="#000000" fill-opacity="0.96"/>
                    <ellipse cx="245" cy="191" rx="13" ry="17" fill="#000000" fill-opacity="0.88"/>
                </g>

                <g class="ghost right" opacity="0.80">
                    <path d="M316 190 C292 211,285 252,294 287 C302 318,290 350,289 381 C317 360,330 393,355 381 C374 371,388 400,413 384 C398 344,408 315,406 279 C404 243,392 210,365 191 C352 181,328 180,316 190 Z" fill="url(#ghostBody)"/>
                    <ellipse cx="348" cy="236" rx="26" ry="35" fill="#101019" fill-opacity="0.82"/>
                    <circle cx="339" cy="229" r="4.8" fill="#000000" fill-opacity="0.94"/>
                    <circle cx="355" cy="229" r="4.8" fill="#000000" fill-opacity="0.94"/>
                </g>

                <g opacity="0.50" filter="url(#ghostBlur)">
                    <path d="M62 392 C120 332,184 335,246 365 C312 397,372 395,432 344 C388 410,349 452,286 480 C223 509,128 487,62 392 Z" fill="#e1dcff" fill-opacity="0.24"/>
                    <path d="M30 430 C104 474,202 479,274 454 C318 438,373 428,430 436 C384 486,326 521,248 534 C160 548,81 509,30 430 Z" fill="#b9b0e1" fill-opacity="0.16"/>
                </g>
            </svg>
        </div>

        <div class="soul-data">
            <div class="soul-symbol" aria-hidden="true"></div>
            <div class="soul-group souls-group">
                <span class="soul-label">SEELEN</span>
                <strong id="vlt-souls">------</strong>
            </div>
            <div class="soul-line" aria-hidden="true"></div>
            <div class="soul-group echoes-group">
                <span class="soul-label">ECHOS</span>
                <strong id="vlt-echoes">------</strong>
            </div>
        </div>
    `;

    document.body.appendChild(counter);

    const soulsElement = document.getElementById("vlt-souls");
    const echoesElement = document.getElementById("vlt-echoes");

    const style = document.createElement("style");
    style.textContent = `
        #vlt-soul-counter {
            --soul-accent:#b30d1d;
            --soul-accent-soft:rgba(179,13,29,.38);
            position:fixed;
            z-index:48;
            display:block;
            overflow:hidden;
            min-width:235px;
            aspect-ratio:300/360;
            pointer-events:none;
            opacity:.96;
        }

        #vlt-soul-counter::before {
            content:"";
            position:absolute;
            inset:0;
            background:linear-gradient(180deg,rgba(0,0,0,.10),rgba(0,0,0,.30));
            pointer-events:none;
            z-index:0;
        }

        #vlt-soul-counter .soul-visual {
            position:absolute;
            inset:0;
            z-index:1;
            overflow:hidden;
            pointer-events:none;
        }

        #vlt-soul-counter .soul-ghosts {
            position:absolute;
            top:2%;
            left:18%;
            width:88%;
            height:92%;
            opacity:.95;
            filter:drop-shadow(0 0 10px rgba(255,255,255,.08));
        }

        #vlt-soul-counter .ghost.main {
            animation:vltSoulFloatMain 8.8s ease-in-out infinite;
            transform-origin:248px 210px;
        }

        #vlt-soul-counter .ghost.back-left {
            animation:vltSoulFloatLeft 11.5s ease-in-out infinite;
            transform-origin:146px 252px;
        }

        #vlt-soul-counter .ghost.right {
            animation:vltSoulFloatRight 10.4s ease-in-out infinite;
            transform-origin:349px 255px;
        }

        #vlt-soul-counter .soul-data {
            position:absolute;
            top:14%;
            right:4%;
            width:32%;
            z-index:3;
            display:flex;
            flex-direction:column;
            align-items:center;
            text-align:center;
        }

        #vlt-soul-counter .soul-symbol {
            position:relative;
            width:18px;
            height:18px;
            margin-bottom:12px;
            border:1px solid var(--soul-accent);
            transform:rotate(45deg);
            box-shadow:0 0 10px var(--soul-accent-soft);
        }

        #vlt-soul-counter .soul-symbol::before,
        #vlt-soul-counter .soul-symbol::after {
            content:"";
            position:absolute;
            left:50%;
            background:var(--soul-accent);
            transform:translateX(-50%);
            box-shadow:0 0 8px var(--soul-accent-soft);
        }

        #vlt-soul-counter .soul-symbol::before {
            top:-16px;
            width:1px;
            height:34px;
        }

        #vlt-soul-counter .soul-symbol::after {
            bottom:-7px;
            width:7px;
            height:1px;
        }

        #vlt-soul-counter .soul-group {
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:4px;
        }

        #vlt-soul-counter .souls-group { margin-bottom:10px; }

        #vlt-soul-counter .soul-line {
            width:78%;
            height:1px;
            margin:8px 0 10px;
            background:linear-gradient(90deg,transparent 0%,var(--soul-accent) 24%,var(--soul-accent) 76%,transparent 100%);
            box-shadow:0 0 8px var(--soul-accent-soft);
            position:relative;
        }

        #vlt-soul-counter .soul-line::before {
            content:"";
            position:absolute;
            left:50%;
            top:50%;
            width:8px;
            height:8px;
            background:var(--soul-accent);
            transform:translate(-50%,-50%) rotate(45deg);
            box-shadow:0 0 8px var(--soul-accent-soft);
        }

        #vlt-soul-counter .soul-label {
            color:rgba(225,219,221,.82);
            font-family:Georgia,"Times New Roman",serif;
            font-size:clamp(10px,.7vw,15px);
            letter-spacing:.26em;
        }

        #vlt-soul-counter strong {
            font-family:Georgia,"Times New Roman",serif;
            font-weight:normal;
            line-height:.95;
        }

        #vlt-soul-counter #vlt-souls {
            color:var(--soul-accent);
            font-size:clamp(32px,2.5vw,54px);
            text-shadow:0 0 14px rgba(255,20,35,.20),0 0 24px var(--soul-accent-soft);
        }

        #vlt-soul-counter #vlt-echoes {
            color:rgba(188,182,186,.86);
            font-size:clamp(22px,1.6vw,38px);
            text-shadow:0 0 12px rgba(255,255,255,.10);
        }

        body[data-hero="gothic"] #vlt-soul-counter {
            --soul-accent:#c20d1f;
            --soul-accent-soft:rgba(194,13,31,.42);
        }

        body[data-hero="main"] #vlt-soul-counter {
            --soul-accent:#c60f21;
            --soul-accent-soft:rgba(198,15,33,.42);
        }

        body[data-hero="psycho"] #vlt-soul-counter {
            --soul-accent:#a46eff;
            --soul-accent-soft:rgba(164,110,255,.42);
        }

        body.vlt-portal-active #vlt-soul-counter {
            opacity:.24;
            transition:opacity .45s ease;
        }

        @keyframes vltSoulFloatMain {
            0%,100% { transform:translate3d(0,0,0) scale(1); }
            50% { transform:translate3d(0,-10px,0) scale(1.02); }
        }

        @keyframes vltSoulFloatLeft {
            0%,100% { transform:translate3d(0,0,0) scale(.98); }
            50% { transform:translate3d(-3px,-7px,0) scale(1.01); }
        }

        @keyframes vltSoulFloatRight {
            0%,100% { transform:translate3d(0,0,0) scale(1); }
            50% { transform:translate3d(4px,-8px,0) scale(1.015); }
        }

        @media (max-width:800px) {
            #vlt-soul-counter { min-width:165px; }
            #vlt-soul-counter .soul-data { top:13%; right:2%; width:36%; }
            #vlt-soul-counter .soul-ghosts { left:12%; width:96%; }
        }

        @media (prefers-reduced-motion:reduce) {
            #vlt-soul-counter .ghost.main,
            #vlt-soul-counter .ghost.back-left,
            #vlt-soul-counter .ghost.right { animation:none; }
        }
    `;

    document.head.appendChild(style);

    const positions = {
        main:{x:.783,y:.070,width:.205},
        gothic:{x:.760,y:.052,width:.220},
        psycho:{x:.780,y:.070,width:.205}
    };

    const image = new Image();

    function getHeroFile() {
        const hero = document.body.dataset.hero;
        if (hero === "gothic") return "images/Gothic.png";
        if (hero === "psycho") return "images/Psycho.png";
        return "images/mainbackground.png";
    }

    function loadPositionImage() {
        image.src = getHeroFile();
    }

    function positionCounter() {
        if (!image.naturalWidth || !image.naturalHeight) return;

        const hero = document.body.dataset.hero || "main";
        const pos = positions[hero] || positions.main;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.min(vw / image.naturalWidth, vh / image.naturalHeight);
        const rw = image.naturalWidth * scale;
        const rh = image.naturalHeight * scale;
        const ox = (vw - rw) / 2;
        const oy = (vh - rh) / 2;

        counter.style.left = `${ox + pos.x * rw}px`;
        counter.style.top = `${oy + pos.y * rh}px`;
        counter.style.width = `${pos.width * rw}px`;
    }

    image.onload = positionCounter;
    window.addEventListener("resize", positionCounter);
    window.addEventListener("vlt:herochange", loadPositionImage);
    loadPositionImage();

    function storageAvailable() {
        try {
            const key = "__vlt_soul_test__";
            localStorage.setItem(key,"1");
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function counterRequest(mode,key) {
        const response = await fetch(`${API}/${mode}/${NAMESPACE}/${key}`, {
            method:"GET",
            cache:"no-store"
        });
        if (!response.ok) throw new Error(`counter ${response.status}`);
        const data = await response.json();
        const value = Number(data.value);
        if (!Number.isFinite(value)) throw new Error("counter value invalid");
        return value;
    }

    function formatValue(value) {
        return String(Math.max(0,Math.floor(value))).padStart(3,"0");
    }

    function animateValue(element,value) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion || value < 2) {
            element.textContent = formatValue(value);
            return;
        }

        const duration = 900;
        const started = performance.now();

        function frame(now) {
            const progress = Math.min(1,(now-started)/duration);
            const eased = 1 - Math.pow(1-progress,3);
            element.textContent = formatValue(Math.round(value*eased));
            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    async function loadCounters() {
        const echoPromise = counterRequest("hit",ECHO_KEY);
        const canStore = storageAvailable();
        let soulPromise;

        if (canStore && !localStorage.getItem(LOCAL_MARK)) {
            soulPromise = counterRequest("hit",SOUL_KEY).then(value => {
                localStorage.setItem(LOCAL_MARK,"1");
                return value;
            });
        } else {
            soulPromise = counterRequest("get",SOUL_KEY);
        }

        const results = await Promise.allSettled([soulPromise,echoPromise]);

        if (results[0].status === "fulfilled") animateValue(soulsElement,results[0].value);
        else soulsElement.textContent = "---";

        if (results[1].status === "fulfilled") animateValue(echoesElement,results[1].value);
        else echoesElement.textContent = "---";
    }

    loadCounters();
});