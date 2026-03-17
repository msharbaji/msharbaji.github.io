/**
 * Shared JS for Prompt-Engineering course slides.
 * Theme detection/toggle, quiz, and copy-code helpers.
 * ──────────────────────────────────────────────────── */

/* ── Theme IIFE — runs immediately ── */
(function () {
  var root = document.documentElement;

  function getPreferred() {
    var stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function apply(mode) {
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    updateToggleIcon(mode);
  }

  function updateToggleIcon(mode) {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.textContent = mode === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
    btn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  // Initial apply (before CSS loads, preventing flash)
  apply(getPreferred());

  // Listen for OS-level changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      var stored = localStorage.getItem("theme");
      if (!stored || stored === "system") {
        apply(e.matches ? "dark" : "light");
      }
    });

  // Cross-tab sync
  window.addEventListener("storage", function (e) {
    if (e.key === "theme") {
      apply(getPreferred());
    }
  });

  // Expose toggle globally
  window.toggleTheme = function () {
    var current = root.classList.contains("dark") ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    apply(next);
  };

  // Enable smooth transitions after first paint
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.add("theme-ready");
    });
  });
})();

/* ── Quiz ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- called via onclick in HTML
function checkAnswer(btn, isCorrect) {
  var question = btn.parentElement;
  var buttons = question.querySelectorAll(".quiz-option");
  var fb = question.querySelector(".quiz-feedback");

  // Disable all buttons
  buttons.forEach(function (b) {
    b.disabled = true;
    b.style.cursor = "default";
    b.style.opacity = "0.7";
  });

  var correctText =
    btn.getAttribute("data-correct-text") || "\u2705 Correct!";
  var wrongText =
    btn.getAttribute("data-wrong-text") ||
    "\u274C Not quite \u2014 see the highlighted correct answer above.";

  if (isCorrect) {
    btn.classList.add("correct");
    btn.style.opacity = "1";
    fb.textContent = correctText;
    fb.className = "quiz-feedback feedback-correct";
  } else {
    btn.classList.add("wrong");
    btn.style.opacity = "1";
    // Highlight correct answer
    buttons.forEach(function (b) {
      if (b.getAttribute("onclick") && b.getAttribute("onclick").indexOf("true") !== -1) {
        b.classList.add("correct");
        b.style.opacity = "1";
      }
    });
    fb.textContent = wrongText;
    fb.className = "quiz-feedback feedback-wrong";
  }
}

/* ── Copy Code ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- called via onclick in HTML
function copyCode(btn) {
  var pre = btn.closest(".code-block").querySelector("pre");
  var copiedText = btn.getAttribute("data-copied-text") || "Copied!";
  var originalText = btn.textContent;
  navigator.clipboard.writeText(pre.textContent).then(function () {
    btn.textContent = copiedText;
    setTimeout(function () {
      btn.textContent = originalText;
    }, 2000);
  });
}
