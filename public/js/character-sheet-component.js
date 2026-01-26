/**
 * Daggerheart Character Sheet Component
 * Form-based character sheet matching official paper layout
 * Supports real-time sync and both dark/light modes
 */

import { CLASS_DATA, CLASS_COLORS, TRAIT_SKILLS, getProficiency, getTier } from './class-data.js';

// Debounce function for real-time sync
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
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * CharacterSheetComponent Class
 * Manages the form-based character sheet rendering and updates
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
      debounceMs: 300,
      ...options
    };

    this.character = null;
    this.syncIndicator = null;

    // Debounced update function
    this.debouncedUpdate = debounce((field, value) => {
      if (this.options.onUpdate) {
        this.options.onUpdate(field, value, this.character);
        this.showSyncIndicator();
      }
    }, this.options.debounceMs);
  }

  /**
   * Load and render a character
   */
  render(character) {
    this.character = character;

    if (!this.container) {
      console.error('CharacterSheetComponent: Container not found');
      return;
    }

    const classLower = (character.class_name || '').toLowerCase();
    const darkModeClass = this.options.darkMode ? 'dark-mode' : '';

    this.container.innerHTML = `
      <div class="character-sheet-form ${darkModeClass}">
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

        <div class="sheet-sync-indicator" id="sheetSyncIndicator">Saved</div>
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

    return `
      <div class="class-banner ${classLower}">
        <div class="class-banner-left">
          <div class="class-banner-title">${escapeHtml(char.class_name) || 'Character'}</div>
          <div class="class-banner-domains">${escapeHtml(classData.domains || '')}</div>
        </div>
        <div class="class-banner-right">
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
          <div class="level-display">
            <div class="level-number">${char.level || 1}</div>
            <div class="level-label">Level</div>
          </div>
          <button class="print-btn" onclick="window.print()">
            Print Sheet
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render Combat Stats Section
   */
  renderCombatStats(char) {
    const proficiency = char.proficiency || getProficiency(char.level || 1);

    return `
      <div class="sheet-section">
        <div class="section-header">Combat Stats</div>
        <div class="section-content">
          <div class="combat-stats-row">
            <div class="combat-stat">
              <div class="combat-stat-label">Evasion</div>
              <input type="number"
                     data-field="evasion"
                     value="${char.evasion || 10}"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="combat-stat">
              <div class="combat-stat-label">Armor</div>
              <input type="number"
                     data-field="armor"
                     value="${char.armor || 0}"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="combat-stat">
              <div class="combat-stat-label">Proficiency</div>
              <div class="proficiency-row">
                ${this.renderProficiencyDots(proficiency)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Proficiency Dots
   */
  renderProficiencyDots(proficiency) {
    let dots = '';
    for (let i = 1; i <= 6; i++) {
      dots += `<div class="proficiency-dot ${i <= proficiency ? 'filled' : ''}"></div>`;
    }
    return `<div class="proficiency-dots">${dots}</div>`;
  }

  /**
   * Render Traits Section (2x3 Grid)
   */
  renderTraits(char) {
    const traits = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];
    const spellcastTrait = this.getSpellcastTrait(char);

    const traitBoxes = traits.map(trait => {
      const value = char[trait] || 0;
      const skills = TRAIT_SKILLS[trait] || [];
      const isSpellcast = trait === spellcastTrait;

      return `
        <div class="trait-box ${isSpellcast ? 'spellcast' : ''}">
          ${isSpellcast ? '<span class="spellcast-badge">Spellcast</span>' : ''}
          <div class="trait-name">${trait.charAt(0).toUpperCase() + trait.slice(1)}</div>
          <input type="text"
                 class="trait-value-input"
                 data-field="${trait}"
                 value="${value >= 0 ? '+' + value : value}"
                 ${this.options.readOnly ? 'readonly' : ''}>
          <div class="trait-skills">${skills.join(', ')}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Traits</div>
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
   */
  renderDamageHealth(char) {
    const hpSlots = char.hp_slots || Array(6).fill(false);
    const stressSlots = char.stress_slots || Array(6).fill(false);
    const armorSlots = char.armor_slots || [];

    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Damage & Health</div>
        <div class="section-content">
          <!-- Damage Thresholds -->
          <div class="damage-thresholds">
            <div class="threshold-item minor">
              <div class="threshold-label">Minor</div>
              <input type="text"
                     class="threshold-input"
                     data-field="minor_damage"
                     value="${escapeHtml(char.minor_damage || '0')}"
                     ${this.options.readOnly ? 'readonly' : ''}>
            </div>
            <div class="threshold-item major">
              <div class="threshold-label">Major</div>
              <input type="text"
                     class="threshold-input"
                     data-field="major_damage"
                     value="${escapeHtml(char.major_damage || '0')}"
                     ${this.options.readOnly ? 'readonly' : ''}>
              <div class="threshold-hint">+Level</div>
            </div>
            <div class="threshold-item severe">
              <div class="threshold-label">Severe</div>
              <input type="text"
                     class="threshold-input"
                     data-field="severe_damage"
                     value="${escapeHtml(char.severe_damage || '0')}"
                     ${this.options.readOnly ? 'readonly' : ''}>
              <div class="threshold-hint">+Level</div>
            </div>
          </div>

          <!-- HP Slots -->
          <div class="checkbox-row" style="margin-top: 1rem;">
            <span class="checkbox-row-label">HP</span>
            <div class="checkbox-slots" data-slots="hp_slots">
              ${this.renderCheckboxSlots(hpSlots, 'hp')}
            </div>
          </div>

          <!-- Stress Slots -->
          <div class="checkbox-row">
            <span class="checkbox-row-label">Stress</span>
            <div class="checkbox-slots" data-slots="stress_slots">
              ${this.renderCheckboxSlots(stressSlots, 'stress')}
            </div>
          </div>

          <!-- Armor Slots -->
          ${armorSlots.length > 0 ? `
          <div class="checkbox-row">
            <span class="checkbox-row-label">Armor</span>
            <div class="checkbox-slots" data-slots="armor_slots">
              ${this.renderCheckboxSlots(armorSlots, 'armor')}
            </div>
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

    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Hope</div>
        <div class="section-content">
          <div class="checkbox-row">
            <span class="checkbox-row-label">Hope</span>
            <div class="checkbox-slots" data-slots="hope_slots">
              ${this.renderCheckboxSlots(hopeSlots, 'hope')}
            </div>
          </div>
          <div style="margin-top: 0.75rem;">
            <label style="font-size: 0.75rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">
              Hope Feature
            </label>
            <textarea class="text-area-field"
                      data-field="hope_feature"
                      placeholder="Your class Hope feature..."
                      ${this.options.readOnly ? 'readonly' : ''}>${escapeHtml(char.hope_feature || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Checkbox Slots
   */
  renderCheckboxSlots(slots, type) {
    return slots.map((checked, index) => `
      <div class="checkbox-slot ${type} ${checked ? 'checked' : ''}"
           data-index="${index}"
           data-type="${type}">
      </div>
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
        <button class="experience-remove" data-action="remove-experience" data-index="${index}">×</button>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Experiences</div>
        <div class="section-content">
          <div class="experiences-list">
            ${experienceRows}
          </div>
          ${!this.options.readOnly ? `
          <button class="add-experience-btn" data-action="add-experience">+ Add Experience</button>
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

    const primaryWeapon = weapons.find(w => w.is_primary);
    const secondaryWeapon = weapons.find(w => w.is_secondary);
    const inventoryWeapons = weapons.filter(w => !w.is_primary && !w.is_secondary && w.is_active);

    return `
      <div class="sheet-section collapsible-section expanded">
        <div class="section-header collapsible-trigger">Active Weapons</div>
        <div class="section-content">
          <div class="weapons-section">
            ${this.renderWeaponBlock(primaryWeapon, 'Primary', 0)}
            ${this.renderWeaponBlock(secondaryWeapon, 'Secondary', 1)}
          </div>

          ${inventoryWeapons.length > 0 ? `
          <div style="margin-top: 1rem;">
            <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">
              Inventory Weapons
            </div>
            <div class="weapons-section">
              ${inventoryWeapons.map((w, i) => this.renderWeaponBlock(w, 'Inventory', i + 2)).join('')}
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
    if (!weapon && type !== 'Primary' && type !== 'Secondary') return '';

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

    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Active Armor</div>
        <div class="section-content">
          <div class="armor-block">
            <div class="armor-fields">
              <div class="weapon-field full-width">
                <label>Name</label>
                <input type="text"
                       data-field="active_armor.name"
                       value="${escapeHtml(armor.name || '')}"
                       placeholder="Armor name"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
              <div class="weapon-field">
                <label>Base Thresholds</label>
                <input type="text"
                       data-field="active_armor.base_thresholds"
                       value="${escapeHtml(armor.base_thresholds || '')}"
                       placeholder="5/11"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
              <div class="weapon-field">
                <label>Armor Score</label>
                <input type="text"
                       data-field="active_armor.base_score"
                       value="${escapeHtml(armor.base_score || '')}"
                       placeholder="3"
                       ${this.options.readOnly ? 'readonly' : ''}>
              </div>
              <div class="weapon-field">
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
    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Inventory</div>
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
   * Render Gold Section
   */
  renderGold(char) {
    const handfuls = char.gold_handfuls || Array(8).fill(false);
    const bags = char.gold_bags || Array(8).fill(false);
    const chests = char.gold_chests || [false];

    return `
      <div class="sheet-section collapsible-section">
        <div class="section-header collapsible-trigger">Gold</div>
        <div class="section-content">
          <div class="gold-section">
            <div class="gold-row">
              <span class="gold-label">Handfuls</span>
              <div class="gold-slots" data-slots="gold_handfuls">
                ${this.renderGoldSlots(handfuls, 'gold_handfuls')}
              </div>
              <span class="gold-count">${this.countChecked(handfuls)}</span>
            </div>
            <div class="gold-row">
              <span class="gold-label">Bags</span>
              <div class="gold-slots" data-slots="gold_bags">
                ${this.renderGoldSlots(bags, 'gold_bags')}
              </div>
              <span class="gold-count">${this.countChecked(bags)}</span>
            </div>
            <div class="gold-row">
              <span class="gold-label">Chests</span>
              <div class="gold-slots" data-slots="gold_chests">
                ${this.renderGoldSlots(chests, 'gold_chests')}
              </div>
              <span class="gold-count">${this.countChecked(chests)}</span>
            </div>
          </div>
          <p style="font-size: 0.7rem; color: var(--sheet-muted); margin-top: 0.5rem; text-align: center;">
            10 handfuls = 1 bag, 10 bags = 1 chest
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Render Gold Slots
   */
  renderGoldSlots(slots, field) {
    return slots.map((checked, index) => `
      <div class="gold-slot ${checked ? 'checked' : ''}"
           data-index="${index}"
           data-field="${field}">
      </div>
    `).join('');
  }

  /**
   * Count checked slots
   */
  countChecked(slots) {
    return (slots || []).filter(Boolean).length;
  }

  /**
   * Render Class Features Section
   */
  renderClassFeatures(char) {
    return `
      <div class="sheet-section">
        <div class="section-header">Class Features</div>
        <div class="section-content">
          <textarea class="text-area-field large"
                    data-field="class_features"
                    placeholder="Your class features and abilities..."
                    ${this.options.readOnly ? 'readonly' : ''}>${escapeHtml(char.class_features || '')}</textarea>
        </div>
      </div>
    `;
  }

  /**
   * Render Notes Section
   */
  renderNotes(char) {
    return `
      <div class="sheet-section">
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
   * Attach event listeners
   */
  attachEventListeners() {
    if (this.options.readOnly) return;

    // Input change listeners
    this.container.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.dataset.field;
        if (field) {
          let value = e.target.value;

          // Handle trait inputs - convert "+2" to 2, "-1" to -1
          if (['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'].includes(field)) {
            value = parseInt(value.replace(/[^-\d]/g, '')) || 0;
          }

          this.updateField(field, value);
        }
      });
    });

    // Checkbox slot click listeners
    this.container.querySelectorAll('.checkbox-slot').forEach(slot => {
      slot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const type = e.target.dataset.type;
        this.toggleCheckboxSlot(type + '_slots', index);
      });
    });

    // Gold slot click listeners
    this.container.querySelectorAll('.gold-slot').forEach(slot => {
      slot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const field = e.target.dataset.field;
        this.toggleGoldSlot(field, index);
      });
    });

    // Collapsible section click listeners
    this.container.querySelectorAll('.collapsible-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const section = trigger.closest('.collapsible-section');
        section.classList.toggle('collapsed');
      });
    });

    // Add experience button
    const addExpBtn = this.container.querySelector('[data-action="add-experience"]');
    if (addExpBtn) {
      addExpBtn.addEventListener('click', () => this.addExperience());
    }

    // Remove experience buttons
    this.container.querySelectorAll('[data-action="remove-experience"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.removeExperience(index);
      });
    });
  }

  /**
   * Update a field value
   */
  updateField(field, value) {
    // Handle nested fields like "weapons.0.name" or "active_armor.name"
    const parts = field.split('.');
    let obj = this.character;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];

      // Handle array indices
      if (!isNaN(parseInt(nextPart))) {
        if (!obj[part]) obj[part] = [];
        obj = obj[part];
      } else {
        if (!obj[part]) obj[part] = {};
        obj = obj[part];
      }
    }

    const lastPart = parts[parts.length - 1];
    obj[lastPart] = value;

    // Update timestamp
    this.character.updated_at = new Date().toISOString();

    // Trigger debounced update
    this.debouncedUpdate(field, value);
  }

  /**
   * Toggle checkbox slot
   */
  toggleCheckboxSlot(slotsField, index) {
    if (!this.character[slotsField]) {
      this.character[slotsField] = Array(6).fill(false);
    }

    const slots = this.character[slotsField];
    const currentlyChecked = slots[index];

    // If clicking on a checked slot, uncheck it and all after it
    // If clicking on unchecked slot, check it and all before it
    if (currentlyChecked) {
      for (let i = index; i < slots.length; i++) {
        slots[i] = false;
      }
    } else {
      for (let i = 0; i <= index; i++) {
        slots[i] = true;
      }
    }

    // Re-render the slots
    const container = this.container.querySelector(`[data-slots="${slotsField}"]`);
    if (container) {
      const type = slotsField.replace('_slots', '');
      container.innerHTML = this.renderCheckboxSlots(slots, type);

      // Re-attach listeners
      container.querySelectorAll('.checkbox-slot').forEach(slot => {
        slot.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.index);
          this.toggleCheckboxSlot(slotsField, idx);
        });
      });
    }

    this.character.updated_at = new Date().toISOString();
    this.debouncedUpdate(slotsField, slots);
  }

  /**
   * Toggle gold slot
   */
  toggleGoldSlot(field, index) {
    if (!this.character[field]) {
      const defaultLength = field === 'gold_chests' ? 1 : 8;
      this.character[field] = Array(defaultLength).fill(false);
    }

    const slots = this.character[field];
    const currentlyChecked = slots[index];

    if (currentlyChecked) {
      for (let i = index; i < slots.length; i++) {
        slots[i] = false;
      }
    } else {
      for (let i = 0; i <= index; i++) {
        slots[i] = true;
      }
    }

    // Handle overflow conversions
    this.handleGoldOverflow();

    // Re-render gold section
    this.refreshGoldDisplay();

    this.character.updated_at = new Date().toISOString();
    this.debouncedUpdate('gold', {
      handfuls: this.character.gold_handfuls,
      bags: this.character.gold_bags,
      chests: this.character.gold_chests
    });
  }

  /**
   * Handle gold overflow (10 handfuls = 1 bag, etc.)
   */
  handleGoldOverflow() {
    const handfulsCount = this.countChecked(this.character.gold_handfuls);
    const bagsCount = this.countChecked(this.character.gold_bags);

    // Convert handfuls to bags
    if (handfulsCount >= 10) {
      const newBags = Math.floor(handfulsCount / 10);
      const remainingHandfuls = handfulsCount % 10;

      this.character.gold_handfuls = Array(8).fill(false);
      for (let i = 0; i < remainingHandfuls && i < 8; i++) {
        this.character.gold_handfuls[i] = true;
      }

      const totalBags = bagsCount + newBags;
      for (let i = 0; i < totalBags && i < 8; i++) {
        this.character.gold_bags[i] = true;
      }
    }

    // Convert bags to chests
    const newBagsCount = this.countChecked(this.character.gold_bags);
    if (newBagsCount >= 10) {
      const newChests = Math.floor(newBagsCount / 10);
      const remainingBags = newBagsCount % 10;

      this.character.gold_bags = Array(8).fill(false);
      for (let i = 0; i < remainingBags && i < 8; i++) {
        this.character.gold_bags[i] = true;
      }

      if (!this.character.gold_chests) {
        this.character.gold_chests = [false];
      }

      const chestsCount = this.countChecked(this.character.gold_chests);
      const totalChests = chestsCount + newChests;

      // Expand chests array if needed
      while (this.character.gold_chests.length < totalChests) {
        this.character.gold_chests.push(false);
      }

      for (let i = 0; i < totalChests; i++) {
        this.character.gold_chests[i] = true;
      }
    }
  }

  /**
   * Refresh gold display after changes
   */
  refreshGoldDisplay() {
    const goldFields = ['gold_handfuls', 'gold_bags', 'gold_chests'];

    goldFields.forEach(field => {
      const container = this.container.querySelector(`[data-slots="${field}"]`);
      if (container) {
        const slots = this.character[field] || (field === 'gold_chests' ? [false] : Array(8).fill(false));
        container.innerHTML = this.renderGoldSlots(slots, field);

        // Update count
        const countEl = container.nextElementSibling;
        if (countEl && countEl.classList.contains('gold-count')) {
          countEl.textContent = this.countChecked(slots);
        }

        // Re-attach listeners
        container.querySelectorAll('.gold-slot').forEach(slot => {
          slot.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            this.toggleGoldSlot(field, idx);
          });
        });
      }
    });
  }

  /**
   * Add a new experience
   */
  addExperience() {
    if (!this.character.experiences) {
      this.character.experiences = [];
    }

    this.character.experiences.push({ name: '', modifier: '+2' });
    this.character.updated_at = new Date().toISOString();

    // Re-render experiences section
    this.render(this.character);

    if (this.options.onUpdate) {
      this.options.onUpdate('experiences', this.character.experiences, this.character);
    }
  }

  /**
   * Remove an experience
   */
  removeExperience(index) {
    if (this.character.experiences && this.character.experiences.length > index) {
      this.character.experiences.splice(index, 1);
      this.character.updated_at = new Date().toISOString();

      // Re-render experiences section
      this.render(this.character);

      if (this.options.onUpdate) {
        this.options.onUpdate('experiences', this.character.experiences, this.character);
      }
    }
  }

  /**
   * Show sync indicator
   */
  showSyncIndicator() {
    if (this.syncIndicator) {
      this.syncIndicator.classList.add('visible');
      setTimeout(() => {
        this.syncIndicator.classList.remove('visible');
      }, 1500);
    }
  }

  /**
   * Get current character data
   */
  getCharacter() {
    return this.character;
  }

  /**
   * Update character externally (e.g., from Firebase)
   */
  setCharacter(character) {
    this.character = character;
    this.render(character);
  }
}

// Export for use
export default CharacterSheetComponent;
