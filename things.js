
/* THE DRAWER HAS BEEN DISTURBED */

document.addEventListener("DOMContentLoaded", () => {

  // Find every artwork card in both piles
  const cards = [
    ...document.querySelectorAll(".object-grid > .object-card"),
    ...document.querySelectorAll(".drawer-additions > .object-card")
  ];

  // Keep each artwork, title, and link together
  const contents = cards.map(card => [...card.children]);

  // Shuffle the contents randomly
  for (let i = contents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [contents[i], contents[j]] =
      [contents[j], contents[i]];
  }

  // Put the shuffled contents into the existing positions
  cards.forEach((card, index) => {
    card.replaceChildren(...contents[index]);
  });

});
