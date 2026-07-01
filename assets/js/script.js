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

    // Global Clipboard Utility
    window.copyToClipboard = function (text, message) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message, "success");
        }).catch(err => {
            console.error("Copy failed:", err);
        });
    };

    // Navbar toggle
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Close mobile menu when clicking outside
    $(document).click(function (event) {
        if (!$(event.target).closest('#menu, .navbar').length) {
            $('#menu').removeClass('fa-times');
            $('.navbar').removeClass('nav-toggle');
        }
    });

    // Throttled scroll spy and scroll effects
    let isScrolling = false;
    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (!isScrolling) {
            window.requestAnimationFrame(function () {
                handleScrollEffects();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function handleScrollEffects() {
        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    }

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
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
        updateGitHubStats('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        updateGitHubStats('light');
    }

    // Toggle theme action
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            updateGitHubStats('light');
            if (window.initParticles) window.initParticles('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            updateGitHubStats('dark');
            if (window.initParticles) window.initParticles('dark');
        }
    });

    // Dynamic GitHub Stats adjustment based on theme
    function updateGitHubStats(theme) {
        const graphImg = document.getElementById('github-graph');
        const leetcodeImg = document.getElementById('leetcode-stats');

        const isDark = theme === 'dark';
        const graphTheme = isDark ? 'react-dark' : 'react-light';
        const leetcodeTheme = isDark ? 'dark' : 'light';

        if (graphImg) graphImg.src = `https://github-readme-activity-graph.vercel.app/graph?username=Riteshmaurya07&theme=${graphTheme}`;
        if (leetcodeImg) leetcodeImg.src = `https://leetcard.jacoblin.cool/riteshmaurya07?theme=${leetcodeTheme}&extension=heatmap`;
    }

    // Custom Toast Notification System
    window.showToast = function(message, type = "success") {
        let toastContainer = document.getElementById("toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // emailjs to mail contact form data
    $("#contact-form").submit(function (event) {
        emailjs.init("5iZXro093oG1yxENx"); // Your EmailJS Public Key

        emailjs.sendForm('service_mt1dkbk', 'template_k5k3su7', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                showToast("Form Submitted Successfully!", "success");
            }, function (error) {
                console.log('FAILED...', error);
                showToast("Form Submission Failed! Try Again", "error");
            });
        event.preventDefault();
    });

});

// Page Visibility Change Title behavior
document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Ritesh Maurya";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });

