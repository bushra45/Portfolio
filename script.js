// Contact form: sends through FormSubmit (https://formsubmit.co). No account needed,
// but the FIRST message triggers an activation email to the address below - click it once.
const FORM_ENDPOINT = "https://formsubmit.co/ajax/panhwarhussain110@gmail.com";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Mobile menu
const burger = $("#burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open");
  burger.setAttribute("aria-expanded", false);
}));

// Active nav link
const links = $$("#menu a");
const sections = $$("main section");
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

// Scroll reveal
const io = new IntersectionObserver((entries, o) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } });
}, { threshold: .12 });
$$(".reveal").forEach(el => io.observe(el));

// Project details toggles
$$("[data-details]").forEach(btn => btn.addEventListener("click", () => {
  const box = document.getElementById(btn.dataset.details);
  const show = box.hidden;
  box.hidden = !show;
  btn.setAttribute("aria-expanded", show);
  btn.textContent = show ? "Hide Details" : "Project Details";
}));

// Whole PromptVault card clickable (keyboard users use the title link)
$("#promptvault").addEventListener("click", e => {
  if (!e.target.closest("a")) window.open("https://promptvault-ai-tau.vercel.app/", "_blank", "noopener");
});

// Contact form
const form = $("#form"), status = $("#status"), send = $("#send");
form.addEventListener("submit", async e => {
  e.preventDefault();
  status.className = "";
  if (!form.checkValidity()) {
    status.textContent = "Please fill in all fields with a valid email address.";
    status.className = "err";
    return;
  }
  send.disabled = true;
  send.textContent = "Sending...";
  status.textContent = "";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && String(data.success) === "true") {
      status.textContent = "Thank you! Your message has been sent.";
      status.className = "ok";
      form.reset();
    } else {
      throw new Error(data.message || "Request failed");
    }
  } catch (err) {
    status.innerHTML = 'Sorry, your message could not be sent. Please email me directly at <a href="https://mail.google.com/mail/?view=cm&fs=1&to=panhwarhussain110@gmail.com" target="_blank" rel="noopener"><u>panhwarhussain110@gmail.com</u></a>.';
    status.className = "err";
  } finally {
    send.disabled = false;
    send.textContent = "Send Message";
  }
});

// Certificate viewer (click a card, browse with arrows / swipe-friendly buttons)
const certs = $$(".cert"), lb = $("#lb"), lbi = $("#lbi"), lbc = $("#lbc");
let cur = 0, opener = null;
function showCert(i) {
  cur = (i + certs.length) % certs.length;
  const d = certs[cur].dataset;
  lbi.src = d.src;
  lbi.alt = "Certificate: " + d.title;
  lbc.textContent = d.title + " \u2022 " + d.org + " \u2022 " + d.date + "  (" + (cur + 1) + "/" + certs.length + ")";
}
function openLb(i) { lb.classList.remove("single"); opener = document.activeElement; showCert(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lbx").focus(); }
function closeLb() { lb.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); }
certs.forEach((c, i) => c.addEventListener("click", () => openLb(i)));
$("#lbx").addEventListener("click", closeLb);
$("#lbp").addEventListener("click", () => showCert(cur - 1));
$("#lbn").addEventListener("click", () => showCert(cur + 1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (lb.classList.contains("single") && e.key !== "Escape") return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") showCert(cur - 1);
  if (e.key === "ArrowRight") showCert(cur + 1);
});

// "View certificate" links inside Experience open a single-image viewer
$$(".view-cert").forEach(b => b.addEventListener("click", () => {
  const d = b.dataset;
  opener = document.activeElement;
  lbi.src = d.src;
  lbi.alt = "Certificate: " + d.title;
  lbc.textContent = d.title + " \u2022 " + d.org + " \u2022 " + d.date;
  lb.classList.add("single");
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  $("#lbx").focus();
}));
