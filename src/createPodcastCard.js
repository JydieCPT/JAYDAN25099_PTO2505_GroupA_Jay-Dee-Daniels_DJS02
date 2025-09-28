import { GenreService } from "../src/genreService.js";
import { DateUtils } from "../src/dateUtils.js";

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

/**
 * A custom Web Component representing a podcast preview card.
 *
 * When the card is clicked, it dispatches a `podcast-selected` event with the
 * podcast’s data in `event.detail.podcast`. The data comes from the internal
 * `_podcast` property or, if that’s empty, from the element’s attributes.
 *
 * @element podcast-card
 * @fires podcast-selected - Fired when the card is clicked. 
 *   `detail.podcast` contains the associated podcast object.
 */
class PodcastCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._podcast = null;

    // Delegate click to dispatch custom event
    this.shadowRoot?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('podcast-selected', {
        detail: { podcast: this._podcast || this._attributesToObject() },
        bubbles: true,
        composed: true
      }));
    });
  }

  /**
 * Lifecycle and attribute handling for the <podcast-card> component.
 *
 * - `connectedCallback()` is called automatically when the element is added
 *   to the DOM and triggers an initial render.
 * - `observedAttributes` declares which attributes should be watched for changes.
 * - `attributeChangedCallback()` re-renders the component whenever one of the
 *   observed attributes changes to a new value.
 */
  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'image', 'description', 'genres', 'seasons', 'updated'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
 * Gets or sets the podcast data object for this <podcast-card>.
 *
 * - Setting `podcast` updates the internal `_podcast` property
 *   and re-renders the card.
 * - Getting `podcast` returns the currently stored podcast object.
 *
 * @type {Object|null}
 */
  // Accept podcast object via property
  set podcast(data) {
    this._podcast = data;
    this.render();
  }
  get podcast() {
    return this._podcast;
  }

  /**
 * Builds a plain object from the element’s current attributes.
 * Used as a fallback when no podcast object has been assigned.
 *
 * @private
 * @returns {{title: string|null, image: string|null, description: string|null,
 *            genres: string|null, seasons: string|null, updated: string|null}}
 * An object containing the attribute values.
 */
  // Convert attributes to an object for fallback
  _attributesToObject() {
    return {
      title: this.getAttribute('title'),
      image: this.getAttribute('image'),
      description: this.getAttribute('description'),
      genres: this.getAttribute('genres'),
      seasons: this.getAttribute('seasons'),
      updated: this.getAttribute('updated')
    };
  }

  /**
 * Renders the visual content of the <podcast-card>.
 *
 * - Uses the `_podcast` property if present; otherwise converts
 *   the element’s attributes into an object for data.
 * - Safely falls back to default values for missing fields.
 * - Formats the `genres` array into a comma-separated string.
 * - Formats the `updated` date into a readable local date string.
 *
 * @returns {void}
 */
  render() {
    // Prefer property data if provided
    const data = this._podcast || this._attributesToObject();

    const title = data.title || 'Untitled Podcast';
    const image = data.image || 'placeholder.jpg';
    const genres =
      Array.isArray(data.genres)
        ? data.genres.join(', ')
        : (data.genres || '');
    const seasons = data.seasons || '—';
    const updated = data.updated
      ? new Date(data.updated).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : '';

      /**
 * Updates the shadow DOM for <podcast-card> with styled HTML.
 *
 * - Injects internal `<style>` rules for a responsive card layout.
 * - Displays the podcast’s image, title, genres, seasons, and last-updated date.
 * - Uses template literals to insert the current property/attribute values.
 *
 * After defining the class, the component is registered under the name
 * `podcast-card` so it can be used directly in HTML.
 *
 * @example
 * <podcast-card
 *   title="My Show"
 *   image="cover.jpg"
 *   genres="Comedy"
 *   seasons="3"
 *   updated="2024-09-01"
 * ></podcast-card>
 */
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 300px;
          margin: 0 auto;
        }
        .card {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease;
          background: #fff;
        }
        .card:hover {
          transform: scale(1.02);
        }
        img {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: cover;
        }
        .content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: .25rem;
        }
        h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .meta {
          font-size: 0.85rem;
          color: #555;
        }
        @media (min-width: 600px) {
          :host {
            max-width: 250px;
          }
        }
      </style>
      <div class="card">
        <img src="${image}" alt="${title}">
        <div class="content">
          <h3>${title}</h3>
          ${genres ? `<div class="meta">Genres: ${genres}</div>` : ''}
          <div class="meta">Seasons: ${seasons}</div>
          ${updated ? `<div class="meta">Last updated: ${updated}</div>` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('podcast-card', PodcastCard);
