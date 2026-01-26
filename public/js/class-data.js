/**
 * Daggerheart Class Data
 * Contains comprehensive class information matching the official character sheets
 * Used by the character sheet wizard and form population
 */

// Class Banner Colors
export const CLASS_COLORS = {
  Bard: '#8B2942',      // Deep burgundy
  Druid: '#2D5A3D',     // Forest green
  Guardian: '#3D5A80',  // Steel blue
  Ranger: '#6B4423',    // Earth brown
  Rogue: '#4A3B5C',     // Dark purple
  Seraph: '#B8860B',    // Gold/amber
  Sorcerer: '#5B2C6F',  // Deep purple
  Warrior: '#8B0000',   // Crimson
  Wizard: '#1E3A5F',    // Royal blue
};

// Trait skills reference (for display on trait boxes)
export const TRAIT_SKILLS = {
  agility: ['Sprint', 'Leap', 'Maneuver'],
  strength: ['Lift', 'Smash', 'Grapple'],
  finesse: ['Control', 'Hide', 'Tinker'],
  instinct: ['Perceive', 'Sense', 'Navigate'],
  presence: ['Charm', 'Perform', 'Deceive'],
  knowledge: ['Recall', 'Analyze', 'Comprehend']
};

// Comprehensive class data matching official sheets
export const CLASS_DATA = {
  Bard: {
    name: 'Bard',
    domains: 'Grace & Codex',
    base_evasion: 10,
    suggested_traits: { agility: 0, strength: -1, finesse: 1, instinct: 0, presence: 2, knowledge: 1 },
    class_features: `RALLY
Once per session, describe how you rally the party and give yourself and each of your allies a Rally Die. At level 1, your Rally Die is a d6. A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear a number of Stress equal to the result. At the end of each session, clear all unspent Rally Dice.

At level 5, your Rally Die increases to a d8.`,
    hope_feature: 'Make a Scene: Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.',
    subclasses: {
      wordsmith: {
        name: 'Wordsmith',
        spellcast_trait: 'knowledge',
        foundation: 'Power of the Pen: You carry a magical tome that records your adventures. Once per rest, you can read from it to give an ally Hope.'
      },
      troubadour: {
        name: 'Troubadour',
        spellcast_trait: 'presence',
        foundation: 'Inspiring Performance: Your performances can bolster allies. When you perform, allies who can hear you gain +1 to their next roll.'
      }
    },
    suggested_weapons: [
      { name: 'Rapier', trait_and_range: 'Presence Melee', damage: 'd8 phy', feature: 'Quick: When you make an attack, you can mark a Stress to target another creature within range.', is_primary: true, is_secondary: false },
      { name: 'Small Dagger', trait_and_range: 'Finesse Melee', damage: 'd8 phy', feature: 'Paired: +2 to primary weapon damage to targets within Melee range', is_primary: false, is_secondary: true }
    ],
    suggested_armor: { name: 'Gambeson Armor', base_thresholds: '5/11', base_score: '3', feature: 'Flexible: +1 to Evasion' }
  },

  Druid: {
    name: 'Druid',
    domains: 'Sage & Arcana',
    base_evasion: 10,
    suggested_traits: { agility: 1, strength: 0, finesse: 1, instinct: 2, presence: -1, knowledge: 0 },
    class_features: `BEASTFORM
Mark a Stress to magically transform into a creature of your tier or lower from the Beastform list. You can drop out of this form at any time. While transformed, you can't use weapons or cast spells from domain cards, but you can still use other features or abilities you have access to. Spells you cast before you transform stay active and last for their normal duration, and you can talk and communicate as normal. Additionally, you gain the Beastform's features, add their Evasion bonus to your Evasion, and use the trait specified in their statistics for your attack. While you're in a Beastform, your armor becomes part of your body and you mark Armor Slots as usual; when you drop out of a Beastform, those marked Armor Slots remain marked. If you mark your last Hit Point, you automatically drop out of this form.

WILDTOUCH
You can perform harmless, subtle effects that involve nature—such as causing a flower to rapidly grow, summoning a slight gust of wind, or starting a campfire—at will.`,
    hope_feature: 'Evolution: Spend 3 Hope to transform into Beastform without marking a Stress. When you do, choose one trait to raise by +1 until you drop out of that Beastform.',
    subclasses: {
      warden_of_renewal: {
        name: 'Warden of Renewal',
        spellcast_trait: 'instinct',
        foundation: 'Gift of the Wild: You can touch a creature to heal them for 1d6 HP. This can be used once per rest.'
      },
      warden_of_the_elements: {
        name: 'Warden of the Elements',
        spellcast_trait: 'presence',
        foundation: 'Elemental Affinity: Choose an element (fire, water, earth, air). Your spells of that element deal +2 damage.'
      }
    },
    suggested_weapons: [
      { name: 'Shortstaff', trait_and_range: 'Instinct Close', damage: 'd8+1 mag', feature: '', is_primary: true, is_secondary: false },
      { name: 'Round Shield', trait_and_range: 'Strength Melee', damage: 'd4 phy', feature: 'Protective: +1 to Armor Score', is_primary: false, is_secondary: true }
    ],
    suggested_armor: { name: 'Leather Armor', base_thresholds: '6/13', base_score: '3', feature: '' }
  },

  Guardian: {
    name: 'Guardian',
    domains: 'Valor & Blade',
    base_evasion: 9,
    suggested_traits: { agility: 1, strength: 2, finesse: -1, instinct: 0, presence: 1, knowledge: 0 },
    class_features: `UNSTOPPABLE
Once per long rest, you can become Unstoppable. You gain an Unstoppable Die. At level 1, your Unstoppable Die is a d4. Place it on this sheet in the space provided, starting with the 1 value facing up. After you make a damage roll that deals 1 or more Hit Points to a target, increase the Unstoppable Die value by one. When the die's value would exceed its maximum value or when the scene ends, remove the die and drop out of Unstoppable. At level 5, your Unstoppable Die increases to a d6.

While Unstoppable, you gain the following benefits:
• You reduce the severity of physical damage by one threshold (Severe to Major, Major to Minor, Minor to None).
• You add the current value of the Unstoppable Die to your damage roll.
• You can't be Restrained or Vulnerable.`,
    hope_feature: 'Frontline Tank: Spend 3 Hope to clear 2 Armor Slots.',
    subclasses: {
      stalwart: {
        name: 'Stalwart',
        spellcast_trait: 'strength',
        foundation: 'Immovable: When you take a defensive stance, you cannot be moved against your will and gain +1 Armor Score until your next turn.'
      },
      vengeance: {
        name: 'Vengeance',
        spellcast_trait: 'strength',
        foundation: 'Retribution: When an enemy damages an ally within Very Close range, you may immediately make a melee attack against that enemy.'
      }
    },
    suggested_weapons: [
      { name: 'Battleaxe', trait_and_range: 'Strength Melee', damage: 'd10+3 phy', feature: '', is_primary: true, is_secondary: false }
    ],
    suggested_armor: { name: 'Chainmail Armor', base_thresholds: '7/15', base_score: '4', feature: 'Heavy: -1 to Evasion' }
  },

  Ranger: {
    name: 'Ranger',
    domains: 'Bone & Sage',
    base_evasion: 12,
    suggested_traits: { agility: 2, strength: 0, finesse: 1, instinct: 1, presence: -1, knowledge: 0 },
    class_features: `RANGER'S FOCUS
Spend a Hope and make an attack against a target. On a success, deal your attack's normal damage and temporarily make the attack's target your Focus. Until this feature ends or you make a different creature your Focus, you gain the following benefits against your Focus:
• You know precisely what direction they are in.
• When you deal damage to them, they must mark a Stress.
• When you fail an attack against them, you can end your Ranger's Focus feature to reroll your Duality Dice.`,
    hope_feature: 'Hold Them Off: Spend 3 Hope when you succeed on an attack with a weapon to use that same roll against two additional adversaries within range of the attack.',
    subclasses: {
      beastbound: {
        name: 'Beastbound',
        spellcast_trait: 'instinct',
        foundation: 'Animal Companion: You have a loyal animal companion that fights alongside you. Your companion has its own stat block and acts on your turn.'
      },
      wayfinder: {
        name: 'Wayfinder',
        spellcast_trait: 'knowledge',
        foundation: 'Trailblazer: You cannot get lost and always know which direction is north. You and your allies travel 25% faster in wilderness.'
      }
    },
    suggested_weapons: [
      { name: 'Shortbow', trait_and_range: 'Agility Far', damage: 'd6+3 phy', feature: '', is_primary: true, is_secondary: false }
    ],
    suggested_armor: { name: 'Leather Armor', base_thresholds: '6/13', base_score: '3', feature: '' }
  },

  Rogue: {
    name: 'Rogue',
    domains: 'Midnight & Grace',
    base_evasion: 12,
    suggested_traits: { agility: 1, strength: -1, finesse: 2, instinct: 0, presence: 1, knowledge: 0 },
    class_features: `CLOAKED
Any time you would be Hidden, you are instead Cloaked. In addition to the benefits of the Hidden condition, while Cloaked you remain unseen if you are stationary when an adversary moves to where they would normally see you. After you make an attack or end a move within line of sight of an adversary, you are no longer Cloaked.

SNEAK ATTACK
When you succeed on an attack while Cloaked or while an ally is within Melee range of your target, add a number of d6s equal to your tier to your damage roll.
Level 1 is Tier 1
Levels 2-4 are Tier 2
Levels 5-7 are Tier 3
Levels 8-10 are Tier 4`,
    hope_feature: "Rogue's Dodge: Spend 3 Hope to gain a +2 bonus to your Evasion until the next time an attack succeeds against you. Otherwise, this bonus lasts until your next rest.",
    subclasses: {
      syndicate: {
        name: 'Syndicate',
        spellcast_trait: 'finesse',
        foundation: 'Underworld Contacts: In any settlement, you can find a contact who owes you a favor. They can provide information, shelter, or simple equipment.'
      },
      nightwalker: {
        name: 'Nightwalker',
        spellcast_trait: 'instinct',
        foundation: 'Shadow Step: Once per rest, you can teleport to any shadow you can see within Close range.'
      }
    },
    suggested_weapons: [
      { name: 'Dagger', trait_and_range: 'Finesse Melee', damage: 'd8+1 phy', feature: '', is_primary: true, is_secondary: false },
      { name: 'Small Dagger', trait_and_range: 'Finesse Melee', damage: 'd8 phy', feature: 'Paired: +2 to primary weapon damage to targets within Melee range', is_primary: false, is_secondary: true }
    ],
    suggested_armor: { name: 'Gambeson Armor', base_thresholds: '5/11', base_score: '3', feature: 'Flexible: +1 to Evasion' }
  },

  Seraph: {
    name: 'Seraph',
    domains: 'Splendor & Valor',
    base_evasion: 9,
    suggested_traits: { agility: 0, strength: 2, finesse: 0, instinct: 1, presence: 1, knowledge: -1 },
    class_features: `PRAYER DICE
At the beginning of each session, roll a number of d4s equal to your subclass's Spellcast trait and place them on this sheet in the space provided. These are your Prayer Dice. You can spend any number of Prayer Dice to aid yourself or an ally within Far range. You can use a spent die's value to reduce incoming damage, add to a roll's result after the roll is made, or gain Hope equal to the result. At the end of each session, clear all unspent Prayer Dice.`,
    hope_feature: 'Life Support: Spend 3 Hope to clear a Hit Point on an ally within Close range.',
    subclasses: {
      winged_sentinel: {
        name: 'Winged Sentinel',
        spellcast_trait: 'presence',
        foundation: 'Celestial Wings: You can manifest spectral wings, gaining flight for up to 1 minute. This can be used once per rest.'
      },
      bound_by_faith: {
        name: 'Bound by Faith',
        spellcast_trait: 'knowledge',
        foundation: 'Divine Oath: Choose an oath (protection, justice, mercy). When acting in accordance with your oath, gain +1 to all rolls.'
      }
    },
    suggested_weapons: [
      { name: 'Hallowed Axe', trait_and_range: 'Strength Melee', damage: 'd8+1 mag', feature: '', is_primary: true, is_secondary: false },
      { name: 'Round Shield', trait_and_range: 'Strength Melee', damage: 'd4 phy', feature: 'Protective: +1 to Armor Score', is_primary: false, is_secondary: true }
    ],
    suggested_armor: { name: 'Chainmail Armor', base_thresholds: '7/15', base_score: '4', feature: 'Heavy: -1 to Evasion' }
  },

  Sorcerer: {
    name: 'Sorcerer',
    domains: 'Arcana & Midnight',
    base_evasion: 10,
    suggested_traits: { agility: 0, strength: -1, finesse: 1, instinct: 2, presence: 1, knowledge: 0 },
    class_features: `ARCANE SENSE
You can sense the presence of magical people and objects within Close range.

MINOR ILLUSION
Make a Spellcast Roll (10). On a success, you create a minor visual illusion no larger than yourself within Close range. This illusion is convincing to anyone at Close range or farther.

CHANNEL RAW POWER
Once per long rest, you can place a domain card from your loadout into your vault and choose to either:
• Gain Hope equal to the level of the card.
• Enhance a spell that deals damage, gaining a bonus to your damage roll equal to twice the level of the card.`,
    hope_feature: 'Volatile Magic: Spend 3 Hope to reroll any number of your damage dice on an attack that deals magic damage.',
    subclasses: {
      primal_origin: {
        name: 'Primal Origin',
        spellcast_trait: 'presence',
        foundation: 'Wild Magic: When you roll a critical success on a spell attack, you may trigger a random magical effect from the Wild Magic table.'
      },
      elemental_origin: {
        name: 'Elemental Origin',
        spellcast_trait: 'instinct',
        foundation: 'Elemental Blood: Choose an element. You have resistance to that element and your spells of that element ignore resistance.'
      }
    },
    suggested_weapons: [
      { name: 'Dualstaff', trait_and_range: 'Instinct Far', damage: 'd6+3 mag', feature: '', is_primary: true, is_secondary: false }
    ],
    suggested_armor: { name: 'Gambeson Armor', base_thresholds: '5/11', base_score: '3', feature: 'Flexible: +1 to Evasion' }
  },

  Warrior: {
    name: 'Warrior',
    domains: 'Blade & Bone',
    base_evasion: 11,
    suggested_traits: { agility: 2, strength: 1, finesse: 0, instinct: 1, presence: -1, knowledge: 0 },
    class_features: `ATTACK OF OPPORTUNITY
When an adversary within Melee range attempts to leave that range, make a reaction roll using a trait of your choice against their Difficulty. Choose one effect on a success, or two if you critically succeed:
• They can't move from where they are.
• You deal damage to them equal to your primary weapon's damage.
• You move with them.

COMBAT TRAINING
You ignore burden when equipping weapons. When you deal physical damage, you gain a bonus to your damage roll equal to your level.`,
    hope_feature: 'No Mercy: Spend 3 Hope to gain a +1 bonus to your attack rolls until your next rest.',
    subclasses: {
      call_of_the_brave: {
        name: 'Call of the Brave',
        spellcast_trait: 'strength',
        foundation: 'Battle Cry: Once per encounter, you can shout a battle cry. All allies who hear it gain +2 to their next attack roll.'
      },
      call_of_the_slayer: {
        name: 'Call of the Slayer',
        spellcast_trait: 'finesse',
        foundation: 'Exploit Weakness: When you hit an enemy, you learn one of their vulnerabilities or weaknesses if they have any.'
      }
    },
    suggested_weapons: [
      { name: 'Longsword', trait_and_range: 'Agility Melee', damage: 'd8+3 phy', feature: '', is_primary: true, is_secondary: false }
    ],
    suggested_armor: { name: 'Chainmail Armor', base_thresholds: '7/15', base_score: '4', feature: 'Heavy: -1 to Evasion' }
  },

  Wizard: {
    name: 'Wizard',
    domains: 'Codex & Splendor',
    base_evasion: 11,
    suggested_traits: { agility: -1, strength: 0, finesse: 0, instinct: 1, presence: 1, knowledge: 2 },
    class_features: `PRESTIDIGITATION
You can perform harmless, subtle magical effects at will. For example, you can change an object's color, create a smell, light a candle, cause a tiny object to float, illuminate a room, or repair a small object.

STRANGE PATTERNS
Choose a number between 1 and 12. When you roll that number on a Duality Die, gain a Hope or clear a Stress. You can change this number when you take a long rest.`,
    hope_feature: 'Not This Time: Spend 3 Hope to force an adversary within Far range to reroll an attack or damage roll.',
    subclasses: {
      school_of_knowledge: {
        name: 'School of Knowledge',
        spellcast_trait: 'knowledge',
        foundation: 'Arcane Library: You have access to a magical library. Once per day, you can research a topic and learn one useful fact.'
      },
      school_of_war: {
        name: 'School of War',
        spellcast_trait: 'instinct',
        foundation: 'Combat Casting: You can cast spells while wearing light armor. Your spell attacks deal +1 damage.'
      }
    },
    suggested_weapons: [
      { name: 'Greatstaff', trait_and_range: 'Knowledge Very Far', damage: 'd6 mag', feature: 'Powerful: On a successful attack, roll an additional damage die and discard the lowest result.', is_primary: true, is_secondary: false }
    ],
    suggested_armor: { name: 'Leather Armor', base_thresholds: '6/13', base_score: '3', feature: '' }
  }
};

