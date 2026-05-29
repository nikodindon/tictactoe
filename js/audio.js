/**
 * audio.js
 * Gestion des sons via l'API Web Audio (oscillateurs).
 * Version stable : un seul AudioContext global, gestion du suspended state,
 * et protection contre le spam de sons.
 */

window.AUDIO = (function () {
    "use strict";

    var soundEnabled = true;
    var soundToggleEl = null;

    // ------------------------------------------------------------------
    // AudioContext global unique
    // ------------------------------------------------------------------

    var audioCtx = null;
    var lastSoundTime = 0;
    var MIN_SOUND_INTERVAL = 50; // ms minimum entre 2 sons (évite le spam)

    /** Initialise / récupère le AudioContext unique */
    function getContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    /** Reprend le context s'il est suspended (obligatoire après interaction utilisateur) */
    function resumeContext() {
        var ctx = getContext();
        if (ctx && ctx.state === "suspended") {
            ctx.resume();
        }
    }

    /** Vérifie s'il y a assez de temps depuis le dernier son */
    function canPlayNow() {
        var now = Date.now();
        if (now - lastSoundTime < MIN_SOUND_INTERVAL) {
            return false;
        }
        lastSoundTime = now;
        return true;
    }

    // ------------------------------------------------------------------
    // Configuration
    // ------------------------------------------------------------------

    /** Définit l'élément DOM du bouton toggle son */
    function setSoundToggleElement(el) {
        soundToggleEl = el;
    }

    /** Retourne l'état actuel du son */
    function isEnabled() {
        return soundEnabled;
    }

    // ------------------------------------------------------------------
    // Fonctions de son
    // ------------------------------------------------------------------

    /**
     * Joue un son court via l'API Web Audio.
     * @param {string} type - "click", "win", "lose", "draw"
     */
    function playSound(type) {
        if (!soundEnabled) return;

        // Resume le context au cas où il serait suspendu
        resumeContext();

        // Protection contre le spam de sons
        if (!canPlayNow()) {
            return;
        }

        var ctx = getContext();

        // Créer l'oscillateur et le gainNode à partir du context global
        var oscillator = ctx.createOscillator();
        var gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch (type) {
            case "click":
                _playClick(ctx, oscillator, gainNode);
                break;
            case "win":
                _playWin(ctx, oscillator, gainNode);
                break;
            case "lose":
                _playLose(ctx, oscillator, gainNode);
                break;
            case "draw":
                _playDraw(ctx, oscillator, gainNode);
                break;
        }
    }

    /** Son de clic */
    function _playClick(ctx, oscillator, gainNode) {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    }

    /** Son de victoire */
    function _playWin(ctx, oscillator, gainNode) {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1047, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    }

    /** Son de défaite */
    function _playLose(ctx, oscillator, gainNode) {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.setValueAtTime(300, ctx.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(200, ctx.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.45);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.6);
    }

    /** Son de match nul */
    function _playDraw(ctx, oscillator, gainNode) {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
    }

    // ------------------------------------------------------------------
    // Toggle
    // ------------------------------------------------------------------

    /** Bascule l'état du son et met à jour l'icône */
    function toggleSound() {
        soundEnabled = !soundEnabled;

        if (soundToggleEl) {
            soundToggleEl.textContent = soundEnabled ? "🔊" : "🔇";
            soundToggleEl.classList.toggle("muted", !soundEnabled);
        }
    }

    return {
        playSound: playSound,
        toggleSound: toggleSound,
        isEnabled: isEnabled,
        setSoundToggleElement: setSoundToggleElement,
    };
})();
