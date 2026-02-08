const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

let _pulseInterval = null;

const clearSignals = () => {
  if (_pulseInterval) {
    clearInterval(_pulseInterval);
    _pulseInterval = null;
  }

  document.querySelectorAll(".diagram-lines path").forEach((path) => {
    path.classList.remove("pulse");
    path.style.animationDuration = "";
    path.style.animationDelay = "";
    path.style.strokeDasharray = "";
    path.style.removeProperty('--sd-offset');
    path.style.removeProperty('--signal-duration');
  });
};

const applyOnce = () => {
  const paths = Array.from(document.querySelectorAll(".diagram-lines path"));
  if (!paths.length) return;

  // pick either 1 or 2 active pulses (1 more commonly)
  const activeCount = Math.random() < 0.6 ? 1 : 2;
  const shuffled = paths.sort(() => Math.random() - 0.5);

  // clear any existing pulse classes but keep static lines subtle
  paths.forEach((p) => {
    p.classList.remove("pulse");
    p.style.animationDuration = "";
    p.style.animationDelay = "";
    p.style.strokeDasharray = "";
    p.style.removeProperty('--sd-offset');
    p.style.removeProperty('--signal-duration');
  });

  shuffled.slice(0, activeCount).forEach((path) => {
    path.classList.add("pulse");

    // make pulses shorter and slightly higher contrast
    const duration = 6 + Math.random() * 6; // 6 - 12s
    const delay = Math.random() * 1.2; // small stagger
    const dash = 8 + Math.random() * 12; // visible short dash
    const gap = 160 + Math.random() * 200; // larger gap for travel feel

    path.style.animationDuration = `${duration.toFixed(1)}s`;
    path.style.animationDelay = `${delay.toFixed(2)}s`;
    path.style.strokeDasharray = `${Math.round(dash)} ${Math.round(gap)}`;
    // expose values to CSS keyframes
    path.style.setProperty('--sd-offset', `${Math.round(gap)}`);
    path.style.setProperty('--signal-duration', `${duration.toFixed(1)}s`);
  });
};

const applySignals = () => {
  // start an immediate pass and then rotate pulses periodically
  applyOnce();
  if (_pulseInterval) clearInterval(_pulseInterval);
  _pulseInterval = setInterval(() => {
    applyOnce();
  }, 8000 + Math.random() * 5000); // rotate every ~8-13s
};

if (!prefersReduced.matches) {
  applySignals();
}

prefersReduced.addEventListener("change", (event) => {
  clearSignals();
  if (!event.matches) {
    applySignals();
  }
});