// Helper function to get proficiency based on level
export function getProficiency(level) {
  if (level >= 10) return 6;
  if (level >= 8) return 5;
  if (level >= 5) return 4;
  if (level >= 3) return 3;
  if (level >= 2) return 2;
  return 1;
}

// Helper function to get tier based on level
export function getTier(level) {
  if (level >= 8) return 4;
  if (level >= 5) return 3;
  if (level >= 2) return 2;
  return 1;
}

// Helper function to get domain card slots based on level
export function getDomainCardSlots(level) {
  return 2 + Math.max(0, level - 1);
}

// Default character structure matching new data model
export function createDefaultCharacter(campaign_id = '', odeum_id = '') {
  return {
    // Identity
    id: crypto.randomUUID(),
    odeum_id: odeum_id,
    campaign_id: campaign_id,

    // Header Info (all free text)
    name: '',
    pronouns: '',
    heritage: '',
    class_name: '',
    subclass: '',
    level: 1,
    portrait: null, // URL or data URL for character portrait (used as battle token)

    // Combat Stats (numeric)
    evasion: 10,
    armor: 0,
    proficiency: 1,

    // Traits (numeric, can be negative)
    agility: 0,
    strength: 0,
    finesse: 0,
    instinct: 0,
    presence: 0,
    knowledge: 0,

    // Damage Thresholds (free text)
    minor_damage: '0',
    major_damage: '0',
    severe_damage: '0',

    // Resource Tracking (arrays of booleans)
    hp_slots: [false, false, false, false, false, false],
    stress_slots: [false, false, false, false, false, false],
    hope_slots: [false, false, false, false, false, false],
    armor_slots: [],

    // Experiences
    experiences: [
      { name: '', modifier: '+2' },
      { name: '', modifier: '+2' }
    ],

    // Weapons
    weapons: [],

    // Armor
    active_armor: {
      name: '',
      base_thresholds: '',
      base_score: '',
      feature: ''
    },

    // Gold (checkboxes)
    gold_handfuls: [false, false, false, false, false, false, false, false],
    gold_bags: [false, false, false, false, false, false, false, false],
    gold_chests: [false],

    // Free Text Areas
    class_features: '',
    hope_feature: '',
    inventory: '',
    notes: '',

    // Metadata
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_modified_by: 'player'
  };
}

