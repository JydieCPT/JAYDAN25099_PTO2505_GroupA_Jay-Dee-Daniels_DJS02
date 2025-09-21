import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";
import { seasons } from "../data.js";

/**
 * Modal Controller - Controls the podcast details modal.
 *
 * @principle SRP - Handles modal logic only (open, close, update content).
 * @principle OCP - Open/Closed Principle: New fields (e.g. ratings) could be added to modal without modifying external usage.
 */
export const createModal = (() => {
  const el = (id) => document.getElementById(id);
  const modal = el("modal");

  /**
   * Updates the modal content with podcast details.
   * @param {Object} podcast - Podcast object.
   */
  function updateContent(podcast) {
    el("modalImage").src = podcast.image;
    el("modalTitle").textContent = podcast.title;
    el("modalDesc").textContent = podcast.description;

    el("modalGenres").innerHTML = GenreService.getNames(podcast.genres)
      .map((g) => `<span class="tag">${g}</span>`)
      .join("");

    el("modalUpdated").textContent = DateUtils.format(podcast.updated);

    const seasonData =
      seasons.find((s) => s.id === podcast.id)?.seasonDetails || [];
    el("seasonList").innerHTML = seasonData
      .map(
        (s, index) => `
          <li class="season-item">
            <strong class="season-title">Season ${index + 1}: ${
          s.title
        }</strong>
            <span class="episodes">${s.episodes} episodes</span>
          </li>`
      )
      .join("");
  }

  return {
    /**
     * Opens the modal with podcast details.
     * @param {Object} podcast - Podcast object.
     */
    open(podcast) {
      updateContent(podcast);
      modal.classList.remove("hidden");
    },
    /** Closes the modal. */
    close() {
      modal.classList.add("hidden");
    },
  };
})();
