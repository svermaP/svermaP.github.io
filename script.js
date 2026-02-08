const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let active = false;
let timer = null;

function firePulse() {
  if (active || prefersReduced.matches) return;

  const paths = document.querySelectorAll(".diagram-lines path");
  if (!paths.length) return;

  const path = paths[Math.floor(Math.random() * paths.length)];
  active = true;

  const length = path.getTotalLength();

  const dash = Math.max(10, length * 0.08);
  const gap = length;
  const duration = 0.9 + Math.random() * 0.5;

  path.style.strokeDasharray = `${dash} ${gap}`;
  path.style.strokeDashoffset = gap;
  path.style.setProperty("--offset", gap);
  path.style.animationDuration = `${duration}s`;

  path.classList.add("signal");

  path.addEventListener(
    "animationend",
    () => {
      path.classList.remove("signal");
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "";
      path.style.animationDuration = "";
      active = false;
      scheduleNext();
    },
    { once: true }
  );
}

function scheduleNext() {
  const delay = 4000 + Math.random() * 16000;
  timer = setTimeout(firePulse, delay);
}

if (!prefersReduced.matches) {
  scheduleNext();
}

prefersReduced.addEventListener("change", (e) => {
  clearTimeout(timer);
  active = false;
  if (!e.matches) scheduleNext();
});
