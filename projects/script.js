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

// Page visibility title updates
document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Projects | Portfolio Ritesh Maurya";
            $("#favicon").attr("href", "../assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "../assets/images/favhand.png");
        }
    });


// fetch projects start
function getProjects() {
    return fetch("../data/projects.json")
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

function showProjects(projects) {
    let projectsContainer = document.querySelector(".work .box-container");
    let projectsHTML = "";
    projects.forEach(project => {
        let flagshipClass = project.flagship ? "flagship-project" : "";
        let ribbonHTML = project.flagship ? `<div class="featured-ribbon"><i class="fas fa-crown"></i> Flagship</div>` : "";
        
        let statusClass = "status-ready";
        if (project.status && project.status.includes("Intern")) {
            statusClass = "status-internship";
        }

        let highlightsHTML = "";
        if (project.highlights && project.highlights.length) {
            highlightsHTML = `
            <div class="project-highlights">
              <h4>Engineering Highlights:</h4>
              <ul>
                ${project.highlights.map(h => `<li><i class="fas fa-check-circle"></i> ${h}</li>`).join('')}
              </ul>
            </div>`;
        }

        let techHTML = "";
        if (project.tech && project.tech.length) {
            techHTML = `<div class="project-tech">`;
            project.tech.forEach(t => {
                techHTML += `<span>${t}</span>`;
            });
            techHTML += `</div>`;
        }

        let caseStudyBtnHTML = "";
        const hasCaseStudy = ["codex-live", "ciphersql-studio", "devfolio", "matty", "docchat", "wanderlust"].includes(project.id);
        if (hasCaseStudy) {
            caseStudyBtnHTML = `<a href="./case-study.html?id=${project.id}" class="btn case-study-btn" style="width: 100%; text-align: center; background: var(--primary-color); color: #fff; margin-bottom: 0.8rem; box-shadow: 0 4px 10px var(--primary-glow); display: flex; align-items: center; justify-content: center; gap: 0.8rem; padding: 1.2rem; border-radius: 8px; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-file-alt"></i> Read Case Study</a>`;
        }

        projectsHTML += `
        <div class="grid-item ${project.category}">
          <div class="box tilt ${flagshipClass}">
            ${ribbonHTML}
            <div class="project-image-wrapper">
              <img draggable="false" loading="lazy" src="../assets/images/projects/${project.image}.png" alt="${project.name}" />
            </div>
            <div class="content">
              <div class="project-header">
                <h3>${project.name}</h3>
                <span class="status-badge ${statusClass}">${project.status || 'Completed'}</span>
              </div>
              <div class="desc">
                <p>${project.desc}</p>
                ${highlightsHTML}
                ${techHTML}
                <div class="btns" style="display: flex; flex-direction: column; width: 100%;">
                  ${caseStudyBtnHTML}
                  <div style="display: flex; gap: 1rem; width: 100%;">
                    <a href="${project.links.view}" class="btn view-btn" target="_blank" style="flex: 1; padding: 1.2rem; justify-content: center; align-items: center; display: inline-flex; gap: 0.5rem;"><i class="fas fa-eye"></i> Live Demo</a>
                    <a href="${project.links.code}" class="btn code-btn" target="_blank" style="flex: 1; padding: 1.2rem; justify-content: center; align-items: center; display: inline-flex; gap: 0.5rem;"><i class="fab fa-github"></i> Code</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`
    });
    projectsContainer.innerHTML = projectsHTML;

    // initialize isotope
    var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    // filter items on button click
    $('.button-group').on('click', 'button', function () {
        $('.button-group').find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    // initialize vanilla-tilt
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
}

getProjects().then(data => {
    showProjects(data);
});