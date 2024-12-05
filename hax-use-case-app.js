import { LitElement, html, css } from 'lit';
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js';
import { I18NMixin } from '@haxtheweb/i18n-manager/lib/I18NMixin.js';
import '@haxtheweb/simple-icon/simple-icon.js';
import './use-case-card.js';  // Import the card component

export class HaxUseCaseApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "hax-use-case-app";
  }

  static properties = {
    useCases: { type: Array },
    filteredUseCases: { type: Array },
    activeUseCase: { type: Object },
    filters: { type: Object },  // Store the filters selected by the user
  };

  constructor() {
    super();
    this.useCases = [];
    this.filteredUseCases = [];
    this.activeUseCase = null;
    this.filters = {
      tags: [],  // Filter by tags
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // Hardcode some use cases for now
    this.useCases = [
      {
        id: 1,
        name: 'Course',
        description: 'Unlock your creativity and technical skills by designing a dynamic website for your course.',
        image: 'https://via.placeholder.com/150',
        tags: ['Design', 'Tech'],
        attributes: [
          { icon: 'info', label: 'Reading level seven' },
          { icon: 'bolt', label: 'Fast processing' },
          { icon: 'security', label: 'Secure data' }
        ]
      },
      {
        id: 2,
        name: 'Portfolio',
        description: 'Showcase your work in a sleek portfolio website.',
        image: 'https://via.placeholder.com/150',
        tags: ['Design', 'Art'],
        attributes: [
          { icon: 'icons:palette', label: 'Creative design' },
          { icon: 'icons:visibility', label: 'Public access' }
        ]
      },
      {
        id: 3,
        name: 'Blog',
        description: 'Create a personal or professional blog with ease.',
        image: 'https://via.placeholder.com/150',
        tags: ['Writing', 'Personal'],
        attributes: [
          { icon: 'icons:book', label: 'Reading level five' },
          { icon: 'icons:bolt', label: 'Fast processing' },
          { icon: 'icons:security', label: 'Secure data' }
        ]
      }
    ];
    this.filteredUseCases = [...this.useCases];  // Initialize with all use cases
  }

  static styles = css`
    .container {
      display: flex;
      padding: 20px;
    }

    .sidebar {
      width: 200px;
      margin-right: 20px;
      padding: 10px;
      background-color: #f4f4f4;
      border-radius: 8px;
    }

    .use-case-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }

    .continue-button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .continue-button[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;

  // Handle filter changes
  updateFilter(e) {
    const { value, checked } = e.target;
    if (checked) {
      this.filters.tags = [...this.filters.tags, value];  // Add the selected tag to the filters
    } else {
      this.filters.tags = this.filters.tags.filter(tag => tag !== value);  // Remove the tag from filters
    }
    this.applyFilters();  // Reapply the filters
  }

  // Apply filters based on selected tags
  applyFilters() {
    this.filteredUseCases = this.useCases.filter(useCase => {
      const matchesTags = this.filters.tags.length === 0 || this.filters.tags.every(tag => useCase.tags.includes(tag));
      return matchesTags;
    });
  }

  render() {
    return html`
      <div class="container">
        <div class="sidebar">
          <h3>Filter by Tags</h3>
          
          <!-- Tag Filter -->
          <div>
            <label>
              <input type="checkbox" value="Design" @change="${this.updateFilter}"> Design
            </label>
            <label>
              <input type="checkbox" value="Tech" @change="${this.updateFilter}"> Tech
            </label>
            <label>
              <input type="checkbox" value="Art" @change="${this.updateFilter}"> Art
            </label>
            <label>
              <input type="checkbox" value="Writing" @change="${this.updateFilter}"> Writing
            </label>
            <label>
              <input type="checkbox" value="Personal" @change="${this.updateFilter}"> Personal
            </label>
          </div>
        </div>

        <div class="use-case-cards">
          ${this.filteredUseCases.map(useCase => html`
            <use-case-card
              .image="${useCase.image}"
              .title="${useCase.name}"
              .description="${useCase.description}"
              .attributes="${useCase.attributes}"
              .active="${this.activeUseCase?.id === useCase.id}"
              @card-selected="${() => this.selectUseCase(useCase)}"
            ></use-case-card>
          `)}
        </div>
      </div>

      <button 
        class="continue-button" 
        @click="${this.continueWithSelection}" 
        ?disabled="${!this.activeUseCase}">
        Continue
      </button>
    `;
  }

  selectUseCase(useCase) {
    this.activeUseCase = (this.activeUseCase?.id === useCase.id) ? null : useCase;
  }

  continueWithSelection() {
    if (this.activeUseCase) {
      alert(`Selected Use Case: ${this.activeUseCase.name}`);
    }
  }
}

customElements.define(HaxUseCaseApp.tag, HaxUseCaseApp);
