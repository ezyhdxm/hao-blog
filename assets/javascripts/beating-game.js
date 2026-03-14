(function () {
  "use strict";

  function formatHz(x) {
    return x.toFixed(2) + " Hz";
  }

  function createSingleToneSamples(config) {
    var freq = config.freq;
    var sampleRate = config.sampleRate || 44100;
    var duration = config.duration || 1.4;
    var gain = config.gain || 0.22;

    var n = Math.floor(sampleRate * duration);
    var buffer = new Float32Array(n);
    for (var i = 0; i < n; i += 1) {
      var t = i / sampleRate;
      buffer[i] = gain * Math.sin(2 * Math.PI * freq * t);
    }
    return buffer;
  }

  function playArrayBuffer(audioContext, samples, sampleRate) {
    if (!audioContext) return Promise.resolve();
    if (audioContext.state === "suspended") {
      return audioContext.resume().then(function () {
        return playArrayBuffer(audioContext, samples, sampleRate || 44100);
      });
    }

    var audioBuffer = audioContext.createBuffer(1, samples.length, sampleRate || 44100);
    audioBuffer.copyToChannel(samples, 0);
    var src = audioContext.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(audioContext.destination);
    src.start();
    return Promise.resolve();
  }

  function startContinuousBeating(audioContext, targetFreq, userFreq) {
    var master = audioContext.createGain();
    master.gain.value = 0.14;
    master.connect(audioContext.destination);

    var osc1 = audioContext.createOscillator();
    var osc2 = audioContext.createOscillator();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.value = targetFreq;
    osc2.frequency.value = userFreq;

    osc1.connect(master);
    osc2.connect(master);

    osc1.start();
    osc2.start();

    return {
      stop: function () {
        var now = audioContext.currentTime;
        master.gain.linearRampToValueAtTime(0, now + 0.05);
        osc1.stop(now + 0.06);
        osc2.stop(now + 0.06);
      },
      setUserFreq: function (freq) {
        var now = audioContext.currentTime;
        osc2.frequency.cancelScheduledValues(now);
        osc2.frequency.linearRampToValueAtTime(freq, now + 0.03);
      },
    };
  }

  function createRoundTarget() {
    var min = 436;
    var max = 444;
    var step = 0.05;
    var count = Math.round((max - min) / step);
    var target = min + Math.floor(Math.random() * (count + 1)) * step;
    return Number(target.toFixed(2));
  }

  function initBeatingGame(root) {
    if (!root) return;

    var ui = {
      guessValue: root.querySelector("[data-role='guess-value']"),
      roundValue: root.querySelector("[data-role='round-value']"),
      slider: root.querySelector("[data-role='slider']"),
      startBtn: root.querySelector("[data-role='start']"),
      stopBtn: root.querySelector("[data-role='stop']"),
      yourToneBtn: root.querySelector("[data-role='your-tone']"),
      targetBtn: root.querySelector("[data-role='target-tone']"),
      revealBtn: root.querySelector("[data-role='reveal']"),
      newRoundBtn: root.querySelector("[data-role='new-round']"),
      resultBox: root.querySelector("[data-role='result-box']"),
      targetValue: root.querySelector("[data-role='target-value']"),
      diffValue: root.querySelector("[data-role='diff-value']"),
      scoreValue: root.querySelector("[data-role='score-value']"),
    };

    var state = {
      audioContext: null,
      drone: null,
      targetFreq: createRoundTarget(),
      guessFreq: 440,
      revealed: false,
      round: 1,
      isPlaying: false,
    };

    function ensureAudio() {
      if (!state.audioContext) {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        state.audioContext = new AudioCtx();
      }
      if (state.audioContext.state === "suspended") {
        return state.audioContext.resume().then(function () {
          return state.audioContext;
        });
      }
      return Promise.resolve(state.audioContext);
    }

    function computeScore(diff) {
      return Math.max(0, Math.round(100 * Math.exp(-1.1 * Math.abs(diff))));
    }

    function updateUI() {
      var diff = state.guessFreq - state.targetFreq;

      ui.guessValue.textContent = formatHz(state.guessFreq);
      ui.roundValue.textContent = String(state.round);
      ui.slider.value = String(state.guessFreq);

      ui.startBtn.disabled = state.isPlaying;
      ui.stopBtn.disabled = !state.isPlaying;
      ui.targetBtn.disabled = !state.revealed;

      if (state.revealed) {
        ui.resultBox.hidden = false;
        ui.targetValue.textContent = formatHz(state.targetFreq);
        ui.diffValue.textContent = Math.abs(diff).toFixed(2) + " Hz";
        ui.scoreValue.textContent = String(computeScore(diff));
      } else {
        ui.resultBox.hidden = true;
      }
    }

    function stopTuning() {
      if (state.drone) {
        state.drone.stop();
        state.drone = null;
      }
      state.isPlaying = false;
      updateUI();
    }

    ui.slider.addEventListener("input", function () {
      state.guessFreq = Number(ui.slider.value);
      if (state.drone) state.drone.setUserFreq(state.guessFreq);
      updateUI();
    });

    ui.startBtn.addEventListener("click", function () {
      ensureAudio().then(function (ctx) {
        if (state.drone) state.drone.stop();
        state.drone = startContinuousBeating(ctx, state.targetFreq, state.guessFreq);
        state.isPlaying = true;
        updateUI();
      });
    });

    ui.stopBtn.addEventListener("click", stopTuning);

    ui.yourToneBtn.addEventListener("click", function () {
      ensureAudio().then(function (ctx) {
        var samples = createSingleToneSamples({ freq: state.guessFreq });
        playArrayBuffer(ctx, samples, 44100);
      });
    });

    ui.targetBtn.addEventListener("click", function () {
      if (!state.revealed) return;
      ensureAudio().then(function (ctx) {
        var samples = createSingleToneSamples({ freq: state.targetFreq });
        playArrayBuffer(ctx, samples, 44100);
      });
    });

    ui.revealBtn.addEventListener("click", function () {
      state.revealed = true;
      updateUI();
    });

    ui.newRoundBtn.addEventListener("click", function () {
      stopTuning();
      state.round += 1;
      state.guessFreq = 440;
      state.revealed = false;
      state.targetFreq = createRoundTarget();
      updateUI();
    });

    updateUI();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var nodes = document.querySelectorAll("[data-beating-game]");
    for (var i = 0; i < nodes.length; i += 1) {
      initBeatingGame(nodes[i]);
    }
  });
})();
