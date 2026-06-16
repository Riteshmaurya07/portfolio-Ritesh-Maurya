$(document).ready(function () {

    // Navbar toggle
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
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

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
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            updateGitHubStats('dark');
        }
    });

    // Dynamic GitHub Stats adjustment based on theme
    function updateGitHubStats(theme) {
        const statsImg = document.getElementById('github-stats');
        const streakImg = document.getElementById('github-streak');
        const topLangsImg = document.getElementById('github-top-langs');
        const graphImg = document.getElementById('github-graph');
        const codolioImg = document.getElementById('codolio-stats');
        const leetcodeImg = document.getElementById('leetcode-stats');

        const isDark = theme === 'dark';
        const cardTheme = isDark ? 'radial' : 'buefy';
        const graphTheme = isDark ? 'react-dark' : 'react-light';
        const codolioTheme = isDark ? 'dark' : 'light';
        const leetcodeTheme = isDark ? 'dark' : 'light';

        if (statsImg) statsImg.src = `https://github-readme-stats.vercel.app/api?username=Riteshmaurya07&show_icons=true&theme=${cardTheme}`;
        if (streakImg) streakImg.src = `https://streak-stats.demolab.com/?user=Riteshmaurya07&theme=${cardTheme}`;
        if (topLangsImg) topLangsImg.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=Riteshmaurya07&layout=compact&theme=${cardTheme}`;
        if (graphImg) graphImg.src = `https://github-readme-activity-graph.vercel.app/graph?username=Riteshmaurya07&theme=${graphTheme}`;
        if (codolioImg) codolioImg.src = `https://dsastats.vercel.app/api/codolio/riteshmaurya07?theme=${codolioTheme}`;
        if (leetcodeImg) leetcodeImg.src = `https://leetcard.jacoblin.cool/riteshmaurya07?theme=${leetcodeTheme}&extension=heatmap`;
    }

    // Set up errors fallback for stats images to handle rate-limiting
    $('img[id^="github-"]').on('error', function () {
        let currentSrc = $(this).attr('src');
        if (currentSrc.includes('github-readme-stats.vercel.app')) {
            // Fallback 1: Stable community mirror
            let newSrc = currentSrc.replace('github-readme-stats.vercel.app', 'github-readme-stats.shion.dev');
            $(this).attr('src', newSrc);
        } else if (currentSrc.includes('github-readme-stats-git-master-anuraghazra.vercel.app')) {
            // Support legacy URLs if they are still loaded in cache/history
            let newSrc = currentSrc.replace('github-readme-stats-git-master-anuraghazra.vercel.app', 'github-readme-stats.vercel.app');
            $(this).attr('src', newSrc);
        } else if (currentSrc.includes('streak-stats.demolab.com')) {
            // Fallback for streak stats
            let newSrc = currentSrc.replace('streak-stats.demolab.com', 'github-readme-streak-stats.herokuapp.com');
            $(this).attr('src', newSrc);
        }
    });

    // emailjs to mail contact form data
    $("#contact-form").submit(function (event) {
        emailjs.init("5iZXro093oG1yxENx"); // Your EmailJS Public Key

        emailjs.sendForm('service_mt1dkbk', 'template_k5k3su7', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
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
    strings: ["Full Stack Development", "MERN Stack Applications", "SaaS Development", "AI Integrations"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

// Fetch API helper
async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

// Render Skills
function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src="${skill.icon}" alt="${skill.name}" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

// Render Projects
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    // Display all projects, highlight featured ones
    projects.forEach(project => {
        let featuredClass = project.featured ? "featured-project" : "";
        projectHTML += `
        <div class="box tilt ${featuredClass}">
      <img draggable="false" src="./assets/images/projects/${project.image}.png" alt="${project.name}" />
      <div class="content">
        <div class="tag">
          <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
            <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
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

fetchData("projects").then(data => {
    showProjects(data);
});

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