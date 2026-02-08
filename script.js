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
  if (length <= 0) {
    active = false;
    scheduleNext();
    return;
  }

  // Get start point (10% along path)
  const startPt = path.getPointAtLength(length * 0.1);
  // Get end point (85% along path)
  const endPt = path.getPointAtLength(length * 0.85);

  const speed = 1.8 + Math.random() * 0.6; // 1.8–2.4 seconds

  const packet = document.querySelector(".signal-packet");
  if (!packet) {
    active = false;
    scheduleNext();
    return;
  }

  // Set CSS custom properties for the animation keyframes
  packet.style.setProperty("--tx-start", `${startPt.x}px`);
  packet.style.setProperty("--ty-start", `${startPt.y}px`);
  packet.style.setProperty("--tx-end", `${endPt.x}px`);
  packet.style.setProperty("--ty-end", `${endPt.y}px`);
  packet.style.setProperty("--duration", `${speed}s`);

  // Force reflow
  void packet.offsetWidth;

  packet.classList.add("pulse");

  const cleanup = () => {
    packet.classList.remove("pulse");
    packet.removeEventListener("animationend", cleanup);
    active = false;
    scheduleNext();
  };

  packet.addEventListener("animationend", cleanup, { once: true });
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
