(function () {
  "use strict";

  var CYCLES = 2.5;

  // ---------------------------------------------------------------------------
  // Waveform math (canvas drawing)
  // ---------------------------------------------------------------------------

  function sampleWaveform(type, phase, dutyCycle) {
    // phase in [0, 1)
    switch (type) {
      case "sine":
        return Math.sin(2 * Math.PI * phase);
      case "square":
        return phase < 0.5 ? 1 : -1;
      case "sawtooth":
        return 2 * phase - 1;
      case "triangle":
        return phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
      case "pulse":
        return phase < (dutyCycle || 0.5) ? 1 : -1;
      default:
        return 0;
    }
  }

  function hasDiscontinuity(type, prevT, t, dutyCycle) {
    // Returns true when we need a vertical stroke between prevT and t
    var d = dutyCycle || 0.5;
    if (type === "sawtooth") {
      return Math.floor(t) !== Math.floor(prevT);
    }
    if (type === "square") {
      return (
        Math.floor(t) !== Math.floor(prevT) ||
        Math.floor(t * 2) !== Math.floor(prevT * 2)
      );
    }
    if (type === "pulse") {
      var prevPhase = prevT % 1;
      var curPhase = t % 1;
      // Rising edge (phase wrap) or falling edge (phase crosses d)
      return (
        Math.floor(t) !== Math.floor(prevT) ||
        (prevPhase < d && curPhase >= d)
      );
    }
    return false;
  }

  function drawWaveform(canvas, type, color, dutyCycle) {
    var dpr = window.devicePixelRatio || 1;
    var W = canvas.offsetWidth || canvas.width;
    var H = canvas.offsetHeight || canvas.height;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    var pad = 6;
    var mid = H / 2;
    var amp = mid - pad;

    ctx.clearRect(0, 0, W, H);

    // Centre axis
    ctx.beginPath();
    ctx.strokeStyle = "rgba(160,160,160,0.25)";
    ctx.lineWidth = 1;
    ctx.moveTo(0, mid);
    ctx.lineTo(W, mid);
    ctx.stroke();

    // Waveform
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";

    var d = dutyCycle || 0.5;
    var needsDiscontinuity =
      type === "square" || type === "sawtooth" || type === "pulse";

    for (var i = 0; i <= W; i++) {
      var t = (CYCLES * i) / W;
      var phase = t % 1;
      var y = sampleWaveform(type, phase, d);
      var px = i;
      var py = mid - y * amp;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else if (needsDiscontinuity) {
        var prevT = (CYCLES * (i - 1)) / W;
        if (hasDiscontinuity(type, prevT, t, d)) {
          var prevPhase = prevT % 1;
          var prevY = sampleWaveform(type, prevPhase, d);
          var prevPy = mid - prevY * amp;
          ctx.lineTo(px, prevPy);
          ctx.lineTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  // ---------------------------------------------------------------------------
  // Pulse wave audio: PeriodicWave from Fourier coefficients
  //
  // Bipolar pulse, DC-free. For PeriodicWave the convention is:
  //   y(t) = Σ real[k] cos(2πkft) - imag[k] sin(2πkft)
  //
  // The Fourier series of x(t) = +1 for phase<d, -1 otherwise is:
  //   x(t) = Σ A_k cos(2πkft) + B_k sin(2πkft)
  //   A_k = 2 sin(2πkd) / (kπ)
  //   B_k = 2(1 - cos(2πkd)) / (kπ)
  //
  // Mapping to PeriodicWave:  real[k] = A_k,  imag[k] = -B_k
  // ---------------------------------------------------------------------------

  var PULSE_HARMONICS = 64;

  function makePulseWave(audioCtx, d) {
    var N = PULSE_HARMONICS;
    var real = new Float32Array(N + 1);
    var imag = new Float32Array(N + 1);
    // index 0 = DC — leave at zero
    for (var k = 1; k <= N; k++) {
      var kpid = k * Math.PI * d; // = kπd
      var k2pid = 2 * kpid;      // = 2kπd
      real[k] = (2 * Math.sin(k2pid)) / (k * Math.PI);
      imag[k] = (-2 * (1 - Math.cos(k2pid))) / (k * Math.PI);
    }
    return audioCtx.createPeriodicWave(real, imag, {
      disableNormalization: false,
    });
  }

  // ---------------------------------------------------------------------------
  // Demo initialisation
  // ---------------------------------------------------------------------------

  function initDemo(container) {
    var type = container.dataset.waveform;
    var color = container.dataset.color || "#4a9eff";
    var isPulse = type === "pulse";

    var canvas = container.querySelector("[data-role='canvas']");
    var playBtn = container.querySelector("[data-role='play']");
    var freqSlider = container.querySelector("[data-role='freq']");
    var freqDisplay = container.querySelector("[data-role='freq-display']");
    var pwSlider = isPulse
      ? container.querySelector("[data-role='pw']")
      : null;
    var pwDisplay = isPulse
      ? container.querySelector("[data-role='pw-display']")
      : null;

    var dutyCycle = isPulse
      ? parseFloat(container.dataset.defaultPw || 0.5)
      : 0.5;

    function draw() {
      drawWaveform(canvas, type, color, dutyCycle);
    }

    draw();
    window.addEventListener("resize", draw);

    var audioCtx = null;
    var oscillator = null;
    var gainNode = null;
    var playing = false;

    function getFreq() {
      return parseFloat(freqSlider.value);
    }

    function ensureContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        return audioCtx.resume();
      }
      return Promise.resolve();
    }

    function start() {
      ensureContext().then(function () {
        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.02);
        gainNode.connect(audioCtx.destination);

        oscillator = audioCtx.createOscillator();
        oscillator.frequency.value = getFreq();

        if (isPulse) {
          oscillator.setPeriodicWave(makePulseWave(audioCtx, dutyCycle));
        } else {
          oscillator.type = type;
        }

        oscillator.connect(gainNode);
        oscillator.start();

        playing = true;
        playBtn.textContent = "Stop";
        playBtn.setAttribute("aria-pressed", "true");
        container.classList.add("is-playing");
      });
    }

    function stop() {
      if (!oscillator) return;
      var now = audioCtx.currentTime;
      gainNode.gain.setTargetAtTime(0, now, 0.02);
      var osc = oscillator;
      var gn = gainNode;
      setTimeout(function () {
        try { osc.stop(); } catch (e) {}
        osc.disconnect();
        gn.disconnect();
      }, 120);
      oscillator = null;
      gainNode = null;
      playing = false;
      playBtn.textContent = "Play";
      playBtn.setAttribute("aria-pressed", "false");
      container.classList.remove("is-playing");
    }

    playBtn.addEventListener("click", function () {
      if (playing) { stop(); } else { start(); }
    });

    freqSlider.addEventListener("input", function () {
      var f = getFreq();
      freqDisplay.textContent = f + " Hz";
      if (oscillator) {
        oscillator.frequency.linearRampToValueAtTime(
          f,
          audioCtx.currentTime + 0.02
        );
      }
    });

    if (isPulse && pwSlider) {
      pwSlider.addEventListener("input", function () {
        dutyCycle = parseFloat(pwSlider.value);
        var pct = Math.round(dutyCycle * 100);
        var label = pct === 50 ? pct + "% (square)" : pct + "%";
        pwDisplay.textContent = label;
        draw();
        if (oscillator) {
          oscillator.setPeriodicWave(makePulseWave(audioCtx, dutyCycle));
        }
      });
    }
  }

  function init() {
    document.querySelectorAll("[data-waveform]").forEach(function (el) {
      initDemo(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
