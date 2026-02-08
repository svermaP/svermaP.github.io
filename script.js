const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

const pickPulseLines = () => {
  const paths = Array.from(document.querySelectorAll(".trace-lines path"));
  if (!paths.length) return;

  const pulseCount = Math.min(6, Math.max(3, Math.floor(paths.length / 4)));
  const shuffled = paths.sort(() => Math.random() - 0.5);

  shuffled.slice(0, pulseCount).forEach((path) => {
    path.classList.add("pulse");
    const duration = 16 + Math.random() * 10;
    const delay = Math.random() * 8;
    const dash = 14 + Math.random() * 16;
    const gap = 200 + Math.random() * 140;

    path.style.animationDuration = `${duration.toFixed(1)}s`;
    path.style.animationDelay = `${delay.toFixed(1)}s`;
    path.style.strokeDasharray = `${dash.toFixed(0)} ${gap.toFixed(0)}`;
  });
};

if (!prefersReduced.matches) {
  pickPulseLines();
}

prefersReduced.addEventListener("change", (event) => {
  const paths = document.querySelectorAll(".trace-lines path");
  if (event.matches) {
    paths.forEach((path) => path.classList.remove("pulse"));
  } else {
    paths.forEach((path) => path.classList.remove("pulse"));
    pickPulseLines();
  }
});
