"use strict";

(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const widgetURL = (resource) => {
    const url = new URL("https://w.soundcloud.com/player/");
    url.search = new URLSearchParams({
      url: resource,
      color: "#c3ef85",
      auto_play: "false",
      hide_related: "true",
      show_comments: "false",
      show_user: "true",
      show_reposts: "false",
      show_teaser: "false",
      visual: "true",
    });
    return url.href;
  };

  const makePlayer = (resource, title) => {
    const iframe = document.createElement("iframe");
    iframe.src = widgetURL(resource);
    iframe.title = title;
    iframe.allow = "autoplay; encrypted-media";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.width = "100%";
    iframe.height = title.toLowerCase().includes("profil") ? "450" : "300";
    return iframe;
  };

  const profile = document.getElementById("profile-player");
  function loadProfile() {
    if (profile.querySelector("iframe")) return;
    const player = makePlayer(
      "https://api.soundcloud.com/users/776350792",
      "Profil SoundCloud de Boiled Stone",
    );
    profile.prepend(player);
    player.addEventListener(
      "load",
      () => {
        profile.querySelector(".player-placeholder")?.remove();
        profile.classList.add("is-loaded");
      },
      { once: true },
    );
  }
  if ("IntersectionObserver" in window) {
    const playerObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadProfile();
        observer.disconnect();
      },
      { rootMargin: "180px" },
    );
    playerObserver.observe(profile);
  } else loadProfile();

  // The eight directions are the complete sequence; no extra keys are required.
  const sequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ];
  let recent = [];
  let unlocked = false;
  const secret = document.getElementById("secret-track");
  const dialog = document.querySelector(".lightbox");

  function acceptDirection(key) {
    if (unlocked || dialog.open) return;
    recent.push(key);
    recent = recent.slice(-sequence.length);
    if (
      recent.length !== sequence.length ||
      !sequence.every((key, i) => recent[i] === key)
    )
      return;
    unlocked = true;
    secret.hidden = false;
    document
      .getElementById("secret-player")
      .append(
        makePlayer(
          "https://api.soundcloud.com/tracks/2178270513?secret_token=s-TPn9grrBKiu",
          "Piste secrète — bonusecretProject_51",
        ),
      );
    document.getElementById("announcement").textContent =
      "La piste bonus est maintenant disponible.";
    document.getElementById("secret-title").focus({ preventScroll: true });
    secret.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.isComposing
    )
      return;
    if (
      event.target instanceof Element &&
      event.target.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
      )
    )
      return;
    if (sequence.includes(event.key)) acceptDirection(event.key);
    else recent = [];
  });

  const items = [...document.querySelectorAll(".gallery-item")];
  const moreGallery = document.querySelector(".more-gallery");
  moreGallery.addEventListener("toggle", () => {
    moreGallery.querySelector(".more-label").textContent = moreGallery.open
      ? "Réduire"
      : "Voir les 6 autres";
  });
  const image = document.getElementById("lightbox-image");
  const imageBox = dialog.querySelector(".lightbox-image");
  const error = dialog.querySelector(".lightbox-error");
  let activeIndex = 0;
  let opener;
  let browsable = items;

  function showImage(index) {
    activeIndex = (index + browsable.length) % browsable.length;
    const item = browsable[activeIndex];
    error.hidden = true;
    image.hidden = false;
    imageBox.classList.add("loading");
    image.alt = item.querySelector("img").alt;
    image.src = item.href;
    document.getElementById("lightbox-title").textContent = item.dataset.title;
    document.getElementById("lightbox-index").textContent =
      item.dataset.caption;
    document.getElementById("lightbox-position").textContent =
      `${String(activeIndex + 1).padStart(2, "0")} / ${String(browsable.length).padStart(2, "0")}`;
    const download = document.getElementById("lightbox-download");
    download.href = item.href;
    download.download = item.getAttribute("href").split("/").pop();
    error.querySelector("a").href = item.href;
  }

  image.addEventListener("load", () => imageBox.classList.remove("loading"));
  image.addEventListener("error", () => {
    imageBox.classList.remove("loading");
    image.hidden = true;
    error.hidden = false;
  });

  items.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      if (typeof dialog.showModal !== "function") return;
      event.preventDefault();
      opener = item;
      browsable = items.filter(
        (entry) => !entry.closest("details") || entry.closest("details").open,
      );
      showImage(browsable.indexOf(item));
      dialog.showModal();
      document.body.classList.add("modal-open");
      dialog.querySelector(".lightbox-close").focus();
    });
  });

  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  dialog
    .querySelector(".lightbox-prev")
    .addEventListener("click", () => showImage(activeIndex - 1));
  dialog
    .querySelector(".lightbox-next")
    .addEventListener("click", () => showImage(activeIndex + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      recent = [];
      showImage(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    recent = [];
    opener?.focus({ preventScroll: true });
  });

  if ("IntersectionObserver" in window) {
    const navLinks = [...document.querySelectorAll(".site-header nav a")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            if (link.hash === `#${entry.target.id}`)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: 0 },
    );
    ["accueil", "musique", "univers"].forEach((id) =>
      observer.observe(document.getElementById(id)),
    );
  }
})();
