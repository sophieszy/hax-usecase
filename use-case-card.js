import { LitElement, html, css } from 'lit';
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js';
import { I18NMixin } from '@haxtheweb/i18n-manager/lib/I18NMixin.js';
import '@haxtheweb/simple-icon/simple-icon.js';

export class UseCaseCard extends DDDSuper(I18NMixin(LitElement)) {
  static get properties() {
    return {
      image: { type: String },
      title: { type: String },
      description: { type: String },
      attributes: { type: Array },
      demoLink: { type: String },  // Add demoLink to the properties
      active: { type: Boolean },  // For active state styling
    };
  }

  static styles = css`
    .card {
      background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-darkGray));
      border: 2px solid var(--ddd-theme-default-limestoneGray);
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      width: 300px;
      height: 400px; /* Fixed height for all cards */
      box-shadow: var(--ddd-boxShadow-xl);
      cursor: pointer;
      transition: border-color 0.3s ease, transform 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: var(--ddd-boxShadow-lg);  
      border-color: var(--ddd-theme-default-darkGray); 
    }

    img {
      width: 300px;
      height: 200px;
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
      color: #555;  
    }

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

    .content-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 10px;
    }

    .attributes-and-button {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center; /* Vertically center the items */
      gap: 15px; /* Space between the attributes and button */
    }

    .button-container {
      display: flex;
      justify-content: center;
    }

    button {
      padding: 10px 20px;
      background-color: var(--ddd-theme-default-link);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .active {
      background-color: var(--ddd-theme-default-roarLight);
    }
  `;

  render() {
    return html`
      <div class="card ${this.active ? 'active' : ''}">
        <!-- Image wrapped in <a> tag for demo link -->
        <a href="${this.demoLink}" target="_blank" rel="noopener noreferrer">
          <img src="${this.image}" alt="${this.title}">
        </a>

        <h3>${this.title}</h3>
        <p>${this.description}</p>

        <!-- Content container for the attributes and select button -->
        <div class="content-container">
          <div class="attributes-and-button">
            <div class="attributes">
              ${this.attributes.map(attribute => html`
                <div class="attribute-circle">
                  <simple-icon icon=${attribute.icon}></simple-icon>
                  <div class="attribute-label">${attribute.label}</div>
                </div>
              `)}
            </div>

            <!-- Select button -->
            <button @click="${this._handleSelect}">
              ${this.active ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _handleSelect() {
    this.dispatchEvent(new CustomEvent('card-selected', {
      detail: { title: this.title },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('use-case-card', UseCaseCard);
