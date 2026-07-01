// Command Palette Functionality for Premium UX
$(document).ready(function () {
    // 1. Inject Command Palette DOM into body if not already present
    if (!document.getElementById("command-palette")) {
        const paletteHTML = `
        <div id="command-palette" class="cmd-palette" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="cmd-search-input">
          <div class="cmd-palette-content">
            <div class="cmd-palette-search">
              <i class="fas fa-search"></i>
              <input type="text" id="cmd-search-input" placeholder="Search projects, skills, pages or actions... (Ctrl + K)" autocomplete="off" aria-label="Command search">
              <span class="cmd-kbd">ESC</span>
            </div>
            <div class="cmd-palette-results" id="cmd-results-list" role="listbox">
              <!-- Populated dynamically -->
            </div>
            <div class="cmd-palette-footer">
              <span><kbd>↑↓</kbd> Navigate</span>
              <span><kbd>Enter</kbd> Select</span>
              <span><kbd>Esc</kbd> Close</span>
            </div>
          </div>
        </div>`;
        $('body').append(paletteHTML);
    }

    // Command palette items directory database
    const commandsList = [
        { name: "Go to Home Section", type: "navigation", target: "#home", icon: "fa-home" },
        { name: "Go to About Section", type: "navigation", target: "#about", icon: "fa-user" },
        { name: "Go to Skills Section", type: "navigation", target: "#skills", icon: "fa-laptop-code" },
        { name: "Go to Experience Section", type: "navigation", target: "#experience", icon: "fa-briefcase" },
        { name: "Go to Projects Section", type: "navigation", target: "#work", icon: "fa-project-diagram" },
        { name: "Go to Contact Section", type: "navigation", target: "#contact", icon: "fa-headset" },
        { name: "View Engineering Project Archive", type: "page", target: "/projects/", icon: "fa-archive" },
        { name: "View Full Experience Timeline", type: "page", target: "/experience/", icon: "fa-history" },
        { name: "Download Resume PDF", type: "action", action: "download-resume", icon: "fa-file-pdf" },
        { name: "Copy Email Address", type: "action", action: "copy-email", icon: "fa-envelope" },
        { name: "Copy Phone Number", type: "action", action: "copy-phone", icon: "fa-phone-alt" },
        { name: "Share Portfolio Link", type: "action", action: "share-portfolio", icon: "fa-share-alt" },
        { name: "Verify LinkedIn Profile", type: "social", target: "https://linkedin.com/in/riteshmaurya07", icon: "fa-linkedin" },
        { name: "Verify GitHub Profile", type: "social", target: "https://github.com/Riteshmaurya07", icon: "fa-github" },
        { name: "Verify LeetCode Profile", type: "social", target: "https://leetcode.com/riteshmaurya07", icon: "fa-code" }
    ];

    let activeIndex = 0;
    const palette = document.getElementById("command-palette");
    const searchInput = document.getElementById("cmd-search-input");
    const resultsContainer = document.getElementById("cmd-results-list");

    // Open/Close Command Palette
    function openPalette() {
        palette.classList.add("active");
        palette.setAttribute("aria-hidden", "false");
        setTimeout(() => searchInput.focus(), 50);
        renderResults("");
    }

    function closePalette() {
        palette.classList.remove("active");
        palette.setAttribute("aria-hidden", "true");
        searchInput.value = "";
    }

    // Toggle shortcut (Ctrl + K or Cmd + K)
    $(document).keydown(function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (palette.classList.contains("active")) {
                closePalette();
            } else {
                openPalette();
            }
        }
        if (e.key === "Escape") {
            closePalette();
        }
    });

    // Close on overlay click
    $(palette).click(function (e) {
        if (e.target === palette) {
            closePalette();
        }
    });

    // Handle Input change search
    $(searchInput).on("input", function () {
        renderResults(this.value);
    });

    // Fuzzy matching logic
    function renderResults(query) {
        resultsContainer.innerHTML = "";
        let filtered = commandsList;

        if (query.trim() !== "") {
            const cleanQuery = query.toLowerCase();
            filtered = commandsList.filter(cmd => 
                cmd.name.toLowerCase().includes(cleanQuery) || 
                cmd.type.toLowerCase().includes(cleanQuery)
            );
        }

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `<div class="cmd-no-results">No matches found for "${query}"</div>`;
            return;
        }

        activeIndex = 0;
        let html = "";
        filtered.forEach((cmd, idx) => {
            const selectedClass = idx === 0 ? "selected" : "";
            const isExternal = cmd.target && cmd.target.startsWith("http") ? 'target="_blank"' : '';
            const actionAttr = cmd.action ? `data-action="${cmd.action}"` : '';
            const targetAttr = cmd.target ? `data-target="${cmd.target}"` : '';
            
            html += `
            <div class="cmd-item ${selectedClass}" role="option" aria-selected="${idx === 0 ? 'true' : 'false'}" ${actionAttr} ${targetAttr} data-index="${idx}">
              <i class="fas ${cmd.icon}"></i>
              <span class="cmd-name">${cmd.name}</span>
              <span class="cmd-badge">${cmd.type}</span>
            </div>`;
        });
        resultsContainer.innerHTML = html;
        setupItemClicks();
    }

    // Keyboard navigation controls
    $(searchInput).keydown(function (e) {
        const items = $(".cmd-item");
        if (items.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            items.eq(activeIndex).removeClass("selected").attr("aria-selected", "false");
            activeIndex = (activeIndex + 1) % items.length;
            items.eq(activeIndex).addClass("selected").attr("aria-selected", "true");
            scrollIntoView(items.eq(activeIndex));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            items.eq(activeIndex).removeClass("selected").attr("aria-selected", "false");
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            items.eq(activeIndex).addClass("selected").attr("aria-selected", "true");
            scrollIntoView(items.eq(activeIndex));
        } else if (e.key === "Enter") {
            e.preventDefault();
            triggerAction(items.eq(activeIndex));
        }
    });

    function scrollIntoView(element) {
        const containerTop = resultsContainer.scrollTop;
        const containerBottom = containerTop + resultsContainer.clientHeight;
        const elemTop = element[0].offsetTop;
        const elemBottom = elemTop + element[0].clientHeight;

        if (elemBottom > containerBottom) {
            resultsContainer.scrollTop = elemBottom - resultsContainer.clientHeight;
        } else if (elemTop < containerTop) {
            resultsContainer.scrollTop = elemTop;
        }
    }

    function setupItemClicks() {
        $(".cmd-item").click(function () {
            triggerAction($(this));
        });
    }

    function triggerAction(element) {
        const target = element.attr("data-target");
        const action = element.attr("data-action");

        closePalette();

        if (target) {
            if (target.startsWith("http")) {
                window.open(target, "_blank");
            } else if (target.startsWith("#")) {
                // Scroll to homepage section
                const section = document.querySelector(target);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Navigate to homepage section if currently on subpage
                    window.location.href = "/" + target;
                }
            } else {
                // Page redirection
                window.location.href = target;
            }
        } else if (action) {
            handleAction(action);
        }
    }

    // Share and Copy Helpers
    function handleAction(action) {
        if (action === "download-resume") {
            window.open("https://drive.google.com/file/d/1cdpvGrLe-in-xqpSkXvvt6jGzLjI_SSc/view?usp=sharing", "_blank");
            showToast("Opening Resume...", "success");
        } else if (action === "copy-email") {
            copyText("riteshmauryarm3@gmail.com", "Email copied to clipboard!");
        } else if (action === "copy-phone") {
            copyText("+91800+ (Simulated)", "Phone number copied!"); // Fallback check
        } else if (action === "share-portfolio") {
            copyText(window.location.origin, "Portfolio link copied!");
        }
    }

    function copyText(text, successMsg) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg, "success");
        }).catch(err => {
            console.error("Clipboard copy failed:", err);
        });
    }

    // Helper Toast Triggers
    function showToast(message, type = "success") {
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

        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
});
