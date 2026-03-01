/**
 * Virtual Prayer Wheel
 * Interactive 3D CSS prayer wheel with momentum physics,
 * mantra counter, and optional Om Mani Padme Hum audio.
 */
(function() {
    'use strict';

    var wheel = document.getElementById('prayerWheelDrum');
    var stage = document.getElementById('prayerWheelStage');
    if (!wheel || !stage) return;

    // Tibetan mantra: Om Mani Padme Hum
    var MANTRA = '\u0F68\u0F7C\u0F58\u0F0B\u0F58\u0F0B\u0F4E\u0F72\u0F0B\u0FA4\u0F51\u0F0B\u0F58\u0F7A\u0F0B\u0F67\u0F74\u0F58\u0F0D';
    var PANEL_COUNT = 8;

    // Generate 8 panels for the 3D cylinder
    for (var i = 0; i < PANEL_COUNT; i++) {
        var panel = document.createElement('div');
        panel.className = 'prayer-wheel__panel';
        panel.textContent = MANTRA;
        wheel.appendChild(panel);
    }

    // === State ===
    var angle = 0;
    var velocity = 0;
    var isDragging = false;
    var lastY = 0;
    var lastTime = 0;
    var animationId = null;
    var mantraCount = parseInt(localStorage.getItem('gungru-mantras') || '0', 10);
    var totalAngle = 0;
    var lastCountedRotation = 0;
    var soundEnabled = false;
    var audioCtx = null;
    var oscillator = null;
    var gainNode = null;

    // === Physics ===
    var FRICTION = 0.988;
    var MIN_VELOCITY = 0.08;
    var DRAG_SENSITIVITY = 0.4;
    var MAX_VELOCITY = 25;

    // Display stored count
    var countEl = document.getElementById('mantraCount');
    if (countEl) countEl.textContent = mantraCount.toLocaleString();

    // === Render wheel ===
    function updateWheel() {
        wheel.style.transform = 'translateX(-50%) rotateX(' + angle + 'deg)';
    }

    // === Drag handlers ===
    function getY(e) {
        if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
        return e.clientY;
    }

    function onDragStart(e) {
        isDragging = true;
        velocity = 0;
        lastY = getY(e);
        lastTime = performance.now();
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        e.preventDefault();
    }

    function onDragMove(e) {
        if (!isDragging) return;
        var y = getY(e);
        var dy = y - lastY;
        var now = performance.now();
        var dt = now - lastTime;

        if (dt > 0) {
            velocity = (dy * DRAG_SENSITIVITY) / Math.max(dt / 16, 0.5);
            velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
        }

        angle += dy * DRAG_SENSITIVITY;
        totalAngle += Math.abs(dy * DRAG_SENSITIVITY);
        lastY = y;
        lastTime = now;
        updateWheel();
        checkRotation();
        e.preventDefault();
    }

    function onDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        if (Math.abs(velocity) > MIN_VELOCITY) {
            animate();
        }
    }

    // === Physics animation loop ===
    function animate() {
        if (isDragging) {
            animationId = null;
            return;
        }

        if (Math.abs(velocity) > MIN_VELOCITY) {
            angle += velocity;
            totalAngle += Math.abs(velocity);
            velocity *= FRICTION;
            updateWheel();
            checkRotation();

            // Manage sound based on velocity
            if (soundEnabled && Math.abs(velocity) > 0.5) {
                playSound(Math.abs(velocity));
            } else if (soundEnabled) {
                fadeOutSound();
            }

            animationId = requestAnimationFrame(animate);
        } else {
            velocity = 0;
            animationId = null;
            if (soundEnabled) fadeOutSound();
        }
    }

    // === Mantra counting ===
    function checkRotation() {
        var fullRotations = Math.floor(totalAngle / 360);
        if (fullRotations > lastCountedRotation) {
            var newMantras = fullRotations - lastCountedRotation;
            mantraCount += newMantras;
            lastCountedRotation = fullRotations;
            if (countEl) countEl.textContent = mantraCount.toLocaleString();
            localStorage.setItem('gungru-mantras', mantraCount.toString());
        }
    }

    // === Sound (simple sine wave Om tone) ===
    function initAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0;
            gainNode.connect(audioCtx.destination);
        } catch (e) {
            console.warn('Web Audio not supported');
            audioCtx = null;
        }
    }

    function playSound(vel) {
        if (!audioCtx || !gainNode) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (!oscillator) {
            oscillator = audioCtx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 136.1; // Om frequency (C#)
            oscillator.connect(gainNode);
            oscillator.start();
        }

        // Volume proportional to velocity (0.05 – 0.2)
        var targetVol = Math.min(0.2, 0.05 + (vel / MAX_VELOCITY) * 0.15);
        gainNode.gain.setTargetAtTime(targetVol, audioCtx.currentTime, 0.1);
    }

    function fadeOutSound() {
        if (!audioCtx || !gainNode) return;
        gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
    }

    function stopSound() {
        if (oscillator) {
            try { oscillator.stop(); } catch (e) {}
            oscillator = null;
        }
        if (gainNode) gainNode.gain.value = 0;
    }

    // === Sound toggle ===
    var soundBtn = document.getElementById('soundToggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                initAudio();
                this.classList.add('prayer-wheel__sound-btn--active');
                this.innerHTML = '&#128266; <span data-i18n="prayer_wheel.sound_label">Sound</span>';
            } else {
                stopSound();
                this.classList.remove('prayer-wheel__sound-btn--active');
                this.innerHTML = '&#128264; <span data-i18n="prayer_wheel.sound_label">Sound</span>';
            }
        });
    }

    // === Event binding ===
    stage.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    stage.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    // Prevent context menu on long press
    stage.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    // Accessibility: keyboard spin
    stage.setAttribute('tabindex', '0');
    stage.setAttribute('role', 'application');
    stage.setAttribute('aria-label', 'Prayer wheel - use arrow keys to spin');
    stage.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            velocity = -3;
            if (!animationId) animate();
            e.preventDefault();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            velocity = 3;
            if (!animationId) animate();
            e.preventDefault();
        }
    });

    // Initial render
    updateWheel();
})();
