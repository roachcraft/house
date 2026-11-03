
/* --------------------------------
   THE DRAWER HAS BEEN DISTURBED
   -------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {

  const additions = document.querySelector(".drawer-additions");

  if (!additions) return;

  /* --------------------------------
     NEW THINGS FROM THE ARCHIVE
     -------------------------------- */

  try {
    const response = await fetch("./data/things.json");

    if (!response.ok) {
      throw new Error("could not open the things archive");
    }

    const entries = await response.json();

    if (!Array.isArray(entries)) {
      throw new Error("things.json must contain an array");
    }

    // Avoid duplicating existing hand-built entry pages.
    const existingPages = new Set(
      [...document.querySelectorAll(".object-link")]
        .map(link => link.getAttribute("href"))
    );

    let added = 0;

    for (const entry of entries) {

      if (!entry.id || !entry.title || !entry.image) {
        console.warn("incomplete archive entry:", entry);
        continue;
      }

      if (entry.page && existingPages.has(entry.page)) {
        continue;
      }

      // Make a new physical card.
      const card = document.createElement("article");

      const position = added++;
      const side = position % 2 === 0 ? "left" : "right";

      card.className =
        `object-card object-card--autofiled object-card--slot-${side}`;

      // The existing additions occupy rows 1 through 5.
      // New cards continue beneath them.
      card.style.gridRow =
        String(6 + Math.floor(position / 2));

      // Create the entry link.
      const link = document.createElement("a");
      link.className = "object-link";

      link.href = entry.page ||
        `./entries/view.html?id=${encodeURIComponent(entry.id)}`;

      // Photograph.
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = "./" + entry.image.replace(/^\.\//, "");
      img.alt = entry.alt || entry.title;
      img.loading = "lazy";

      // Label.
      const caption = document.createElement("figcaption");

      const title = document.createElement("span");
      title.className = "object-title";
      title.textContent = entry.title;

      const detail = document.createElement("span");
      detail.className = "object-detail";
      detail.textContent = entry.detail || "";

      caption.append(title, detail);
      figure.append(img, caption);
      link.append(figure);

      // Little invitation underneath.
      const hint = document.createElement("p");
      hint.className = "object-hint";
      hint.textContent = "open entry →";

      card.append(link, hint);
      additions.append(card);
    }

  } catch (error) {
    // Keep the existing drawer working even if JSON fails.
    console.warn("the archive is having a moment:", error);
  }


  /* --------------------------------
     SHUFFLE EVERYTHING
     -------------------------------- */

  const cards = [
    ...document.querySelectorAll(".object-grid > .object-card"),
    ...document.querySelectorAll(".drawer-additions > .object-card")
  ];

  // Preserve every artwork's title, link, and image.
  const contents = cards.map(card => [...card.children]);

  // Fisher-Yates shuffle.
  for (let i = contents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [contents[i], contents[j]] =
      [contents[j], contents[i]];
  }

  // Put shuffled artwork into the existing physical slots.
  cards.forEach((card, index) => {
    card.replaceChildren(...contents[index]);
  });

});
