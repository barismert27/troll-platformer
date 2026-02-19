(function () {
    "use strict";
    var CW = 800, CH = 450, GRAV = 0.55, PW = 16, PH = 16, PSPEED = 3.2, PACCEL = 0.35, PDECEL = 0.25,
        JFORCE = -10, DJFORCE = -9, MAXFALL = 12, TOTAL_LEVELS = 15;
    var MSGS = ["GENE OLDU 😂", "SURPRIZ BEBEGIM 🎉", "GIT AGLA 😭", "KAC... KACAMIYORSAN 😏",
        "RESMEN BERBATSIN", "CTRL+Z YOK BURADA", "YAT ASSAAAAAA", "OYNAMASAN OLUR MU YA :)",
        "BU KADAR KOLAY DEGIL MI??", "BUNU BEKLEDIN MI? 😈", "TABII KI DUSTUN",
        "BEN DE SASIRDIM... SAKA", "YINE MI? CIDDEN MI?", "KLAVYEN BOZUK OLMALI",
        "BU OYUN SENIN ICIN DEGIL", "PROFESYONEL OLUCU", "HARIKA BIR OLUM, ALKIS 👏",
        "BEYIN KULLANMAYI DENEDIN MI?", "NEFES AL, TEKRAR DENEYECEKSIN",
        "HAYATINDA BU KADAR OLDUN MU?", "BEN SANA INANMIYORUM", "SANA KOLAY DEMEDIM KI",
        "UMARIM EVINDE KIMSE YOK 😬", "SES CIKARDIM MI? CIKARMADIM", "SIMDI NE HISSEDIYORSUN?",
        "HATIRLATMA: BU OYUN BITIYOR", "DUSMEK BIR SANATTIR, SEN SANATCISIN",
        "PLATFORMU GORDUN DEGIL MI?", "GOZLERIN KAPALI MIYDI?", "HAYIR HAYIR HAYIR 😩",
        "TEKRAR HOSGELDIN YABANCI", "BU SEFER FARKLI OLACAKTI...", "OLMADI BI DAHA 😇",
        "SEN CABALIYORSUN, TAKDIR EDIYORUM", "HAYAL KIRIKLIGI SEVIYORUM",
        "REKOR KIRMAK UZERESIN... OLUM REKORU", "SENINLE GURUR DUYUYORUM... DUYAMIYORUM",
        "PLATFORM NEYDI KI ZATEN", "BOMBAYI GORMEDIN MI GERCEKTEN", "AH BE ADAMIM 😔",
        "BIR GUN BELKI", "BUGUN DEGIL AMA", "ASLA DEMEYECEGIM... ASLA",
        "KAHRAMAN DEGILSIN AMA DENE", "HATA INSANA OZGUDUR, SEN COK INSANSIN",
        "KUPA YOK AMA DEVAM ET", "SONSUZLUGA DUSTUN", "ZEMIN FELSEFE YAPTI SENINLE",
        "BOMBA SANA SELAM YOLLADI", "GRAVITE SENI SEVMIYOR", "PLATFORM: BEN BURADA DEGILIM",
        "SEN: NE?? PLATFORM: 😂", "BUGUN SANSLI DEGILSIN", "YARIN DA OLMAYACAK",
        "AMA OBUR GUN BELKI", "KARDESIM BU 4. KEZ AYNI YER", "O PLATFORMU ARTIK EZBERLEDIN",
        "SONUNDA BIR SEYDE IYISIN: OLMEK", "DEVAM ET, ADINI EFSANEYE YAZACAGIM",
        "EN UZUN OYUNCU ODULU SENIN 🏆"];
    var msgUsed = [];
    var LNAMES = ["KOLAY GORUNUYOR DEGIL MI?", "HAREKET ETMEYI SEV", "BOMBA SEVIYOR MUSUN?",
        "GRAVITY? NEVER HEARD OF HER", "SON BOSS: HERSEY", "NEREDEYSE...", "DIKEN LABIRENT",
        "TAVAN SORUNU", "ISIK YOK", "KOSU BANDI", "SAHTE YARDIM", "KUCULEN DUNYA",
        "KOPYA KARAKTERI", "GERI SAY", "SON LEVEL"];
    var LTROLLS = ["ZEMIN MI? HANGI ZEMIN? 😂", "KONTROLLER TERS OLDU 😈",
        "DIKKATLI OL... YA DA OLMA 💣", "YUKARI MI ASAGI MI? 😵", "SIKE! ONE MORE... 😈",
        "NEREDEYSE 😂", "UC KORIDOR... BASIT 😇", "TAVAN DUSUYOOR 😱", "KARANLIK GUZEL DEGIL MI? 🌑",
        "RUZGAR YARDIM EDIYOR, SEN KARSI KOYUYORSUN 😂💨", "OKU TAKIP ET 😇➡️", "YER DARALIYOOR 😬",
        "HANGISI SENSIN? 👥", "SAYDIM BITTI 💣", "BU LEVEL BITMEZ. ASLA. 👹"];
    var canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d"),
        $dc = document.getElementById("death-count"), $ln = document.getElementById("level-num"),
        $tm = document.getElementById("troll-message"), $tt = document.getElementById("troll-text"),
        $lt = document.getElementById("level-title"), $ltn = document.getElementById("level-title-num"),
        $ltna = document.getElementById("level-title-name"), $ss = document.getElementById("start-screen"),
        $ws = document.getElementById("win-screen"), $fws = document.getElementById("fake-win-screen"),
        $fd = document.getElementById("final-deaths"), $ft = document.getElementById("final-time"),
        $rf = document.getElementById("red-flash"), $yf = document.getElementById("yellow-flash"),
        $cc = document.getElementById("canvas-container"), $bo = document.getElementById("blackout"),
        $gg = document.getElementById("green-glow"), $td = document.getElementById("level-timer-display"),
        $hd = document.getElementById("hud-deaths"), confC = document.getElementById("confettiCanvas");
    var state = "start", deaths = 0, curLvl = 0, lvlTime = 0, calmTimer = 0, totalTime = 0;
    var player = {}, particles = [], dustP = [], jumpFx = [], bombs = [], explosions = [];
    var plats = [], spikes = [], flag = {}, fakePlats = [], movPlats = [], tramps = [], hidSpikes = [];
    var ctrlRev = false, ctrlRevT = 0, gravFlip = false, gravFlipT = 4, gravWarn = false, bombT = 2;
    var isBonus = false, fakeWinShown = false, fakeWinT = 0, deathT = 0, trollT = 0;
    // L6: floor disappear near flag
    var l6floorGone = false;
    // L7: spike labyrinth
    var l7spikeTraps = [], l7troll1 = false, l7troll2 = false, l7fakeWall = false;
    // L8: ceiling drop
    var l8ceilDrop = false, l8ceilY = -20, l8gapX = 0;
    // L9: darkness
    var l9dark = false, l9timer = 0, l9lightBack = false;
    // L10: wind
    var windForce = 0;
    // L11: fake arrow
    var arrowDir = 1;
    // L12: shrink
    var shrinkT = 0, shrinkAmt = 0;
    // L13: clone
    var clone = {}, cloneActive = false;
    // L14: countdown timer (visual only)
    var l14timer = 10, l14bombDropped = false, l14timerDone = false;
    // L15: combined chaos
    var l15blackoutT = 0, l15blackOn = false;
    // Input
    var keys = {}, kPress = {}, mL = false, mR = false, mJP = false;
    // Swipe
    var touchSX = 0, touchSY = 0, touchActive = false;
    // === SAVE/LOAD SYSTEM ===
    function saveToLS(k, v) { try { localStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : String(v)); } catch (e) { } }
    function loadFromLS(k, json) { try { var v = localStorage.getItem(k); if (v === null) return null; return json ? JSON.parse(v) : v; } catch (e) { return null; } }
    function clearSave() { try { ['trollparkur_level', 'trollparkur_deaths', 'trollparkur_best', 'trollparkur_maxlevel'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) { } }
    function saveProgress() {
        saveToLS('trollparkur_level', curLvl); saveToLS('trollparkur_deaths', deaths);
        var ml = parseInt(loadFromLS('trollparkur_maxlevel')) || 0;
        saveToLS('trollparkur_maxlevel', Math.max(curLvl, ml));
    }
    function hasSave() { return loadFromLS('trollparkur_level') !== null; }
    // === MUSIC SYSTEM ===
    var MusicManager = {
        audio: null, isMuted: false, started: false,
        init: function () {
            try {
                this.audio = new Audio('music.mp3');
                this.audio.loop = true; this.audio.volume = 0.4;
                var savedMute = loadFromLS('trollparkur_muted');
                var savedVol = loadFromLS('trollparkur_volume');
                if (savedMute === 'true') { this.isMuted = true; this.audio.muted = true; }
                if (savedVol !== null) { this.audio.volume = parseFloat(savedVol); var sl = document.getElementById('volume-slider'); if (sl) sl.value = savedVol; }
                this.updateUI();
            } catch (e) { }
        },
        play: function () {
            if (this.started || !this.audio) return;
            this.started = true;
            this.audio.play().catch(function () { });
        },
        toggleMute: function () {
            this.isMuted = !this.isMuted;
            if (this.audio) {
                this.audio.muted = this.isMuted;
                if (!this.isMuted && this.started && this.audio.paused) this.audio.play().catch(function () { });
            }
            saveToLS('trollparkur_muted', this.isMuted);
            this.updateUI();
        },
        setVolume: function (val) {
            if (this.audio) this.audio.volume = val;
            saveToLS('trollparkur_volume', val);
        },
        updateUI: function () {
            var btn = document.getElementById('mute-btn');
            if (btn) btn.textContent = this.isMuted ? '🔇' : '🔊';
        }
    };
    document.addEventListener("keydown", function (e) {
        if (!keys[e.code]) kPress[e.code] = true; keys[e.code] = true;
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) >= 0) e.preventDefault();
    });
    document.addEventListener("keyup", function (e) { keys[e.code] = false; kPress[e.code] = false; });
    function setupBtn(id, dn, up) {
        var b = document.getElementById(id); if (!b) return;
        var s = function (e) { e.preventDefault(); dn(); b.classList.add("pressed"); };
        var en = function (e) { e.preventDefault(); up(); b.classList.remove("pressed"); };
        b.addEventListener("touchstart", s, { passive: false }); b.addEventListener("touchend", en, { passive: false });
        b.addEventListener("touchcancel", en, { passive: false }); b.addEventListener("mousedown", s);
        b.addEventListener("mouseup", en); b.addEventListener("mouseleave", en);
    }
    setupBtn("btn-left", function () { mL = true; }, function () { mL = false; });
    setupBtn("btn-right", function () { mR = true; }, function () { mR = false; });
    setupBtn("btn-jump", function () { mJP = true; }, function () { });
    // Swipe support
    document.addEventListener("touchstart", function (e) {
        if (e.target.closest("#mobile-controls")) return;
        touchSX = e.touches[0].clientX; touchSY = e.touches[0].clientY; touchActive = true;
    }, { passive: true });
    document.addEventListener("touchend", function (e) {
        if (!touchActive) return; touchActive = false;
        var dx = e.changedTouches[0].clientX - touchSX, dy = e.changedTouches[0].clientY - touchSY;
        if (Math.abs(dx) < 20 && Math.abs(dy) < 20) { mJP = true; return; }// tap = jump
        if (Math.abs(dy) > Math.abs(dx) && dy < -30) mJP = true;// swipe up = jump
    }, { passive: true });
    // Player
    function resetP() {
        var sp = getSpawn();
        player = {
            x: sp.x, y: sp.y, vx: 0, vy: 0, w: PW, h: PH, grounded: false, jumps: 0, maxJ: 2, alive: true,
            face: "normal", scaleX: 1, scaleY: 1, flashT: 0, squishT: 0
        };
    }
    function getSpawn() {
        if (curLvl === 6 && !isBonus) return { x: 50, y: 170 };
        return isBonus ? { x: 40, y: 380 } : { x: 40, y: 380 };
    }
    // Level building
    function loadLvl(n) {
        plats = []; spikes = []; fakePlats = []; movPlats = []; tramps = []; hidSpikes = []; bombs = []; explosions = []; flag = {};
        ctrlRev = false; ctrlRevT = 0; gravFlip = false; gravFlipT = 4; gravWarn = false; bombT = 2;
        windForce = 0; l6floorGone = false; l7spikeTraps = []; l7troll1 = false; l7troll2 = false; l7fakeWall = false;
        l8ceilDrop = false; l8ceilY = -20;
        l9dark = false; l9timer = 0; l9lightBack = false; shrinkT = 0; shrinkAmt = 0; cloneActive = false;
        l14timer = 10; l14bombDropped = false; l14timerDone = false; l15blackoutT = 0; l15blackOn = false;
        arrowDir = 1; calmTimer = 3; lvlTime = 0;
        if (n === 4 && !isBonus) fakeWinShown = false;
        if (n === 14 && !isBonus) fakeWinShown = false;
        switch (n) {
            case 0: bL1(); break; case 1: bL2(); break; case 2: bL3(); break; case 3: bL4(); break;
            case 4: isBonus ? bL5B() : bL5(); break; case 5: bL6(); break; case 6: bL7(); break; case 7: bL8(); break;
            case 8: bL9(); break; case 9: bL10(); break; case 10: bL11(); break; case 11: bL12(); break;
            case 12: bL13(); break; case 13: bL14(); break; case 14: isBonus ? bL15B() : bL15(); break;
        }
    }
    function bL1() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 }); plats.push({ x: 60, y: 350, w: 100, h: 15 });
        plats.push({ x: 200, y: 300, w: 100, h: 15 });
        fakePlats.push({ x: 350, y: 260, w: 110, h: 15, timer: -1, dur: 0.8, op: 1 });
        plats.push({ x: 520, y: 220, w: 100, h: 15 }); plats.push({ x: 660, y: 170, w: 100, h: 15 });
        for (var i = 0; i < 8; i++)spikes.push({ x: 330 + i * 18, y: 405, w: 16, h: 15 });
        // Almost-moment trap: spike near flag
        hidSpikes.push({ x: 700, y: 155, w: 16, h: 15, active: false, triggerX: 650 });
        flag = { x: 720, y: 140, w: 20, h: 30 };
    }
    function bL2() {
        plats.push({ x: 0, y: 420, w: 150, h: 30 });
        movPlats.push({ x: 180, y: 340, w: 80, h: 15, sx: 180, ex: 340, spd: 1.2, dir: 1, revOnP: false });
        movPlats.push({ x: 380, y: 280, w: 80, h: 15, sx: 350, ex: 530, spd: 1.5, dir: 1, revOnP: true, revd: false, pOn: false });
        plats.push({ x: 560, y: 230, w: 80, h: 15 });
        hidSpikes.push({ x: 570, y: 410, w: 16, h: 15, active: false, triggerX: 500 });
        hidSpikes.push({ x: 590, y: 410, w: 16, h: 15, active: false, triggerX: 500 });
        hidSpikes.push({ x: 610, y: 410, w: 16, h: 15, active: false, triggerX: 500 });
        plats.push({ x: 660, y: 180, w: 100, h: 15 }); flag = { x: 720, y: 150, w: 20, h: 30 };
    }
    function bL3() {
        plats.push({ x: 0, y: 420, w: 200, h: 30 }); plats.push({ x: 160, y: 340, w: 80, h: 15 });
        plats.push({ x: 300, y: 290, w: 80, h: 15 }); tramps.push({ x: 440, y: 400, w: 60, h: 15, pow: -22 });
        for (var i = 0; i < 6; i++)spikes.push({ x: 420 + i * 18, y: 5, w: 16, h: 15, ceil: true });
        plats.push({ x: 550, y: 340, w: 80, h: 15 }); plats.push({ x: 670, y: 280, w: 100, h: 15 });
        flag = { x: 730, y: 250, w: 20, h: 30 };
    }
    function bL4() {
        var ps = [[30, 400, 60], [130, 330, 30], [220, 260, 30], [310, 190, 30], [400, 120, 30],
        [470, 200, 30], [540, 300, 30], [620, 200, 30], [700, 130, 60]];
        var cs = [[30, 35, 60], [130, 100, 30], [220, 170, 30], [310, 240, 30], [400, 310, 30],
        [470, 230, 30], [540, 130, 30], [620, 230, 30], [700, 300, 60]];
        for (var i = 0; i < ps.length; i++) {
            plats.push({ x: ps[i][0], y: ps[i][1], w: ps[i][2], h: 15 });
            plats.push({ x: cs[i][0], y: cs[i][1], w: cs[i][2], h: 15 });
        } flag = { x: 720, y: 100, w: 20, h: 30 };
    }
    function bL5() {
        plats.push({ x: 0, y: 420, w: 100, h: 30 });
        fakePlats.push({ x: 140, y: 360, w: 80, h: 15, timer: -1, dur: 0.8, op: 1 });
        plats.push({ x: 130, y: 420, w: 10, h: 30 });
        movPlats.push({ x: 250, y: 310, w: 70, h: 15, sx: 220, ex: 350, spd: 1.5, dir: 1, revOnP: true, revd: false, pOn: false });
        plats.push({ x: 380, y: 260, w: 50, h: 15 }); tramps.push({ x: 460, y: 400, w: 50, h: 15, pow: -20 });
        for (var i = 0; i < 4; i++)spikes.push({ x: 445 + i * 18, y: 5, w: 16, h: 15, ceil: true });
        plats.push({ x: 540, y: 300, w: 60, h: 15 }); plats.push({ x: 640, y: 230, w: 60, h: 15 });
        spikes.push({ x: 150, y: 405, w: 16, h: 15 }); spikes.push({ x: 170, y: 405, w: 16, h: 15 });
        spikes.push({ x: 190, y: 405, w: 16, h: 15 }); flag = { x: 680, y: 200, w: 20, h: 30 };
    }
    function bL5B() {
        plats.push({ x: 0, y: 420, w: 60, h: 30 });
        plats.push({ x: 100, y: 370, w: 25, h: 15 }); plats.push({ x: 170, y: 310, w: 25, h: 15 });
        plats.push({ x: 250, y: 250, w: 25, h: 15 });
        movPlats.push({ x: 320, y: 200, w: 50, h: 15, sx: 300, ex: 430, spd: 2, dir: 1, revOnP: false });
        for (var i = 0; i < 20; i++)spikes.push({ x: 60 + i * 38, y: 420, w: 16, h: 15 });
        plats.push({ x: 500, y: 150, w: 30, h: 15 }); plats.push({ x: 600, y: 100, w: 30, h: 15 });
        plats.push({ x: 700, y: 70, w: 70, h: 15 }); flag = { x: 730, y: 40, w: 20, h: 30 };
    }
    // L6: Floor disappears near flag
    function bL6() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 100, y: 350, w: 90, h: 15 }); plats.push({ x: 250, y: 290, w: 90, h: 15 });
        plats.push({ x: 400, y: 240, w: 90, h: 15 }); plats.push({ x: 550, y: 200, w: 90, h: 15 });
        // Spikes under entire floor
        for (var i = 0; i < 25; i++)spikes.push({ x: i * 32, y: 432, w: 16, h: 15 });
        // Safe platform the player won't notice
        plats.push({ x: 350, y: 180, w: 40, h: 15 });
        flag = { x: 700, y: 170, w: 20, h: 30 }; l6floorGone = false;
    }
    // L7: DIKEN LABIRENT — 3 corridor zigzag with spike traps
    function bL7() {
        // === CORRIDOR 1 (top): player goes RIGHT ===
        // Ceiling
        plats.push({ x: 0, y: 120, w: 800, h: 20 });
        // Floor (with exit hole at right end: x=750..800 is open)
        plats.push({ x: 0, y: 200, w: 750, h: 20 });
        // Left wall
        plats.push({ x: 0, y: 120, w: 10, h: 80 });

        // === CORRIDOR 2 (middle): player goes LEFT ===
        // Ceiling (shared with C1 floor, but C1 floor ends at x=750)
        // From x=0 to x=750, ceiling is C1 floor (y=200). Right portion open for drop.
        plats.push({ x: 0, y: 200, w: 750, h: 20 }); // this overlaps C1 floor, acts as C2 ceiling too
        // Floor (with exit hole at left end: x=0..60 is open)
        plats.push({ x: 60, y: 280, w: 740, h: 20 });
        // Right wall for corridor 2 (closes off right side so player must go left)
        plats.push({ x: 790, y: 200, w: 10, h: 80 });

        // === CORRIDOR 3 (bottom): player goes RIGHT ===
        // Ceiling (shared with C2 floor, but C2 floor starts at x=60)
        // Left portion x=0..60 is open for drop from C2.
        plats.push({ x: 60, y: 280, w: 740, h: 20 }); // overlaps C2 floor, acts as C3 ceiling too
        // Floor
        plats.push({ x: 60, y: 360, w: 740, h: 20 });
        // Left wall for corridor 3
        plats.push({ x: 60, y: 280, w: 10, h: 80 });
        // Right wall for corridor 3
        plats.push({ x: 790, y: 280, w: 10, h: 80 });
        // Bottom boundary
        plats.push({ x: 0, y: 430, w: 800, h: 20 });

        // === SPIKE TRAPS ===
        // Each trap: x, floorY (floor surface), corridor, state machine
        // Corridor 1 spikes (floor at y=200, spikes shoot up from floor)
        l7spikeTraps.push({ x: 300, floorY: 200, corridor: 1, state: 'idle', timer: 0, offset: 0 });
        l7spikeTraps.push({ x: 500, floorY: 200, corridor: 1, state: 'idle', timer: 0, offset: 1.5 });
        // Corridor 2 spikes (floor at y=280)
        l7spikeTraps.push({ x: 400, floorY: 280, corridor: 2, state: 'idle', timer: 0, offset: 3.0 });
        l7spikeTraps.push({ x: 200, floorY: 280, corridor: 2, state: 'idle', timer: 0, offset: 4.5 });
        // Corridor 3 spike (floor at y=360)
        l7spikeTraps.push({ x: 400, floorY: 360, corridor: 3, state: 'idle', timer: 0, offset: 6.0 });

        // === FLAG ===
        flag = { x: 740, y: 330, w: 20, h: 30 };

        // === TROLL STATE ===
        l7troll1 = false;
        l7troll2 = false;
        l7fakeWall = false;
    }
    // L8: Ceiling drops
    function bL8() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 100, y: 350, w: 80, h: 15 }); plats.push({ x: 250, y: 300, w: 80, h: 15 });
        plats.push({ x: 400, y: 250, w: 80, h: 15 }); plats.push({ x: 600, y: 200, w: 80, h: 15 });
        l8gapX = 100;// gap on left side (opposite to where player walks right)
        flag = { x: 720, y: 170, w: 20, h: 30 }; l8ceilDrop = false; l8ceilY = -20;
    }
    // L9: Darkness
    function bL9() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 80, y: 360, w: 80, h: 15 }); plats.push({ x: 220, y: 310, w: 80, h: 15 });
        plats.push({ x: 380, y: 260, w: 80, h: 15 }); plats.push({ x: 540, y: 220, w: 80, h: 15 });
        // Spikes where player naturally walks in dark
        spikes.push({ x: 200, y: 405, w: 16, h: 15 }); spikes.push({ x: 220, y: 405, w: 16, h: 15 });
        spikes.push({ x: 350, y: 405, w: 16, h: 15 }); spikes.push({ x: 370, y: 405, w: 16, h: 15 });
        spikes.push({ x: 500, y: 405, w: 16, h: 15 }); spikes.push({ x: 520, y: 405, w: 16, h: 15 });
        flag = { x: 700, y: 180, w: 20, h: 30 }; l9dark = false; l9timer = 0;
    }
    // L10: Wind pushes left, flag on left -- wind helps reach flag
    function bL10() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 600, y: 360, w: 80, h: 15 }); plats.push({ x: 400, y: 310, w: 80, h: 15 });
        plats.push({ x: 200, y: 260, w: 80, h: 15 });
        movPlats.push({ x: 300, y: 350, w: 60, h: 15, sx: 200, ex: 500, spd: 1.5, dir: 1, revOnP: false });
        windForce = -1.33; flag = { x: 30, y: 230, w: 20, h: 30 };
    }
    // L11: Fake arrow pointing to death
    function bL11() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 200, y: 340, w: 80, h: 15 }); plats.push({ x: 400, y: 280, w: 80, h: 15 });
        // Spikes where arrow points (right side)
        for (var i = 0; i < 8; i++)spikes.push({ x: 600 + i * 18, y: 405, w: 16, h: 15 });
        // Real path: left side, hidden-looking
        plats.push({ x: 50, y: 280, w: 40, h: 15 }); plats.push({ x: 10, y: 200, w: 50, h: 15 });
        // Fake dangerous-looking spikes player must walk through (they're visual only)
        flag = { x: 20, y: 170, w: 20, h: 30 }; arrowDir = 1;
    }
    // L12: Shrinking world
    function bL12() {
        plats.push({ x: 50, y: 400, w: 700, h: 15 });
        plats.push({ x: 150, y: 330, w: 80, h: 15 }); plats.push({ x: 350, y: 280, w: 80, h: 15 });
        plats.push({ x: 550, y: 230, w: 80, h: 15 });
        // Spikes surrounding flag
        spikes.push({ x: 370, y: 175, w: 16, h: 15 }); spikes.push({ x: 430, y: 175, w: 16, h: 15 });
        flag = { x: 400, y: 190, w: 20, h: 30 }; shrinkT = 0; shrinkAmt = 0;
    }
    // L13: Clone
    function bL13() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 100, y: 350, w: 80, h: 15 }); plats.push({ x: 280, y: 300, w: 80, h: 15 });
        plats.push({ x: 450, y: 250, w: 80, h: 15 }); plats.push({ x: 620, y: 200, w: 80, h: 15 });
        flag = { x: 700, y: 170, w: 20, h: 30 }; cloneActive = true;
        clone = { x: 760, y: 380, vx: 0, vy: 0, w: PW, h: PH, alive: true };
    }
    // L14: Fake countdown
    function bL14() {
        plats.push({ x: 0, y: 420, w: 800, h: 30 });
        plats.push({ x: 80, y: 360, w: 70, h: 15 }); plats.push({ x: 200, y: 310, w: 70, h: 15 });
        plats.push({ x: 340, y: 260, w: 70, h: 15 }); plats.push({ x: 480, y: 220, w: 70, h: 15 });
        plats.push({ x: 620, y: 180, w: 80, h: 15 });
        flag = { x: 680, y: 150, w: 20, h: 30 }; l14timer = 10; l14bombDropped = false; l14timerDone = false;
    }
    // L15: Final boss - everything combined
    function bL15() {
        plats.push({ x: 0, y: 420, w: 100, h: 30 });
        fakePlats.push({ x: 130, y: 370, w: 70, h: 15, timer: -1, dur: 0.8, op: 1 });
        plats.push({ x: 230, y: 320, w: 40, h: 15 });
        movPlats.push({ x: 310, y: 270, w: 60, h: 15, sx: 280, ex: 420, spd: 2, dir: 1, revOnP: false });
        plats.push({ x: 460, y: 220, w: 50, h: 15 }); plats.push({ x: 580, y: 170, w: 50, h: 15 });
        plats.push({ x: 700, y: 130, w: 60, h: 15 });
        for (var i = 0; i < 6; i++)spikes.push({ x: 100 + i * 30, y: 420, w: 16, h: 15 });
        for (var i = 0; i < 3; i++)spikes.push({ x: 460 + i * 18, y: 5, w: 16, h: 15, ceil: true });
        flag = { x: 720, y: 100, w: 20, h: 30 };
    }
    function bL15B() {
        plats.push({ x: 0, y: 420, w: 50, h: 30 });
        plats.push({ x: 90, y: 380, w: 25, h: 15 }); plats.push({ x: 160, y: 330, w: 25, h: 15 });
        plats.push({ x: 240, y: 280, w: 25, h: 15 }); plats.push({ x: 330, y: 230, w: 25, h: 15 });
        movPlats.push({ x: 420, y: 180, w: 40, h: 15, sx: 400, ex: 520, spd: 2.5, dir: 1, revOnP: false });
        for (var i = 0; i < 22; i++)spikes.push({ x: 50 + i * 35, y: 420, w: 16, h: 15 });
        plats.push({ x: 560, y: 130, w: 30, h: 15 }); plats.push({ x: 660, y: 80, w: 30, h: 15 });
        plats.push({ x: 730, y: 50, w: 50, h: 15 }); flag = { x: 740, y: 20, w: 20, h: 30 };
    }
    // ========= UPDATE =========
    function update(dt) {
        if (state === "dead") {
            deathT -= dt; if (player.squishT > 0) player.squishT -= dt;
            if (deathT <= 0) respawn(); updateParts(dt); return;
        }
        if (state === "fakewin") {
            fakeWinT -= dt; if (fakeWinT <= 0 && !isBonus) {
                $fws.classList.add("hidden"); isBonus = true; loadLvl(curLvl); resetP(); state = "playing";
                showTroll(LTROLLS[curLvl]);
            } return;
        }
        if (state !== "playing") return;
        lvlTime += dt; totalTime += dt;
        // Calm period
        if (calmTimer > 0) { calmTimer -= dt; if (calmTimer < 0) calmTimer = 0; }
        // Level-specific timers
        if (curLvl === 5 && !l6floorGone && player.x > 600) {
            l6floorGone = true;
            plats = plats.filter(function (p) { return p.y !== 420; }); yellowFlash(); showTroll(LTROLLS[5]);
        }
        if (curLvl === 6) {
            // L7 DIKEN LABIRENT: spike trap state machine
            for (var i = 0; i < l7spikeTraps.length; i++) {
                var trap = l7spikeTraps[i];
                var dx = Math.abs((player.x + player.w / 2) - (trap.x + 25));
                trap.timer += dt;
                switch (trap.state) {
                    case 'idle':
                        // Activate warning when player is within 150px horizontally
                        if (dx < 150) { trap.state = 'warning'; trap.timer = 0; }
                        break;
                    case 'warning':
                        // Flash for 1 second then fire spikes
                        if (trap.timer >= 1.0) { trap.state = 'active'; trap.timer = 0; }
                        break;
                    case 'active':
                        // Spikes are up for 1.5 seconds — kill player on contact
                        var spikeRect = { x: trap.x - 5, y: trap.floorY - 40, w: 60, h: 40 };
                        if (rectC(player, spikeRect)) { killP(); showTroll('DIKENI GORMEDIN MI? 🌵'); return; }
                        if (trap.timer >= 1.5) { trap.state = 'cooldown'; trap.timer = 0; }
                        break;
                    case 'cooldown':
                        if (trap.timer >= 2.0) { trap.state = 'idle'; trap.timer = 0; }
                        break;
                }
            }
            // TROLL 1: When player reaches x=400 in corridor 1, fire nearest spike early
            if (!l7troll1 && player.y > 130 && player.y < 195 && player.x >= 400) {
                l7troll1 = true;
                showTroll('BU KADAR KOLAY MI? 😊');
                // Fire the nearest corridor 1 spike 0.3s early
                for (var i = 0; i < l7spikeTraps.length; i++) {
                    var t = l7spikeTraps[i];
                    if (t.corridor === 1 && t.state === 'idle') {
                        t.state = 'warning'; t.timer = 0.7; // only 0.3s warning left
                        break;
                    }
                }
            }
            // TROLL 2: When player enters corridor 3, show fake wall
            if (!l7troll2 && player.y > 290 && player.y < 355) {
                l7troll2 = true;
                l7fakeWall = true;
            }
            // Fake wall collision (x=650, gap at bottom y=310..360 = 50px)
            if (l7fakeWall) {
                // Wall top part: y=280 to y=310 (blocks)
                var wallTop = { x: 650, y: 280, w: 15, h: 30 };
                if (rectC(player, wallTop)) {
                    if (player.vx > 0) { player.x = wallTop.x - player.w; player.vx = 0; }
                    else if (player.vx < 0) { player.x = wallTop.x + wallTop.w; player.vx = 0; }
                }
                // Player passed the wall
                if (player.x > 665) {
                    showTroll('BULDUN MU? 😈');
                    l7fakeWall = false;
                }
            }
        }
        if (curLvl === 7 && !l8ceilDrop && player.x > 400 && calmTimer <= 0) { l8ceilDrop = true; yellowFlash(); showTroll(LTROLLS[7]); }
        if (curLvl === 7 && l8ceilDrop) { l8ceilY += dt * 300; if (l8ceilY > 50) l8ceilY = 50; }
        if (curLvl === 8) {
            l9timer += dt; if (l9timer >= 2 && !l9dark && calmTimer <= 0) { l9dark = true; $bo.classList.add("active"); }
            if (l9dark && l9timer >= 6 && !l9lightBack) { l9lightBack = true; $bo.classList.remove("active"); }
        }
        if (curLvl === 9 && calmTimer <= 0) { player.x += windForce * dt * 60; if (player.x < 30) player.x = 30; }
        if (curLvl === 11 && calmTimer <= 0) { shrinkT += dt; shrinkAmt = Math.min(shrinkT * 8, 120); }
        if (curLvl === 12 && cloneActive) {
            clone.x += (player.x - clone.x) * 0.02;
            clone.y += (player.y - clone.y) * 0.03; clone.vx = -player.vx * 0.5;
            if (rectC(player, clone)) { killP(); return; }
        }
        if (curLvl === 13 && calmTimer <= 0) {
            l14timer -= dt;
            $td.classList.remove("hidden"); $td.textContent = Math.max(0, Math.ceil(l14timer));
            if (l14timer <= 5) $td.classList.add("urgent"); else $td.classList.remove("urgent");
            if (l14timer <= 0 && !l14timerDone) {
                l14timerDone = true; showTroll("ZAMAN DOLDU... AMA OLMEDIN? DEVAM ET 😏");
                setTimeout(function () {
                    if (curLvl === 13 && !l14bombDropped) {
                        l14bombDropped = true;
                        bombs.push({ x: player.x, y: -20, vy: 3, w: 16, h: 16, exploded: false });
                    }
                }, 2000);
            }
        }
        if (curLvl === 14 && calmTimer <= 0) {
            gravFlipT -= dt; if (gravFlipT <= 1 && gravFlipT > 0 && !gravWarn) { gravWarn = true; }
            if (gravFlipT <= 0) { gravFlip = !gravFlip; gravFlipT = 4; gravWarn = false; player.vy = 0; player.jumps = 0; }
            bombT -= dt; if (bombT <= 0) { bombT = 2.5; bombs.push({ x: 50 + Math.random() * (CW - 100), y: -20, vy: 2.5, w: 14, h: 14, exploded: false }); }
            l15blackoutT -= dt; if (l15blackoutT <= 0) {
                l15blackOn = !l15blackOn;
                l15blackoutT = l15blackOn ? 1 : 5; if (l15blackOn) $bo.classList.add("active"); else $bo.classList.remove("active");
            }
        }
        // Input
        var mv = 0, wantJ = false, left = keys.ArrowLeft || keys.KeyA || mL, right = keys.ArrowRight || keys.KeyD || mR,
            jump = kPress.ArrowUp || kPress.KeyW || kPress.Space || mJP;
        kPress.ArrowUp = false; kPress.KeyW = false; kPress.Space = false; mJP = false;
        if (ctrlRev) { var t = left; left = right; right = t; ctrlRevT -= dt; if (ctrlRevT <= 0) ctrlRev = false; }
        if (left) mv = -1; if (right) mv = 1; if (jump) wantJ = true;
        // Physics
        var gv = gravFlip ? -GRAV : GRAV, jf = gravFlip ? Math.abs(JFORCE) : JFORCE, djf = gravFlip ? Math.abs(DJFORCE) : DJFORCE;
        if (mv !== 0) { player.vx += mv * PACCEL; if (Math.abs(player.vx) > PSPEED) player.vx = mv * PSPEED; }
        else { if (Math.abs(player.vx) < PDECEL) player.vx = 0; else player.vx -= Math.sign(player.vx) * PDECEL; }
        if (wantJ && player.jumps < player.maxJ) {
            player.vy = player.jumps === 0 ? jf : djf; player.jumps++;
            jumpFx.push({ x: player.x + player.w / 2, y: player.y + player.h, r: 3, maxR: 18, op: 0.7 });
        }
        player.vy += gv;
        if (!gravFlip && player.vy > MAXFALL) player.vy = MAXFALL;
        if (gravFlip && player.vy < -MAXFALL) player.vy = -MAXFALL;
        player.x += player.vx; player.grounded = false; colX();
        player.y += player.vy; colY();
        // Boundaries
        if (player.x < 0) { player.x = 0; player.vx = 0; }
        if (player.x + player.w > CW) { player.x = CW - player.w; player.vx = 0; }
        if (curLvl === 11) {
            var b = shrinkAmt; if (player.x < b) { player.x = b; player.vx = 0; }
            if (player.x + player.w > CW - b) { player.x = CW - b - player.w; player.vx = 0; }
            if (player.y + player.h > CH - b) { killP(); return; } if (player.y < b) { killP(); return; }
        }
        if (player.y > CH + 50 || player.y < -80) { killP(); return; }
        // Fake platforms fade
        for (var i = 0; i < fakePlats.length; i++) { var fp = fakePlats[i]; if (fp.timer >= 0) { fp.timer -= dt; fp.op = Math.max(0, fp.timer / fp.dur); } }
        // Moving plats
        for (var i = 0; i < movPlats.length; i++) {
            var mp = movPlats[i], px = mp.x;
            if (mp.revOnP && mp.revd) mp.x -= mp.spd * mp.dir; else mp.x += mp.spd * mp.dir;
            if (mp.x <= mp.sx) { mp.dir = 1; mp.x = mp.sx; } if (mp.x >= mp.ex) { mp.dir = -1; mp.x = mp.ex; }
            if (pOnPlat(mp)) {
                player.x += (mp.x - px);
                if (mp.revOnP && !mp.revd && mp.pOn) {
                    mp.revd = true;
                    if (curLvl === 1 && !ctrlRev) { ctrlRev = true; ctrlRevT = 3; showTroll(LTROLLS[1]); }
                }
                mp.pOn = true;
            }
        }
        // Hidden spikes
        for (var i = 0; i < hidSpikes.length; i++) { var hs = hidSpikes[i]; if (!hs.active && player.x > hs.triggerX) hs.active = true; }
        // Bombs (L3 only — L15 has its own bomb logic above)
        if (curLvl === 2) {
            bombT -= dt; if (bombT <= 0) {
                bombT = 2;
                bombs.push({ x: 50 + Math.random() * (CW - 100), y: -20, vy: 2.5, w: 14, h: 14, exploded: false });
            }
        }
        for (var i = bombs.length - 1; i >= 0; i--) {
            var b = bombs[i]; if (!b.exploded) {
                b.y += b.vy; b.vy += 0.08;
                if (b.y > 410) { b.exploded = true; explosions.push({ x: b.x, y: b.y, r: 40, t: 1, mt: 1 }); }
            }
        }
        for (var i = explosions.length - 1; i >= 0; i--) { explosions[i].t -= dt; if (explosions[i].t <= 0) explosions.splice(i, 1); }
        // Gravity flip (L4, L15 non-bonus)
        if (curLvl === 3) {
            gravFlipT -= dt; if (gravFlipT <= 1 && gravFlipT > 0 && !gravWarn) gravWarn = true;
            if (gravFlipT <= 0) { gravFlip = !gravFlip; gravFlipT = 4; gravWarn = false; player.vy = 0; player.jumps = 0; }
        }
        // Trampolines
        for (var i = 0; i < tramps.length; i++) { if (pOnPlat(tramps[i]) && player.vy >= 0) { player.vy = tramps[i].pow; player.jumps = 1; } }
        // Face & green glow near flag
        var nearFlag = false; if (flag.x !== undefined) {
            var dx = player.x - flag.x, dy = player.y - flag.y;
            if (Math.sqrt(dx * dx + dy * dy) < 120) nearFlag = true;
        }
        $gg.classList.toggle("active", nearFlag);
        updateFace();
        // Collisions: spikes
        for (var i = 0; i < spikes.length; i++) { if (rectC(player, spikes[i])) { killP(); return; } }
        for (var i = 0; i < hidSpikes.length; i++) { if (hidSpikes[i].active && rectC(player, hidSpikes[i])) { killP(); return; } }
        for (var i = 0; i < explosions.length; i++) {
            var e = explosions[i], edx = (player.x + player.w / 2) - e.x, edy = (player.y + player.h / 2) - e.y;
            if (Math.sqrt(edx * edx + edy * edy) < e.r) { killP(); return; }
        }
        for (var i = 0; i < bombs.length; i++) { if (!bombs[i].exploded && rectC(player, bombs[i])) { killP(); return; } }
        // L8 ceiling collision
        if (curLvl === 7 && l8ceilDrop && l8ceilY > 0) {
            if (player.y < l8ceilY &&
                !(player.x > l8gapX && player.x + player.w < l8gapX + 50)) { killP(); return; }
        }
        // Flag
        if (rectC(player, flag)) lvlComplete();
        updateParts(dt); updateDust(dt); updateJFx(dt);
    }
    // Collision
    function rectC(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
    function pOnPlat(p) {
        return player.x + player.w > p.x && player.x < p.x + p.w &&
            player.y + player.h >= p.y && player.y + player.h <= p.y + 8 && player.vy >= 0;
    }
    function getSolids() {
        var a = plats.slice();
        for (var i = 0; i < fakePlats.length; i++)if (fakePlats[i].op > 0.3) a.push(fakePlats[i]);
        a = a.concat(movPlats); return a;
    }
    function colX() {
        var a = getSolids(); for (var i = 0; i < a.length; i++) {
            if (rectC(player, a[i])) {
                if (player.vx > 0) player.x = a[i].x - player.w; else if (player.vx < 0) player.x = a[i].x + a[i].w; player.vx = 0;
            }
        }
    }
    function colY() {
        var a = getSolids(); for (var i = 0; i < a.length; i++) {
            if (rectC(player, a[i])) {
                if (!gravFlip) {
                    if (player.vy > 0) {
                        player.y = a[i].y - player.h; player.vy = 0; player.grounded = true; player.jumps = 0;
                        spawnDust(player.x + player.w / 2, player.y + player.h); chkFake(a[i]);
                    }
                    else if (player.vy < 0) { player.y = a[i].y + a[i].h; player.vy = 0; }
                }
                else {
                    if (player.vy < 0) { player.y = a[i].y + a[i].h; player.vy = 0; player.grounded = true; player.jumps = 0; }
                    else if (player.vy > 0) { player.y = a[i].y - player.h; player.vy = 0; }
                }
            }
        }
    }
    function chkFake(p) {
        for (var i = 0; i < fakePlats.length; i++) {
            var f = fakePlats[i];
            if (f === p && f.timer === -1) { f.timer = f.dur; if (curLvl === 0) setTimeout(function () { showTroll(LTROLLS[0]); }, 600); }
        }
    }
    function updateFace() {
        var nd = false; var all = spikes.concat(hidSpikes.filter(function (h) { return h.active; }));
        for (var i = 0; i < all.length; i++) {
            var dx = (player.x + PW / 2) - (all[i].x + all[i].w / 2),
                dy = (player.y + PH / 2) - (all[i].y + all[i].h / 2); if (Math.sqrt(dx * dx + dy * dy) < 50) { nd = true; break; }
        }
        player.face = nd ? "scared" : "normal";
    }
    // Death & Respawn
    function killP() {
        if (!player.alive) return; player.alive = false; player.face = "dead"; state = "dead";
        deaths++; deathT = 0.8; player.squishT = 0.3; saveToLS('trollparkur_deaths', deaths);
        $dc.textContent = deaths; $hd.classList.remove("bump"); void $hd.offsetWidth; $hd.classList.add("bump");
        spawnDeath(player.x + player.w / 2, player.y + player.h / 2);
        $rf.classList.remove("active"); void $rf.offsetWidth; $rf.classList.add("active");
        var msg = getMsg(); showTroll(msg);
    }
    function getMsg() {
        if (deaths === 10) return "ISRAR ETMENI TAKDIR EDIYORUM... NEDEN BILMIYORUM 🤔";
        if (deaths === 25) return "DOKTOR RANDEVUSU ALMAN LAZIM 🏥";
        if (deaths === 50) return "SEN EFSANESIN. KOTU ANLAMDA. 👑";
        if (deaths === 75) return "BU NOKTADA SEN OYUNUN PARCASISIN";
        if (deaths === 100) return "100 OLUM. GUINNESS'E HABER VER 📰";
        if (msgUsed.length >= MSGS.length) msgUsed = [];
        var avail = MSGS.filter(function (m) { return msgUsed.indexOf(m) < 0; });
        var m = avail[Math.floor(Math.random() * avail.length)]; msgUsed.push(m); return m;
    }
    function showTroll(m) {
        $tt.textContent = m; $tm.classList.remove("hidden");
        $tt.style.animation = "none"; void $tt.offsetWidth;
        $tt.style.animation = "trollBounce .5s cubic-bezier(.68,-.55,.27,1.55) forwards";
        clearTimeout(trollT); trollT = setTimeout(function () { $tm.classList.add("hidden"); }, 2200);
    }
    function yellowFlash() { $yf.classList.remove("active"); void $yf.offsetWidth; $yf.classList.add("active"); }
    function respawn() {
        state = "playing"; $bo.classList.remove("active"); $td.classList.add("hidden");
        $gg.classList.remove("active"); var wasB = isBonus; loadLvl(curLvl); isBonus = wasB;
        if (curLvl === 4 && isBonus) loadLvl(4); if (curLvl === 14 && isBonus) loadLvl(14); resetP(); player.flashT = 0.4;
    }
    // Particles
    function spawnDeath(x, y) {
        var c = ["#dd2233", "#ff8c55", "#4488dd", "#ffe600", "#39cc14", "#fff"];
        for (var i = 0; i < 20; i++)particles.push({
            x: x, y: y, vx: (Math.random() - .5) * 7, vy: (Math.random() - .5) * 7 - 2,
            sz: 3 + Math.random() * 4, life: 1, c: c[Math.floor(Math.random() * c.length)]
        });
    }
    function spawnDust(x, y) {
        for (var i = 0; i < 4; i++)dustP.push({
            x: x + (Math.random() - .5) * 10, y: y,
            vx: (Math.random() - .5) * 2, vy: -Math.random() * 1.5, sz: 2 + Math.random() * 2, life: .5, c: "rgba(0,0,0,0.2)"
        });
    }
    function updateParts(dt) {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += .15; p.life -= dt * 1.5; if (p.life <= 0) particles.splice(i, 1);
        }
    }
    function updateDust(dt) {
        for (var i = dustP.length - 1; i >= 0; i--) {
            var p = dustP[i];
            p.x += p.vx; p.y += p.vy; p.life -= dt * 2; if (p.life <= 0) dustP.splice(i, 1);
        }
    }
    function updateJFx(dt) {
        for (var i = jumpFx.length - 1; i >= 0; i--) {
            var j = jumpFx[i];
            j.r += dt * 80; j.op -= dt * 3; if (j.op <= 0) jumpFx.splice(i, 1);
        }
    }
    // Level complete
    function lvlComplete() {
        if ((curLvl === 4 || curLvl === 14) && !isBonus && !fakeWinShown) {
            fakeWinShown = true; state = "fakewin"; fakeWinT = 2;
            $fws.classList.remove("hidden"); $fws.querySelector(".fake-win-text").textContent = "TEBRIKLER! KAZANDIN!";
            setTimeout(function () { $fws.querySelector(".fake-win-text").textContent = "BIR TANE DAHA... 😈"; }, 1200); return;
        }
        $bo.classList.remove("active"); $td.classList.add("hidden"); $gg.classList.remove("active");
        if (curLvl < TOTAL_LEVELS - 1) { curLvl++; isBonus = false; $ln.textContent = curLvl + 1; showLvlTitle(curLvl); saveProgress(); }
        else { state = "win"; showWin(); }
    }
    function showLvlTitle(n) {
        state = "levelIntro"; $ltn.textContent = "LEVEL " + (n + 1); $ltna.textContent = LNAMES[n];
        $lt.classList.remove("hidden"); $ltn.style.animation = "none"; $ltna.style.animation = "none";
        void $ltn.offsetWidth; $ltn.style.animation = "titleSlide .6s ease-out forwards";
        $ltna.style.animation = "titleSlide .6s ease-out .2s forwards";
        setTimeout(function () { $lt.classList.add("hidden"); loadLvl(n); resetP(); state = "playing"; gravFlip = false; }, 1500);
    }
    function showWin() {
        $ws.classList.remove("hidden"); $fd.textContent = deaths;
        var s = Math.floor(totalTime), m = Math.floor(s / 60), ss = s % 60;
        $ft.textContent = m + ":" + (ss < 10 ? "0" : "") + ss; startConfetti();
        saveToLS('trollparkur_maxlevel', TOTAL_LEVELS - 1);
        try { localStorage.removeItem('trollparkur_level'); localStorage.removeItem('trollparkur_deaths'); } catch (e) { }
    }
    var confP = [];
    function startConfetti() {
        confC.width = window.innerWidth; confC.height = window.innerHeight;
        var cc = confC.getContext("2d"); confP = []; var cs = ["#dd2233", "#4488dd", "#ff8c55", "#39cc14", "#ffe600"];
        for (var i = 0; i < 120; i++)confP.push({
            x: Math.random() * confC.width, y: Math.random() * -confC.height,
            w: 5 + Math.random() * 7, h: 5 + Math.random() * 7, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 3,
            rot: Math.random() * Math.PI * 2, rs: (Math.random() - .5) * .2, c: cs[Math.floor(Math.random() * cs.length)]
        });
        animConf(cc);
    }
    function animConf(cc) {
        if (state !== "win") return; cc.clearRect(0, 0, confC.width, confC.height);
        for (var i = 0; i < confP.length; i++) {
            var p = confP[i]; p.x += p.vx; p.y += p.vy; p.rot += p.rs;
            if (p.y > confC.height) { p.y = -10; p.x = Math.random() * confC.width; }
            cc.save(); cc.translate(p.x, p.y); cc.rotate(p.rot); cc.fillStyle = p.c;
            cc.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cc.restore();
        } requestAnimationFrame(function () { animConf(cc); });
    }
    // ========= RENDER =========
    function render() {
        ctx.save();
        // BG: clean white with faded level number
        ctx.fillStyle = "#f8f8f8"; ctx.fillRect(0, 0, CW, CH);
        ctx.fillStyle = "rgba(0,0,0,0.03)"; ctx.font = "bold 200px 'Fredoka One'"; ctx.textAlign = "center";
        ctx.fillText("" + (curLvl + 1), CW / 2, CH / 2 + 70); ctx.textAlign = "left";
        // Shrink border (L12)
        if (curLvl === 11 && shrinkAmt > 0) {
            ctx.fillStyle = "#e87040"; var s = shrinkAmt;
            ctx.fillRect(0, 0, s, CH); ctx.fillRect(CW - s, 0, s, CH); ctx.fillRect(0, 0, CW, s); ctx.fillRect(0, CH - s, CW, s);
        }
        // Gravity warning
        if (gravWarn) {
            ctx.fillStyle = "rgba(255,200,0,0.08)"; ctx.fillRect(0, 0, CW, CH);
            ctx.fillStyle = "#cc8800"; ctx.font = "bold 16px 'Fredoka One'"; ctx.textAlign = "center";
            ctx.fillText("⚠ YERCEKIMI DEGISIYOR ⚠", CW / 2, 30); ctx.textAlign = "left";
        }
        if (ctrlRev) {
            ctx.fillStyle = "rgba(220,50,50,0.06)"; ctx.fillRect(0, 0, CW, CH);
            ctx.fillStyle = "#cc3333"; ctx.font = "bold 14px 'Fredoka One'"; ctx.textAlign = "center";
            ctx.fillText("⚠ KONTROLLER TERS ⚠", CW / 2, 30); ctx.textAlign = "left";
        }
        // Wind indicator (L10)
        if (curLvl === 9 && calmTimer <= 0) {
            ctx.fillStyle = "rgba(100,180,255,0.1)";
            for (var i = 0; i < 5; i++) {
                var wx = CW - ((lvlTime * 100 + i * 170) % CW);
                ctx.fillRect(wx, 50 + i * 70, 40, 3); ctx.fillRect(wx + 10, 58 + i * 70, 30, 2);
            }
        }
        // Arrow (L11)
        if (curLvl === 10) {
            ctx.fillStyle = "rgba(0,180,0,0.3)"; ctx.font = "bold 60px 'Fredoka One'";
            ctx.textAlign = "center"; ctx.fillText("➡ BURAYA GEL ➡", CW * 0.75, CH / 2); ctx.textAlign = "left";
        }
        // Platforms
        for (var i = 0; i < plats.length; i++)drawPlat(plats[i], "#e87040", "#ff9960");
        for (var i = 0; i < fakePlats.length; i++) { var f = fakePlats[i]; if (f.op > 0) { ctx.globalAlpha = f.op; drawPlat(f, "#e87040", "#ff9960"); ctx.globalAlpha = 1; } }
        for (var i = 0; i < movPlats.length; i++)drawPlat(movPlats[i], "#4488dd", "#66aaff");
        for (var i = 0; i < tramps.length; i++) {
            drawPlat(tramps[i], "#ff8c00", "#ffcc00");
            ctx.strokeStyle = "#ffcc00"; ctx.lineWidth = 2; ctx.beginPath();
            var tr = tramps[i]; ctx.moveTo(tr.x + 10, tr.y + tr.h);
            for (var z = 0; z < 4; z++)ctx.lineTo(tr.x + 10 + (z % 2 ? -6 : 8), tr.y + tr.h - 3 - z * 2); ctx.stroke();
        }
        // Spikes
        for (var i = 0; i < spikes.length; i++)drawSpike(spikes[i]);
        for (var i = 0; i < hidSpikes.length; i++)if (hidSpikes[i].active) drawSpike(hidSpikes[i]);
        // L7 DIKEN LABIRENT rendering
        if (curLvl === 6) {
            // Spike traps: warning dots, active spikes
            for (var i = 0; i < l7spikeTraps.length; i++) {
                var trap = l7spikeTraps[i];
                var tx = trap.x, fy = trap.floorY;
                if (trap.state === 'idle') {
                    // Small warning dot (yellow)
                    ctx.fillStyle = '#ffe600'; ctx.beginPath();
                    ctx.arc(tx + 25, fy - 5, 5, 0, Math.PI * 2); ctx.fill();
                } else if (trap.state === 'warning') {
                    // Flashing red/yellow dot
                    var flash = Math.floor(trap.timer * 12) % 2 === 0;
                    ctx.fillStyle = flash ? '#dd2233' : '#ffe600'; ctx.beginPath();
                    ctx.arc(tx + 25, fy - 5, 6, 0, Math.PI * 2); ctx.fill();
                } else if (trap.state === 'active') {
                    // 3 spike triangles shooting up from floor, 40px tall
                    ctx.fillStyle = '#dd2233';
                    for (var s = 0; s < 3; s++) {
                        var sx = tx + s * 18;
                        ctx.beginPath();
                        ctx.moveTo(sx, fy);
                        ctx.lineTo(sx + 8, fy - 40);
                        ctx.lineTo(sx + 16, fy);
                        ctx.fill();
                    }
                } else if (trap.state === 'cooldown') {
                    // Small retracting dot (dim)
                    ctx.fillStyle = 'rgba(255,230,0,0.4)'; ctx.beginPath();
                    ctx.arc(tx + 25, fy - 3, 4, 0, Math.PI * 2); ctx.fill();
                }
            }
            // Exit arrows (white chevrons)
            ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = "bold 22px 'Fredoka One'";
            ctx.textAlign = 'center';
            // Corridor 1 exit: arrow pointing DOWN at right end
            ctx.fillText('\u25BC', 775, 215); ctx.fillText('\u25BC', 775, 230);
            // Corridor 2 exit: arrow pointing DOWN at left end
            ctx.fillText('\u25BC', 30, 295); ctx.fillText('\u25BC', 30, 310);
            ctx.textAlign = 'left';
            // Fake wall in corridor 3 (troll 2)
            if (l7fakeWall) {
                // Wall from y=280 to y=310 (top part blocks)
                ctx.fillStyle = '#d06030';
                ctx.fillRect(650, 280, 15, 30);
                // Gap from y=310 to y=360 (50px opening at bottom)
                // Subtle hint: lighter color at gap
                ctx.fillStyle = 'rgba(255,200,150,0.3)';
                ctx.fillRect(650, 310, 15, 50);
            }
        }
        // L8 ceiling
        if (curLvl === 7 && l8ceilDrop && l8ceilY > 0) {
            ctx.fillStyle = "#e87040";
            ctx.fillRect(0, 0, l8gapX, l8ceilY); ctx.fillRect(l8gapX + 50, 0, CW - l8gapX - 50, l8ceilY);
            // Spikes on ceiling bottom
            for (var i = 0; i < CW; i += 20) {
                if (i < l8gapX || i > l8gapX + 50) {
                    ctx.fillStyle = "#dd2233"; ctx.beginPath(); ctx.moveTo(i, l8ceilY);
                    ctx.lineTo(i + 10, l8ceilY + 12); ctx.lineTo(i + 20, l8ceilY); ctx.fill();
                }
            }
        }
        // Bombs
        for (var i = 0; i < bombs.length; i++) {
            var b = bombs[i]; if (!b.exploded) {
                ctx.fillStyle = "#dd2233";
                ctx.beginPath(); ctx.arc(b.x, b.y, b.w / 2, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#ffe600"; ctx.fillRect(b.x - 1, b.y - b.h / 2 - 5, 3, 5);
            }
        }
        // Explosions
        for (var i = 0; i < explosions.length; i++) {
            var e = explosions[i], a = e.t / e.mt;
            ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(220,100,0," + a * 0.4 + ")"; ctx.fill();
            ctx.beginPath(); ctx.arc(e.x, e.y, e.r * .5, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,200,0," + a * 0.5 + ")"; ctx.fill();
        }
        // Flag
        if (flag.x !== undefined) {
            ctx.fillStyle = "#2288cc"; ctx.fillRect(flag.x + 9, flag.y, 3, flag.h);
            ctx.fillStyle = "#39cc14"; ctx.beginPath(); ctx.moveTo(flag.x + 12, flag.y);
            ctx.lineTo(flag.x + 28, flag.y + 8); ctx.lineTo(flag.x + 12, flag.y + 16); ctx.fill();
        }
        // Clone (L13)
        if (curLvl === 12 && cloneActive) { ctx.globalAlpha = 0.5; drawBall(clone.x, clone.y, PW, PH, "#dd4444", "normal", 1, 1); ctx.globalAlpha = 1; }
        // Jump effects
        for (var i = 0; i < jumpFx.length; i++) {
            var j = jumpFx[i]; ctx.strokeStyle = "rgba(68,136,221," + j.op + ")";
            ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2); ctx.stroke();
        }
        // Dust
        for (var i = 0; i < dustP.length; i++) {
            var d = dustP[i]; ctx.globalAlpha = d.life * 2; ctx.fillStyle = d.c;
            ctx.beginPath(); ctx.arc(d.x, d.y, d.sz, 0, Math.PI * 2); ctx.fill();
        } ctx.globalAlpha = 1;
        // Player
        if (player.alive || player.squishT > 0) {
            var sx = player.squishT > 0 ? 2 : player.scaleX, sy = player.squishT > 0 ? 0.2 : player.scaleY;
            if (player.flashT > 0) { player.flashT -= 0.016; if (Math.floor(player.flashT * 20) % 2 === 0) ctx.globalAlpha = 0.3; else ctx.globalAlpha = 1; }
            drawBall(player.x, player.y, player.w, player.h, "#4488dd", player.face, sx, sy); ctx.globalAlpha = 1;
        }
        // Particles
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i]; ctx.globalAlpha = p.life; ctx.fillStyle = p.c;
            ctx.fillRect(p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
        } ctx.globalAlpha = 1;
        ctx.restore();
    }
    function drawPlat(p, body, top) {
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, p.h, 4); ctx.fill();
        ctx.fillStyle = top; ctx.fillRect(p.x + 1, p.y, p.w - 2, 3);
    }
    function drawSpike(s) {
        ctx.fillStyle = "#dd2233"; ctx.beginPath();
        if (s.ceil) { ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + s.w / 2, s.y + s.h); ctx.lineTo(s.x + s.w, s.y); }
        else { ctx.moveTo(s.x, s.y + s.h); ctx.lineTo(s.x + s.w / 2, s.y); ctx.lineTo(s.x + s.w, s.y + s.h); }
        ctx.fill();
    }
    function drawBall(x, y, w, h, col, face, sx, sy) {
        ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(sx, sy);
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, w / 2 + 1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 1; ctx.stroke();
        // Eyes
        if (face === "normal") {
            ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(-3, -2, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(3, -2, 1.5, 0, Math.PI * 2); ctx.fill();
        }
        else if (face === "scared") {
            ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(-3, -2, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(3, -2, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(0, 4, 2, 0, Math.PI * 2); ctx.fill();
        }
        else if (face === "dead") {
            ctx.strokeStyle = "#222"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(-1, 0); ctx.moveTo(-1, -4); ctx.lineTo(-5, 0); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(1, -4); ctx.lineTo(5, 0); ctx.moveTo(5, -4); ctx.lineTo(1, 0); ctx.stroke();
        }
        ctx.restore();
    }
    // Game loop
    var lastT = 0;
    function loop(ts) { var dt = (ts - lastT) / 1000; if (dt > 0.1) dt = 0.1; lastT = ts; update(dt); render(); requestAnimationFrame(loop); }
    // Public API
    window.Game = {
        start: function () {
            $ss.classList.add("hidden"); deaths = 0; curLvl = 0; isBonus = false; fakeWinShown = false;
            lvlTime = 0; totalTime = 0; gravFlip = false; msgUsed = []; $dc.textContent = "0"; $ln.textContent = "1"; showLvlTitle(0);
            MusicManager.play();
        },
        restart: function () {
            $ws.classList.add("hidden"); $fws.classList.add("hidden"); $bo.classList.remove("active");
            $td.classList.add("hidden"); deaths = 0; curLvl = 0; isBonus = false; fakeWinShown = false; lvlTime = 0; totalTime = 0;
            gravFlip = false; particles = []; bombs = []; explosions = []; dustP = []; jumpFx = []; msgUsed = [];
            $dc.textContent = "0"; $ln.textContent = "1"; showLvlTitle(0);
            MusicManager.play();
        },
        continueGame: function () {
            var savedLvl = parseInt(loadFromLS('trollparkur_level')) || 0;
            var savedDeaths = parseInt(loadFromLS('trollparkur_deaths')) || 0;
            document.getElementById('continue-screen').classList.add('hidden');
            deaths = savedDeaths; curLvl = savedLvl; isBonus = false; fakeWinShown = false;
            lvlTime = 0; totalTime = 0; gravFlip = false; msgUsed = [];
            $dc.textContent = String(deaths); $ln.textContent = String(curLvl + 1);
            showLvlTitle(curLvl);
            MusicManager.play();
        },
        freshStart: function () {
            clearSave();
            document.getElementById('continue-screen').classList.add('hidden');
            deaths = 0; curLvl = 0; isBonus = false; fakeWinShown = false;
            lvlTime = 0; totalTime = 0; gravFlip = false; msgUsed = [];
            $dc.textContent = "0"; $ln.textContent = "1"; showLvlTitle(0);
            MusicManager.play();
        },
        resetProgress: function () {
            if (confirm('EMIN MISIN? TUM ILERLEME SILINECEK')) {
                clearSave();
                $ws.classList.add('hidden'); $fws.classList.add('hidden'); $bo.classList.remove('active');
                $td.classList.add('hidden');
                deaths = 0; curLvl = 0; isBonus = false; fakeWinShown = false;
                lvlTime = 0; totalTime = 0; gravFlip = false;
                particles = []; bombs = []; explosions = []; dustP = []; jumpFx = []; msgUsed = [];
                $dc.textContent = '0'; $ln.textContent = '1';
                state = 'start'; $ss.classList.remove('hidden');
            }
        }
    };
    canvas.width = CW; canvas.height = CH;
    ctx.fillStyle = "#f8f8f8"; ctx.fillRect(0, 0, CW, CH);
    // Init save system
    (function initSaveSystem() {
        var cs = document.getElementById('continue-screen');
        if (cs && hasSave()) {
            var savedLvl = parseInt(loadFromLS('trollparkur_level')) || 0;
            var savedDeaths = parseInt(loadFromLS('trollparkur_deaths')) || 0;
            document.getElementById('continue-level').textContent = 'LEVEL ' + (savedLvl + 1) + "'TEN DEVAM";
            document.getElementById('continue-deaths').textContent = 'TOPLAM OLUM: ' + savedDeaths;
            var troll = document.getElementById('continue-troll');
            if (savedDeaths < 20) troll.textContent = 'HOS GELDIN GERI 😈';
            else if (savedDeaths <= 50) troll.textContent = 'HALA MI DEVAM EDIYORSUN?';
            else troll.textContent = 'SEN BIR EFSANESIN. KOTU ANLAMDA.';
            $ss.classList.add('hidden'); cs.classList.remove('hidden');
        }
    })();
    MusicManager.init(); window.MusicManager = MusicManager;
    window.addEventListener('beforeunload', function () { if (state === 'playing' || state === 'dead') saveProgress(); });
    requestAnimationFrame(loop);
})();

