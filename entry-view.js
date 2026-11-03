
/* --------------------------------
   OPEN A FILED THING
   -------------------------------- */

(async () => {

  const id = new URLSearchParams(window.location.search)
    .get("id");

  const title = document.querySelector("#entry-title");

  try {
    if (!id) {
      throw new Error("no entry was specified");
    }

    const response = await fetch("../data/things.json");

    if (!response.ok) {
      throw new Error("archive unavailable");
    }

    const entries = await response.json();

    const entry = entries.find(item => item.id === id);

    if (!entry) {
      throw new Error("entry not found");
    }

    // Page heading and metadata.
    document.title = `${entry.title} — roachcraft`;

    title.textContent = entry.title;

    document.querySelector("#entry-meta").textContent =
      entry.date || "date unrecorded";

    // Main photograph.
    const figure = document.querySelector("#entry-figure");
    const image = document.querySelector("#entry-image");

    image.src = "../" + entry.image.replace(/^\.\//, "");
    image.alt = entry.alt || entry.title;

    document.querySelector("#entry-caption").textContent =
      entry.detail || "";

    figure.hidden = false;

    // Optional written observations.
    const body = document.querySelector("#entry-body");

    if (Array.isArray(entry.body)) {
      for (const paragraph of entry.body) {
        const p = document.createElement("p");
        p.textContent = paragraph;
        body.append(p);
      }
    }

  } catch (error) {
    title.textContent =
      "this file appears to have wandered off.";

    console.warn(error);
  }

})();
