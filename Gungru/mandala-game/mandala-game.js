// ========================================
// Sacred Sands — Main Game Controller
// Ties together sand engine, teachings, and UI
// ========================================

(function() {
    'use strict';

    // ======================================== Game State ========================================
    const state = {
        phase: 'start',           // start, intention, consecration, game, dissolution, completion
        intention: null,          // healing, compassion, peace, wisdom
        mandalaType: null,        // medicine-buddha, chenrezig, amitayus, kalachakra
        currentLayer: 1,
        totalLayers: 5,
        layerProgress: 0,         // 0-100% progress in current layer
        unlockedColors: ['white'],
        activeColor: 'white',
        merit: 0,
        totalGrains: 0,
        mindfulnessHistory: [],
        lampsLit: 0,
        lastTeachingTip: 0,       // timestamp of last random tip
        savedMandalas: JSON.parse(localStorage.getItem('sacredSands_gallery') || '[]'),
        completedMandalas: parseInt(localStorage.getItem('sacredSands_completed') || '0')
    };

    // Layer names
    const LAYER_NAMES = {
        1: 'Central Seed',
        2: 'Inner Palace',
        3: 'Four Gates',
        4: 'Outer Rings',
        5: 'Fire Ring'
    };

    // Colors unlocked per layer
    const LAYER_UNLOCKS = {
        2: 'blue',
        3: 'yellow',
        4: 'red',
        5: 'green'
    };

    // Layer grain thresholds (approximate grains needed to complete a layer)
    const LAYER_THRESHOLDS = {
        1: 5000,
        2: 15000,
        3: 25000,
        4: 35000,
        5: 20000
    };

    // Mandala display names
    const MANDALA_NAMES = {
        'medicine-buddha': 'Medicine Buddha Mandala',
        'chenrezig': 'Chenrezig Mandala',
        'amitayus': 'Amitayus Mandala',
        'kalachakra': 'Kalachakra Mandala'
    };

    // ======================================== DOM References ========================================
    const $ = id => document.getElementById(id);
    const screens = {
        start: $('startScreen'),
        intention: $('intentionScreen'),
        consecration: $('consecrationScreen'),
        game: $('gameScreen'),
        dissolution: $('dissolutionScreen'),
        completion: $('completionScreen')
    };

    // ======================================== Sand Engine ========================================
    let sandRenderer = null;
    let riverAnim = null;

    // ======================================== Screen Transitions ========================================
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('game-screen--active'));
        if (screens[name]) {
            screens[name].classList.add('game-screen--active');
        }
        state.phase = name;
    }

    // ======================================== Phase 0: Start ========================================
    $('startBtn').addEventListener('click', () => {
        showScreen('intention');
    });

    // ======================================== Phase 1: Intention ========================================
    document.querySelectorAll('.intention-card').forEach(card => {
        card.addEventListener('click', () => {
            state.intention = card.dataset.intention;
            state.mandalaType = card.dataset.mandala;
            showScreen('consecration');
            initConsecration();
        });
    });

    // ======================================== Phase 2: Consecration ========================================
    function initConsecration() {
        state.lampsLit = 0;

        // Draw a simple platform on the consecration canvas
        const canvas = $('consecrateCanvas');
        const ctx = canvas.getContext('2d');
        const size = canvas.width;

        ctx.clearRect(0, 0, size, size);

        // Draw concentric circles
        ctx.strokeStyle = 'rgba(212, 168, 67, 0.15)';
        ctx.lineWidth = 1;
        [0.9, 0.7, 0.5, 0.3, 0.15].forEach(r => {
            ctx.beginPath();
            ctx.arc(size/2, size/2, (size/2) * r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Cross lines
        ctx.beginPath();
        ctx.moveTo(size/2, 20);
        ctx.lineTo(size/2, size - 20);
        ctx.moveTo(20, size/2);
        ctx.lineTo(size - 20, size/2);
        ctx.stroke();

        // Setup lamp click handlers
        document.querySelectorAll('.lamp').forEach(lamp => {
            lamp.onclick = () => {
                if (lamp.dataset.lit === 'true') return;
                lamp.dataset.lit = 'true';
                state.lampsLit++;

                // Draw glow on canvas for this direction
                const dir = lamp.dataset.dir;
                const positions = {
                    north: [size/2, size * 0.15],
                    east:  [size * 0.85, size/2],
                    south: [size/2, size * 0.85],
                    west:  [size * 0.15, size/2]
                };
                const [gx, gy] = positions[dir];

                const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, 60);
                gradient.addColorStop(0, 'rgba(255, 180, 50, 0.15)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(gx, gy, 60, 0, Math.PI * 2);
                ctx.fill();

                // All 4 lit? Proceed after brief delay
                if (state.lampsLit >= 4) {
                    setTimeout(() => {
                        showScreen('game');
                        initGame();
                    }, 1200);
                }
            };
        });
    }

    // ======================================== Phase 3: Main Game ========================================
    function initGame() {
        const canvas = $('mandalaCanvas');
        sandRenderer = new SandEngine.SandRenderer(canvas);

        // Set mandala name
        $('mandalaName').textContent = MANDALA_NAMES[state.mandalaType] || 'Sand Mandala';
        $('currentLayer').textContent = state.currentLayer;
        $('totalLayers').textContent = state.totalLayers;
        $('layerName').textContent = LAYER_NAMES[state.currentLayer];

        // Draw initial guides
        sandRenderer.drawGuides(state.mandalaType, state.currentLayer);

        // Setup canvas interaction
        setupCanvasInput(canvas);

        // Setup palette
        setupPalette();

        // Setup HUD buttons
        $('teachingBtn').onclick = () => showRandomTeaching();
        $('settingsBtn').onclick = () => showLayerTeaching();

        // Show initial teaching
        setTimeout(() => {
            showTeachingModal(Teachings.getLayerTeaching(1));
        }, 800);

        // Start mindfulness tracking
        startMindfulnessTracking();

        // Start tip timer
        state.lastTeachingTip = Date.now();
    }

    function setupCanvasInput(canvas) {
        const wrapper = $('canvasWrapper');
        const cursor = $('chakpurCursor');

        function getCanvasPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function onPointerDown(e) {
            e.preventDefault();
            const pos = getCanvasPos(e);
            sandRenderer.startPour(pos.x, pos.y);
        }

        function onPointerMove(e) {
            e.preventDefault();
            const pos = getCanvasPos(e);

            // Update cursor position
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            cursor.style.left = clientX + 'px';
            cursor.style.top = clientY + 'px';
            cursor.style.display = 'block';

            if (sandRenderer.isPouring) {
                sandRenderer.updatePour(pos.x, pos.y);
                trackGrains();
            }
        }

        function onPointerUp(e) {
            e.preventDefault();
            sandRenderer.stopPour();
        }

        // Mouse events
        canvas.addEventListener('mousedown', onPointerDown);
        canvas.addEventListener('mousemove', onPointerMove);
        canvas.addEventListener('mouseup', onPointerUp);
        canvas.addEventListener('mouseleave', () => {
            sandRenderer.stopPour();
            cursor.style.display = 'none';
        });
        canvas.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
        });

        // Touch events
        canvas.addEventListener('touchstart', onPointerDown, { passive: false });
        canvas.addEventListener('touchmove', onPointerMove, { passive: false });
        canvas.addEventListener('touchend', onPointerUp, { passive: false });
        canvas.addEventListener('touchcancel', () => sandRenderer.stopPour());
    }

    function setupPalette() {
        const palette = $('sandPalette');
        const colors = palette.querySelectorAll('.sand-color');

        colors.forEach(btn => {
            btn.addEventListener('click', () => {
                const colorName = btn.dataset.color;
                if (btn.classList.contains('sand-color--locked')) {
                    // Show which layer unlocks this
                    const family = Teachings.getBuddhaFamily(colorName);
                    if (family) {
                        showToast(`${family.color} sand unlocks at Layer ${getUnlockLayer(colorName)}`);
                    }
                    return;
                }

                // Deactivate all, activate this one
                colors.forEach(c => c.classList.remove('sand-color--active'));
                btn.classList.add('sand-color--active');
                state.activeColor = colorName;
                sandRenderer.setColor(colorName);
            });
        });

        // Brush size
        $('brushSize').addEventListener('input', (e) => {
            sandRenderer.setFlowRate(parseInt(e.target.value));
        });
    }

    function getUnlockLayer(color) {
        for (const [layer, c] of Object.entries(LAYER_UNLOCKS)) {
            if (c === color) return layer;
        }
        return '?';
    }

    function unlockColor(colorName) {
        if (state.unlockedColors.includes(colorName)) return;
        state.unlockedColors.push(colorName);

        // Update palette UI
        const btn = document.querySelector(`.sand-color[data-color="${colorName}"]`);
        if (btn) {
            btn.classList.remove('sand-color--locked');
            const lock = btn.querySelector('.lock-icon');
            if (lock) lock.remove();
        }

        // Show unlock modal
        const family = Teachings.getBuddhaFamily(colorName);
        if (family) {
            showUnlockModal(family);
        }
    }

    // ======================================== Grain & Layer Tracking ========================================
    let lastGrainCheck = 0;

    function trackGrains() {
        const now = Date.now();
        if (now - lastGrainCheck < 200) return; // Check every 200ms
        lastGrainCheck = now;

        state.totalGrains = sandRenderer.totalGrains;

        // Calculate layer progress
        const threshold = LAYER_THRESHOLDS[state.currentLayer] || 20000;
        const prevThreshold = state.currentLayer > 1 ?
            Object.values(LAYER_THRESHOLDS).slice(0, state.currentLayer - 1).reduce((a, b) => a + b, 0) : 0;
        const layerGrains = state.totalGrains - prevThreshold;
        state.layerProgress = Math.min(100, (layerGrains / threshold) * 100);

        // Update merit (mindfulness-weighted)
        const mindfulness = sandRenderer.getMindfulness();
        const meritGain = (mindfulness / 100) * 0.1;
        state.merit += meritGain;
        $('meritCount').textContent = Math.floor(state.merit);

        // Check layer completion
        if (state.layerProgress >= 100 && state.currentLayer < state.totalLayers) {
            advanceLayer();
        } else if (state.layerProgress >= 100 && state.currentLayer >= state.totalLayers) {
            completeMandala();
        }

        // Show random tip every 2 minutes of active play
        if (now - state.lastTeachingTip > 120000 && sandRenderer.isPouring) {
            state.lastTeachingTip = now;
            showRandomTeaching();
        }
    }

    function advanceLayer() {
        state.currentLayer++;
        state.layerProgress = 0;

        // Update HUD
        $('currentLayer').textContent = state.currentLayer;
        $('layerName').textContent = LAYER_NAMES[state.currentLayer];

        // Update layer dots
        document.querySelectorAll('.layer-dot').forEach((dot, i) => {
            dot.classList.remove('layer-dot--active', 'layer-dot--complete');
            if (i + 1 < state.currentLayer) dot.classList.add('layer-dot--complete');
            if (i + 1 === state.currentLayer) dot.classList.add('layer-dot--active');
        });

        // Update guide lines
        sandRenderer.drawGuides(state.mandalaType, state.currentLayer);

        // Unlock new color?
        const unlockColor = LAYER_UNLOCKS[state.currentLayer];
        if (unlockColor) {
            setTimeout(() => {
                unlockColorFn(unlockColor);
            }, 500);
        } else {
            // Show layer teaching
            const teaching = Teachings.getLayerTeaching(state.currentLayer);
            if (teaching) {
                setTimeout(() => showTeachingModal(teaching), 500);
            }
        }
    }

    function unlockColorFn(colorName) {
        if (state.unlockedColors.includes(colorName)) return;
        state.unlockedColors.push(colorName);

        // Update palette UI
        const btn = document.querySelector(`.sand-color[data-color="${colorName}"]`);
        if (btn) {
            btn.classList.remove('sand-color--locked');
            const lock = btn.querySelector('.lock-icon');
            if (lock) lock.remove();
        }

        // Show unlock modal
        const family = Teachings.getBuddhaFamily(colorName);
        if (family) {
            showUnlockModal(family);
        }
    }

    function completeMandala() {
        // Save screenshot before dissolution
        const screenshot = sandRenderer.toDataURL();
        state.savedMandalas.push({
            type: state.mandalaType,
            intention: state.intention,
            date: new Date().toISOString(),
            merit: Math.floor(state.merit),
            grains: state.totalGrains,
            image: screenshot
        });
        localStorage.setItem('sacredSands_gallery', JSON.stringify(state.savedMandalas));

        // Show final layer teaching then move to dissolution
        const teaching = Teachings.getLayerTeaching(5);
        if (teaching) {
            showTeachingModal(teaching, () => {
                startDissolution(screenshot);
            });
        } else {
            startDissolution(screenshot);
        }
    }

    // ======================================== Mindfulness Tracking ========================================
    let mindfulnessInterval = null;

    function startMindfulnessTracking() {
        mindfulnessInterval = setInterval(() => {
            if (!sandRenderer) return;
            const mindfulness = sandRenderer.getMindfulness();
            state.mindfulnessHistory.push(mindfulness);
            $('mindfulnessFill').style.width = mindfulness + '%';

            // Color the bar based on mindfulness level
            const fill = $('mindfulnessFill');
            if (mindfulness > 70) {
                fill.style.background = 'linear-gradient(90deg, var(--gold-dim), var(--gold))';
            } else if (mindfulness > 40) {
                fill.style.background = 'linear-gradient(90deg, var(--maroon), var(--gold-dim))';
            } else {
                fill.style.background = 'var(--maroon)';
            }
        }, 500);
    }

    // ======================================== Dissolution ========================================
    function startDissolution(screenshot) {
        sandRenderer.stopRenderLoop();
        showScreen('dissolution');

        const canvas = $('dissolutionCanvas');
        const ctx = canvas.getContext('2d');

        // Size to match game canvas
        const size = Math.min(window.innerWidth - 48, 500);
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';

        // Draw the mandala screenshot
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size);

            // Setup dissolution interaction
            let dissolutionPhase = 'cut-vertical'; // cut-vertical, cut-horizontal, sweep
            let cuts = 0;

            canvas.onclick = (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (dissolutionPhase === 'cut-vertical') {
                    // Draw vertical cut line
                    ctx.beginPath();
                    ctx.moveTo(size / 2, 0);
                    ctx.lineTo(size / 2, size);
                    ctx.strokeStyle = 'rgba(212, 168, 67, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    dissolutionPhase = 'cut-horizontal';
                    showToast('Now draw the horizontal line...');
                } else if (dissolutionPhase === 'cut-horizontal') {
                    // Draw horizontal cut line
                    ctx.beginPath();
                    ctx.moveTo(0, size / 2);
                    ctx.lineTo(size, size / 2);
                    ctx.strokeStyle = 'rgba(212, 168, 67, 0.7)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    dissolutionPhase = 'sweep';
                    $('dissolutionActions').style.display = 'block';
                    startSweepAnimation(canvas, ctx, size);
                }
            };
        };
        img.src = screenshot;
    }

    function startSweepAnimation(canvas, ctx, size) {
        let progress = 0;
        const imageData = ctx.getImageData(0, 0, size, size);
        const bgR = 28, bgG = 20, bgB = 16;

        function sweep() {
            progress += 0.008;

            const data = imageData.data;
            const cx = size / 2;
            const cy = size / 2;

            // Sweep sand inward
            for (let i = 0; i < 2000; i++) {
                const x = Math.floor(Math.random() * size);
                const y = Math.floor(Math.random() * size);
                const idx = (y * size + x) * 4;

                // Skip background
                if (data[idx] === bgR && data[idx+1] === bgG && data[idx+2] === bgB) continue;

                const dx = cx - x;
                const dy = cy - y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 10) continue;

                // Chance to move inward increases with progress
                if (Math.random() < progress * 0.3) {
                    const nx = Math.round(x + dx * 0.05);
                    const ny = Math.round(y + dy * 0.05);
                    if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                        const nIdx = (ny * size + nx) * 4;
                        data[nIdx] = data[idx];
                        data[nIdx+1] = data[idx+1];
                        data[nIdx+2] = data[idx+2];
                        data[nIdx+3] = 255;
                    }
                    // Fade original
                    if (Math.random() < 0.5) {
                        // Blend toward gray
                        data[idx]   = Math.round(data[idx] * 0.95 + 128 * 0.05);
                        data[idx+1] = Math.round(data[idx+1] * 0.95 + 120 * 0.05);
                        data[idx+2] = Math.round(data[idx+2] * 0.95 + 110 * 0.05);
                    }
                }

                // Fade edges
                if (dist > size * 0.3 * (1 - progress)) {
                    if (Math.random() < 0.05) {
                        data[idx]   = bgR;
                        data[idx+1] = bgG;
                        data[idx+2] = bgB;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);

            if (progress < 1.5) {
                requestAnimationFrame(sweep);
            } else {
                // Dissolution complete
                setTimeout(() => {
                    showCompletion();
                }, 1000);
            }
        }

        requestAnimationFrame(sweep);
    }

    // ======================================== Completion ========================================
    function showCompletion() {
        showScreen('completion');

        // Calculate stats
        const avgMindfulness = state.mindfulnessHistory.length > 0 ?
            Math.round(state.mindfulnessHistory.reduce((a, b) => a + b, 0) / state.mindfulnessHistory.length) : 0;

        $('finalMerit').textContent = Math.floor(state.merit);
        $('finalGrains').textContent = state.totalGrains.toLocaleString();
        $('finalMindfulness').textContent = avgMindfulness + '%';

        // Save completion count
        state.completedMandalas++;
        localStorage.setItem('sacredSands_completed', state.completedMandalas.toString());

        // Start river animation
        const riverCanvas = $('riverCanvas');
        riverAnim = new SandEngine.RiverAnimation(riverCanvas);
        riverAnim.startAnimation();

        // New mandala button
        $('newMandalaBtn').onclick = () => {
            resetGame();
            showScreen('start');
        };
    }

    function resetGame() {
        // Clean up
        if (sandRenderer) {
            sandRenderer.destroy();
            sandRenderer = null;
        }
        if (riverAnim) {
            riverAnim.stop();
            riverAnim = null;
        }
        if (mindfulnessInterval) {
            clearInterval(mindfulnessInterval);
            mindfulnessInterval = null;
        }

        // Reset state
        state.currentLayer = 1;
        state.layerProgress = 0;
        state.unlockedColors = ['white'];
        state.activeColor = 'white';
        state.merit = 0;
        state.totalGrains = 0;
        state.mindfulnessHistory = [];
        state.lampsLit = 0;
        state.intention = null;
        state.mandalaType = null;

        // Reset UI
        $('meritCount').textContent = '0';
        $('currentLayer').textContent = '1';
        $('layerName').textContent = LAYER_NAMES[1];
        $('mindfulnessFill').style.width = '70%';

        // Reset lamps
        document.querySelectorAll('.lamp').forEach(lamp => {
            lamp.dataset.lit = 'false';
        });

        // Reset palette
        document.querySelectorAll('.sand-color').forEach(btn => {
            btn.classList.remove('sand-color--active');
            if (btn.dataset.color !== 'white') {
                btn.classList.add('sand-color--locked');
                if (!btn.querySelector('.lock-icon')) {
                    const lock = document.createElement('span');
                    lock.className = 'lock-icon';
                    lock.innerHTML = '&#128274;';
                    btn.appendChild(lock);
                }
            } else {
                btn.classList.add('sand-color--active');
            }
        });

        // Reset layer dots
        document.querySelectorAll('.layer-dot').forEach((dot, i) => {
            dot.classList.remove('layer-dot--active', 'layer-dot--complete');
            if (i === 0) dot.classList.add('layer-dot--active');
        });
    }

    // ======================================== Modals & UI ========================================
    function showTeachingModal(teaching, onClose) {
        if (!teaching) return;

        const modal = $('teachingModal');
        $('teachingIcon').innerHTML = teaching.icon;
        $('teachingTitle').textContent = teaching.title;
        $('teachingBody').innerHTML = teaching.body;
        modal.style.display = 'flex';

        const closeModal = () => {
            modal.style.display = 'none';
            if (onClose) onClose();
        };

        $('closeTeaching').onclick = closeModal;
        $('teachingContinue').onclick = closeModal;
        modal.querySelector('.modal-backdrop').onclick = closeModal;
    }

    function showUnlockModal(family) {
        const modal = $('unlockModal');
        $('unlockIcon').innerHTML = family.icon;
        $('unlockFamily').textContent = family.name + ' \u2014 ' + family.wisdom;
        $('unlockDesc').textContent = family.description;
        $('unlockDir').textContent = family.direction;
        $('unlockElement').textContent = family.element;
        $('unlockPoison').textContent = family.poison;
        $('unlockGlow').style.background = `radial-gradient(circle at center, rgba(${SandEngine.SAND_COLORS[family.color.toLowerCase()]?.r || 200}, ${SandEngine.SAND_COLORS[family.color.toLowerCase()]?.g || 200}, ${SandEngine.SAND_COLORS[family.color.toLowerCase()]?.b || 200}, 0.1) 0%, transparent 50%)`;
        modal.style.display = 'flex';

        $('unlockContinue').onclick = () => {
            modal.style.display = 'none';

            // Auto-select the new color
            const colorName = family.color.toLowerCase();
            document.querySelectorAll('.sand-color').forEach(c => c.classList.remove('sand-color--active'));
            const btn = document.querySelector(`.sand-color[data-color="${colorName}"]`);
            if (btn) btn.classList.add('sand-color--active');
            state.activeColor = colorName;
            sandRenderer.setColor(colorName);

            // Show layer teaching after unlock
            const teaching = Teachings.getLayerTeaching(state.currentLayer);
            if (teaching) {
                setTimeout(() => showTeachingModal(teaching), 300);
            }
        };
        modal.querySelector('.modal-backdrop').onclick = () => {
            modal.style.display = 'none';
        };
    }

    function showRandomTeaching() {
        const tip = Teachings.getRandomTip();
        showTeachingModal({
            icon: '\uD83D\uDCD6',
            title: tip.title,
            body: '<p>' + tip.text + '</p>'
        });
    }

    function showLayerTeaching() {
        const teaching = Teachings.getLayerTeaching(state.currentLayer);
        if (teaching) {
            showTeachingModal(teaching);
        }
    }

    // Simple toast notification
    function showToast(message) {
        const existing = document.querySelector('.game-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            padding: 10px 20px; background: rgba(0,0,0,0.8); color: rgba(255,255,255,0.7);
            border-radius: 100px; font-size: 13px; z-index: 2000;
            animation: fadeInUp 0.3s ease-out; pointer-events: none;
            font-family: 'DM Sans', sans-serif;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

})();
