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

    // Navbar toggle
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');
    });

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem('theme');
    
    if (!currentTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
    }

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

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

    // Parse URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = "/projects/";
        return;
    }

    // Fetch and render case study details
    fetch('../data/case-studies.json')
        .then(response => {
            if (!response.ok) throw new Error("JSON Fetch Failed");
            return response.json();
        })
        .then(data => {
            const project = data.find(p => p.id === projectId);
            if (!project) {
                window.location.href = "/projects/";
                return;
            }
            renderCaseStudy(project);
        })
        .catch(err => {
            console.error("Error loading case study database:", err);
            window.location.href = "/projects/";
        });

    function renderCaseStudy(project) {
        // 1. Title & Metadata
        document.title = `${project.name} | Technical Case Study`;
        document.getElementById("project-title").innerText = project.name;
        document.getElementById("project-tagline").innerText = project.tagline;

        // Dynamic SEO meta updates
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", `Read the engineering case study of ${project.name} - ${project.tagline}. Details system architecture, trade-offs, and outcomes.`);
        }

        // 2. Overview Details
        const overviewDetails = `
            <div class="overview-item">
              <span class="overview-label">Duration</span>
              <span class="overview-value">${project.duration}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">My Role</span>
              <span class="overview-value">${project.role}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">Project Type</span>
              <span class="overview-value">${project.type}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">Status</span>
              <span class="overview-value">${project.status}</span>
            </div>
            <div class="overview-item">
              <span class="overview-label">Team Size</span>
              <span class="overview-value">${project.team_size}</span>
            </div>
        `;
        document.getElementById("overview-details").innerHTML = overviewDetails;

        // 3. Tech Stack Badges
        const techHTML = project.tech.map(t => `<span>${t}</span>`).join('');
        document.getElementById("overview-tech").innerHTML = techHTML;

        // Links
        document.getElementById("live-btn-link").href = project.live_link;
        document.getElementById("code-btn-link").href = project.code_link;

        // 4. Problem Statement
        document.getElementById("problem-text").innerText = project.problem;

        // 5. Goals
        const goalsHTML = project.goals.map(g => `<li><i class="fas fa-check-circle"></i> ${g}</li>`).join('');
        document.getElementById("goals-list").innerHTML = goalsHTML;

        // 6. Architecture Cards
        const arch = project.architecture;
        const archHTML = `
            <div class="detail-card">
              <h3>Frontend Architecture</h3>
              <p>${arch.frontend}</p>
            </div>
            <div class="detail-card">
              <h3>Backend Services</h3>
              <p>${arch.backend}</p>
            </div>
            <div class="detail-card">
              <h3>Database Storage</h3>
              <p>${arch.database}</p>
            </div>
            <div class="detail-card">
              <h3>Authentication Security</h3>
              <p>${arch.auth}</p>
            </div>
            <div class="detail-card">
              <h3>Data & Event Flow</h3>
              <p>${arch.communication}</p>
            </div>
        `;
        document.getElementById("architecture-details").innerHTML = archHTML;

        // 7. Features categories
        let featuresHTML = "";
        for (const [category, items] of Object.entries(project.features)) {
            featuresHTML += `
                <div class="detail-card">
                  <h3>${category} Modules</h3>
                  <ul>
                    ${items.map(i => `<li><i class="fas fa-check"></i> ${i}</li>`).join('')}
                  </ul>
                </div>
            `;
        }
        document.getElementById("features-details").innerHTML = featuresHTML;

        // 8. Technical Challenges
        const challengesHTML = project.challenges.map(c => `
            <div class="detail-card">
              <h3>Challenge: ${c.title}</h3>
              <h4>The Problem</h4>
              <p>${c.description}</p>
              <h4>The Engineering Solution</h4>
              <p>${c.solution}</p>
            </div>
        `).join('');
        document.getElementById("challenges-details").innerHTML = challengesHTML;

        // 9. Engineering Decisions
        const decisionsHTML = project.decisions.map(d => `
            <div class="detail-card">
              <h3>Choice: ${d.tech}</h3>
              <p>${d.reason}</p>
            </div>
        `).join('');
        document.getElementById("decisions-details").innerHTML = decisionsHTML;

        // 10. Lessons
        const lessonsHTML = project.lessons.map(l => `<li><i class="fas fa-arrow-right"></i> ${l}</li>`).join('');
        document.getElementById("lessons-list").innerHTML = lessonsHTML;

        // 11. Results
        const resultsHTML = project.results.map(r => `<li><i class="fas fa-award"></i> ${r}</li>`).join('');
        document.getElementById("results-list").innerHTML = resultsHTML;

        // Re-trigger scroll spy checks after rendering
        setupScrollSpy();
    }

    // Sticky Sidebar Scrollspy
    function setupScrollSpy() {
        const sections = $('.case-study-section');
        const navItems = $('.case-study-sidebar ul li a');

        $(window).on('scroll', function () {
            let cur_pos = $(this).scrollTop() + 150;

            sections.each(function () {
                let top = $(this).offset().top;
                let bottom = top + $(this).outerHeight();

                if (cur_pos >= top && cur_pos <= bottom) {
                    navItems.removeClass('active');
                    sections.removeClass('active');

                    $(this).addClass('active');
                    navItems.filter('[href="#' + $(this).attr('id') + '"]').addClass('active');
                }
            });
        });
    }

});
