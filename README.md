<!DOCTYPE html>
<html>
<head>
    <title>Square Sumo - Particles Edition</title>
    <style>
        body { 
            display: flex; flex-direction: column; align-items: center; 
            background: #111; color: white; font-family: 'Papyrus', serif; 
            margin: 0; overflow: hidden; height: 100vh; justify-content: center;
        }
        canvas { 
            border: 8px solid #fff; background: #222; 
            box-shadow: 0 0 50px rgba(0,0,0,0.8); display: none; 
        }
        
        #menu, #map-selection, #mode-selection, #commands-screen, #custom-menu { 
            display: flex; flex-direction: column; gap: 20px; align-items: center; 
        }

        /* ESTILO DOS ÍCONES SOCIAIS */
        .social-menu {
            position: absolute;
            bottom: 30px;
            display: flex;
            gap: 25px;
            z-index: 10;
        }
        .social-icon {
            width: 55px;
            height: 55px;
            cursor: pointer;
            transition: 0.3s;
            background: white;
            border-radius: 12px;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            border: 2px solid transparent;
        }
        .social-icon:hover {
            transform: translateY(-5px) scale(1.1);
            border-color: #3498db;
            box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
        }
        .social-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* ESTILO DO MENU IN-GAME E FIM DE JOGO */
        #ingame-menu, #game-over {
            display: none;
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100;
            text-align: center;
        }

        .btn {
            width: 220px; padding: 15px; background: #3498db; color: white;
            text-align: center; border-radius: 8px; cursor: pointer;
            font-size: 24px; font-weight: bold; border: 3px solid #fff;
            user-select: none; transition: 0.2s;
            position: relative; overflow: hidden;
        }
        .btn:hover { 
            transform: scale(1.1); 
            filter: brightness(1.2);
            box-shadow: 0 0 20px rgba(255,255,255,0.4);
        }
        .btn:active { transform: scale(0.95); }

        .map-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
        .map-card {
            width: 120px; height: 120px; border: 4px solid #fff;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: #333; cursor: pointer; transition: 0.2s;
        }
        .map-card:hover:not(.map-locked) { border-color: #f1c40f; transform: translateY(-5px); }
        .map-locked { opacity: 0.4; cursor: not-allowed; background: #111; border-color: #555; }
        
        .arena-shake { animation: megaShake 0.1s linear infinite !important; }
        @keyframes megaShake {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-8px, 8px); }
            50% { transform: translate(8px, -8px); }
            100% { transform: translate(8px, 8px); }
        }

        .impact-vfx { filter: grayscale(100%) contrast(1000%) invert(1) !important; background: #fff !important; }
        .rainbow-bg { animation: rainbowAnim 0.3s linear infinite; }
        @keyframes rainbowAnim {
            0% { background: #ff0000; } 33% { background: #00ff00; } 66% { background: #0000ff; } 100% { background: #ff0000; }
        }

        .stats { display: none; gap: 40px; margin-bottom: 15px; font-size: 24px; font-weight: bold; }
        
        .color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .color-opt { width: 35px; height: 35px; border: 2px solid white; cursor: pointer; transition: 0.2s; }
        .color-opt:hover { transform: scale(1.2); border-color: #f1c40f; }
    </style>
</head>
<body id="mainBody">

    <div id="game-over">
        <h1 id="winner-text" style="font-size: 60px; color: #f1c40f; margin-bottom: 10px;">VENCEDOR!</h1>
        <div class="btn" onclick="playSound('ui'); restartGame()">JOGAR NOVAMENTE</div>
        <div class="btn" style="background:#c0392b; margin-top:10px" onclick="playSound('ui'); backToMenu()">MENU PRINCIPAL</div>
    </div>

    <div id="ingame-menu">
        <h2 style="font-size: 40px;">PAUSADO</h2>
        <div class="btn" onclick="playSound('ui'); resumeGame()">CONTINUAR</div>
        <div class="btn" style="background:#c0392b; margin-top:10px" onclick="playSound('ui'); backToMenu()">MENU PRINCIPAL</div>
    </div>

    <div id="menu">
        <h1 style="font-size: 60px; margin-bottom: 20px;">Square Sumo</h1>
        <div class="btn" onclick="playSound('ui'); showMaps()">JOGAR</div>
        <div class="btn" style="background:#2ecc71" onclick="playSound('ui'); showCustom()">CUSTOMIZAR</div>
        <div class="btn" style="background:#e67e22" onclick="playSound('ui'); showCommands()">COMANDOS</div>

        <div class="social-menu">
            <a href="https://www.tiktok.com/@o_embananado?lang=pt-BR" target="_blank" class="social-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok">
            </a>
            <a href="https://x.com/oembananado" target="_blank" class="social-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="X">
            </a>
            <a href="https://www.youtube.com/@o_embananado" target="_blank" class="social-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube">
            </a>
        </div>
    </div>

    <div id="custom-menu" style="display:none">
        <h2>PERSONALIZAR PLAYER</h2>
        <input type="text" id="nickInput" placeholder="SEU NICK" maxlength="10" 
               style="padding: 12px; font-size: 20px; border-radius: 8px; border: 3px solid #fff; text-align: center; background: #222; color: white;">
        
        <div id="preview-box" style="width: 70px; height: 70px; background: #3498db; border: 4px solid white; margin: 10px 0;"></div>
        
        <div class="color-grid">
            <div class="color-opt" onclick="playSound('ui'); changeColor('#3498db')" style="background:#3498db"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#2ecc71')" style="background:#2ecc71"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#e74c3c')" style="background:#e74c3c"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#f1c40f')" style="background:#f1c40f"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#9b59b6')" style="background:#9b59b6"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#e67e22')" style="background:#e67e22"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#1abc9c')" style="background:#1abc9c"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#ffffff')" style="background:#ffffff"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#34495e')" style="background:#34495e"></div>
            <div class="color-opt" onclick="playSound('ui'); changeColor('#ff69b4')" style="background:#ff69b4"></div>
        </div>
        <div class="btn" onclick="playSound('ui'); saveCustom()">CONFIRMAR</div>
    </div>

    <div id="map-selection" style="display:none">
        <h2>ESCOLHA O MAPA</h2>
        <div class="map-grid">
            <div class="map-card" onclick="playSound('ui'); selectMap('arena')">
                <div style="width:30px; height:30px; background:#444; border:1px solid white; margin-bottom:5px"></div>
                <span>ARENA</span>
            </div>
            <div class="map-card" onclick="playSound('ui'); selectMap('deserto')" style="background: #c2a13e;">
                <div style="width:50px; height:15px; background:#e3c36d; border:1px solid white; margin-bottom:5px"></div>
                <span>DESERTO</span>
            </div>
            <div class="map-card map-locked"><span>🔒</span></div>
        </div>
        <div class="btn" style="background:#c0392b; margin-top:20px" onclick="playSound('ui'); showMenu()">VOLTAR</div>
    </div>

    <div id="mode-selection" style="display:none">
        <h2>MODO DE JOGO</h2>
        <div id="mode-title" style="font-size: 18px; color: #f1c40f;">MAPA: ARENA</div>
        <div class="btn" onclick="playSound('ui'); startWithMode('pvp')">JxJ (Player 2)</div>
        <div class="btn" style="background:#8e44ad" onclick="playSound('ui'); startWithMode('pve')">JxB (Bot)</div>
        <div class="btn" style="background:#c0392b" onclick="playSound('ui'); showMaps()">VOLTAR</div>
    </div>

    <div id="commands-screen" style="display:none">
        <h2>CONTROLES</h2>
        <p>P1: <b>W, A, S, D</b> | P2: <b>SETAS</b></p>
        <p>ESC: <b>MENU PAUSE</b></p>
        <p>🌀 Areia Atordoante exclusiva do Deserto!</p>
        <p>🌈 Rainbow (R): Super Força | 💣 Bomba (B): Explode o oponente</p>
        <div class="btn" onclick="playSound('ui'); showMenu()">VOLTAR</div>
    </div>

    <div class="stats" id="stats">
        <div id="p1-label" style="color: #3498db;">P1: <span id="p1-lives">5</span></div>
        <div style="color: #e74c3c;" id="p2-label">P2: <span id="p2-lives">5</span></div>
    </div>
    <canvas id="gameCanvas"></canvas>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const body = document.getElementById('mainBody');
        const keys = {};

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playSound(type) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;
            if (type === 'hit') {
                osc.type = 'square'; osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
                gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(); osc.stop(now + 0.1);
            } else if (type === 'ui') {
                osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
                gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(); osc.stop(now + 0.05);
            } else if (type === 'damage') {
                osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(10, now + 0.3);
                gain.gain.setValueAtTime(0.4, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(); osc.stop(now + 0.3);
            } else if (type === 'powerup') {
                osc.type = 'triangle'; osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
                gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(); osc.stop(now + 0.2);
            }
        }

        let gameRunning = false, isPvP = false, rainbowActive = 0, powerUps = [], quicksands = [], p1, p2;
        let isPaused = false;
        let currentMap = 'arena';
        let particles = [];
        let p1ColorChosen = '#3498db';
        let p1NickChosen = 'P1';
        let currentMode = 'pvp';

        class Particle {
            constructor(x, y, color) {
                this.x = x; this.y = y; this.size = Math.random() * 4 + 2;
                this.color = color; this.vx = (Math.random() - 0.5) * 10;
                this.vy = (Math.random() - 0.5) * 10; this.gravity = 0.2; this.alpha = 1;
            }
            update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravity; this.alpha -= 0.02; }
            draw() {
                ctx.save(); ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }

        function createExplosion(x, y, color, count = 8) {
            for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color));
        }

        function spawnPowerUp() {
            if (!gameRunning || isPaused) { setTimeout(spawnPowerUp, 1000); return; }
            const size = 25;
            powerUps.push({
                x: 50 + Math.random() * (canvas.width - 100),
                y: 50 + Math.random() * (canvas.height - 100),
                size: size, type: Math.random() > 0.5 ? 'rainbow' : 'bomb'
            });
            setTimeout(spawnPowerUp, 5000 + Math.random() * 5000); 
        }

        window.addEventListener('keydown', e => {
            keys[e.key.toLowerCase()] = true;
            if(e.key === "Escape" && gameRunning && !document.getElementById('game-over').style.display.includes('flex')) {
                playSound('ui'); togglePause();
            }
        });
        window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

        function togglePause() {
            isPaused = !isPaused;
            document.getElementById('ingame-menu').style.display = isPaused ? 'flex' : 'none';
            if (!isPaused) gameLoop();
        }

        function resumeGame() {
            isPaused = false;
            document.getElementById('ingame-menu').style.display = 'none';
            gameLoop();
        }

        function showMenu() { hideAll(); document.getElementById('menu').style.display = 'flex'; }
        function showMaps() { hideAll(); document.getElementById('map-selection').style.display = 'flex'; }
        function showCommands() { hideAll(); document.getElementById('commands-screen').style.display = 'flex'; }
        function showCustom() { hideAll(); document.getElementById('custom-menu').style.display = 'flex'; }
        
        function hideAll() { 
            ['menu', 'map-selection', 'mode-selection', 'commands-screen', 'custom-menu', 'ingame-menu', 'game-over'].forEach(id => {
                if(document.getElementById(id)) document.getElementById(id).style.display = 'none';
            }); 
        }

        function changeColor(color) {
            p1ColorChosen = color;
            document.getElementById('preview-box').style.backgroundColor = color;
        }

        function saveCustom() {
            let input = document.getElementById('nickInput').value;
            if(input.trim() !== "") p1NickChosen = input.toUpperCase();
            showMenu();
        }

        function selectMap(map) {
            currentMap = map;
            hideAll();
            document.getElementById('mode-title').innerText = "MAPA: " + map.toUpperCase();
            document.getElementById('mode-selection').style.display = 'flex';
            if (map === 'deserto') {
                canvas.width = 1200; canvas.height = 500;
                canvas.style.backgroundColor = "#d4b35e"; canvas.style.borderColor = "#8c6d1a";
            } else {
                canvas.width = 800; canvas.height = 600;
                canvas.style.backgroundColor = "#222"; canvas.style.borderColor = "#fff";
            }
        }

        function spawnFixedTraps() {
            quicksands = [];
            if (currentMap === 'deserto') {
                for(let i=0; i<3; i++) {
                    quicksands.push({
                        x: 300 + Math.random() * (canvas.width - 600),
                        y: 150 + Math.random() * (canvas.height - 300),
                        r: 45 + Math.random() * 20
                    });
                }
            }
        }

        function startWithMode(mode) {
            currentMode = mode;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            isPvP = (mode === 'pvp');
            powerUps = []; 
            document.getElementById('p1-label').style.color = p1ColorChosen;
            document.getElementById('p1-label').innerHTML = p1NickChosen + ": <span id='p1-lives'>5</span>";
            document.getElementById('p2-label').innerHTML = isPvP ? "P2: <span id='p2-lives'>5</span>" : "BOT: <span id='p2-lives'>5</span>";
            
            hideAll(); canvas.style.display = 'block'; document.getElementById('stats').style.display = 'flex';
            
            spawnFixedTraps(); 
            spawnPowerUp(); 
            
            p1 = new Player(100, canvas.height/2, p1ColorChosen, false, {up:'w', down:'s', left:'a', right:'d'}, p1NickChosen);
            p2 = new Player(canvas.width-150, canvas.height/2, '#e74c3c', !isPvP, {up:'arrowup', down:'arrowdown', left:'arrowleft', right:'arrowright'}, isPvP ? "P2" : "BOT");
            
            gameRunning = true; isPaused = false; rainbowActive = 0;
            body.classList.remove('rainbow-bg', 'arena-shake');
            gameLoop();
        }

        function restartGame() {
            hideAll();
            startWithMode(currentMode);
        }

        function backToMenu() {
            gameRunning = false;
            hideAll();
            canvas.style.display = 'none';
            document.getElementById('stats').style.display = 'none';
            body.classList.remove('rainbow-bg', 'arena-shake');
            showMenu();
        }

        class Player {
            constructor(x, y, color, isBot, controls, nick) {
                this.x = x; this.y = y; this.size = 35; this.color = color;
                this.vx = 0; this.vy = 0; this.lives = 5; 
                this.isBot = isBot; this.controls = controls; this.nick = nick;
                this.accel = 0.3; this.friction = 0.96; this.invulnerable = 0;
                this.hasPower = false; this.bombTimer = 0; this.isExpelled = false;
                this.trail = [];
            }
            draw() {
                if (this.hasPower || this.isExpelled) {
                    this.trail.forEach((t, i) => {
                        ctx.fillStyle = this.isExpelled ? `rgba(255, 0, 0, ${i/15})` : `hsla(${Date.now()/3 + (i*25)}, 100%, 50%, ${i/12})`;
                        ctx.fillRect(t.x, t.y, this.size, this.size);
                    });
                }
                if (this.invulnerable > 0 && Math.floor(Date.now() / 50) % 2 === 0) ctx.globalAlpha = 0.3;
                ctx.fillStyle = (this.bombTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) ? "white" : this.color;
                if (this.hasPower) { ctx.shadowBlur = 30; ctx.shadowColor = "white"; }
                ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
                ctx.fillStyle = "white"; ctx.font = "bold 16px Papyrus"; ctx.textAlign = "center";
                ctx.fillText(this.nick, this.x + this.size/2, this.y - 12);
            }
            update(target) {
                let f = this.friction;
                quicksands.forEach(qs => {
                    let dx = (this.x + this.size/2) - qs.x;
                    let dy = (this.y + this.size/2) - qs.y;
                    if (Math.sqrt(dx*dx + dy*dy) < qs.r) f = 0.76;
                });
                if (!this.isExpelled) {
                    if (this.isBot) {
                        let ms = this.hasPower ? 0.35 : 0.18;
                        if (this.x < target.x) this.vx += ms; if (this.x > target.x) this.vx -= ms;
                        if (this.y < target.y) this.vy += ms; if (this.y > target.y) this.vy -= ms;
                    } else {
                        if (keys[this.controls.up]) this.vy -= this.accel;
                        if (keys[this.controls.down]) this.vy += this.accel;
                        if (keys[this.controls.left]) this.vx -= this.accel;
                        if (keys[this.controls.right]) this.vx += this.accel;
                    }
                }
                this.x += this.vx; this.y += this.vy;
                this.vx *= f; this.vy *= f;
                this.trail.push({x: this.x, y: this.y}); if (this.trail.length > 15) this.trail.shift();
                if (this.invulnerable > 0) this.invulnerable--;
                if (this.hasPower) {
                    rainbowActive--;
                    if(rainbowActive <= 0) { this.hasPower = false; body.classList.remove('rainbow-bg', 'arena-shake'); }
                }
                if (this.bombTimer > 0) { this.bombTimer--; if (this.bombTimer <= 0) explodeBomb(this, target); }

                for (let i = powerUps.length - 1; i >= 0; i--) {
                    let p = powerUps[i];
                    if (this.x < p.x + p.size && this.x + this.size > p.x && this.y < p.y + p.size && this.y + this.size > p.y) {
                        playSound('powerup');
                        if (p.type === 'rainbow') activateRainbow(this);
                        else this.bombTimer = 200;
                        powerUps.splice(i, 1); createExplosion(p.x, p.y, "white", 10);
                    }
                }
                let wallColor = currentMap === 'deserto' ? '#8c6d1a' : '#ffffff';
                if (this.x < 0 || this.x + this.size > canvas.width) {
                    playSound('hit'); createExplosion(this.x < 0 ? 0 : canvas.width, this.y + this.size/2, wallColor);
                    this.vx *= this.isExpelled ? -1.15 : -1; this.x = this.x < 0 ? 0 : canvas.width - this.size;
                }
                if (this.y < 0 || this.y + this.size > canvas.height) {
                    playSound('hit'); createExplosion(this.x + this.size/2, this.y < 0 ? 0 : canvas.height, wallColor);
                    this.vy *= this.isExpelled ? -1.15 : -1; this.y = this.y < 0 ? 0 : canvas.height - this.size;
                }
                if (this.invulnerable === 0) {
                    if (currentMap === 'deserto') {
                        let dist = Math.sqrt((this.x + this.size/2 - canvas.width/2)**2 + (this.y + this.size/2 - canvas.height/2)**2);
                        if (dist < 75) this.takeDamage();
                    } else {
                        [{x:0, y:0}, {x:canvas.width-50, y:0}, {x:0, y:canvas.height-50}, {x:canvas.width-50, y:canvas.height-50}].forEach(h => {
                            if (this.x < h.x + 50 && this.x + this.size > h.x && this.y < h.y + 50 && this.y + this.size > h.y) this.takeDamage();
                        });
                    }
                }
            }
            takeDamage() {
                playSound('damage'); this.lives--; this.invulnerable = 90; 
                this.x = (this.color === p1ColorChosen ? 100 : canvas.width-150);
                this.y = canvas.height/2; this.vx = 0; this.vy = 0; this.isExpelled = false; this.hasPower = false;
                createExplosion(this.x, this.y, "red", 20); triggerImpact(true);
            }
        }

        function activateRainbow(player) { player.hasPower = true; rainbowActive = 300; body.classList.add('rainbow-bg', 'arena-shake'); }
        function explodeBomb(player, enemy) {
            playSound('damage'); triggerImpact(true); enemy.isExpelled = true; 
            createExplosion(enemy.x, enemy.y, "orange", 15);
            let dx = enemy.x - player.x; let dy = enemy.y - player.y;
            enemy.vx = dx > 0 ? 30 : -30; enemy.vy = dy > 0 ? 30 : -30;
            setTimeout(() => { enemy.isExpelled = false; }, 3000);
        }
        function triggerImpact(isMajor) {
            if (isMajor || Math.random() < 0.3) {
                body.classList.remove('impact-vfx'); void body.offsetWidth; body.classList.add('impact-vfx');
                setTimeout(() => body.classList.remove('impact-vfx'), 100);
            }
            body.classList.add('arena-shake');
            setTimeout(() => { if (rainbowActive <= 0) body.classList.remove('arena-shake'); }, 150);
        }

        function checkCollision() {
            if (p1.x < p2.x + p2.size && p1.x + p1.size > p2.x && p1.y < p2.y + p2.size && p1.y + p1.size > p2.y) {
                playSound('hit');
                let dx = (p1.x + p1.size/2) - (p2.x + p2.size/2);
                let dy = (p1.y + p1.size/2) - (p2.y + p2.size/2);
                let impactForce = (p1.hasPower || p2.hasPower) ? 60 : 22;
                let midX = (p1.x + p2.x) / 2; let midY = (p1.y + p2.y) / 2;
                createExplosion(midX, midY, p1.color, 5); createExplosion(midX, midY, p2.color, 5);
                if (Math.abs(dx) > Math.abs(dy)) { 
                    p1.vx = dx > 0 ? impactForce : -impactForce; p2.vx = dx > 0 ? -impactForce : impactForce; 
                } else { 
                    p1.vy = dy > 0 ? impactForce : -impactForce; p2.vy = dy > 0 ? -impactForce : impactForce; 
                }
                triggerImpact(false);
            }
        }

        function gameLoop() {
            if (!gameRunning || isPaused) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (currentMap === 'deserto') {
                ctx.fillStyle = "rgba(60, 45, 10, 0.7)";
                quicksands.forEach(qs => {
                    ctx.beginPath(); ctx.arc(qs.x, qs.y, qs.r + Math.sin(Date.now()/300)*5, 0, Math.PI*2); ctx.fill();
                });
                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 90, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 70, 0, Math.PI*2); ctx.fill();
            } else {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 50, 50); ctx.fillRect(canvas.width-50, 0, 50, 50);
                ctx.fillRect(0, canvas.height-50, 50, 50); ctx.fillRect(canvas.width-50, canvas.height-50, 50, 50);
            }
            powerUps.forEach(p => {
                ctx.fillStyle = p.type === 'rainbow' ? '#f1c40f' : '#e74c3c';
                ctx.shadowBlur = 15; ctx.shadowColor = ctx.fillStyle;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                ctx.shadowBlur = 0; ctx.fillStyle = "white"; ctx.font = "bold 15px Arial";
                ctx.fillText(p.type === 'rainbow' ? "R" : "B", p.x + 12, p.y + 18);
            });
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update(); particles[i].draw();
                if (particles[i].alpha <= 0) particles.splice(i, 1);
            }
            p1.update(p2); p2.update(p1); checkCollision();
            p1.draw(); p2.draw();
            document.getElementById('p1-lives').innerText = p1.lives;
            document.getElementById('p2-lives').innerText = p2.lives;
            
            if (p1.lives <= 0 || p2.lives <= 0) {
                gameRunning = false;
                playSound('damage');
                document.getElementById('winner-text').innerText = (p1.lives <= 0 ? p2.nick : p1.nick) + " VENCEU!";
                document.getElementById('game-over').style.display = 'flex';
            } else { requestAnimationFrame(gameLoop); }
        }
    </script>
</body>
</html>
