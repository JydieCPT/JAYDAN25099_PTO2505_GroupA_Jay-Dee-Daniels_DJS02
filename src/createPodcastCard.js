import { GenreService } from "../utils/GenreService.js";
import { DateUtils } from "../utils/DateUtils.js";

/**
 * Podcast Card Factory - Creates a DOM element for a podcast preview card.
 *
 * @principle SRP - Only responsible for rendering one podcast card.
 * @principle OCP - Card rendering logic can be extended (e.g., add badges or icons) without changing other modules.
 *
 * @param {Object} podcast - Podcast object.
 * @param {Function} onClick - Function to call on card click.
 * @returns {HTMLDivElement} The constructed card element.
 */
export const createPodcastCard = (podcast, onClick) => {
  const genreNames = GenreService.getNames(podcast.genres);
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = podcast.id;

  card.innerHTML = `
    <img src="${podcast.image}" alt="${podcast.title} cover"/>
    <h3>${podcast.title}</h3>
    <p>${podcast.seasons} season${podcast.seasons > 1 ? "s" : ""}</p>
    <div class="tags">${genreNames
      .map((g) => `<span class="tag">${g}</span>`)
      .join("")}</div>
    <p class="updated-text">${DateUtils.format(podcast.updated)}</p>
  `;

  card.addEventListener("click", () => onClick(podcast));
  return card;
};
