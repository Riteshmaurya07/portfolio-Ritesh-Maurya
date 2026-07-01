# Ritesh Maurya's Personal Portfolio Website 🚀

A modern, highly optimized, and production-grade personal portfolio website showcasing professional skills, achievements, experience timeline, and detailed case studies of flagship software projects.

🌐 **Live Link:** [Visit My Portfolio](https://portfolio-ritesh-maurya.vercel.app/)

---

## 📌 Features

*   🌓 **Theme System:** Dynamic styling variables mapped to Light/Dark mode with automatic OS preferences fallback and persistence.
*   ⌨️ **Command Palette (Ctrl + K):** Accessible global modal search console supporting fuzzy search, keyboard Arrow/Enter navigation, and quick convenience triggers (socials, downloads).
*   📈 **GitHub Telemetry Dashboard:** REST API integrations loading repository tallies, followers, and languages statistics with cached fail-safe fallback options.
*   📝 **Dynamic Case Studies:** Structured data templates that parse query URL coordinates (`case-study.html?id=...`) to render end-to-end technical case studies.
*   ⚡ **Scroll Progress Tracking:** Real-time visual tracking indicating scroll position on all layouts.
*   📬 **Interactive Contact form:** Secure client-side message dispatcher using EmailJS API connection.
*   🔍 **Crawl Optimization (SEO):** Native `robots.txt`, XML sitemaps, canonical links, and Person JSON-LD Schema markup.

---

## 📂 Repository Structure

The codebase is organized into a modular, scalable architecture separating dynamic database content from execution files:

```text
├── assets/
│   ├── css/
│   │   └── style.css           # Core styling system (themes & common overrides)
│   ├── images/                 # Favicon and local graphics
│   └── js/
│       ├── command-palette.js  # Fuzzy search palette console trigger logic
│       ├── script.js           # Main landing controller (telemetry, dynamic renders)
│       └── app.js              # Particles background configurations
├── data/
│   ├── skills.json             # Grouped technical skill profiles
│   ├── projects.json           # Showcase catalog featuring flagship weights
│   ├── case-studies.json       # Case studies text content database
│   ├── experience.json         # Work history records
│   └── education.json          # Academic achievements
├── experience/
│   ├── index.html              # Timeline layout HTML
│   ├── script.js               # Subpage dynamic content controllers
│   └── style.css               # Subpage styles overrides
├── projects/
│   ├── index.html              # Isotope archive layout HTML
│   ├── case-study.html         # Reusable case study shell
│   ├── case-study.js           # Case study client loader controller
│   ├── script.js               # Projects filter controllers
│   └── style.css               # Projects section styling
├── index.html                  # Core landing layout
├── robots.txt                  # Search engine crawls permissions
├── sitemap.xml                 # XML Index site directories catalog
└── README.md                   # This documentation
```

---

## 💻 Local Setup & Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Riteshmaurya07/Portfolio-Website.git
    ```
2.  **Navigate into the folder:**
    ```bash
    cd Portfolio-Website
    ```
3.  **Run a local development server:**
    Using Python:
    ```bash
    python -m http.server 8000
    ```
    Or Node.js:
    ```bash
    npx serve
    ```
4.  Open `http://localhost:8000` (or `http://localhost:3000`) in your browser.

---

## 🚀 Deployment

The portfolio is configured for zero-configuration deployments on modern platforms like **Vercel** or **GitHub Pages**. Simply import the repository, and the static assets build pipeline will deploy instantly, caching static resources at Edge CDN centers.

---

## 🗺️ Future Roadmap

1.  **Unit & E2E Testing:** Integrate Jest and Playwright to automate testing of navigation, theme settings, and Command Palette inputs.
2.  **Asset Bundling:** Add Webpack or ESBuild compilation pipelines to compress scripts and minify stylesheets.
3.  **Dynamic Blog Integration:** Sync medium/dev.to API triggers to inject recent publications.
