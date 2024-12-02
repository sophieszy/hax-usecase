import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class HaxUseCaseApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "hax-use-case-app";
  }

  static properties = {
    useCases: { type: Array },
    filteredUseCases: { type: Array },
    activeUseCase: { type: Object }
  };

  constructor() {
    super();
    this.useCases = [];
    this.filteredUseCases = [];
    this.activeUseCase = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // Fetch the data from your JSON file
    fetch('./lib/use-case-data.json') // Relative path to the JSON file
      .then(response => response.json())
      .then(data => {
        console.log("Loaded data:", data);  // Ensure the data is loaded correctly
        this.useCases = data.data;  // Assuming the JSON data structure has a 'data' field with the array
        this.filteredUseCases = [...this.useCases]; // Set filtered use cases to all initially
      })
      .catch(error => {
        console.error('Error loading data:', error);  // Log any errors
      });
  }

  static styles = css`
    .use-case-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }

    .card {
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      width: 250px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
    }

    .active {
      border-color: blue;
    }

    .continue-button {
      margin-top: 20px;
      padding: 10px 20px;
    }
  `;

  selectUseCase(useCase) {
    this.activeUseCase = this.activeUseCase?.id === useCase.id ? null : useCase;
  }

  render() {
    return html`
      <div class="use-case-cards">
        ${this.filteredUseCases.map(useCase => html`
          <div class="card ${this.activeUseCase?.id === useCase.id ? 'active' : ''}">
            <img src="${useCase.image}" alt="${useCase.name}">
            <h3>${useCase.name}</h3>
            <p>${useCase.description}</p>
            <button @click=${() => this.selectUseCase(useCase)}>
              ${this.activeUseCase?.id === useCase.id ? 'Selected' : 'Select'}
            </button>
          </div>
        `)}
      </div>

      <button 
        class="continue-button" 
        @click=${this.continueWithSelection} 
        ?disabled=${!this.activeUseCase}>
        Continue
      </button>
    `;
  }

  continueWithSelection() {
    if (this.activeUseCase) {
      alert(`Selected Use Case: ${this.activeUseCase.name}`);
    }
  }
}

globalThis.customElements.define(HaxUseCaseApp.tag, HaxUseCaseApp);
