$(document).ready(function () {

    // Dynamic Scroll Progress Bar
    const progBar = document.createElement("div");
    progBar.id = "scroll-progress";
    progBar.className = "scroll-progress-bar";
    document.body.prepend(progBar);

    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progBar.style.width = scrolled + "%";
    });

    // Navbar toggler
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem('theme');
    
    if (!currentTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Toggle theme action
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

});

// Scroll Reveal Animations
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 300 });

// Page visibility title updates
document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Experience | Portfolio Ritesh Maurya";
            $("#favicon").attr("href", "../assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "../assets/images/favhand.png");
        }
    });

// Fetch and render experience timeline dynamically
fetch("../data/experience.json")
    .then(response => response.json())
    .then(data => {
        showExperience(data);
    });

function showExperience(experience) {
    const container = document.getElementById("experienceContainer");
    if (!container) return;
    let html = "";
    experience.forEach((exp, idx) => {
        const sideClass = idx % 2 === 0 ? "right" : "left";
        const bulletsHTML = exp.bullets.map(b => `<li>${b}</li>`).join('');
        html += `
        <div class="container ${sideClass}">
          <div class="content">
            <div class="tag">
              <h2>${exp.company}</h2>
            </div>
            <div class="desc">
              <h3>${exp.role}</h3>
              <p>${exp.duration}</p>
              <ul>
                ${bulletsHTML}
              </ul>
            </div>
          </div>
        </div>`;
    });
    container.innerHTML = html;
}