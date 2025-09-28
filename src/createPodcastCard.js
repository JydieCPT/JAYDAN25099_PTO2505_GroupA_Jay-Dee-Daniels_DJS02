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

  // Accept podcast object via property
  set podcast(data) {
    this._podcast = data;
    this.render();
  }
  get podcast() {
    return this._podcast;
  }

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
