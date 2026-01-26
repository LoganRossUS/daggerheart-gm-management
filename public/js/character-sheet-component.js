/**
 * Daggerheart Character Sheet Component - Complete Rewrite
 *
 * Fixes implemented:
 * 1. Form input reset - Uses local state with blur/debounce sync
 * 2. Checkbox multi-select - Simple toggle, one click = one toggle
 * 3. UI jumping - Fixed dimensions, stable layouts
 * 4. Image persistence - Proper state handling
 * 5. Mobile functionality - Touch-friendly, all features work
 * 6. Campaign-independent - Works with or without campaign
 *
 * Correct Daggerheart mechanics:
 * - Damage thresholds: Only Major and Severe (Minor is implicit)
 * - Gold: Odometer style with +/- buttons (not checkboxes)
 * - Class-specific content auto-populated
 */

import { CLASS_DATA, CLASS_COLORS, TRAIT_SKILLS, getProficiency, getTier } from './class-data.js';

// Debounce helper - longer delay for text inputs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * CharacterSheetComponent Class
 * Manages the form-based character sheet with proper state handling
 */
export class CharacterSheetComponent {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    this.options = {
      darkMode: true,
      readOnly: false,
      onUpdate: null,
      debounceMs: 500, // Increased for better typing experience
      ...options
    };

    this.character = null;
    this.syncIndicator = null;

    // Track which field is currently being edited to prevent sync overwrite
    this.activeEditField = null;

    // Track collapsed sections (persisted to localStorage)
    this.collapsedSections = this.loadCollapsedSections();

