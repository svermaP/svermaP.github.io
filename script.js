const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let active = false;

function firePulse() {
  if (active || prefersReduced.matches) return;

  const paths = document.querySelectorAll(".diagram-lines path");
  if (!paths.length) return;

  const path = paths[Math.floor(Math.random() * paths.length)];
  active = true;

  const dash = 8 + Math.random() * 10;
  const gap = 180 + Math.random() * 160;
  const duration = 0.9 + Math.random() * 0.6;

  path.style.setProperty("--dash", dash);
  path.style.setProperty("--gap", gap);
  path.style.setProperty("--offset", gap);
  path.style.setProperty("--duration", `${duration}s`);

  path.classList.add("signal");

  path.addEventListener(
    "animationend",
    () => {
      path.classList.remove("signal");
      active = false;
      scheduleNext();
    },
    { once: true }
  );
}

function scheduleNext() {
  const delay = 4000 + Math.random() * 16000;
  setTimeout(firePulse, delay);
}

if (!prefersReduced.matches) {
  scheduleNext();
}
