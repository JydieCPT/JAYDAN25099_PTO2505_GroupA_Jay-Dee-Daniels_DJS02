class PodcastCard extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM to encapsulate styles and markup
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Called each time element is inserted into the DOM
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'image', 'description'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Untitled Podcast';
    const image = this.getAttribute('image') || 'placeholder.jpg';
    const description = this.getAttribute('description') || 'No description available';

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          display: grid;
          grid-template-rows: auto 1fr;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .card:hover {
          transform: scale(1.02);
        }
        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .content {
          padding: 1rem;
        }
        h3 {
          margin: 0 0 .5rem;
          font-size: 1.2rem;
        }
        p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
      </style>
      <div class="card">
        <img src="${image}" alt="${title}">
        <div class="content">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      </div>
    `;
  }
}

// Register the custom element (tag name stays kebab-case)
customElements.define('podcast-card', PodcastCard);
