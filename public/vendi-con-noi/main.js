/* =========================================================
   Devit Immobiliare · "Vendi con Noi" · interazioni
   Vanilla JS, nessuna libreria. Defer-loaded.
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Anno corrente ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scrolled + scroll progress + sticky CTA ---------- */
  const header = $("#siteHeader");
  const scrollBar = $("#scrollBar");
  const stickyCta = $("#stickyCta");
  const hero = $("#hero");

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;

    if (scrollBar) scrollBar.style.width = pct + "%";
    if (header) header.classList.toggle("scrolled", y > 40);

    if (stickyCta && hero) {
      const past = y > hero.offsetHeight * 0.85;
      stickyCta.classList.toggle("show", past);
      stickyCta.setAttribute("aria-hidden", past ? "false" : "true");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Hero word reveal ---------- */
  const wordEl = $("[data-words]");
  if (wordEl) {
    const text = wordEl.textContent.trim();
    // Preserva l'em (capitolo dopo): ricostruiamo il markup parola per parola.
    const html = wordEl.innerHTML;
    wordEl.innerHTML = "";
    // Spezza per parole mantenendo i tag <em>
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    let idx = 0;
    const frag = document.createDocumentFragment();

    function wrapWords(node, emphasis) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split(/(\s+)/).forEach((token) => {
            if (token.trim() === "") {
              frag.appendChild(document.createTextNode(token));
              return;
            }
            const wrap = document.createElement("span");
            wrap.className = "word-wrap";
            const w = document.createElement("span");
            w.className = "word";
            w.textContent = token;
            w.style.transitionDelay = (idx * 0.09) + "s";
            if (emphasis) w.style.cssText += "font-style:italic;color:var(--accent);";
            idx++;
            wrap.appendChild(w);
            frag.appendChild(wrap);
          });
        } else if (child.nodeName === "EM") {
          wrapWords(child, true);
        }
      });
    }
    wrapWords(tmp, false);
    wordEl.appendChild(frag);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => wordEl.classList.add("is-in"));
    });
  }

  /* ---------- IntersectionObserver: reveal generico ---------- */
  const revealEls = $$(".reveal, .partner, .testimonial");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Cinema 2: video di sfondo FIXED dietro Metodo + Trasformazione ----------
     Compare (fade-in dal buio) a metà del Metodo, si scrubba su Metodo+Trasformazione,
     arriva alla scena finale a tutto schermo, e poi "Chi ci ha scelto" sale sopra di esso.
     Essendo FIXED non lascia "coda": il filmato resta fino all'inizio della sezione chiara. */
  const methodVideo = $("#methodVideo");
  const bg2 = $("#cinema2bg");
  const metodoSec = $("#metodo");
  const testiSec = $("#testimonianze");
  const sociSec = $("#soci");
  if (methodVideo && bg2 && metodoSec && testiSec && !prefersReduced) {
    let mdur = 0, mready = false, mTarget = 0, mCur = 0, mLoop = false, mprog = 0;

    methodVideo.addEventListener("loadedmetadata", () => { mdur = methodVideo.duration || 0; });
    methodVideo.addEventListener("canplay", () => {
      mready = true;
      methodVideo.play().then(() => methodVideo.pause()).catch(() => {});
      mSchedule();
    });

    // carica il filmato solo quando la zona si avvicina (risparmia banda al primo load)
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((ents) => {
        ents.forEach((e) => { if (e.isIntersecting) { methodVideo.preload = "auto"; methodVideo.load(); io.disconnect(); } });
      }, { rootMargin: "200% 0px" });
      io.observe(metodoSec);
    } else { methodVideo.preload = "auto"; methodVideo.load(); }

    function mCompute() {
      const sy = window.scrollY || 0;
      const vh = window.innerHeight;
      const mTop = metodoSec.getBoundingClientRect().top + sy;
      const tsTop = testiSec.getBoundingClientRect().top + sy;
      const sociTop = sociSec ? sociSec.getBoundingClientRect().top + sy : tsTop + vh * 2;
      const startY = mTop + metodoSec.offsetHeight * 0.5;        // metà Metodo
      const endY = tsTop;                                        // il video si congela all'inizio di "Chi ci ha scelto"
      const range = Math.max(endY - startY, 1);
      mprog = Math.min(Math.max((sy - startY) / range, 0), 1);
      if (mdur) mTarget = mprog * Math.max(mdur - 0.05, 0);

      // master NERO: acceso da poco prima del Metodo (entra già nero, nessun bianco->nero);
      // si spegne solo quando "I soci" (scuro, opaco) copre, così sotto non resta il layer fisso.
      const fadeIn = Math.min(Math.max((sy - (mTop - vh * 1.2)) / (vh * 0.14), 0), 1);
      bg2.style.opacity = fadeIn.toFixed(3);
      // il video appare a metà Metodo, resta visibile (frame finale congelato) dietro ai testimonial
      // E dietro "I soci" (trasparente). La paisagem resta finché la sezione NON è ~entrata per il 70%
      // in vista; solo allora sfuma al NERO (base scura del bg2) entro il ~95%.
      const vIn = (mprog < 0.12 ? mprog / 0.12 : 1);
      // quanto della sezione "I soci" è già VISIBILE in viewport (0 = entra dal basso, 1 = tutta in vista).
      // La paisagem resta piena finché non è ~60% in vista; poi transiziona al NERO entro l'~85%.
      const onScreen = ((sy + vh) - sociTop) / Math.max(sociSec.offsetHeight, 1);
      const vOut = 1 - Math.min(Math.max((onScreen - 0.6) / 0.25, 0), 1);
      methodVideo.style.opacity = Math.min(vIn, vOut).toFixed(3);
    }

    function mFrame() {
      let moving = false;
      if (mready && mdur) {
        mCur += (mTarget - mCur) * 0.16;
        if (Math.abs(mTarget - mCur) < 0.01) mCur = mTarget;
        if (Math.abs(methodVideo.currentTime - mCur) > 0.012) {
          try { methodVideo.currentTime = mCur; } catch (e) {}
        }
        moving = Math.abs(mTarget - mCur) > 0.01;
      }
      if (moving) requestAnimationFrame(mFrame);
      else mLoop = false;
    }
    function mSchedule() { if (!mLoop) { mLoop = true; requestAnimationFrame(mFrame); } }

    window.addEventListener("scroll", () => { mCompute(); mSchedule(); }, { passive: true });
    mCompute(); mSchedule();
  }

  /* ---------- Hero video: parallax + scrub allo scroll ----------
     Scroll giù → il video avanza (play). Scroll su → torna indietro (reverse).
     La posizione del filmato è agganciata allo scroll dentro l'hero; un lerp
     dà la sensazione di "play" invece di un salto secco di fotogrammi.        */
  const heroVideo = $("#heroVideo");
  const cinema = $("#cinema");
  const stage = $(".cinema-stage");
  if (heroVideo && cinema && stage && !prefersReduced) {
    let mx = 0, my = 0, sy = 0, prog = 0;
    let duration = 0, ready = false, targetTime = 0, curTime = 0, looping = false;

    // Solo per chi NON ha ridotto le animazioni: bufferizza tutto il filmato.
    heroVideo.preload = "auto";
    heroVideo.load();
    heroVideo.addEventListener("loadedmetadata", () => { duration = heroVideo.duration || 0; });
    heroVideo.addEventListener("canplay", () => { ready = true; schedule(); });
    // Safari/iOS: "sblocca" il seek di un video muto inline
    heroVideo.play().then(() => heroVideo.pause()).catch(() => {});

    function computeTargets() {
      sy = window.scrollY || 0;
      // distanza di scrub = tutta l'altezza della zona cinema meno una schermata
      const range = Math.max(cinema.offsetHeight - stage.offsetHeight, 1);
      const top = cinema.offsetTop || 0;
      prog = Math.min(Math.max((sy - top) / range, 0), 1);
      if (duration) targetTime = prog * Math.max(duration - 0.05, 0);
    }

    function frame() {
      // parallax sottile basato sul progresso (l'hero è pinnato: niente deriva sullo scrollY grezzo)
      const par = (prog - 0.5) * 56;            // ~±28px dentro l'overscan del 10%
      const mX = mx * 14, mY = my * 10;
      heroVideo.style.transform =
        "translate3d(" + mX.toFixed(1) + "px," + (par + mY).toFixed(1) + "px,0) scale(1.05)";

      // scrub: avviciniamo currentTime al target → effetto play / reverse
      let moving = false;
      if (ready && duration) {
        curTime += (targetTime - curTime) * 0.16;
        if (Math.abs(targetTime - curTime) < 0.01) curTime = targetTime;
        if (Math.abs(heroVideo.currentTime - curTime) > 0.012) {
          try { heroVideo.currentTime = curTime; } catch (e) {}
        }
        moving = Math.abs(targetTime - curTime) > 0.01;
      }

      // fadeout finale: il video sfuma nel buio negli ultimi istanti → transizione morbida
      const lp = (ready && duration) ? curTime / duration : prog;
      const op = lp <= 0.82 ? 1 : Math.max(0, 1 - (lp - 0.82) / 0.18);
      stage.style.opacity = op.toFixed(3);

      if (moving) { requestAnimationFrame(frame); }
      else { looping = false; }
    }
    function schedule() { if (!looping) { looping = true; requestAnimationFrame(frame); } }

    window.addEventListener("scroll", () => { computeTargets(); schedule(); }, { passive: true });
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", (ev) => {
        if ((window.scrollY || 0) > window.innerHeight) return;
        mx = (ev.clientX / window.innerWidth - 0.5) * 2;
        my = (ev.clientY / window.innerHeight - 0.5) * 2;
        schedule();
      }, { passive: true });
    }
    computeTargets();
    schedule();
  }

  /* ---------- Smooth scroll per anchor interni ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = $(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        }
      }
    });
  });
})();