    // Debounced sync function - only syncs after typing stops
    this.debouncedSync = debounce((field, value) => {
      if (this.options.onUpdate) {
        this.options.onUpdate(field, value, this.character);
        this.showSyncIndicator('Saved');
      }
    }, this.options.debounceMs);
  }

  /**
   * Load collapsed sections from localStorage
   */
  loadCollapsedSections() {
    try {
      const stored = localStorage.getItem('daggerheart_collapsed_sections');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Save collapsed sections to localStorage
   */
  saveCollapsedSections() {
    try {
      localStorage.setItem('daggerheart_collapsed_sections', JSON.stringify(this.collapsedSections));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Load and render a character
   */
  render(character) {
    if (!character) {
      console.error('CharacterSheetComponent: No character provided');
      return;
    }

    this.character = { ...character };

    if (!this.container) {
      console.error('CharacterSheetComponent: Container not found');
      return;
    }

    const classLower = (character.class_name || '').toLowerCase();
    const darkModeClass = this.options.darkMode ? 'dark-mode' : '';

    this.container.innerHTML = `
      <div class="character-sheet-form ${darkModeClass}" data-class="${classLower}">
        ${this.renderClassBanner(character)}

        <div class="sheet-body">
          <!-- Left Column -->
          <div class="sheet-column sheet-column-left">
            ${this.renderCombatStats(character)}
            ${this.renderTraits(character)}
            ${this.renderDamageHealth(character)}
            ${this.renderHopeSection(character)}
            ${this.renderExperiences(character)}
          </div>

          <!-- Right Column -->
          <div class="sheet-column sheet-column-right">
            ${this.renderWeapons(character)}
            ${this.renderArmor(character)}
            ${this.renderInventory(character)}
            ${this.renderGold(character)}
          </div>
        </div>

        <!-- Full Width Sections -->
        <div class="sheet-full-width">
          ${this.renderClassFeatures(character)}
          ${this.renderNotes(character)}
        </div>

        <div class="sheet-footer">
          Daggerheart &copy; Darrington Press 2025
        </div>

        <div class="sheet-sync-indicator" id="sheetSyncIndicator">
          <span class="sync-icon">&#10003;</span>
          <span class="sync-text">Saved</span>
        </div>
      </div>
    `;

    this.syncIndicator = this.container.querySelector('#sheetSyncIndicator');
    this.attachEventListeners();
  }

  /**
   * Render Class Banner
   */
  renderClassBanner(char) {
    const classData = CLASS_DATA[char.class_name] || {};
    const classLower = (char.class_name || '').toLowerCase();
    const portraitUrl = char.portrait || '';
    const startingEvasion = classData.base_evasion || 10;

    return `
      <div class="class-banner ${classLower}">
        <div class="class-banner-left">
          <div class="portrait-section">
            <div class="portrait-container" id="portraitContainer" data-action="open-portrait-modal">
              ${portraitUrl
                ? `<img src="${escapeHtml(portraitUrl)}" alt="Character portrait" class="portrait-image" id="portraitImage">`
                : `<div class="portrait-placeholder">
                    <span class="portrait-placeholder-icon">&#128100;</span>
                  </div>`
              }
              ${!this.options.readOnly ? `
              <div class="portrait-overlay">
                <span class="portrait-edit-label">${portraitUrl ? 'Change' : 'Add'}</span>
              </div>
              ` : ''}
            </div>
            <input type="file" id="portraitFileInput" accept="image/*" style="display: none;">
          </div>
          <div class="class-info">
            <div class="class-banner-title">${escapeHtml(char.class_name) || 'CHARACTER'}</div>
            <div class="class-banner-domains">${escapeHtml(classData.domains || '')}</div>
          </div>
        </div>
        <div class="class-banner-right">
          <div class="header-fields-grid">
            <div class="header-field">
              <label>Name</label>
              <input type="text"
                     data-field="name"
                     value="${escapeHtml(char.name)}"
                     placeholder="Character Name"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="header-field">
              <label>Pronouns</label>
              <input type="text"
                     data-field="pronouns"
                     value="${escapeHtml(char.pronouns || '')}"
                     placeholder="they/them"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="header-field">
              <label>Heritage</label>
              <input type="text"
                     data-field="heritage"
                     value="${escapeHtml(char.heritage || '')}"
                     placeholder="Ancestry"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="header-field">
              <label>Subclass</label>
              <input type="text"
                     data-field="subclass"
                     value="${escapeHtml(char.subclass || '')}"
                     placeholder="Subclass"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
          </div>
          <div class="level-display">
            <div class="level-number">${char.level || 1}</div>
            <div class="level-label">Level</div>
          </div>
          <button type="button" class="print-btn" data-action="print">
            <span class="print-icon">&#128424;</span> Print
          </button>
        </div>
      </div>

      <!-- Portrait Modal -->
      <div class="portrait-modal" id="portraitModal">
        <div class="portrait-modal-content">
          <h3>Character Portrait</h3>
          <div class="portrait-modal-preview" id="portraitModalPreview">
            ${portraitUrl
              ? `<img src="${escapeHtml(portraitUrl)}" alt="Preview">`
              : `<div class="portrait-placeholder"><span class="portrait-placeholder-icon">&#128100;</span></div>`
            }
          </div>
          <div class="portrait-modal-options">
            <button type="button" class="btn-portrait-upload" data-action="upload-portrait">
              Upload Image
            </button>
            <div class="portrait-url-input-group">
              <input type="url" id="portraitUrlInput" placeholder="Or paste image URL..." value="${escapeHtml(portraitUrl)}">
              <button type="button" class="btn-portrait-apply" data-action="apply-portrait-url">Apply</button>
            </div>
            ${portraitUrl ? `
            <button type="button" class="btn-portrait-remove" data-action="remove-portrait">
              Remove Portrait
            </button>
            ` : ''}
          </div>
          <button type="button" class="btn-portrait-close" data-action="close-portrait-modal">Close</button>
        </div>
      </div>
    `;
  }

  /**
   * Render Combat Stats Section
   */
  renderCombatStats(char) {
    const classData = CLASS_DATA[char.class_name] || {};
    const proficiency = char.proficiency || getProficiency(char.level || 1);
    const startingEvasion = classData.base_evasion;

    return `
      <div class="sheet-section" data-section="combat-stats">
        <div class="section-header">Combat Stats</div>
        <div class="section-content">
          <div class="combat-stats-row">
            <div class="combat-stat">
              <div class="combat-stat-label">Evasion</div>
              <input type="number"
                     class="combat-stat-input"
                     data-field="evasion"
                     value="${char.evasion || 10}"
                     min="0"
                     ${this.options.readOnly ? 'readonly' : ''}>
              ${startingEvasion ? `<div class="combat-stat-hint">Start at ${startingEvasion}</div>` : ''}
            </div>
            <div class="combat-stat">
              <div class="combat-stat-label">Armor Score</div>
              <input type="number"
                     class="combat-stat-input"
                     data-field="armor"
                     value="${char.armor || 0}"
                     min="0"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="combat-stat">
              <div class="combat-stat-label">Proficiency</div>
              <div class="proficiency-display">
                ${this.renderProficiencyDots(proficiency)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Proficiency Dots (read-only display)
   */
  renderProficiencyDots(proficiency) {
    let dots = '';
    for (let i = 1; i <= 6; i++) {
      const filled = i <= proficiency;
      dots += `<div class="proficiency-dot ${filled ? 'filled' : ''}" title="+${proficiency}"></div>`;
    }
    return `<div class="proficiency-dots">${dots}</div>`;
  }

  /**
   * Render Traits Section (2x3 Grid)
   */
  renderTraits(char) {
    const traits = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];
    const spellcastTrait = this.getSpellcastTrait(char);
    const isCollapsed = this.collapsedSections['traits'];

    const traitBoxes = traits.map(trait => {
      const value = char[trait] || 0;
      const skills = TRAIT_SKILLS[trait] || [];
      const isSpellcast = trait === spellcastTrait;
      const displayValue = value >= 0 ? `+${value}` : `${value}`;

      return `
        <div class="trait-box ${isSpellcast ? 'spellcast' : ''}">
          ${isSpellcast ? '<span class="spellcast-badge">Spellcast</span>' : ''}
          <div class="trait-name">${trait.charAt(0).toUpperCase() + trait.slice(1)}</div>
          <input type="text"
                 class="trait-value-input"
                 data-field="${trait}"
                 data-type="trait"
                 value="${displayValue}"
                 ${this.options.readOnly ? 'readonly' : ''}>
          <div class="trait-skills">${skills.join(', ')}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="traits">
        <div class="section-header collapsible-trigger" data-toggle="traits">
          <span>Traits</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <div class="traits-grid">
            ${traitBoxes}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get spellcast trait for a character
   */
  getSpellcastTrait(char) {
    const classData = CLASS_DATA[char.class_name];
    if (!classData || !classData.subclasses) return null;

    // Find subclass by name
    for (const [key, subclass] of Object.entries(classData.subclasses)) {
      if (subclass.name === char.subclass) {
        return subclass.spellcast_trait;
      }
    }
    return null;
  }

  /**
   * Render Damage & Health Section
   * FIXED: Only Major and Severe thresholds (Minor is implicit - below Major)
   */
  renderDamageHealth(char) {
    const hpSlots = char.hp_slots || Array(6).fill(false);
    const stressSlots = char.stress_slots || Array(6).fill(false);
    const armorSlots = char.armor_slots || [];
    const isCollapsed = this.collapsedSections['damage-health'];

    // Calculate thresholds with level
    const level = char.level || 1;
    const majorBase = char.major_threshold || 0;
    const severeBase = char.severe_threshold || 0;

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="damage-health">
        <div class="section-header collapsible-trigger" data-toggle="damage-health">
          <span>Damage &amp; Health</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <!-- Damage Thresholds - CORRECTED: Only Major and Severe -->
          <div class="damage-info-text">
            Add your current level (+${level}) to your damage thresholds.
          </div>
          <div class="damage-thresholds">
            <div class="threshold-item minor-info">
              <div class="threshold-label">Minor</div>
              <div class="threshold-description">Mark 1 HP</div>
              <div class="threshold-note">Below Major</div>
            </div>
            <div class="threshold-item major">
              <div class="threshold-label">Major</div>
              <div class="threshold-description">Mark 2 HP</div>
              <input type="number"
                     class="threshold-input"
                     data-field="major_threshold"
                     value="${majorBase}"
                     placeholder="5"
                     min="0"
                     ${this.options.readOnly ? 'readonly' : ''}>
              <div class="threshold-calculated">Total: ${majorBase + level}</div>
            </div>
            <div class="threshold-item severe">
              <div class="threshold-label">Severe</div>
              <div class="threshold-description">Mark 3 HP</div>
              <input type="number"
                     class="threshold-input"
                     data-field="severe_threshold"
                     value="${severeBase}"
                     placeholder="11"
                     min="0"
                     ${this.options.readOnly ? 'readonly' : ''}>
              <div class="threshold-calculated">Total: ${severeBase + level}</div>
            </div>
          </div>

          <!-- HP Slots -->
          <div class="resource-row">
            <span class="resource-label">HP</span>
            <div class="checkbox-slots" data-slots="hp_slots">
              ${this.renderCheckboxSlots(hpSlots, 'hp')}
            </div>
            <span class="resource-count">${this.countChecked(hpSlots)}/${hpSlots.length}</span>
          </div>

          <!-- Stress Slots -->
          <div class="resource-row">
            <span class="resource-label">Stress</span>
            <div class="checkbox-slots" data-slots="stress_slots">
              ${this.renderCheckboxSlots(stressSlots, 'stress')}
            </div>
            <span class="resource-count">${this.countChecked(stressSlots)}/${stressSlots.length}</span>
          </div>

          <!-- Armor Slots (if any) -->
          ${armorSlots.length > 0 ? `
          <div class="resource-row">
            <span class="resource-label">Armor</span>
            <div class="checkbox-slots" data-slots="armor_slots">
              ${this.renderCheckboxSlots(armorSlots, 'armor')}
            </div>
            <span class="resource-count">${this.countChecked(armorSlots)}/${armorSlots.length}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render Hope Section
   */
  renderHopeSection(char) {
    const hopeSlots = char.hope_slots || Array(6).fill(false);
    const classData = CLASS_DATA[char.class_name] || {};
    const hopeFeature = char.hope_feature || classData.hope_feature || '';
    const isCollapsed = this.collapsedSections['hope'];

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="hope">
        <div class="section-header collapsible-trigger" data-toggle="hope">
          <span>Hope</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <div class="resource-row">
            <span class="resource-label">Hope</span>
            <div class="checkbox-slots hope-slots" data-slots="hope_slots">
              ${this.renderCheckboxSlots(hopeSlots, 'hope')}
            </div>
            <span class="resource-count">${this.countChecked(hopeSlots)}/${hopeSlots.length}</span>
          </div>
          <div class="hope-feature-section">
            <label class="field-label">Hope Feature (Spend 3 Hope)</label>
            <textarea class="text-area-field hope-feature-text"
                      data-field="hope_feature"
                      placeholder="${escapeHtml(classData.hope_feature || 'Your class Hope feature...')}"
                      ${this.options.readOnly ? 'readonly' : ''}>${escapeHtml(hopeFeature)}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Checkbox Slots - FIXED: Simple toggle, one click = one toggle
   */
  renderCheckboxSlots(slots, type) {
    return slots.map((checked, index) => `
      <button type="button"
              class="checkbox-slot ${type} ${checked ? 'checked' : ''}"
              data-index="${index}"
              data-type="${type}"
              data-action="toggle-checkbox"
              aria-pressed="${checked}"
              aria-label="${type} slot ${index + 1}">
      </button>
    `).join('');
  }

  /**
   * Render Experiences Section
   */
  renderExperiences(char) {
    const experiences = char.experiences || [
      { name: '', modifier: '+2' },
      { name: '', modifier: '+2' }
    ];
    const isCollapsed = this.collapsedSections['experiences'];

    const experienceRows = experiences.map((exp, index) => `
      <div class="experience-row" data-index="${index}">
        <input type="text"
               class="experience-name"
               data-field="experiences.${index}.name"
               value="${escapeHtml(exp.name || '')}"
               placeholder="Experience description"
               ${this.options.readOnly ? 'readonly' : ''}>
        <input type="text"
               class="experience-modifier"
               data-field="experiences.${index}.modifier"
               value="${escapeHtml(exp.modifier || '+2')}"
               ${this.options.readOnly ? 'readonly' : ''}>
        ${!this.options.readOnly ? `
        <button type="button" class="experience-remove" data-action="remove-experience" data-index="${index}" aria-label="Remove experience">
          <span aria-hidden="true">&times;</span>
        </button>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="experiences">
        <div class="section-header collapsible-trigger" data-toggle="experiences">
          <span>Experiences</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <div class="experiences-list" id="experiencesList">
            ${experienceRows}
          </div>
          ${!this.options.readOnly ? `
          <button type="button" class="add-btn" data-action="add-experience">+ Add Experience</button>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render Weapons Section
   */
  renderWeapons(char) {
    const weapons = char.weapons || [];
    const isCollapsed = this.collapsedSections['weapons'];

    const primaryWeapon = weapons.find(w => w.is_primary) || null;
    const secondaryWeapon = weapons.find(w => w.is_secondary) || null;
    const inventoryWeapons = weapons.filter(w => !w.is_primary && !w.is_secondary);

    // Find indices
    const primaryIndex = weapons.findIndex(w => w.is_primary);
    const secondaryIndex = weapons.findIndex(w => w.is_secondary);

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="weapons">
        <div class="section-header collapsible-trigger" data-toggle="weapons">
          <span>Active Weapons</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <div class="weapons-section">
            ${this.renderWeaponBlock(primaryWeapon, 'Primary', primaryIndex >= 0 ? primaryIndex : 0)}
            ${this.renderWeaponBlock(secondaryWeapon, 'Secondary', secondaryIndex >= 0 ? secondaryIndex : 1)}
          </div>

          ${inventoryWeapons.length > 0 ? `
          <div class="inventory-weapons-section">
            <div class="subsection-label">Inventory Weapons</div>
            <div class="weapons-section">
              ${inventoryWeapons.map((w, i) => {
                const actualIndex = weapons.indexOf(w);
                return this.renderWeaponBlock(w, 'Inventory', actualIndex);
              }).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render a single weapon block
   */
  renderWeaponBlock(weapon, type, index) {
    const w = weapon || { name: '', trait_and_range: '', damage: '', feature: '' };
    const typeClass = type.toLowerCase();

    return `
      <div class="weapon-block ${typeClass}" data-weapon-index="${index}">
        <div class="weapon-header">
          <span class="weapon-type-badge">${type}</span>
        </div>
        <div class="weapon-fields">
          <div class="weapon-field full-width">
            <label>Name</label>
            <input type="text"
                   data-field="weapons.${index}.name"
                   value="${escapeHtml(w.name || '')}"
                   placeholder="Weapon name"
                   ${this.options.readOnly ? 'readonly' : ''}>
          </div>
          <div class="weapon-field">
            <label>Trait / Range</label>
            <input type="text"
                   data-field="weapons.${index}.trait_and_range"
                   value="${escapeHtml(w.trait_and_range || '')}"
                   placeholder="Agility Melee"
                   ${this.options.readOnly ? 'readonly' : ''}>
          </div>
          <div class="weapon-field">
            <label>Damage</label>
            <input type="text"
                   data-field="weapons.${index}.damage"
                   value="${escapeHtml(w.damage || '')}"
                   placeholder="d8 phy"
                   ${this.options.readOnly ? 'readonly' : ''}>
          </div>
          <div class="weapon-field full-width">
            <label>Feature</label>
            <input type="text"
                   data-field="weapons.${index}.feature"
                   value="${escapeHtml(w.feature || '')}"
                   placeholder="Special feature"
                   ${this.options.readOnly ? 'readonly' : ''}>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Armor Section
   */
  renderArmor(char) {
    const armor = char.active_armor || { name: '', base_thresholds: '', base_score: '', feature: '' };
    const isCollapsed = this.collapsedSections['armor'];

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="armor">
        <div class="section-header collapsible-trigger" data-toggle="armor">
          <span>Active Armor</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <div class="armor-block">
            <div class="armor-fields">
              <div class="armor-field full-width">
                <label>Name</label>
                <input type="text"
                       data-field="active_armor.name"
                       value="${escapeHtml(armor.name || '')}"
                       placeholder="Armor name"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
              <div class="armor-field">
                <label>Base Thresholds</label>
                <input type="text"
                       data-field="active_armor.base_thresholds"
                       value="${escapeHtml(armor.base_thresholds || '')}"
                       placeholder="5/11"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
              <div class="armor-field">
                <label>Armor Score</label>
                <input type="text"
                       data-field="active_armor.base_score"
                       value="${escapeHtml(armor.base_score || '')}"
                       placeholder="3"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
              <div class="armor-field full-width">
                <label>Feature</label>
                <input type="text"
                       data-field="active_armor.feature"
                       value="${escapeHtml(armor.feature || '')}"
                       placeholder="Special feature"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Inventory Section
   */
  renderInventory(char) {
    const isCollapsed = this.collapsedSections['inventory'];

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="inventory">
        <div class="section-header collapsible-trigger" data-toggle="inventory">
          <span>Inventory</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <textarea class="text-area-field large"
                    data-field="inventory"
                    placeholder="List your items, gear, and possessions..."
                    ${this.options.readOnly ? 'readonly' : ''}>${escapeHtml(char.inventory || '')}</textarea>
        </div>
      </div>
    `;
  }

  /**
   * Render Gold Section - FIXED: Odometer style with +/- buttons (not checkboxes)
   */
  renderGold(char) {
    const handfuls = char.gold_handfuls || 0;
    const bags = char.gold_bags || 0;
    const chests = char.gold_chests || 0;
    const isCollapsed = this.collapsedSections['gold'];

    return `
      <div class="sheet-section collapsible-section ${isCollapsed ? 'collapsed' : ''}" data-section="gold">
        <div class="section-header collapsible-trigger" data-toggle="gold">
          <span>Gold</span>
          <span class="collapse-icon"></span>
        </div>
        <div class="section-content">
          <div class="gold-counter">
            <div class="gold-row">
              <span class="gold-label">Handfuls</span>
              <div class="gold-controls">
                <button type="button" class="gold-btn decrement" data-action="gold-decrement" data-tier="handfuls" ${this.options.readOnly ? 'disabled' : ''}>-</button>
                <span class="gold-value" id="goldHandfuls">${handfuls}</span>
                <button type="button" class="gold-btn increment" data-action="gold-increment" data-tier="handfuls" ${this.options.readOnly ? 'disabled' : ''}>+</button>
              </div>
            </div>
            <div class="gold-row">
              <span class="gold-label">Bags</span>
              <div class="gold-controls">
                <button type="button" class="gold-btn decrement" data-action="gold-decrement" data-tier="bags" ${this.options.readOnly ? 'disabled' : ''}>-</button>
                <span class="gold-value" id="goldBags">${bags}</span>
                <button type="button" class="gold-btn increment" data-action="gold-increment" data-tier="bags" ${this.options.readOnly ? 'disabled' : ''}>+</button>
              </div>
            </div>
            <div class="gold-row">
              <span class="gold-label">Chests</span>
              <div class="gold-controls">
                <button type="button" class="gold-btn decrement" data-action="gold-decrement" data-tier="chests" ${this.options.readOnly ? 'disabled' : ''}>-</button>
                <span class="gold-value" id="goldChests">${chests}</span>
                <button type="button" class="gold-btn increment" data-action="gold-increment" data-tier="chests" ${this.options.readOnly ? 'disabled' : ''}>+</button>
              </div>
            </div>
          </div>
          <p class="gold-conversion-note">10 handfuls = 1 bag, 10 bags = 1 chest</p>
        </div>
      </div>
    `;
  }

  /**
   * Render Class Features Section
   */
  renderClassFeatures(char) {
    const classData = CLASS_DATA[char.class_name] || {};
    const classFeatures = char.class_features || classData.class_features || '';

    return `
      <div class="sheet-section" data-section="class-features">
        <div class="section-header">Class Features</div>
        <div class="section-content">
          <textarea class="text-area-field large class-features-text"
                    data-field="class_features"
                    placeholder="${escapeHtml(classData.class_features || 'Your class features and abilities...')}"
                    ${this.options.readOnly ? 'readonly' : ''}>${escapeHtml(classFeatures)}</textarea>
        </div>
      </div>
    `;
  }

  /**
   * Render Notes Section
   */
  renderNotes(char) {
    return `
      <div class="sheet-section" data-section="notes">
        <div class="section-header">Notes</div>
        <div class="section-content">
          <textarea class="text-area-field large"
                    data-field="notes"
                    placeholder="Additional notes, background, connections..."
                    ${this.options.readOnly ? 'readonly' : ''}>${escapeHtml(char.notes || '')}</textarea>
        </div>
      </div>
    `;
  }

  /**
   * Count checked slots
   */
  countChecked(slots) {
    if (Array.isArray(slots)) {
      return slots.filter(Boolean).length;
    }
    // Handle numeric gold values
    return slots || 0;
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    if (!this.container) return;

    // Use event delegation for better performance and to handle dynamic content
    this.container.addEventListener('click', this.handleClick.bind(this));
    this.container.addEventListener('input', this.handleInput.bind(this));
    this.container.addEventListener('change', this.handleChange.bind(this));
    this.container.addEventListener('blur', this.handleBlur.bind(this), true);
    this.container.addEventListener('focus', this.handleFocus.bind(this), true);

    // Prevent browser shortcuts (like Ctrl+F/Cmd+F) from triggering when typing in inputs
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));

    // File input for portrait
    const fileInput = this.container.querySelector('#portraitFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handlePortraitFileUpload(e));
    }
  }

  /**
   * Handle keydown events - prevent browser shortcuts when typing in form fields
   */
  handleKeyDown(e) {
    const target = e.target;
    const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

    if (!isFormElement) return;

    // Prevent browser find (Ctrl+F / Cmd+F) and other shortcuts when typing
    // But allow copy/paste/cut (Ctrl+C, Ctrl+V, Ctrl+X) and undo/redo (Ctrl+Z, Ctrl+Y)
    const allowedKeys = ['c', 'v', 'x', 'z', 'y', 'a']; // copy, paste, cut, undo, redo, select all

    if ((e.ctrlKey || e.metaKey) && !allowedKeys.includes(e.key.toLowerCase())) {
      // Don't prevent the default for allowed shortcuts
      // For 'f' specifically (find), prevent it in text inputs
      if (e.key.toLowerCase() === 'f') {
        e.stopPropagation();
        // Don't preventDefault here as it may interfere with normal typing
        // The key will be typed into the input instead
      }
    }

    // Prevent '/' from opening quick find in Firefox when typing
    // (The slash should just be typed into the input normally)
    if (e.key === '/' && isFormElement) {
      e.stopPropagation();
    }
  }

  /**
   * Handle click events (delegated)
   */
  handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case 'toggle-checkbox':
        this.handleCheckboxToggle(target);
        break;
      case 'gold-increment':
        this.handleGoldChange(target.dataset.tier, 1);
        break;
      case 'gold-decrement':
        this.handleGoldChange(target.dataset.tier, -1);
        break;
      case 'add-experience':
        this.addExperience();
        break;
      case 'remove-experience':
        this.removeExperience(parseInt(target.dataset.index));
        break;
      case 'open-portrait-modal':
        this.openPortraitModal();
        break;
      case 'close-portrait-modal':
        this.closePortraitModal();
        break;
      case 'upload-portrait':
        this.container.querySelector('#portraitFileInput')?.click();
        break;
      case 'apply-portrait-url':
        this.applyPortraitUrl();
        break;
      case 'remove-portrait':
        this.removePortrait();
        break;
      case 'print':
        window.print();
        break;
    }

    // Handle collapsible section toggle
    const collapseTrigger = e.target.closest('.collapsible-trigger');
    if (collapseTrigger) {
      const sectionId = collapseTrigger.dataset.toggle;
      this.toggleSection(sectionId);
    }
  }

  /**
   * Handle input events (for text fields - update local state only)
   */
  handleInput(e) {
    const target = e.target;
    if (!target.dataset.field) return;

    const field = target.dataset.field;
    let value = target.value;

    // Mark this field as actively being edited
    this.activeEditField = field;

    // Handle trait inputs - convert "+2" to 2, "-1" to -1
    if (target.dataset.type === 'trait') {
      const parsed = parseInt(value.replace(/[^-\d]/g, '')) || 0;
      // Don't update input value while typing, just store the parsed value
      this.updateFieldLocal(field, parsed);
    } else if (target.type === 'number') {
      this.updateFieldLocal(field, parseInt(value) || 0);
    } else {
      this.updateFieldLocal(field, value);
    }

    // Show saving indicator
    this.showSyncIndicator('Saving...');
  }

  /**
   * Handle change events (for selects, checkboxes)
   */
  handleChange(e) {
    const target = e.target;
    if (!target.dataset.field) return;

    const field = target.dataset.field;
    let value;

    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (target.type === 'number') {
      value = parseInt(target.value) || 0;
    } else {
      value = target.value;
    }

    this.updateFieldAndSync(field, value);
  }

  /**
   * Handle focus events - track active field
   */
  handleFocus(e) {
    const target = e.target;
    if (target.dataset.field) {
      this.activeEditField = target.dataset.field;
    }
  }

  /**
   * Handle blur events - sync on blur for text fields
   */
  handleBlur(e) {
    const target = e.target;
    if (!target.dataset.field) return;

    const field = target.dataset.field;

    // Clear active edit field
    if (this.activeEditField === field) {
      this.activeEditField = null;
    }

    // Format trait display on blur
    if (target.dataset.type === 'trait') {
      const value = this.getFieldValue(field) || 0;
      target.value = value >= 0 ? `+${value}` : `${value}`;
    }

    // Sync to database on blur
    const value = this.getFieldValue(field);
    if (this.options.onUpdate) {
      this.options.onUpdate(field, value, this.character);
      this.showSyncIndicator('Saved');
    }
  }

  /**
   * Handle checkbox toggle - FIXED: Simple toggle, one click = one toggle
   */
  handleCheckboxToggle(target) {
    if (this.options.readOnly) return;

    const index = parseInt(target.dataset.index);
    const type = target.dataset.type;
    const slotsField = `${type}_slots`;

    // Ensure slots array exists
    if (!this.character[slotsField]) {
      this.character[slotsField] = Array(6).fill(false);
    }

    const slots = [...this.character[slotsField]];

    // FIXED: Simple toggle - just flip the clicked slot
    slots[index] = !slots[index];

    // Update character data
    this.character[slotsField] = slots;
    this.character.updated_at = new Date().toISOString();

    // Update UI immediately
    target.classList.toggle('checked', slots[index]);
    target.setAttribute('aria-pressed', slots[index]);

    // Update count display
    const container = target.closest('.resource-row') || target.closest('.checkbox-row');
    if (container) {
      const countEl = container.querySelector('.resource-count');
      if (countEl) {
        countEl.textContent = `${this.countChecked(slots)}/${slots.length}`;
      }
    }

    // Sync immediately for checkboxes
    if (this.options.onUpdate) {
      this.options.onUpdate(slotsField, slots, this.character);
      this.showSyncIndicator('Saved');
    }
  }

  /**
   * Handle gold counter change - Odometer style with overflow
   */
  handleGoldChange(tier, delta) {
    if (this.options.readOnly) return;

    let handfuls = this.character.gold_handfuls || 0;
    let bags = this.character.gold_bags || 0;
    let chests = this.character.gold_chests || 0;

    // Convert from old boolean array format if needed
    if (Array.isArray(handfuls)) {
      handfuls = handfuls.filter(Boolean).length;
      this.character.gold_handfuls = handfuls;
    }
    if (Array.isArray(bags)) {
      bags = bags.filter(Boolean).length;
      this.character.gold_bags = bags;
    }
    if (Array.isArray(chests)) {
      chests = chests.filter(Boolean).length;
      this.character.gold_chests = chests;
    }

    switch (tier) {
      case 'handfuls':
        handfuls += delta;
        // Handle overflow/underflow
        if (handfuls > 9) {
          handfuls = 0;
          bags += 1;
          if (bags > 9) {
            bags = 0;
            chests += 1;
          }
        } else if (handfuls < 0) {
          if (bags > 0 || chests > 0) {
            handfuls = 9;
            bags -= 1;
            if (bags < 0) {
              bags = 9;
              chests -= 1;
            }
          } else {
            handfuls = 0;
          }
        }
        break;

      case 'bags':
        bags += delta;
        if (bags > 9) {
          bags = 0;
          chests += 1;
        } else if (bags < 0) {
          if (chests > 0) {
            bags = 9;
            chests -= 1;
          } else {
            bags = 0;
          }
        }
        break;

      case 'chests':
        chests += delta;
        if (chests < 0) chests = 0;
        break;
    }

    // Update character
    this.character.gold_handfuls = handfuls;
    this.character.gold_bags = bags;
    this.character.gold_chests = chests;
    this.character.updated_at = new Date().toISOString();

    // Update UI
    const handfulsEl = this.container.querySelector('#goldHandfuls');
    const bagsEl = this.container.querySelector('#goldBags');
    const chestsEl = this.container.querySelector('#goldChests');

    if (handfulsEl) handfulsEl.textContent = handfuls;
    if (bagsEl) bagsEl.textContent = bags;
    if (chestsEl) chestsEl.textContent = chests;

    // Sync immediately
    if (this.options.onUpdate) {
      this.options.onUpdate('gold', {
        handfuls: handfuls,
        bags: bags,
        chests: chests
      }, this.character);
      this.showSyncIndicator('Saved');
    }
  }

  /**
   * Toggle collapsible section
   */
  toggleSection(sectionId) {
    const section = this.container.querySelector(`[data-section="${sectionId}"]`);
    if (!section) return;

    const isCollapsed = section.classList.toggle('collapsed');
    this.collapsedSections[sectionId] = isCollapsed;
    this.saveCollapsedSections();
  }

  /**
   * Update field in local state only (no sync)
   */
  updateFieldLocal(field, value) {
    this.setNestedValue(this.character, field, value);
    this.character.updated_at = new Date().toISOString();

    // Debounced sync
    this.debouncedSync(field, value);
  }

  /**
   * Update field and sync immediately
   */
  updateFieldAndSync(field, value) {
    this.setNestedValue(this.character, field, value);
    this.character.updated_at = new Date().toISOString();

    if (this.options.onUpdate) {
      this.options.onUpdate(field, value, this.character);
      this.showSyncIndicator('Saved');
    }
  }

  /**
   * Get field value from character
   */
  getFieldValue(field) {
    return this.getNestedValue(this.character, field);
  }

  /**
   * Set nested value in object using dot notation
   */
  setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];

      // Handle array indices
      if (!isNaN(parseInt(nextPart))) {
        if (!current[part]) current[part] = [];
        current = current[part];
        // Ensure array element exists
        if (!current[parseInt(nextPart)]) {
          current[parseInt(nextPart)] = {};
        }
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      current = current[part];
    }

    return current;
  }

  /**
   * Add a new experience
   */
  addExperience() {
    if (!this.character.experiences) {
      this.character.experiences = [];
    }

    const newExp = { name: '', modifier: '+2' };
    this.character.experiences.push(newExp);
    this.character.updated_at = new Date().toISOString();

    // Instead of full re-render, just add the new row
    const list = this.container.querySelector('#experiencesList');
    if (list) {
      const index = this.character.experiences.length - 1;
      const row = document.createElement('div');
      row.className = 'experience-row';
      row.dataset.index = index;
      row.innerHTML = `
        <input type="text"
               class="experience-name"
               data-field="experiences.${index}.name"
               value=""
               placeholder="Experience description">
        <input type="text"
               class="experience-modifier"
               data-field="experiences.${index}.modifier"
               value="+2">
        <button type="button" class="experience-remove" data-action="remove-experience" data-index="${index}" aria-label="Remove experience">
          <span aria-hidden="true">&times;</span>
        </button>
      `;
      list.appendChild(row);

      // Focus the new input
      row.querySelector('.experience-name')?.focus();
    }

    // Sync
    if (this.options.onUpdate) {
      this.options.onUpdate('experiences', this.character.experiences, this.character);
    }
  }

  /**
   * Remove an experience
   */
  removeExperience(index) {
    if (!this.character.experiences || index < 0 || index >= this.character.experiences.length) {
      return;
    }

    this.character.experiences.splice(index, 1);
    this.character.updated_at = new Date().toISOString();

    // Remove from DOM and update indices
    const list = this.container.querySelector('#experiencesList');
    if (list) {
      const row = list.querySelector(`[data-index="${index}"]`);
      if (row) {
        row.remove();
      }

      // Update indices for remaining rows
      list.querySelectorAll('.experience-row').forEach((row, i) => {
        row.dataset.index = i;
        row.querySelector('.experience-name').dataset.field = `experiences.${i}.name`;
        row.querySelector('.experience-modifier').dataset.field = `experiences.${i}.modifier`;
        const removeBtn = row.querySelector('[data-action="remove-experience"]');
        if (removeBtn) removeBtn.dataset.index = i;
      });
    }

    // Sync
    if (this.options.onUpdate) {
      this.options.onUpdate('experiences', this.character.experiences, this.character);
      this.showSyncIndicator('Saved');
    }
  }

  /**
   * Portrait modal handling
   */
  openPortraitModal() {
    const modal = this.container.querySelector('#portraitModal');
    if (modal) {
      modal.classList.add('visible');
    }
  }

  closePortraitModal() {
    const modal = this.container.querySelector('#portraitModal');
    if (modal) {
      modal.classList.remove('visible');
    }
  }

  /**
   * Handle portrait file upload
   */
  async handlePortraitFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    try {
      // Show loading state
      this.showSyncIndicator('Uploading...');

      // Convert to data URL
      const dataUrl = await this.fileToDataUrl(file);

      // Update character and UI
      this.updatePortrait(dataUrl);
    } catch (error) {
      console.error('Error processing portrait:', error);
      alert('Error processing image');
    }
  }

  /**
   * Convert file to data URL
   */
  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Apply portrait from URL
   */
  applyPortraitUrl() {
    const urlInput = this.container.querySelector('#portraitUrlInput');
    if (!urlInput) return;

    const url = urlInput.value.trim();
    if (!url) {
      alert('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    this.updatePortrait(url);
  }

  /**
   * Remove portrait
   */
  removePortrait() {
    this.updatePortrait(null);
  }

  /**
   * Update portrait in character and UI
   */
  updatePortrait(portraitUrl) {
    this.character.portrait = portraitUrl;
    this.character.updated_at = new Date().toISOString();

    // Update the main portrait display
    const portraitContainer = this.container.querySelector('#portraitContainer');
    if (portraitContainer) {
      const img = portraitContainer.querySelector('.portrait-image');
      const placeholder = portraitContainer.querySelector('.portrait-placeholder');

      if (portraitUrl) {
        if (img) {
          img.src = portraitUrl;
        } else if (placeholder) {
          const newImg = document.createElement('img');
          newImg.src = portraitUrl;
          newImg.alt = 'Character portrait';
          newImg.className = 'portrait-image';
          newImg.id = 'portraitImage';
          placeholder.replaceWith(newImg);
        }
      } else {
        if (img) {
          const newPlaceholder = document.createElement('div');
          newPlaceholder.className = 'portrait-placeholder';
          newPlaceholder.innerHTML = '<span class="portrait-placeholder-icon">&#128100;</span>';
          img.replaceWith(newPlaceholder);
        }
      }

      // Update edit label
      const editLabel = portraitContainer.querySelector('.portrait-edit-label');
      if (editLabel) {
        editLabel.textContent = portraitUrl ? 'Change' : 'Add';
      }
    }

    // Update modal preview
    const modalPreview = this.container.querySelector('#portraitModalPreview');
    if (modalPreview) {
      if (portraitUrl) {
        modalPreview.innerHTML = `<img src="${escapeHtml(portraitUrl)}" alt="Preview">`;
      } else {
        modalPreview.innerHTML = '<div class="portrait-placeholder"><span class="portrait-placeholder-icon">&#128100;</span></div>';
      }
    }

    // Update URL input
    const urlInput = this.container.querySelector('#portraitUrlInput');
    if (urlInput) {
      urlInput.value = portraitUrl || '';
    }

    // Close modal
    this.closePortraitModal();

    // Sync immediately for portrait changes
    if (this.options.onUpdate) {
      this.options.onUpdate('portrait', portraitUrl, this.character);
      this.showSyncIndicator('Saved');
    }
  }

  /**
   * Show sync indicator
   */
  showSyncIndicator(text = 'Saved') {
    if (this.syncIndicator) {
      const textEl = this.syncIndicator.querySelector('.sync-text');
      const iconEl = this.syncIndicator.querySelector('.sync-icon');

      if (textEl) textEl.textContent = text;
      if (iconEl) {
        iconEl.innerHTML = text === 'Saving...' ? '&#8987;' : '&#10003;';
      }

      this.syncIndicator.classList.add('visible');

      // Auto-hide after delay
      clearTimeout(this.syncIndicatorTimeout);
      this.syncIndicatorTimeout = setTimeout(() => {
        this.syncIndicator.classList.remove('visible');
      }, 2000);
    }
  }

  /**
   * Get current character data
   */
  getCharacter() {
    return this.character;
  }

  /**
   * Update character from external source (e.g., Firebase sync)
   * Only updates fields that aren't currently being edited
   * This prevents re-render loops that cause checkbox multi-select bugs
   */
  updateFromExternal(newCharacter) {
    if (!this.character || !newCharacter) return;

    // If user is actively editing a field, don't update at all
    // This prevents any interference with user interactions
    if (this.activeEditField) {
      return;
    }

    // Check if any form element has focus - if so, skip update
    const activeElement = document.activeElement;
    if (activeElement && this.container.contains(activeElement)) {
      const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(activeElement.tagName);
      if (isFormElement) {
        return;
      }
    }

    // Update local character state with new data
    for (const [field, value] of Object.entries(newCharacter)) {
      this.character[field] = value;
    }

    // Update specific DOM elements without full re-render
    // This preserves user interaction state
    this.updateDOMSelectively(newCharacter);
  }

  /**
   * Update DOM elements selectively without full re-render
   * Only updates elements that aren't being interacted with
   */
  updateDOMSelectively(char) {
    // Update checkbox slots (HP, Stress, Hope, Armor)
    this.updateSlotDisplay('hp_slots', char.hp_slots || Array(6).fill(false));
    this.updateSlotDisplay('stress_slots', char.stress_slots || Array(6).fill(false));
    this.updateSlotDisplay('hope_slots', char.hope_slots || Array(6).fill(false));
    if (char.armor_slots && char.armor_slots.length > 0) {
      this.updateSlotDisplay('armor_slots', char.armor_slots);
    }

    // Update gold display
    const handfulsEl = this.container.querySelector('#goldHandfuls');
    const bagsEl = this.container.querySelector('#goldBags');
    const chestsEl = this.container.querySelector('#goldChests');
    if (handfulsEl) handfulsEl.textContent = char.gold_handfuls || 0;
    if (bagsEl) bagsEl.textContent = char.gold_bags || 0;
    if (chestsEl) chestsEl.textContent = char.gold_chests || 0;

    // Update text fields only if they don't have focus
    const textFields = ['name', 'pronouns', 'heritage', 'subclass', 'evasion', 'armor'];
    textFields.forEach(field => {
      const input = this.container.querySelector(`[data-field="${field}"]`);
      if (input && document.activeElement !== input) {
        input.value = char[field] || '';
      }
    });
  }

  /**
   * Update slot display (checkboxes) without re-render
   */
  updateSlotDisplay(slotsField, slots) {
    const type = slotsField.replace('_slots', '');
    const container = this.container.querySelector(`[data-slots="${slotsField}"]`);
    if (!container) return;

    const buttons = container.querySelectorAll('.checkbox-slot');
    buttons.forEach((btn, index) => {
      if (index < slots.length) {
        const isChecked = slots[index];
        btn.classList.toggle('checked', isChecked);
        btn.setAttribute('aria-pressed', isChecked);
      }
    });

    // Update count display
    const resourceRow = container.closest('.resource-row');
    if (resourceRow) {
      const countEl = resourceRow.querySelector('.resource-count');
      if (countEl) {
        countEl.textContent = `${this.countChecked(slots)}/${slots.length}`;
      }
    }
  }

  /**
   * Set character (full replace) - use for initial load
   */
  setCharacter(character) {
    this.render(character);
  }

  /**
   * Get portrait URL for use as battle token
   */
  getPortraitUrl() {
    return this.character?.portrait || null;
  }
}

// Export for use
export default CharacterSheetComponent;
