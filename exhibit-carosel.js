
/* --------------------------------
   ROACHCRAFT / EXHIBIT CAROUSELS
-------------------------------- */

document.querySelectorAll("[data-exhibit-carousel]")
  .forEach((carousel) => {

    const track = carousel.querySelector(
      "[data-carousel-track]"
    );

    const slides = [...track.querySelectorAll(
      ".exhibit-slide"
    )];

    const previous = carousel.querySelector(
      "[data-carousel-prev]"
    );

    const next = carousel.querySelector(
      "[data-carousel-next]"
    );

    const counter = carousel.querySelector(
      "[data-carousel-count]"
    );

    if (!slides.length) return;

    const total = slides.length;

    const currentIndex = () => {
      return Math.max(
        0,
        Math.min(
          total - 1,
          Math.round(track.scrollLeft / track.clientWidth)
        )
      );
    };

    const update = () => {
      const index = currentIndex();

      counter.textContent =
        `${String(index + 1).padStart(2, "0")} / ` +
        `${String(total).padStart(2, "0")}`;

      previous.disabled = index === 0;
      next.disabled = index === total - 1;
    };

    const goTo = (index) => {
      const target = Math.max(
        0,
        Math.min(total - 1, index)
      );

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reduceMotion ? "instant" : "smooth"
      });
    };

    previous.addEventListener("click", () => {
      goTo(currentIndex() - 1);
    });

    next.addEventListener("click", () => {
      goTo(currentIndex() + 1);
    });

    /* Support arrow keys when using the viewer */

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex() - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex() + 1);
      }
    });

    /* Update the counter during touch/trackpad scrolling */

    track.addEventListener("scroll", update, {
      passive: true
    });

    update();
  });
