document.addEventListener("DOMContentLoaded", () => {
  // Tahun otomatis
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Progress bar
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    if (!progressBar) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Animasi reveal
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  } else revealElements.forEach(el => el.classList.add("is-visible"));

  // Navbar smooth scroll + active link
  const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
  navLinks.forEach(link => link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    }
  }));
  function updateActiveLink() {
    let current = "";
    document.querySelectorAll("main section[id]").forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  // Mode gelap
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark-mode");
    themeToggle.textContent = dark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
    themeToggle.title = dark ? "Ganti ke mode terang" : "Ganti ke mode gelap";
  });

  // Pie charts: tampilkan pesan jelas jika Chart.js gagal dimuat
  if (typeof Chart === "undefined") {
    console.error("Chart.js belum termuat. Periksa koneksi internet atau CDN Chart.js.");
    document.querySelectorAll(".chart-card").forEach(card => {
      const msg = document.createElement("p");
      msg.className = "chart-error";
      msg.textContent = "Diagram gagal dimuat. Periksa koneksi internet lalu refresh halaman.";
      card.appendChild(msg);
    });
    return;
  }

  const colors = ["#ec4899", "#c026d3", "#9333ea", "#7c3aed", "#6366f1"];
  function makePieChart(canvasId, labels, values) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas #${canvasId} tidak ditemukan.`);
      return;
    }
    new Chart(canvas, {
      type: "pie",
      data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: "#ffffff", borderWidth: 3, hoverOffset: 10 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { padding: 16, usePointStyle: true } },
          tooltip: { callbacks: { label: context => `${context.label}: ${context.raw}%` } }
        },
        animation: { animateRotate: true, duration: 900 }
      }
    });
  }
  makePieChart("minatChart", ["Menggambar", "Musik", "Membaca", "Menulis", "Olahraga"], [30, 25, 20, 15, 10]);
  makePieChart("bakatChart", ["Kreativitas", "Komunikasi", "Kerja Sama", "Pemecahan Masalah", "Teknologi"], [30, 25, 20, 15, 10]);
  console.log("Portfolio Alissa dan pie chart berhasil dimuat 💗");
});