// Helper to populate character from class selection
export function populateFromClass(character, className, subclassKey) {
  const classData = CLASS_DATA[className];
  if (!classData) return character;

  character.class_name = className;
  character.evasion = classData.base_evasion;
  character.class_features = classData.class_features;
  character.hope_feature = classData.hope_feature;

  // Apply suggested traits
  if (classData.suggested_traits) {
    character.agility = classData.suggested_traits.agility;
    character.strength = classData.suggested_traits.strength;
    character.finesse = classData.suggested_traits.finesse;
    character.instinct = classData.suggested_traits.instinct;
    character.presence = classData.suggested_traits.presence;
    character.knowledge = classData.suggested_traits.knowledge;
  }

  // Set subclass
  if (subclassKey && classData.subclasses && classData.subclasses[subclassKey]) {
    character.subclass = classData.subclasses[subclassKey].name;
  }

  // Add suggested weapons
  if (classData.suggested_weapons) {
    character.weapons = classData.suggested_weapons.map(w => ({
      ...w,
      is_active: true
    }));
  }

  // Add suggested armor
  if (classData.suggested_armor) {
    character.active_armor = { ...classData.suggested_armor };
    // Set armor slots based on armor score
    const armorScore = parseInt(classData.suggested_armor.base_score) || 0;
    character.armor_slots = Array(armorScore).fill(false);
    character.armor = armorScore;
  }

  return character;
}
