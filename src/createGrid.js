import { createPodcastCard } from "../components/createPodcastCard.js";
import { createModal } from "../components/createModal.js";

/**
 * Grid Renderer - Responsible for rendering the grid of podcast cards.
 *
 * @principle SRP - Manages layout and rendering only; delegates card creation and modal logic elsewhere.
 */
export const createGrid = () => {
  const container = document.getElementById("podcastGrid");

  return {
    /**
     * Renders a list of podcast cards into the grid.
     * @param {Object[]} podcastList - Array of podcast objects.
     */
    render(podcastList) {
      container.innerHTML = "";
      podcastList.forEach((p) => {
        const card = createPodcastCard(p, createModal.open);
        container.appendChild(card);
      });
    },
  };
};
