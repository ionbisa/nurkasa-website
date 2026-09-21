(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const currentYear = document.getElementById("currentYear");
  const navbar = document.getElementById("mainNavbar");
  const navbarCollapse = document.getElementById("navbarNav");
  const backToTop = document.getElementById("backToTop");
  const mobileBreakpoint = 992;
  const navToggleButton = navbar?.querySelector(".navbar-toggler");
  const navToggleIcon = navbar?.querySelector(".navbar-toggler i");

  const navLinks = Array.from(document.querySelectorAll("#navbarNav a"));
  const sectionLinks = navLinks.filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#");
  });
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const contactForm = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  const defaultSubmitLabel = submitButton?.textContent.trim() || "Kirim Pesan";
  const whatsappNumber = "628533388295";

  const getNavIconClass = (href = "") => {
    if (href.includes("#home")) {
      return "bi-house-door";
    }

    if (href.includes("#about")) {
      return "bi-buildings";
    }

    if (href.includes("#business")) {
      return "bi-diagram-3";
    }

    if (href.includes("#advantages")) {
      return "bi-stars";
    }

    if (href.includes("portal-berita.html")) {
      return "bi-newspaper";
    }

    if (href.includes("Lamaran-kerja.html") || href.includes("career")) {
      return "bi-briefcase";
    }

    if (href.includes("#gallery")) {
      return "bi-images";
    }

    if (href.includes("#location")) {
      return "bi-geo-alt";
    }

    if (href.includes("#contact")) {
      return "bi-chat-dots";
    }

    return "bi-arrow-right";
  };

  const decorateNavbarLinks = () => {
    document.querySelectorAll("#navbarNav .nav-link").forEach((link) => {
      if (link.querySelector(".nav-link-label")) {
        return;
      }

      const labelText = link.textContent.trim();
      const iconWrapper = document.createElement("span");
      iconWrapper.className = "mobile-nav-link-icon";
      iconWrapper.setAttribute("aria-hidden", "true");

      const icon = document.createElement("i");
      icon.className = `bi ${getNavIconClass(link.getAttribute("href") || "")}`;
      iconWrapper.append(icon);

      const label = document.createElement("span");
      label.className = "nav-link-label";
      label.textContent = labelText;

      link.textContent = "";
      link.append(iconWrapper, label);
    });

    const navCta = document.querySelector("#navbarNav .btn.btn-gold");
    if (!navCta || navCta.querySelector(".nav-cta-label")) {
      return;
    }

    const ctaText = navCta.textContent.trim();
    const iconWrapper = document.createElement("span");
    iconWrapper.className = "mobile-nav-cta-icon";
    iconWrapper.setAttribute("aria-hidden", "true");

    const icon = document.createElement("i");
    icon.className = "bi bi-telephone-forward";
    iconWrapper.append(icon);

    const label = document.createElement("span");
    label.className = "nav-cta-label";
    label.textContent = ctaText;

    navCta.textContent = "";
    navCta.append(iconWrapper, label);
  };

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  decorateNavbarLinks();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const updateScrollUi = () => {
    const isScrolled = window.scrollY > 24;
    navbar?.classList.toggle("scrolled", isScrolled);
    backToTop?.classList.toggle("show", window.scrollY > 360);
  };

  const updateActiveNavLink = () => {
    if (!sections.length) {
      return;
    }

    const currentSection =
      sections
        .slice()
        .reverse()
        .find((section) => window.scrollY >= section.offsetTop - 180) ||
      sections[0];

    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection.id}`;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const closeMobileMenu = () => {
    if (
      !navbarCollapse ||
      !navbarCollapse.classList.contains("show") ||
      !window.bootstrap?.Collapse
    ) {
      return;
    }

    const collapse =
      window.bootstrap.Collapse.getInstance(navbarCollapse) ||
      new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
    collapse.hide();
  };

  const isMobileViewport = () => window.innerWidth < mobileBreakpoint;

  const setMobileMenuState = (isOpen) => {
    if (!navbar) {
      return;
    }

    const shouldEnable = isOpen && isMobileViewport();
    navbar.classList.toggle("menu-open", shouldEnable);
    document.body.classList.toggle("mobile-nav-open", shouldEnable);

    if (navToggleButton) {
      navToggleButton.setAttribute("aria-expanded", String(shouldEnable));
      navToggleButton.setAttribute(
        "aria-label",
        shouldEnable ? "Tutup navigasi" : "Buka navigasi",
      );
    }

    if (navToggleIcon) {
      navToggleIcon.classList.toggle("bi-list", !shouldEnable);
      navToggleIcon.classList.toggle("bi-x-lg", shouldEnable);
    }
  };

  const syncMobileMenuState = () => {
    if (!navbarCollapse) {
      return;
    }

    setMobileMenuState(navbarCollapse.classList.contains("show"));
  };

  const buildContactWhatsappUrl = () => {
    if (!contactForm) {
      return `https://wa.me/${whatsappNumber}`;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const lines = [
      "Halo CV Nurkasa Jaya Pertiwi,",
      "",
      "Saya ingin menghubungi tim perusahaan dengan detail berikut:",
      `Nama: ${name}`,
      `Email: ${email}`,
      `Telepon: ${phone}`,
      `Subjek: ${subject}`,
      "Pesan:",
      message,
    ];

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;
  };

  const setupNewsCollection = ({
    inputId,
    listId,
    itemSelector,
    emptyStateId,
    filterButtonsSelector,
    prevButtonId,
    nextButtonId,
    pageInfoId,
    pageNumbersId,
    resultsInfoId,
    titleOnly = false,
    defaultPageSize,
  }) => {
    const list = document.getElementById(listId);
    const items = Array.from(list?.querySelectorAll(itemSelector) || []);

    if (!list || !items.length) {
      return;
    }

    const input = document.getElementById(inputId);
    const emptyState = emptyStateId
      ? document.getElementById(emptyStateId)
      : null;
    const filterButtons = filterButtonsSelector
      ? Array.from(document.querySelectorAll(filterButtonsSelector))
      : [];
    const prevButton = prevButtonId
      ? document.getElementById(prevButtonId)
      : null;
    const nextButton = nextButtonId
      ? document.getElementById(nextButtonId)
      : null;
    const pageInfo = pageInfoId ? document.getElementById(pageInfoId) : null;
    const pageNumbers = pageNumbersId
      ? document.getElementById(pageNumbersId)
      : null;
    const resultsInfo = resultsInfoId
      ? document.getElementById(resultsInfoId)
      : null;

    const pageSize =
      Number(list.dataset.pageSize || defaultPageSize || items.length) ||
      items.length;
    let currentPage = 1;
    let activeFilter =
      filterButtons.find((button) => button.classList.contains("active"))
        ?.dataset.newsFilter || "all";

    const getMatches = () => {
      const keyword = input?.value.trim().toLowerCase() || "";

      return items.filter((item) => {
        const fallbackTitle =
          item.dataset.newsTitle ||
          item.querySelector("h3, h4")?.textContent ||
          "";
        const haystack = titleOnly
          ? fallbackTitle
          : `${fallbackTitle} ${item.textContent}`;
        const category = item.dataset.newsCategory || "all";
        const matchesCategory =
          activeFilter === "all" || category === activeFilter;

        return (
          matchesCategory &&
          (!keyword || haystack.toLowerCase().includes(keyword))
        );
      });
    };

    const render = () => {
      const matches = getMatches();
      const totalPages = matches.length
        ? Math.ceil(matches.length / pageSize)
        : 1;
      currentPage = Math.min(currentPage, totalPages);

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const visibleItems = new Set(matches.slice(start, end));

      items.forEach((item) => {
        const isVisible = visibleItems.has(item);
        item.classList.toggle("d-none", !isVisible);
      });

      emptyState?.classList.toggle("d-none", matches.length !== 0);

      filterButtons.forEach((button) => {
        const isActive = button.dataset.newsFilter === activeFilter;
        button.classList.toggle("active", isActive);
        if (isActive) {
          button.setAttribute("aria-pressed", "true");
        } else {
          button.setAttribute("aria-pressed", "false");
        }
      });

      if (resultsInfo) {
        const activeFilterLabel =
          filterButtons.find(
            (button) => button.dataset.newsFilter === activeFilter,
          )?.textContent || "Semua";
        resultsInfo.textContent = matches.length
          ? `Menampilkan ${start + 1}-${Math.min(end, matches.length)} dari ${matches.length} berita • ${activeFilterLabel}`
          : "Menampilkan 0 dari 0 berita";
      }

      if (pageInfo) {
        pageInfo.textContent = matches.length
          ? `Halaman ${currentPage} / ${totalPages}`
          : "Halaman 0 / 0";
      }

      if (prevButton) {
        prevButton.disabled = currentPage <= 1 || matches.length === 0;
      }

      if (nextButton) {
        nextButton.disabled = currentPage >= totalPages || matches.length === 0;
      }

      if (pageNumbers) {
        pageNumbers.replaceChildren();

        if (matches.length > 0) {
          for (let page = 1; page <= totalPages; page += 1) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "portal-page-btn";
            button.textContent = String(page);

            if (page === currentPage) {
              button.classList.add("active");
              button.setAttribute("aria-current", "page");
            }

            button.addEventListener("click", () => {
              currentPage = page;
              render();
            });

            pageNumbers.append(button);
          }
        }
      }
    };

    input?.addEventListener("input", () => {
      currentPage = 1;
      render();
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.newsFilter || "all";
        currentPage = 1;
        render();
      });
    });

    prevButton?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        render();
      }
    });

    nextButton?.addEventListener("click", () => {
      const totalPages = Math.ceil(getMatches().length / pageSize) || 1;

      if (currentPage < totalPages) {
        currentPage += 1;
        render();
      }
    });

    render();
  };

  const handleContactSubmit = (event) => {
    if (!contactForm || !submitButton) {
      return;
    }

    event.preventDefault();
    formAlert?.classList.add("d-none");

    if (!contactForm.checkValidity()) {
      contactForm.classList.add("was-validated");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Menyiapkan WhatsApp...";

    const whatsappUrl = buildContactWhatsappUrl();
    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );

    if (!whatsappWindow) {
      window.location.href = whatsappUrl;
      return;
    }

    contactForm.reset();
    contactForm.classList.remove("was-validated");
    submitButton.disabled = false;
    submitButton.textContent = defaultSubmitLabel;

    if (formAlert) {
      formAlert.textContent =
        "WhatsApp telah dibuka. Silakan lanjutkan pengiriman pesan kepada tim CV Nurkasa Jaya Pertiwi.";
      formAlert.classList.remove("d-none");
    }
  };

  updateScrollUi();
  updateActiveNavLink();

  setupNewsCollection({
    inputId: "searchPortalNews",
    listId: "portalNewsList",
    itemSelector: ".portal-news-item",
    emptyStateId: "portalNewsEmptyState",
    filterButtonsSelector: "#portalCategoryFilters .portal-filter-btn",
    prevButtonId: "portalPrev",
    nextButtonId: "portalNext",
    pageInfoId: "portalPageInfo",
    pageNumbersId: "portalPageNumbers",
    resultsInfoId: "portalResultsInfo",
    titleOnly: true,
    defaultPageSize: 2,
  });

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  window.addEventListener("resize", () => {
    if (!isMobileViewport()) {
      setMobileMenuState(false);
      return;
    }

    syncMobileMenuState();
  });

  backToTop?.addEventListener("click", scrollToTop);

  navToggleButton?.addEventListener("click", () => {
    window.setTimeout(syncMobileMenuState, 20);
  });

  navbarCollapse?.addEventListener("show.bs.collapse", () => {
    setMobileMenuState(true);
  });

  navbarCollapse?.addEventListener("shown.bs.collapse", syncMobileMenuState);

  navbarCollapse?.addEventListener("hidden.bs.collapse", () => {
    setMobileMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
    contactForm.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        formAlert?.classList.add("d-none");
      });
    });
  }

  syncMobileMenuState();
})();
