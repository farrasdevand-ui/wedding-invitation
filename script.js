document.addEventListener("DOMContentLoaded", () => {

  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  const enterBtn = document.getElementById("enterBtn");

  let playing = false;

  /* ENTER */
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      music.play().catch(()=>{});
      playing = true;
    });
  }

  /* MUSIC */
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (playing) {
        music.pause();
        playing = false;
        musicBtn.innerText = "MUSIC OFF";
      } else {
        music.play().catch(()=>{});
        playing = true;
        musicBtn.innerText = "MUSIC ON";
      }
    });
  }

  /* REVEAL */
  const reveals = document.querySelectorAll(".reveal");

  window.addEventListener("scroll", () => {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add("active");
      }
    });
  });

  /* GALLERY SLIDER */
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  function show(i) {
    slides.forEach(s => {
      s.classList.remove("active");
    });

    slides[i].classList.add("active");
  }

  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  if (next && prev) {
    next.addEventListener("click", () => {
      current++;
      if (current >= slides.length) current = 0;
      show(current);
    });

    prev.addEventListener("click", () => {
      current--;
      if (current < 0) current = slides.length - 1;
      show(current);
    });
  }

  show(current);

  /* NAME + EVENT */
  const name = document.getElementById("coupleName");
  const date = document.getElementById("weddingDate");
  const location = document.getElementById("weddingLocation");

  if (name) name.innerText = "Arkan & Caca";
  if (date) date.innerText = "21 June 2026";
  if (location) location.innerText = "Gedung SMK Pertanian";

});