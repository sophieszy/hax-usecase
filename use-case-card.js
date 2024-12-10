import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/simple-icon/simple-icon.js';


export class UseCaseCard extends DDDSuper(I18NMixin(LitElement)) {
  static get properties() {
    return {
      image: { type: String },
      title: { type: String },
      description: { type: String },
      attributes: { type: Array },
      active: { type: Boolean },  // For active state styling
    };
  }

  static styles = css`
    .card {
      background-color: var(--ddd-theme-default-white);
      border: var(--ddd-border-lg) solid var(--ddd-theme-default-limestoneGray);
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      width: 280px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: border-color 0.3s ease, transform 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .active {
      border-color: blue;
      box-shadow: var(--ddd-boxShadow-lg) rgba(0, 0, 255, 0.2);
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: var(--ddd-spacing-2);
    }

    h3 {
      margin: var(--ddd-spacing-4);
      font-size: var(--ddd-font-size-sm);
      color: var(--ddd-theme-default-potentialMidnight);
    }

    p {
      font-size: 0.9em;
      color: var(--ddd-theme-default-potentialMidnight);
    }

    

    .attributes {
      display: flex;
      gap: 10px;
    }

    .attribute-circle {
  background-color: #eee;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  border-radius: var(--ddd-radius-circle);
}

simple-icon {
  width: 20px;
  height: 20px;
  color: #555;  /* Customize icon color */
}

/* Attribute label styling */
.attribute-label {
  visibility: hidden;
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.attribute-circle:hover .attribute-label {
  visibility: visible;
  opacity: 1;
}

.attributes-and-button {
  display: flex; /* Enables flexbox */
  flex-wrap: nowrap; /* Ensures content stays in one row */
  align-items: center; /* Aligns items vertically */
  justify-content: space-between; /* Spreads out the content */
  gap: 15px; /* Space between attributes and the button */
  width: 100%; /* Ensures the container spans the card's width */
  margin-top: 15px; /* Adds spacing from the content above */
}

    button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;

  render() {
    return html`
      <div class="card ${this.active ? 'active' : ''}">
        <img src="${this.image}" alt="${this.title}">
        <h3>${this.title}</h3>
        <p>${this.description}</p>

        <div class="attributes-and-button">
        <div class="attributes">
          ${this.attributes.map(attribute => html`
            <div class="attribute-circle">
              <simple-icon icon=${attribute.icon}> </simple-icon>
              <div class="attribute-label">${attribute.label}</div>
            </div>
          `)}
        </div>

        <button @click=${this._handleSelect}>
          ${this.active ? 'Selected' : 'Select'}
        </button>
      </div>
          </div>
    `;
  }

  _handleSelect() {
    this.dispatchEvent(new CustomEvent('card-selected', {
      detail: { title: this.title },  // Send any data needed to the parent
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('use-case-card', UseCaseCard);
