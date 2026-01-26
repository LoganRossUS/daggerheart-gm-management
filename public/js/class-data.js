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
    description: 'As a bard, you know how to get people to talk, bring attention to yourself, and use words or music to influence the world around you.',
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
    suggested_armor: { name: 'Gambeson Armor', base_thresholds: '5/11', base_score: '3', feature: 'Flexible: +1 to Evasion' },
    background_questions: [
      'Who from your community taught you to have such confidence in yourself?',
      'You were in love once. Who did you adore, and how did they hurt you?',
      'You\'ve always looked up to another bard. Who are they, and why do you idolize them?'
    ],
    connections_questions: [
      'What made you realize we were going to be such good friends?',
      'What do I do that annoys you?',
      'Why do you grab my hand at night?'
    ],
    description_options: {
      clothes: ['extravagant', 'fancy', 'loud', 'oversized', 'ragged', 'sleek', 'wild'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a barkeep', 'a magician', 'a ringmaster', 'a rock star', 'a swashbuckler']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A romance novel', 'A letter never opened'],
      spellcasting_focus: 'Decide what you carry your spells in: songbook, journal, etc.'
    }
  },

  Druid: {
    name: 'Druid',
    domains: 'Sage & Arcana',
    base_evasion: 10,
    description: 'As a druid, you are a force of nature, preserving the balance of life and death by channeling the wilds themselves through you.',
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
    suggested_armor: { name: 'Leather Armor', base_thresholds: '6/13', base_score: '3', feature: '' },
    background_questions: [
      'Why was the community you grew up in so reliant on nature and its creatures?',
      'Who was the first wild animal you bonded with? Why did your bond end?',
      'Who has been trying to hunt you down? What do they want from you?'
    ],
    connections_questions: [
      'What did you confide in me that makes me leap into danger for you every time?',
      'What animal do I say you remind me of?',
      'What affectionate nickname have you given me?'
    ],
    description_options: {
      clothes: ['camouflaged', 'grown', 'loose', 'natural', 'patchwork', 'regal', 'scraps'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a firecracker', 'a fox', 'a guide', 'a hippie', 'a witch']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A small bag of rocks and bones', 'A strange pendant found in the dirt']
    },
    beastforms: {
      tier1: [
        {
          name: 'Agile Scout',
          examples: 'Fox, Mouse, Weasel, etc.',
          trait: 'agility',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Melee Agility d4 phy',
          advantages: ['deceive', 'locate', 'sneak'],
          features: [
            { name: 'Agile', description: 'Your movement is silent, and you can spend a Hope to move up to Far range without rolling.' },
            { name: 'Fragile', description: 'When you take Major or greater damage, you drop out of Beastform.' }
          ]
        },
        {
          name: 'Household Friend',
          examples: 'Cat, Dog, Rabbit, etc.',
          trait: 'instinct',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Melee Instinct d6 phy',
          advantages: ['climb', 'locate', 'protect'],
          features: [
            { name: 'Companion', description: 'When you Help an Ally, you can roll a d8 as your advantage die.' },
            { name: 'Fragile', description: 'When you take Major or greater damage, you drop out of Beastform.' }
          ]
        },
        {
          name: 'Nimble Grazer',
          examples: 'Deer, Gazelle, Goat, etc.',
          trait: 'agility',
          trait_bonus: 1,
          evasion_bonus: 3,
          attack: 'Melee Agility d6 phy',
          advantages: ['leap', 'sneak', 'sprint'],
          features: [
            { name: 'Elusive Prey', description: 'When an attack roll against you would succeed, you can mark a Stress and roll a d4. Add the result to your Evasion against this attack.' },
            { name: 'Fragile', description: 'When you take Major or greater damage, you drop out of Beastform.' }
          ]
        },
        {
          name: 'Aquatic Scout',
          examples: 'Eel, Fish, Octopus, etc.',
          trait: 'agility',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Melee Agility d4 phy',
          advantages: ['navigate', 'sneak', 'swim'],
          features: [
            { name: 'Aquatic', description: 'You can breathe and move naturally underwater.' },
            { name: 'Fragile', description: 'When you take Major or greater damage, you drop out of Beastform.' }
          ]
        },
        {
          name: 'Stalking Arachnid',
          examples: 'Tarantula, Wolf Spider, etc.',
          trait: 'finesse',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Melee Finesse d6+1 phy',
          advantages: ['attack', 'climb', 'sneak'],
          features: [
            { name: 'Venomous Bite', description: 'When you succeed on an attack against a target within Melee range, the target becomes temporarily Poisoned. A Poisoned creature takes 1d10 direct physical damage each time they act.' },
            { name: 'Webslinger', description: 'You can create a strong web material useful for both adventuring and battle. The web is resilient enough to support one creature. You can temporarily Restrain a target within Close range by succeeding on a Finesse Roll against them.' }
          ]
        },
        {
          name: 'Winged Beast',
          examples: 'Hawk, Owl, Raven, etc.',
          trait: 'finesse',
          trait_bonus: 1,
          evasion_bonus: 3,
          attack: 'Melee Finesse d4+2 phy',
          advantages: ['deceive', 'locate', 'scare'],
          features: [
            { name: 'Bird\'s-Eye View', description: 'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.' },
            { name: 'Hollow Bones', description: 'You gain a −2 penalty to your damage thresholds.' }
          ]
        }
      ],
      tier2: [
        {
          name: 'Armored Sentry',
          examples: 'Armadillo, Pangolin, Turtle, etc.',
          trait: 'strength',
          trait_bonus: 1,
          evasion_bonus: 1,
          attack: 'Melee Strength d8+2 phy',
          advantages: ['dig', 'locate', 'protect'],
          features: [
            { name: 'Armored Shell', description: 'Your hardened exterior gives you resistance to physical damage. Additionally, mark an Armor Slot to retract into your shell. While in your shell, physical damage is reduced by a number equal to your Armor Score (after applying resistance), but you can\'t perform other actions without leaving this form.' },
            { name: 'Cannonball', description: 'Mark a Stress to allow an ally to throw or launch you at an adversary. To do so, the ally makes an attack roll using Agility or Strength (their choice) against a target within Close range. On a success, the adversary takes d12+2 physical damage using the thrower\'s Proficiency. You can spend a Hope to target an additional adversary within Very Close range of the first. The second target takes half the damage dealt to the first target.' }
          ]
        },
        {
          name: 'Pack Predator',
          examples: 'Coyote, Hyena, Wolf, etc.',
          trait: 'strength',
          trait_bonus: 2,
          evasion_bonus: 1,
          attack: 'Melee Strength d8+2 phy',
          advantages: ['attack', 'sprint', 'track'],
          features: [
            { name: 'Hobbling Strike', description: 'When you succeed on an attack against a target within Melee range, you can mark a Stress to make the target temporarily Vulnerable.' },
            { name: 'Pack Hunting', description: 'When you succeed on an attack against the same target as an ally who acts immediately before you, add a d8 to your damage roll.' }
          ]
        },
        {
          name: 'Powerful Beast',
          examples: 'Bear, Bull, Moose, etc.',
          trait: 'strength',
          trait_bonus: 1,
          evasion_bonus: 3,
          attack: 'Melee Strength d10+4 phy',
          advantages: ['navigate', 'protect', 'scare'],
          features: [
            { name: 'Rampage', description: 'When you roll a 1 on a damage die, you can roll a d10 and add the result to the damage roll. Additionally, before you make an attack roll, you can mark a Stress to gain a +1 bonus to your Proficiency for that attack.' },
            { name: 'Thick Hide', description: 'You gain a +2 bonus to your damage thresholds.' }
          ]
        },
        {
          name: 'Mighty Strider',
          examples: 'Camel, Horse, Zebra, etc.',
          trait: 'agility',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Melee Agility d8+1 phy',
          advantages: ['leap', 'navigate', 'sprint'],
          features: [
            { name: 'Carrier', description: 'You can carry up to two willing allies with you when you move.' },
            { name: 'Trample', description: 'Mark a Stress to move up to Close range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+1 physical damage using your Proficiency and are temporarily Vulnerable.' }
          ]
        },
        {
          name: 'Striking Serpent',
          examples: 'Cobra, Rattlesnake, Viper, etc.',
          trait: 'finesse',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Very Close Finesse d8+4 phy',
          advantages: ['climb', 'deceive', 'sprint'],
          features: [
            { name: 'Venomous Strike', description: 'Make an attack against any number of targets within Very Close range. On a success, a target is temporarily Poisoned. A Poisoned creature takes 1d10 physical direct damage each time they act.' },
            { name: 'Warning Hiss', description: 'Mark a Stress to force any number of targets within Melee range to move back to Very Close range.' }
          ]
        },
        {
          name: 'Pouncing Predator',
          examples: 'Cheetah, Lion, Panther, etc.',
          trait: 'instinct',
          trait_bonus: 1,
          evasion_bonus: 3,
          attack: 'Melee Instinct d8+6 phy',
          advantages: ['attack', 'climb', 'sneak'],
          features: [
            { name: 'Fleet', description: 'Spend a Hope to move up to Far range without rolling.' },
            { name: 'Takedown', description: 'Mark a Stress to move into Melee range of a target and make an attack roll against them. On a success, you gain a +2 bonus to your Proficiency for this attack and the target must mark a Stress.' }
          ]
        }
      ],
      tier3: [
        {
          name: 'Great Predator',
          examples: 'Dire Wolf, Velociraptor, Sabertooth Tiger, etc.',
          trait: 'strength',
          trait_bonus: 2,
          evasion_bonus: 2,
          attack: 'Melee Strength d12+8 phy',
          advantages: ['attack', 'sneak', 'sprint'],
          features: [
            { name: 'Carrier', description: 'You can carry up to two willing allies with you when you move.' },
            { name: 'Vicious Maul', description: 'When you succeed on an attack against a target, you can spend a Hope to make them temporarily Vulnerable and gain a +1 bonus to your Proficiency for this attack.' }
          ]
        },
        {
          name: 'Mighty Lizard',
          examples: 'Alligator, Crocodile, Gila Monster, etc.',
          trait: 'instinct',
          trait_bonus: 2,
          evasion_bonus: 1,
          attack: 'Melee Instinct d10+7 phy',
          advantages: ['attack', 'sneak', 'track'],
          features: [
            { name: 'Physical Defense', description: 'You gain a +3 bonus to your damage thresholds.' },
            { name: 'Snapping Strike', description: 'When you succeed on an attack against a target within Melee range, you can spend a Hope to clamp that opponent in your jaws, making them temporarily Restrained and Vulnerable.' }
          ]
        },
        {
          name: 'Great Winged Beast',
          examples: 'Giant Eagle, Falcon, etc.',
          trait: 'finesse',
          trait_bonus: 2,
          evasion_bonus: 3,
          attack: 'Melee Finesse d8+6 phy',
          advantages: ['deceive', 'distract', 'locate'],
          features: [
            { name: 'Bird\'s-Eye View', description: 'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.' },
            { name: 'Carrier', description: 'You can carry up to two willing allies with you when you move.' }
          ]
        },
        {
          name: 'Aquatic Predator',
          examples: 'Dolphin, Orca, Shark, etc.',
          trait: 'agility',
          trait_bonus: 2,
          evasion_bonus: 4,
          attack: 'Melee Agility d10+6 phy',
          advantages: ['attack', 'swim', 'track'],
          features: [
            { name: 'Aquatic', description: 'You can breathe and move naturally underwater.' },
            { name: 'Vicious Maul', description: 'When you succeed on an attack against a target, you can spend a Hope to make them temporarily Vulnerable and gain a +1 bonus to your Proficiency for this attack.' }
          ]
        },
        {
          name: 'Legendary Beast',
          examples: 'Upgraded Tier 1 Options',
          trait: 'varies',
          trait_bonus: 1,
          evasion_bonus: 2,
          attack: 'Varies +6 damage bonus',
          advantages: ['varies'],
          features: [
            { name: 'Evolved', description: 'Pick a Tier 1 Beastform option and become a larger, more powerful version of that creature. While you\'re in this form, you retain all traits and features from the original form and gain: +6 bonus to damage rolls, +1 bonus to the trait used by this form, +2 bonus to Evasion.' }
          ]
        },
        {
          name: 'Legendary Hybrid',
          examples: 'Griffon, Sphinx, etc.',
          trait: 'strength',
          trait_bonus: 2,
          evasion_bonus: 3,
          attack: 'Melee Strength d10+8',
          advantages: ['varies'],
          features: [
            { name: 'Hybrid Features', description: 'To transform into this creature, mark an additional Stress. Choose any two Beastform options from Tiers 1–2. Choose a total of four advantages and two features from those options.' }
          ]
        }
      ],
      tier4: [
        {
          name: 'Massive Behemoth',
          examples: 'Elephant, Mammoth, Rhinoceros, etc.',
          trait: 'strength',
          trait_bonus: 3,
          evasion_bonus: 1,
          attack: 'Melee Strength d12+12 phy',
          advantages: ['locate', 'protect', 'scare', 'sprint'],
          features: [
            { name: 'Carrier', description: 'You can carry up to four willing allies with you when you move.' },
            { name: 'Demolish', description: 'Spend a Hope to move up to Far range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+10 physical damage using your Proficiency and are temporarily Vulnerable.' },
            { name: 'Undaunted', description: 'You gain a +2 bonus to all your damage thresholds.' }
          ]
        },
        {
          name: 'Terrible Lizard',
          examples: 'Brachiosaurus, Tyrannosaurus, etc.',
          trait: 'strength',
          trait_bonus: 3,
          evasion_bonus: 2,
          attack: 'Melee Strength d12+10 phy',
          advantages: ['attack', 'deceive', 'scare', 'track'],
          features: [
            { name: 'Devastating Strikes', description: 'When you deal Severe damage to a target within Melee range, you can mark a Stress to force them to mark an additional Hit Point.' },
            { name: 'Massive Stride', description: 'You can move up to Far range without rolling. You ignore rough terrain (at the GM\'s discretion) due to your size.' }
          ]
        },
        {
          name: 'Mythic Aerial Hunter',
          examples: 'Dragon, Pterodactyl, Roc, Wyvern, etc.',
          trait: 'finesse',
          trait_bonus: 3,
          evasion_bonus: 4,
          attack: 'Melee Finesse d10+11 phy',
          advantages: ['attack', 'deceive', 'locate', 'navigate'],
          features: [
            { name: 'Carrier', description: 'You can carry up to three willing allies with you when you move.' },
            { name: 'Deadly Raptor', description: 'You can fly at will and move up to Far range as part of your action. When you move in a straight line into Melee range of a target from at least Close range and make an attack against that target in the same action, you can reroll all damage dice that rolled a result lower than your Proficiency.' }
          ]
        },
        {
          name: 'Epic Aquatic Beast',
          examples: 'Giant Squid, Whale, etc.',
          trait: 'agility',
          trait_bonus: 3,
          evasion_bonus: 3,
          attack: 'Melee Agility d10+10 phy',
          advantages: ['locate', 'protect', 'scare', 'track'],
          features: [
            { name: 'Ocean Master', description: 'You can breathe and move naturally underwater. When you succeed on an attack against a target within Melee range, you can temporarily Restrain them.' },
            { name: 'Unyielding', description: 'When you would mark an Armor Slot, roll a d6. On a result of 5 or higher, reduce the severity by one threshold without marking an Armor Slot.' }
          ]
        },
        {
          name: 'Mythic Beast',
          examples: 'Upgraded Tier 1 or Tier 2 Options',
          trait: 'varies',
          trait_bonus: 2,
          evasion_bonus: 3,
          attack: 'Varies +9 damage bonus',
          advantages: ['varies'],
          features: [
            { name: 'Evolved', description: 'Pick a Tier 1 or Tier 2 Beastform option and become a larger, more powerful version of that creature. While you\'re in this form, you retain all traits and features from the original form and gain: +9 bonus to damage rolls, +2 bonus to the trait used by this form, +3 bonus to Evasion, your damage die increases by one size (d6 becomes d8, d8 becomes d10, etc.).' }
          ]
        },
        {
          name: 'Mythic Hybrid',
          examples: 'Chimera, Cockatrice, Manticore, etc.',
          trait: 'strength',
          trait_bonus: 3,
          evasion_bonus: 2,
          attack: 'Strength Melee d12+10 phy',
          advantages: ['varies'],
          features: [
            { name: 'Hybrid Features', description: 'To transform into this creature, mark 2 additional Stress. Choose any three Beastform options from Tiers 1–3. Choose a total of five advantages and three features from those options.' }
          ]
        }
      ]
    }
  },

  Guardian: {
    name: 'Guardian',
    domains: 'Valor & Blade',
    base_evasion: 9,
    description: 'As a guardian, you run into danger to protect your party, keeping watch over those who might not survive without you there.',
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
    suggested_armor: { name: 'Chainmail Armor', base_thresholds: '7/15', base_score: '4', feature: 'Heavy: -1 to Evasion' },
    background_questions: [
      'Who from your community did you fail to protect, and why do you still think of them?',
      'You\'ve been tasked with protecting something important and delivering it somewhere dangerous. What is it, and where does it need to go?',
      'You consider an aspect of yourself to be a weakness. What is it, and how has it affected you?'
    ],
    connections_questions: [
      'How did I save your life the first time we met?',
      'What small gift did you give me that you notice I always carry with me?',
      'What lie have you told me about yourself that I absolutely believe?'
    ],
    description_options: {
      clothes: ['casual', 'intricate', 'loose', 'padded', 'royal', 'tactical', 'weathered'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a captain', 'a caretaker', 'an elephant', 'a general', 'a wrestler']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A totem from your mentor', 'A secret key']
    }
  },

  Ranger: {
    name: 'Ranger',
    domains: 'Bone & Sage',
    base_evasion: 12,
    description: 'As a ranger, your keen eyes and graceful haste make you indispensable when tracking down enemies and navigating the wilds.',
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
        foundation: 'Animal Companion: You have a loyal animal companion that fights alongside you. Your companion has its own stat block and acts on your turn.',
        requires_companion: true
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
    suggested_armor: { name: 'Leather Armor', base_thresholds: '6/13', base_score: '3', feature: '' },
    background_questions: [
      'A terrible creature hurt your community, and you\'ve vowed to hunt them down. What are they, and what unique trail or sign do they leave behind?',
      'Your first kill almost killed you, too. What was it, and what part of you was never the same after that event?',
      'You\'ve traveled many dangerous lands, but what is the one place you refuse to go?'
    ],
    connections_questions: [
      'What friendly competition do we have?',
      'Why do you act differently when we\'re alone than when others are around?',
      'What threat have you asked me to watch for, and why are you worried about it?'
    ],
    description_options: {
      clothes: ['flowing', 'muted', 'natural', 'stained', 'tactical', 'tight', 'woven'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a child', 'a ghost', 'a survivalist', 'a teacher', 'a watchdog']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A trophy from your first kill', 'A seemingly broken compass']
    },
    companion: {
      description: 'Make a Spellcast Roll to connect with your companion and command them to take action. Spend a Hope to add an applicable Companion Experience to the roll. On a success with Hope, if your next action builds on their success, you gain advantage on the roll.',
      base_evasion: 10,
      base_stress_slots: 3,
      damage_note: 'When you command your companion to attack, they gain any benefits that would normally only apply to you (such as the effects of "Ranger\'s Focus"). On a success, their damage roll uses your Proficiency and their damage die.',
      stress_note: 'When your companion would take any amount of damage, they mark a Stress. When they mark their last Stress, they drop out of the scene (by hiding, fleeing, or a similar action). They remain unavailable until the start of your next long rest, where they return with 1 Stress cleared. When you choose a downtime move that clears Stress on yourself, your companion clears an equal number of Stress.',
      attack_dice: ['d6', 'd8', 'd10', 'd12'],
      attack_ranges: ['Melee', 'Very Close', 'Close', 'Far', 'Very Far'],
      training_options: [
        { name: 'Intelligent', description: 'Your companion gains a permanent +1 bonus to a Companion Experience of your choice.' },
        { name: 'Light in the Dark', description: 'Use this as an additional Hope slot your character can mark.' },
        { name: 'Creature Comfort', description: 'Once per rest, when you take time during a quiet moment to give your companion love and attention, you can gain a Hope or you can both clear a Stress.' },
        { name: 'Armored', description: 'When your companion takes damage, you can mark one of your Armor Slots instead of marking one of their Stress.' },
        { name: 'Vicious', description: 'Increase your companion\'s damage dice or range by one step (d6 to d8, Close to Far, etc.).' },
        { name: 'Resilient', description: 'Your companion gains an additional Stress slot.' },
        { name: 'Bonded', description: 'When you mark your last Hit Point, your companion rushes to your side to comfort you. Roll a number of d6s equal to the unmarked Stress slots they have and mark them. If any roll a 6, your companion helps you up. Clear your last Hit Point and return to the scene.' },
        { name: 'Aware', description: 'Your companion gains a permanent +2 bonus to their Evasion.' }
      ],
      example_experiences: [
        'Bold Distraction', 'Expert Climber', 'Fetch', 'Friendly', 'Guardian of the Forest',
        'Horrifying', 'Intimidating', 'Loyal Until the End', 'Navigation', 'Nimble',
        'Nobody Left Behind', 'On High Alert', 'Protective', 'Royal Companion', 'Scout',
        'Service Animal', 'Trusted Mount', 'Vigilant', 'We Always Find Them', 'You Can\'t Hit What You Can\'t Find'
      ]
    }
  },

  Rogue: {
    name: 'Rogue',
    domains: 'Midnight & Grace',
    base_evasion: 12,
    description: 'As a rogue, you have experience fighting with your blade as well as your wit, preferring to move quickly and fight quietly.',
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
    suggested_armor: { name: 'Gambeson Armor', base_thresholds: '5/11', base_score: '3', feature: 'Flexible: +1 to Evasion' },
    background_questions: [
      'What did you get caught doing that got you exiled from your home community?',
      'You used to have a different life, but you\'ve tried to leave it behind. Who from your past is still chasing you?',
      'Who from your past were you most sad to say goodbye to?'
    ],
    connections_questions: [
      'What did I recently convince you to do that got us both in trouble?',
      'What have I discovered about your past that I hold secret from the others?',
      'Who do you know from my past, and how have they influenced your feelings about me?'
    ],
    description_options: {
      clothes: ['clean', 'dark', 'inconspicuous', 'leather', 'scary', 'tactical', 'tight'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a bandit', 'a con artist', 'a gambler', 'a mob boss', 'a pirate']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A set of forgery tools', 'A grappling hook']
    }
  },

  Seraph: {
    name: 'Seraph',
    domains: 'Splendor & Valor',
    base_evasion: 9,
    description: 'As a seraph, you\'ve taken a vow to a god who helps you channel sacred arcane power to keep your party on their feet.',
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
    suggested_armor: { name: 'Chainmail Armor', base_thresholds: '7/15', base_score: '4', feature: 'Heavy: -1 to Evasion' },
    background_questions: [
      'Which god did you devote yourself to? What incredible feat did they perform for you in a moment of desperation?',
      'How did your appearance change after taking your oath?',
      'In what strange or unique way do you communicate with your god?'
    ],
    connections_questions: [
      'What promise did you make me agree to, should you die on the battlefield?',
      'Why do you ask me so many questions about my god?',
      'You\'ve told me to protect one member of our party above all others, even yourself. Who are they and why?'
    ],
    description_options: {
      clothes: ['glowing', 'rippling', 'ornate', 'tight', 'modest', 'strange', 'natural'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['an angel', 'a doctor', 'an evangelist', 'a monk', 'a priest']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A bundle of offerings', 'A sigil of your god']
    }
  },

  Sorcerer: {
    name: 'Sorcerer',
    domains: 'Arcana & Midnight',
    base_evasion: 10,
    description: 'As a sorcerer, you were born with innate magical power, and you\'ve learned how to wield that power to get what you want.',
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
    suggested_armor: { name: 'Gambeson Armor', base_thresholds: '5/11', base_score: '3', feature: 'Flexible: +1 to Evasion' },
    background_questions: [
      'What did you do that made the people in your community wary of you?',
      'What mentor taught you to control your untamed magic, and why are they no longer able to guide you?',
      'You have a deep fear you hide from everyone. What is it, and why does it scare you?'
    ],
    connections_questions: [
      'Why do you trust me so deeply?',
      'What did I do that makes you cautious around me?',
      'Why do we keep our shared past a secret?'
    ],
    description_options: {
      clothes: ['always moving', 'flamboyant', 'inconspicuous', 'layered', 'ornate', 'tight'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a celebrity', 'a commander', 'a politician', 'a prankster', 'a wolf in sheep\'s clothing']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A whispering orb', 'A family heirloom']
    }
  },

  Warrior: {
    name: 'Warrior',
    domains: 'Blade & Bone',
    base_evasion: 11,
    description: 'As a warrior, you run into battle without hesitation or caution, knowing you can strike down whatever enemy stands in your path.',
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
    suggested_armor: { name: 'Chainmail Armor', base_thresholds: '7/15', base_score: '4', feature: 'Heavy: -1 to Evasion' },
    background_questions: [
      'Who taught you to fight, and why did they stay behind when you left home?',
      'Somebody defeated you in battle years ago and left you to die. Who was it, and how did they betray you?',
      'What legendary place have you always wanted to visit, and why is it so special?'
    ],
    connections_questions: [
      'We knew each other long before this party came together. How?',
      'What mundane task do you usually help me with off the battlefield?',
      'What fear am I helping you overcome?'
    ],
    description_options: {
      clothes: ['bold', 'patched', 'reinforced', 'royal', 'sleek', 'sparing', 'weathered'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['a bull', 'a dedicated soldier', 'a gladiator', 'a hero', 'a hired hand']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['The drawing of a lover', 'A sharpening stone']
    }
  },

  Wizard: {
    name: 'Wizard',
    domains: 'Codex & Splendor',
    base_evasion: 11,
    description: 'As a wizard, you\'ve become familiar with the arcane through the relentless study of grimoires and other tools of magic.',
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
    suggested_armor: { name: 'Leather Armor', base_thresholds: '6/13', base_score: '3', feature: '' },
    background_questions: [
      'What responsibilities did your community once count on you for? How did you let them down?',
      'You\'ve spent your life searching for a book or object of great significance. What is it, and why is it so important to you?',
      'You have a powerful rival. Who are they, and why are you so determined to defeat them?'
    ],
    connections_questions: [
      'What favor have I asked of you that you\'re not sure you can fulfill?',
      'What weird hobby or strange fascination do we both share?',
      'What secret about yourself have you entrusted only to me?'
    ],
    description_options: {
      clothes: ['beautiful', 'clean', 'common', 'flowing', 'layered', 'patchwork', 'tight'],
      eyes: ['carnations', 'earth', 'endless ocean', 'fire', 'ivy', 'lilacs', 'night', 'seafoam', 'winter'],
      body: ['broad', 'carved', 'curvy', 'lanky', 'rotund', 'short', 'stocky', 'tall', 'thin', 'tiny', 'toned'],
      skin: ['ashes', 'clover', 'falling snow', 'fine sand', 'obsidian', 'rose', 'sapphire', 'wisteria'],
      attitude: ['an eccentric', 'a librarian', 'a lit fuse', 'a philosopher', 'a professor']
    },
    starting_inventory: {
      take_all: ['A torch', '50 feet of rope', 'Basic supplies', 'A handful of gold'],
      choose_one_1: ['Minor Health Potion', 'Minor Stamina Potion'],
      choose_one_2: ['A book you\'re trying to translate', 'A tiny, harmless elemental pet'],
      spellcasting_focus: 'Decide what you carry your spells in: large tomes, tarot cards, etc.'
    }
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

/**
 * Parse armor thresholds from "5/11" format to { major, severe }
 */
export function parseArmorThresholds(thresholdsString) {
  if (!thresholdsString) return { major: 0, severe: 0 };
  const parts = thresholdsString.split('/');
  return {
    major: parseInt(parts[0]) || 0,
    severe: parseInt(parts[1]) || 0
  };
}

// Default character structure matching new data model
// UPDATED: Uses major_threshold/severe_threshold (not minor/major/severe damage)
// UPDATED: Gold uses numbers (odometer style) not boolean arrays
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

    // Damage Thresholds - CORRECTED
    // Only Major and Severe thresholds (Minor is implicit - below Major)
    // These are BASE values from armor, add character level to get total
    major_threshold: 0,
    severe_threshold: 0,

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

    // Gold - CORRECTED: Odometer style (numbers, not boolean arrays)
    // 10 handfuls = 1 bag, 10 bags = 1 chest
    gold_handfuls: 0,
    gold_bags: 0,
    gold_chests: 0,

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

  // Add suggested armor and set damage thresholds
  if (classData.suggested_armor) {
    character.active_armor = { ...classData.suggested_armor };
    // Set armor slots based on armor score
    const armorScore = parseInt(classData.suggested_armor.base_score) || 0;
    character.armor_slots = Array(armorScore).fill(false);
    character.armor = armorScore;

    // Set damage thresholds from armor (CORRECTED - only Major and Severe)
    const thresholds = parseArmorThresholds(classData.suggested_armor.base_thresholds);
    character.major_threshold = thresholds.major;
    character.severe_threshold = thresholds.severe;
  }

  return character;
}
