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
    sortBy: { type: String }, // Sorting criterion
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
    // Fetch the JSON file
    fetch(new URL('./lib/use-case-data.json', import.meta.url).href)  // Replace with the actual path to your JSON file
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load use cases: ${response.statusText}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        this.useCases = data.data; // Assuming your JSON structure has a "data" key
        this.filteredUseCases = [...this.useCases]; // Initialize filtered use cases
      })
      .catch(error => {
        console.error('Error fetching use cases:', error);
        this.useCases = []; // Fallback to an empty array on error
        this.filteredUseCases = [];
      });
  }



  static styles = css`
    .container {
      display: flex;
      align-items: flex-start; /* Align items to top */
      gap: 20px;
    }

    .sidebar {
      width: 300px;
      height: 100vh; /* Sidebar takes full viewport height */
      padding: 10px;
      background-color: #f4f4f4;
      border-radius: 8px;
      flex-shrink: 0; /* Prevent sidebar from shrinking */
      overflow-y: auto; /* Handle overflow */
      display: flex;
      flex-direction: column; /* Ensure items are stacked vertically */
      justify-content: flex-start;
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

    .checkbox-group {
      display: flex;
      flex-direction: column; /* Stack children vertically */
      gap: 10px; 
    }

    .checkbox-group label {
      display: block; /* Ensures each label occupies a full line */
    }

    .reset-button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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

  // Apply filters and sorting
  applyFilters() {
    this.filteredUseCases = this.useCases
      .filter(useCase => {
        const matchesTags = this.filters.tags.length === 0 || this.filters.tags.every(tag => useCase.tags.includes(tag));
        return matchesTags;
      })
      .sort((a, b) => {
        if (this.sortBy === 'title') {
          return a.name.localeCompare(b.name); // Sort alphabetically by title (name)
        }
        return 0; // No sorting if sortBy is not set
      });
  }

  // Update sorting criterion
  updateSorting(criterion) {
    this.sortBy = criterion;
    this.applyFilters(); // Reapply filters and sorting
  }

  // Reset all filters
  resetFilters() {
    this.filters.tags = [];  // Clear selected tags
    this.applyFilters();  // Reapply filters (which will reset to all use cases)

    // Uncheck all checkboxes in the filter section
    const checkboxes = this.shadowRoot.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;  // Uncheck each checkbox
    });
  }

  render() {
    return html`
      <div class="container">
        <div class="sidebar">

          <h3>Sorting</h3>
          <select @change="${e => this.updateSorting(e.target.value)}">
            <option value="">None</option>
            <option value="title">Title</option>
          </select>

          <h3>Filter by Tags</h3>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" value="portfolio" @change="${this.updateFilter}"> Portfolio
            </label>
            <label>
              <input type="checkbox" value="course" @change="${this.updateFilter}"> Course
            </label>
            <label>
              <input type="checkbox" value="resume" @change="${this.updateFilter}"> Resume
            </label>
            <label>
              <input type="checkbox" value="blog" @change="${this.updateFilter}"> Blog
            </label>
            <label>
              <input type="checkbox" value="research website" @change="${this.updateFilter}"> Research Website
            </label>
          </div>

          <!-- Reset Filters Button -->
          <button @click="${this.resetFilters}" class="reset-button">Reset Filters</button>

          <!-- Continue Button moved after reset filter -->
          <button 
            class="continue-button" 
            @click="${this.continueWithSelection}" 
            ?disabled="${!this.activeUseCase}">
            Continue
          </button>

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
