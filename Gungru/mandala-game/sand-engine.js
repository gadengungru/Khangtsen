// ========================================
// Sacred Sands — Sand Particle Engine
// Canvas-based particle system for sand mandala rendering
// ========================================

const SandEngine = (function() {
    'use strict';

    // Sand color definitions (Five Buddha Families + extras)
    const SAND_COLORS = {
        white:  { r: 245, g: 240, b: 232, name: 'White',  family: 'Vairochana' },
        blue:   { r: 43,  g: 87,  b: 151, name: 'Blue',   family: 'Akshobhya' },
        yellow: { r: 232, g: 184, b: 56,  name: 'Yellow', family: 'Ratnasambhava' },
        red:    { r: 196, g: 48,  b: 48,  name: 'Red',    family: 'Amitabha' },
        green:  { r: 46,  g: 125, b: 50,  name: 'Green',  family: 'Amoghasiddhi' },
        gold:   { r: 212, g: 168, b: 67,  name: 'Gold',   family: 'Special' },
        maroon: { r: 123, g: 26,  b: 44,  name: 'Maroon', family: 'Special' },
        black:  { r: 30,  g: 25,  b: 22,  name: 'Black',  family: 'Outline' }
    };

    // Particle pool for performance
    class ParticlePool {
        constructor(maxSize) {
            this.maxSize = maxSize;
            this.particles = new Float32Array(maxSize * 6); // x, y, r, g, b, a
            this.count = 0;
        }

        add(x, y, r, g, b, a) {
            if (this.count >= this.maxSize) return false;
            const i = this.count * 6;
            this.particles[i]     = x;
            this.particles[i + 1] = y;
            this.particles[i + 2] = r;
            this.particles[i + 3] = g;
            this.particles[i + 4] = b;
            this.particles[i + 5] = a || 1;
            this.count++;
            return true;
        }

        clear() {
            this.count = 0;
        }
    }

    class SandRenderer {
        constructor(canvas, options) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { willReadFrequently: false });
            this.options = Object.assign({
                maxParticles: 500000,
                backgroundColor: '#1C1410',
                guideColor: 'rgba(212, 168, 67, 0.12)',
                guideLineWidth: 0.5
            }, options);

            // Particle storage
            this.pool = new ParticlePool(this.options.maxParticles);

            // Rendering layers
            this.sandLayer = null;       // ImageData for committed sand
            this.guideLayer = null;      // Pre-rendered guide lines
            this.needsRedraw = true;

            // Sand state
            this.isPouring = false;
            this.pourX = 0;
            this.pourY = 0;
            this.pourColor = SAND_COLORS.white;
            this.pourRate = 2;           // 1-5 flow rate
            this.pourVelocity = 0;       // Movement speed for mindfulness calc

            // Mandala geometry
            this.centerX = 0;
            this.centerY = 0;
            this.mandalaRadius = 0;

            // Stats
            this.totalGrains = 0;

            // Movement tracking for mindfulness
            this.lastPourX = 0;
            this.lastPourY = 0;
            this.movementHistory = [];

            // Resize
            this.resize();
            this._resizeHandler = () => this.resize();
            window.addEventListener('resize', this._resizeHandler);

            // Start render loop
            this._frameId = null;
            this._lastFrame = 0;
            this.startRenderLoop();
        }

        resize() {
            const wrapper = this.canvas.parentElement;
            if (!wrapper) return;

            const rect = wrapper.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const size = Math.min(rect.width - 32, rect.height - 32, 700);

            this.canvas.width = size * dpr;
            this.canvas.height = size * dpr;
            this.canvas.style.width = size + 'px';
            this.canvas.style.height = size + 'px';

            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.displaySize = size;

            this.centerX = size / 2;
            this.centerY = size / 2;
            this.mandalaRadius = (size / 2) - 20;

            // Recreate sand layer
            this.sandLayer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
            // Fill with background
            const bg = this._parseColor(this.options.backgroundColor);
            const data = this.sandLayer.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i]     = bg.r;
                data[i + 1] = bg.g;
                data[i + 2] = bg.b;
                data[i + 3] = 255;
            }

            this.needsRedraw = true;
        }

        // Set the active sand color
        setColor(colorName) {
            this.pourColor = SAND_COLORS[colorName] || SAND_COLORS.white;
        }

        // Set flow rate (1-5)
        setFlowRate(rate) {
            this.pourRate = Math.max(1, Math.min(5, rate));
        }

        // Start pouring sand at position
        startPour(x, y) {
            this.isPouring = true;
            this.pourX = x;
            this.pourY = y;
            this.lastPourX = x;
            this.lastPourY = y;
        }

        // Update pour position
        updatePour(x, y) {
            if (!this.isPouring) return;
            this.lastPourX = this.pourX;
            this.lastPourY = this.pourY;
            this.pourX = x;
            this.pourY = y;

            // Track movement for mindfulness
            const dx = x - this.lastPourX;
            const dy = y - this.lastPourY;
            this.pourVelocity = Math.sqrt(dx * dx + dy * dy);
            this.movementHistory.push(this.pourVelocity);
            if (this.movementHistory.length > 60) this.movementHistory.shift();
        }

        // Stop pouring
        stopPour() {
            this.isPouring = false;
            this.pourVelocity = 0;
        }

        // Get mindfulness score (0-100) based on movement steadiness
        getMindfulness() {
            if (this.movementHistory.length < 5) return 70;
            const recent = this.movementHistory.slice(-30);
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

            // Ideal speed is 1-3 px/frame. Too fast = erratic, too slow = not placing
            if (avg < 0.5) return 60; // barely moving
            if (avg > 8) return Math.max(20, 70 - (avg - 8) * 5); // too fast
            // Sweet spot
            const variance = recent.reduce((sum, v) => sum + Math.abs(v - avg), 0) / recent.length;
            const steadiness = Math.max(0, 100 - variance * 8);
            return Math.min(100, Math.max(20, steadiness));
        }

        // Place sand grains at a position
        _placeSand(x, y) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const data = this.sandLayer.data;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const color = this.pourColor;

            // Number of grains based on flow rate
            const grainCount = this.pourRate * 3 + 2;

            // Spread based on flow rate
            const spread = this.pourRate * 1.5 + 1;

            for (let i = 0; i < grainCount; i++) {
                // Random offset around pour point with gaussian-like distribution
                const angle = Math.random() * Math.PI * 2;
                const dist = (Math.random() + Math.random()) * spread * 0.5;
                const gx = Math.round((x + Math.cos(angle) * dist) * dpr);
                const gy = Math.round((y + Math.sin(angle) * dist) * dpr);

                if (gx < 0 || gx >= w || gy < 0 || gy >= h) continue;

                // Check if within mandala circle
                const cdx = gx / dpr - this.centerX;
                const cdy = gy / dpr - this.centerY;
                if (cdx * cdx + cdy * cdy > this.mandalaRadius * this.mandalaRadius) continue;

                const idx = (gy * w + gx) * 4;

                // Slight color variation for realistic sand texture
                const variation = (Math.random() - 0.5) * 20;
                data[idx]     = Math.max(0, Math.min(255, color.r + variation));
                data[idx + 1] = Math.max(0, Math.min(255, color.g + variation));
                data[idx + 2] = Math.max(0, Math.min(255, color.b + variation));
                data[idx + 3] = 255;

                this.totalGrains++;
            }

            this.needsRedraw = true;
        }

        // Interpolate sand placement along movement path for smooth lines
        _pourFrame() {
            if (!this.isPouring) return;

            const dx = this.pourX - this.lastPourX;
            const dy = this.pourY - this.lastPourY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.5) {
                // Stationary — place at current position
                this._placeSand(this.pourX, this.pourY);
            } else {
                // Interpolate along path
                const steps = Math.max(1, Math.ceil(dist / 1.5));
                for (let s = 0; s <= steps; s++) {
                    const t = s / steps;
                    const sx = this.lastPourX + dx * t;
                    const sy = this.lastPourY + dy * t;
                    this._placeSand(sx, sy);
                }
            }
        }

        // Draw mandala guide lines
        drawGuides(mandalaType, layer) {
            const ctx = this.ctx;
            const cx = this.centerX;
            const cy = this.centerY;
            const r = this.mandalaRadius;

            // Store guide drawing function for re-rendering
            this._guideDrawFn = () => {
                ctx.save();
                ctx.strokeStyle = this.options.guideColor;
                ctx.lineWidth = this.options.guideLineWidth;

                // Outer circle
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();

                // 8 directional lines
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI) / 4;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
                    ctx.stroke();
                }

                // Concentric circles for layers
                const layerRadii = [0.12, 0.25, 0.4, 0.6, 0.8, 1.0];
                layerRadii.forEach((ratio, idx) => {
                    ctx.beginPath();
                    ctx.arc(cx, cy, r * ratio, 0, Math.PI * 2);
                    ctx.globalAlpha = idx < layer ? 0.06 : 0.15;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                });

                // Inner square (palace)
                if (layer >= 2) {
                    const palaceSize = r * 0.4;
                    ctx.strokeStyle = 'rgba(212, 168, 67, 0.08)';
                    ctx.strokeRect(cx - palaceSize, cy - palaceSize, palaceSize * 2, palaceSize * 2);

                    // Gates (T-shapes at cardinal points)
                    const gateW = palaceSize * 0.15;
                    const gateH = palaceSize * 0.25;
                    ctx.strokeStyle = 'rgba(212, 168, 67, 0.06)';

                    // North gate
                    ctx.strokeRect(cx - gateW, cy - palaceSize - gateH, gateW * 2, gateH);
                    // South gate
                    ctx.strokeRect(cx - gateW, cy + palaceSize, gateW * 2, gateH);
                    // East gate
                    ctx.strokeRect(cx + palaceSize, cy - gateW, gateH, gateW * 2);
                    // West gate
                    ctx.strokeRect(cx - palaceSize - gateH, cy - gateW, gateH, gateW * 2);
                }

                // Ring labels (very subtle)
                if (layer >= 4) {
                    ctx.font = '8px DM Sans, sans-serif';
                    ctx.fillStyle = 'rgba(212, 168, 67, 0.12)';
                    ctx.textAlign = 'center';

                    const labels = [
                        { r: 0.85, text: 'Fire Ring' },
                        { r: 0.75, text: 'Vajra Ring' },
                        { r: 0.65, text: 'Lotus Ring' }
                    ];
                    labels.forEach(l => {
                        ctx.fillText(l.text, cx, cy - r * l.r - 4);
                    });
                }

                ctx.restore();
            };
        }

        // Main render
        render() {
            if (!this.needsRedraw && !this.isPouring) return;

            const ctx = this.ctx;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            // Pour new sand
            this._pourFrame();

            // Draw sand layer
            ctx.putImageData(this.sandLayer, 0, 0);

            // Reset transform after putImageData
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Draw guides on top
            if (this._guideDrawFn) {
                this._guideDrawFn();
            }

            // Draw center marker
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 168, 67, 0.2)';
            ctx.fill();

            // Glow effect when pouring with high mindfulness
            if (this.isPouring) {
                const mindfulness = this.getMindfulness();
                if (mindfulness > 70) {
                    const glowAlpha = ((mindfulness - 70) / 30) * 0.15;
                    ctx.beginPath();
                    ctx.arc(this.pourX, this.pourY, 8 + this.pourRate * 2, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(
                        this.pourX, this.pourY, 0,
                        this.pourX, this.pourY, 8 + this.pourRate * 2
                    );
                    gradient.addColorStop(0, `rgba(${this.pourColor.r}, ${this.pourColor.g}, ${this.pourColor.b}, ${glowAlpha})`);
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }

            this.needsRedraw = false;
        }

        // Render loop
        startRenderLoop() {
            const loop = (timestamp) => {
                if (timestamp - this._lastFrame >= 16) { // ~60fps cap
                    this.render();
                    this._lastFrame = timestamp;
                }
                this._frameId = requestAnimationFrame(loop);
            };
            this._frameId = requestAnimationFrame(loop);
        }

        stopRenderLoop() {
            if (this._frameId) {
                cancelAnimationFrame(this._frameId);
                this._frameId = null;
            }
        }

        // Get canvas image data for saving/dissolution
        getSnapshot() {
            return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }

        // Get canvas as data URL for gallery
        toDataURL() {
            // Render once without guides for clean screenshot
            const ctx = this.ctx;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            ctx.putImageData(this.sandLayer, 0, 0);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return this.canvas.toDataURL('image/png');
        }

        // Dissolution effect — sweep sand toward center
        dissolve(progress) {
            if (!this.sandLayer) return;

            const data = this.sandLayer.data;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = this.canvas.width;
            const h = this.canvas.height;
            const cx = this.centerX * dpr;
            const cy = this.centerY * dpr;
            const bg = this._parseColor(this.options.backgroundColor);

            // As progress increases (0-1), push sand toward center
            const pullStrength = progress * 0.05;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;

                    // Skip background pixels
                    if (data[idx] === bg.r && data[idx+1] === bg.g && data[idx+2] === bg.b) continue;

                    const dx = cx - x;
                    const dy = cy - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 5 * dpr) continue; // Don't move center particles

                    // Random chance to move based on progress
                    if (Math.random() < pullStrength) {
                        // Move toward center
                        const nx = Math.round(x + dx * 0.02);
                        const ny = Math.round(y + dy * 0.02);
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                            const nIdx = (ny * w + nx) * 4;
                            // Copy color to new position
                            data[nIdx]     = data[idx];
                            data[nIdx + 1] = data[idx + 1];
                            data[nIdx + 2] = data[idx + 2];
                            data[nIdx + 3] = 255;
                        }
                        // Fade original
                        if (Math.random() < 0.3) {
                            data[idx]     = bg.r;
                            data[idx + 1] = bg.g;
                            data[idx + 2] = bg.b;
                        }
                    }

                    // Random fade at edges based on progress
                    if (progress > 0.3 && dist > this.mandalaRadius * dpr * (1 - progress * 0.8)) {
                        if (Math.random() < 0.02) {
                            data[idx]     = bg.r;
                            data[idx + 1] = bg.g;
                            data[idx + 2] = bg.b;
                        }
                    }
                }
            }

            this.needsRedraw = true;
        }

        // Utility
        _parseColor(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }

        destroy() {
            this.stopRenderLoop();
            window.removeEventListener('resize', this._resizeHandler);
        }
    }

    // ======================================== River Animation ========================================
    class RiverAnimation {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.running = false;
            this.progress = 0;
        }

        start() {
            this.running = true;
            this.progress = 0;

            // Create sand particles falling into water
            for (let i = 0; i < 200; i++) {
                this.particles.push({
                    x: 280 + (Math.random() - 0.5) * 40,
                    y: 50 + Math.random() * 20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: 0.5 + Math.random() * 2,
                    r: Math.random() * 255,
                    g: Math.random() * 200 + 55,
                    b: Math.random() * 100,
                    size: 1 + Math.random() * 2,
                    delay: i * 20,
                    opacity: 1
                });
            }

            this._animate();
        }

        _animate() {
            if (!this.running) return;

            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;

            this.progress += 0.005;

            // Clear
            ctx.fillStyle = '#1C1410';
            ctx.fillRect(0, 0, w, h);

            // Draw river
            ctx.fillStyle = '#1a3a5c';
            ctx.fillRect(0, h * 0.5, w, h * 0.5);

            // River surface shimmer
            for (let i = 0; i < 20; i++) {
                const rx = Math.sin(Date.now() * 0.001 + i) * w * 0.5 + w * 0.5;
                const ry = h * 0.5 + Math.random() * 10;
                ctx.beginPath();
                ctx.arc(rx, ry, 1 + Math.random() * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 160, 220, ${0.1 + Math.random() * 0.15})`;
                ctx.fill();
            }

            // Draw and update sand particles
            const now = Date.now();
            this.particles.forEach(p => {
                if (now < p.delay + this._startTime) return;

                p.y += p.vy;
                p.x += p.vx;

                // When hitting water, slow down and spread
                if (p.y > h * 0.5) {
                    p.vy *= 0.95;
                    p.vx += (Math.random() - 0.5) * 0.5;
                    p.opacity *= 0.995;
                    p.size *= 0.998;
                }

                if (p.opacity < 0.01) return;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity})`;
                ctx.fill();
            });

            // Draw jar pouring
            const jarY = 30 + Math.sin(Date.now() * 0.002) * 3;
            ctx.save();
            ctx.translate(280, jarY);
            ctx.fillStyle = '#8B7355';
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(-10, -25);
            ctx.lineTo(10, -25);
            ctx.lineTo(15, 0);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#6B5335';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();

            // Golden text overlay
            if (this.progress > 0.3) {
                ctx.save();
                ctx.globalAlpha = Math.min(1, (this.progress - 0.3) * 2);
                ctx.font = '14px Cormorant Garamond, serif';
                ctx.fillStyle = 'rgba(212, 168, 67, 0.6)';
                ctx.textAlign = 'center';
                ctx.fillText('The sand returns to the waters...', w / 2, h * 0.85);
                ctx.restore();
            }

            if (this.progress < 2) {
                requestAnimationFrame(() => this._animate());
            }
        }

        startAnimation() {
            this._startTime = Date.now();
            this.start();
        }

        stop() {
            this.running = false;
        }
    }

    return {
        SandRenderer,
        RiverAnimation,
        SAND_COLORS
    };

})();