// Typed.js effect for Hero Section
var typed = new Typed(".typing-text", {
    strings: ["scalable web applications.", "AI-powered developer tools.", "optimized database systems.", "interactive user interfaces."],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

// Fetch API helper
async function fetchData(type = "skills") {
    let response;
    if (type === "skills") {
        response = await fetch("data/skills.json");
    } else if (type === "projects") {
        response = await fetch("data/projects.json");
    } else if (type === "experience") {
        response = await fetch("data/experience.json");
    } else if (type === "education") {
        response = await fetch("data/education.json");
    }
    const data = await response.json();
    return data;
}

// Render Education
function showEducation(education) {
    const container = document.getElementById("educationContainer");
    if (!container) return;
    let html = "";
    education.forEach(edu => {
        const courseworkHTML = edu.coursework.map(c => `<span>${c}</span>`).join('');
        html += `
        <div class="box">
          <div class="image">
            <img draggable="false" src="./assets/images/educat/college.jpg" alt="College">
          </div>
          <div class="content">
            <h3>${edu.degree}</h3>
            <p>${edu.institution}</p>
            <div><span class="cgpa-badge">${edu.metrics}</span></div>
            <div class="coursework-title">Relevant Coursework:</div>
            <div class="coursework-badges">
              ${courseworkHTML}
            </div>
            <h4>${edu.duration} | Completed</h4>
          </div>
        </div>`;
    });
    container.innerHTML = html;
}

// Render Experience Timeline
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

// Render Skills
function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    
    // Group skills by category
    const categories = {};
    skills.forEach(skill => {
        const cat = skill.category || "Other";
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push(skill);
    });

    // Render grouped categories
    for (const [category, items] of Object.entries(categories)) {
        skillHTML += `<h3 class="category-title">${category}</h3>`;
        items.forEach(skill => {
            skillHTML += `
            <div class="bar">
              <div class="info">
                <img src="${skill.icon}" alt="${skill.name}" />
                <span>${skill.name}</span>
              </div>
            </div>`;
        });
    }
    skillsContainer.innerHTML = skillHTML;
}

// Render Projects
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    // Display all projects, highlight featured ones
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
            caseStudyBtnHTML = `<a href="./projects/case-study.html?id=${project.id}" class="btn case-study-btn" style="width: 100%; text-align: center; background: var(--primary-color); color: #fff; margin-bottom: 0.8rem; box-shadow: 0 4px 10px var(--primary-glow); display: flex; align-items: center; justify-content: center; gap: 0.8rem; padding: 1.2rem; border-radius: 8px; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-file-alt"></i> Read Case Study</a>`;
        }

        projectHTML += `
        <div class="box tilt ${flagshipClass}">
          ${ribbonHTML}
          <div class="project-image-wrapper">
            <img draggable="false" loading="lazy" src="./assets/images/projects/${project.image}.png" alt="${project.name}" />
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
        </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // vanilla-tilt init
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });

    // ScrollReveal animations
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    srtop.reveal('.work .box', { interval: 150 });
}

// Initial fetches
fetchData().then(data => {
    showSkills(data);
});

fetchData("education").then(data => {
    showEducation(data);
});

fetchData("experience").then(data => {
    showExperience(data);
});

fetchData("projects").then(data => {
    // Show only featured projects on the homepage
    const homeProjects = data.filter(project => project.featured);
    // Sort so CodeX Live is at the beginning (index 0)
    homeProjects.sort((a, b) => {
        if (a.name === "CodeX Live") return -1;
        if (b.name === "CodeX Live") return 1;
        return 0;
    });
    showProjects(homeProjects);
});

// Dynamic GitHub Telemetry Loader
function fetchGitHubTelemetry() {
    const username = "Riteshmaurya07";
    
    // Lazy-load contribution graph chart
    const graphImg = document.getElementById("git-graph-img");
    if (graphImg && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy-telemetry");
                    observer.unobserve(lazyImage);
                }
            });
        });
        observer.observe(graphImg);
    } else if (graphImg) {
        graphImg.src = graphImg.dataset.src;
    }

    // Fetch user details from GitHub REST API
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) throw new Error("API Limit Reached");
            return response.json();
        })
        .then(data => {
            // Update UI elements dynamically with live values
            const repos = data.public_repos || 14;
            const followers = data.followers || 8;
            const following = data.following || 15;

            document.getElementById("github-repo-count").innerText = `${repos}+`;
            document.getElementById("git-repos-val").innerText = repos;
            document.getElementById("git-followers-val").innerText = followers;
            document.getElementById("git-following-val").innerText = following;
            document.getElementById("github-follower-stat").innerText = `${repos} Repos | ${followers} Followers`;
        })
        .catch(err => {
            console.warn("GitHub API limit exceeded or offline. Retaining premium static fallbacks:", err);
        });
}

// Trigger telemetry load
fetchGitHubTelemetry();

// Scroll Reveal configurations
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

srtop.reveal('.home .content h2', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });
srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .social-icons li', { interval: 150 });

srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });
srtop.reveal('.about .achievement-card', { interval: 150 });

srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 200 });

srtop.reveal('.education .box', { interval: 150 });
srtop.reveal('.experience .timeline .container', { interval: 150 });
srtop.reveal('.github-card-wrapper', { interval: 150 });
srtop.reveal('.github-graph-wrapper', { delay: 200 });

srtop.reveal('.contact .container', { delay: 200 });
srtop.reveal('.contact .container .form-group', { delay: 200 });