/**
 * Daggerheart Game Data
 * Contains all classes, subclasses, ancestries, communities, weapons, armor, and domain cards
 */

export const CLASSES = {
  bard: {
    name: 'Bard',
    domains: ['codex', 'grace'],
    startingEvasion: 10,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Masters of performance and persuasion who weave magic through words, music, and art.',
    hopeFeature: 'When you spend Hope, you may grant an ally within Close range +1 to their next roll.',
    stressSlots: 6,
    subclasses: {
      wordsmith: {
        name: 'Wordsmith',
        spellcastTrait: 'instinct',
        foundation: {
          name: 'Power of the Pen',
          description: 'You carry a magical tome that records your adventures. Once per rest, you can read from it to give an ally Hope.'
        }
      },
      troubadour: {
        name: 'Troubadour',
        spellcastTrait: 'presence',
        foundation: {
          name: 'Inspiring Performance',
          description: 'Your performances can bolster allies. When you perform, allies who can hear you gain +1 to their next roll.'
        }
      }
    }
  },
  druid: {
    name: 'Druid',
    domains: ['arcana', 'sage'],
    startingEvasion: 8,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Guardians of the natural world who channel primal magic and can transform into beasts.',
    hopeFeature: 'When you spend Hope, you may commune with nature to learn one fact about your surroundings.',
    stressSlots: 6,
    subclasses: {
      wardenOfRenewal: {
        name: 'Warden of Renewal',
        spellcastTrait: 'instinct',
        foundation: {
          name: 'Gift of the Wild',
          description: 'You can touch a creature to heal them for 1d6 HP. This can be used once per rest.'
        }
      },
      wardenOfTheElements: {
        name: 'Warden of the Elements',
        spellcastTrait: 'presence',
        foundation: {
          name: 'Elemental Affinity',
          description: 'Choose an element (fire, water, earth, air). Your spells of that element deal +2 damage.'
        }
      }
    }
  },
  guardian: {
    name: 'Guardian',
    domains: ['blade', 'valor'],
    startingEvasion: 7,
    hpFormula: { base: 6, perLevel: 3 },
    description: 'Stalwart defenders who protect their allies and hold the line against any threat.',
    hopeFeature: 'When you spend Hope, you may reduce damage to an adjacent ally by your Armor Score.',
    stressSlots: 6,
    subclasses: {
      stalwart: {
        name: 'Stalwart',
        spellcastTrait: 'strength',
        foundation: {
          name: 'Immovable',
          description: 'When you take a defensive stance, you cannot be moved against your will and gain +1 Armor Score until your next turn.'
        }
      },
      vengeance: {
        name: 'Vengeance',
        spellcastTrait: 'strength',
        foundation: {
          name: 'Retribution',
          description: 'When an enemy damages an ally within Very Close range, you may immediately make a melee attack against that enemy.'
        }
      }
    }
  },
  ranger: {
    name: 'Ranger',
    domains: ['bone', 'sage'],
    startingEvasion: 10,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Skilled hunters and trackers who thrive in the wilderness and strike from afar.',
    hopeFeature: 'When you spend Hope, you may mark a target. You have advantage on attacks against marked targets.',
    stressSlots: 6,
    subclasses: {
      beastbound: {
        name: 'Beastbound',
        spellcastTrait: 'instinct',
        requiresCompanion: true,
        foundation: {
          name: 'Animal Companion',
          description: 'You have a loyal animal companion that fights alongside you. Your companion has its own stat block and acts on your turn.'
        }
      },
      wayfinder: {
        name: 'Wayfinder',
        spellcastTrait: 'knowledge',
        foundation: {
          name: 'Trailblazer',
          description: 'You cannot get lost and always know which direction is north. You and your allies travel 25% faster in wilderness.'
        }
      }
    }
  },
  rogue: {
    name: 'Rogue',
    domains: ['grace', 'midnight'],
    startingEvasion: 12,
    hpFormula: { base: 6, perLevel: 1 },
    description: 'Cunning operatives who strike from the shadows and use guile to overcome obstacles.',
    hopeFeature: 'When you spend Hope, you may become Hidden until the end of your next turn or until you attack.',
    stressSlots: 6,
    subclasses: {
      syndicate: {
        name: 'Syndicate',
        spellcastTrait: 'finesse',
        foundation: {
          name: 'Underworld Contacts',
          description: 'In any settlement, you can find a contact who owes you a favor. They can provide information, shelter, or simple equipment.'
        }
      },
      nightwalker: {
        name: 'Nightwalker',
        spellcastTrait: 'instinct',
        foundation: {
          name: 'Shadow Step',
          description: 'Once per rest, you can teleport to any shadow you can see within Close range.'
        }
      }
    }
  },
  seraph: {
    name: 'Seraph',
    domains: ['splendor', 'valor'],
    startingEvasion: 9,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Divine warriors touched by celestial power who smite evil and inspire the righteous.',
    hopeFeature: 'When you spend Hope, your next attack deals +1d6 radiant damage.',
    stressSlots: 6,
    subclasses: {
      wingedSentinel: {
        name: 'Winged Sentinel',
        spellcastTrait: 'presence',
        foundation: {
          name: 'Celestial Wings',
          description: 'You can manifest spectral wings, gaining flight for up to 1 minute. This can be used once per rest.'
        }
      },
      boundByFaith: {
        name: 'Bound by Faith',
        spellcastTrait: 'knowledge',
        foundation: {
          name: 'Divine Oath',
          description: 'Choose an oath (protection, justice, mercy). When acting in accordance with your oath, gain +1 to all rolls.'
        }
      }
    }
  },
  sorcerer: {
    name: 'Sorcerer',
    domains: ['arcana', 'midnight'],
    startingEvasion: 9,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Innate spellcasters whose magic flows from within, shaped by heritage or cosmic forces.',
    hopeFeature: 'When you spend Hope, you may add +2 to the damage of your next spell.',
    stressSlots: 6,
    subclasses: {
      primalOrigin: {
        name: 'Primal Origin',
        spellcastTrait: 'presence',
        foundation: {
          name: 'Wild Magic',
          description: 'When you roll a critical success on a spell attack, you may trigger a random magical effect from the Wild Magic table.'
        }
      },
      elementalOrigin: {
        name: 'Elemental Origin',
        spellcastTrait: 'instinct',
        foundation: {
          name: 'Elemental Blood',
          description: 'Choose an element. You have resistance to that element and your spells of that element ignore resistance.'
        }
      }
    }
  },
  warrior: {
    name: 'Warrior',
    domains: ['blade', 'bone'],
    startingEvasion: 8,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Master combatants who excel at physical warfare and can adapt to any battle situation.',
    hopeFeature: 'When you spend Hope, you may make an additional attack this turn.',
    stressSlots: 6,
    subclasses: {
      callOfTheBrave: {
        name: 'Call of the Brave',
        spellcastTrait: 'strength',
        foundation: {
          name: 'Battle Cry',
          description: 'Once per encounter, you can shout a battle cry. All allies who hear it gain +2 to their next attack roll.'
        }
      },
      callOfTheSlayer: {
        name: 'Call of the Slayer',
        spellcastTrait: 'finesse',
        foundation: {
          name: 'Exploit Weakness',
          description: 'When you hit an enemy, you learn one of their vulnerabilities or weaknesses if they have any.'
        }
      }
    }
  },
  wizard: {
    name: 'Wizard',
    domains: ['codex', 'splendor'],
    startingEvasion: 8,
    hpFormula: { base: 6, perLevel: 2 },
    description: 'Scholarly mages who study the arcane arts and wield carefully prepared spells.',
    hopeFeature: 'When you spend Hope, you may recall a spell you have already used today.',
    stressSlots: 6,
    subclasses: {
      schoolOfKnowledge: {
        name: 'School of Knowledge',
        spellcastTrait: 'knowledge',
        foundation: {
          name: 'Arcane Library',
          description: 'You have access to a magical library. Once per day, you can research a topic and learn one useful fact.'
        }
      },
      schoolOfWar: {
        name: 'School of War',
        spellcastTrait: 'instinct',
        foundation: {
          name: 'Combat Casting',
          description: 'You can cast spells while wearing light armor. Your spell attacks deal +1 damage.'
        }
      }
    }
  }
};

export const ANCESTRIES = {
  clank: {
    name: 'Clank',
    description: 'Mechanical beings of gears and magic, created for purposes long forgotten.',
    features: [
      { name: 'Constructed', description: 'You don\'t need to eat, drink, or breathe. You can\'t be poisoned.' },
      { name: 'Built for Purpose', description: 'Choose one skill. You have advantage on rolls using that skill.' }
    ]
  },
  drakona: {
    name: 'Drakona',
    description: 'Dragon-blooded humanoids with scales, horns, and an affinity for elemental power.',
    features: [
      { name: 'Dragon Breath', description: 'Once per rest, breathe elemental energy in a cone. Creatures must succeed a dodge roll or take 2d6 damage.' },
      { name: 'Scaled Hide', description: '+1 to Armor Score.' }
    ]
  },
  dwarf: {
    name: 'Dwarf',
    description: 'Stout, hardy folk known for their craftsmanship and stubbornness.',
    features: [
      { name: 'Sturdy', description: 'You have advantage on rolls to resist being knocked prone or moved.' },
      { name: 'Stonecunning', description: 'You can sense structural weaknesses and hidden passages in stonework.' }
    ]
  },
  elf: {
    name: 'Elf',
    description: 'Long-lived beings with keen senses and a deep connection to magic.',
    features: [
      { name: 'Keen Senses', description: 'You have advantage on rolls to perceive hidden things.' },
      { name: 'Trance', description: 'You only need 4 hours of rest instead of 8, and remain aware during rest.' }
    ]
  },
  faerie: {
    name: 'Faerie',
    description: 'Tiny winged folk from the realm of dreams, full of mischief and wonder.',
    features: [
      { name: 'Flight', description: 'You have wings and can fly at your normal movement speed.' },
      { name: 'Faerie Dust', description: 'Once per rest, sprinkle dust on a creature to give them +1 to their next roll.' }
    ]
  },
  faun: {
    name: 'Faun',
    description: 'Goat-legged folk of forest and field, known for revelry and nature magic.',
    features: [
      { name: 'Sure-Footed', description: 'You ignore difficult terrain and have advantage on climbing rolls.' },
      { name: 'Forest Friend', description: 'Animals are naturally friendly to you and won\'t attack unless provoked.' }
    ]
  },
  firbolg: {
    name: 'Firbolg',
    description: 'Gentle giants who live in harmony with nature and can communicate with plants.',
    features: [
      { name: 'Speech of Beast and Leaf', description: 'You can communicate simple ideas with animals and plants.' },
      { name: 'Hidden Step', description: 'Once per rest, you can turn invisible until your next turn or until you attack.' }
    ]
  },
  fungril: {
    name: 'Fungril',
    description: 'Mushroom folk who emerged from the depths, spreading spores and wisdom.',
    features: [
      { name: 'Spore Cloud', description: 'Once per rest, release spores that obscure vision in Close range for 1 minute.' },
      { name: 'Decomposer', description: 'You can eat almost anything organic and gain sustenance from it.' }
    ]
  },
  galapa: {
    name: 'Galapa',
    description: 'Turtle-like folk with shells on their backs, slow but incredibly resilient.',
    features: [
      { name: 'Shell Defense', description: 'As a reaction, retreat into your shell for +3 Armor Score until your next turn. You can\'t move.' },
      { name: 'Hold Breath', description: 'You can hold your breath for up to 1 hour.' }
    ]
  },
  giant: {
    name: 'Giant',
    description: 'Towering humanoids of great strength, descended from the titans of old.',
    features: [
      { name: 'Powerful Build', description: 'You count as one size larger for carrying capacity and grappling.' },
      { name: 'Thunderous Strike', description: 'Once per rest, your melee attack deals +1d6 damage and pushes the target back.' }
    ]
  },
  goblin: {
    name: 'Goblin',
    description: 'Small, crafty folk known for their ingenuity and survival instincts.',
    features: [
      { name: 'Nimble Escape', description: 'You can move through spaces occupied by larger creatures.' },
      { name: 'Scrappy', description: 'Once per rest, when you would be reduced to 0 HP, remain at 1 HP instead.' }
    ]
  },
  halfling: {
    name: 'Halfling',
    description: 'Small folk with big hearts, known for their luck and hospitality.',
    features: [
      { name: 'Lucky', description: 'Once per session, reroll any die and take either result.' },
      { name: 'Brave', description: 'You have advantage on rolls to resist fear effects.' }
    ]
  },
  human: {
    name: 'Human',
    description: 'Adaptable and ambitious, humans thrive in any environment.',
    features: [
      { name: 'Versatile', description: 'Gain proficiency in one additional skill of your choice.' },
      { name: 'Determined', description: 'Once per rest, you may add +2 to any roll after seeing the result.' }
    ]
  },
  infernis: {
    name: 'Infernis',
    description: 'Beings with infernal heritage, marked by horns, tails, or unusual skin tones.',
    features: [
      { name: 'Hellish Resistance', description: 'You have resistance to fire damage.' },
      { name: 'Infernal Legacy', description: 'You can cast a minor fire spell at will, dealing 1d4 fire damage.' }
    ]
  },
  katari: {
    name: 'Katari',
    description: 'Feline humanoids with keen reflexes and predatory instincts.',
    features: [
      { name: 'Cat\'s Grace', description: 'You always land on your feet and take half damage from falls.' },
      { name: 'Darkvision', description: 'You can see in darkness up to Far range as if it were dim light.' }
    ]
  },
  orc: {
    name: 'Orc',
    description: 'Powerful warriors with a proud culture and fierce determination.',
    features: [
      { name: 'Fearless', description: 'You are immune to fear effects.' },
      { name: 'Dread Visage', description: 'Once per rest, intimidate a creature. They have disadvantage on their next roll against you.' }
    ]
  },
  ribbet: {
    name: 'Ribbet',
    description: 'Frog-like folk who dwell near water and have incredible jumping ability.',
    features: [
      { name: 'Standing Leap', description: 'Your jump distance is tripled.' },
      { name: 'Amphibious', description: 'You can breathe underwater and have advantage on swimming rolls.' }
    ]
  },
  simiah: {
    name: 'Simiah',
    description: 'Ape-like folk with prehensile tails and natural climbing ability.',
    features: [
      { name: 'Prehensile Tail', description: 'Your tail can hold and manipulate objects, giving you a free hand.' },
      { name: 'Natural Climber', description: 'You have a climbing speed equal to your movement speed.' }
    ]
  }
};

export const COMMUNITIES = {
  highborne: {
    name: 'Highborne',
    feature: {
      name: 'Privilege',
      description: 'You have advantage on rolls involving negotiations with nobles, merchants, or when discussing prices and status.'
    },
    adjectives: ['Refined', 'Educated', 'Entitled', 'Diplomatic', 'Cultured', 'Ambitious']
  },
  loreborne: {
    name: 'Loreborne',
    feature: {
      name: 'Well-Read',
      description: 'You have advantage on rolls involving history, culture, politics, or ancient knowledge.'
    },
    adjectives: ['Scholarly', 'Curious', 'Methodical', 'Analytical', 'Bookish', 'Inquisitive']
  },
  orderborne: {
    name: 'Orderborne',
    feature: {
      name: 'Tactical',
      description: 'When you or an ally executes a plan you helped create, gain 1 Hope.'
    },
    adjectives: ['Disciplined', 'Loyal', 'Organized', 'Dutiful', 'Honorable', 'Precise']
  },
  ridgeborne: {
    name: 'Ridgeborne',
    feature: {
      name: 'Steady',
      description: 'You have advantage on rolls involving endurance, resisting fear, or weathering harsh conditions.'
    },
    adjectives: ['Stoic', 'Resilient', 'Patient', 'Hardy', 'Traditional', 'Grounded']
  },
  seaborne: {
    name: 'Seaborne',
    feature: {
      name: 'Waterwise',
      description: 'You have advantage on rolls involving navigation, swimming, or predicting weather.'
    },
    adjectives: ['Adventurous', 'Adaptable', 'Free-spirited', 'Superstitious', 'Bold', 'Resourceful']
  },
  slyborne: {
    name: 'Slyborne',
    feature: {
      name: 'Scoundrel',
      description: 'You have advantage on rolls involving deception, underworld dealings, or finding black market goods.'
    },
    adjectives: ['Cunning', 'Streetwise', 'Opportunistic', 'Charming', 'Secretive', 'Pragmatic']
  },
  underborne: {
    name: 'Underborne',
    feature: {
      name: 'Low-Light Living',
      description: 'You can see in complete darkness up to Close range and have advantage on rolls while underground.'
    },
    adjectives: ['Cautious', 'Observant', 'Quiet', 'Self-reliant', 'Mysterious', 'Enduring']
  },
  wanderborne: {
    name: 'Wanderborne',
    feature: {
      name: 'Nomad',
      description: 'You have advantage on rolls involving survival, foraging, or navigating unfamiliar terrain.'
    },
    adjectives: ['Independent', 'Adaptable', 'Curious', 'Practical', 'Open-minded', 'Restless']
  },
  wildborne: {
    name: 'Wildborne',
    feature: {
      name: 'Animal Whisperer',
      description: 'You have advantage on rolls involving animal handling, tracking, or understanding animal behavior.'
    },
    adjectives: ['Natural', 'Instinctive', 'Empathetic', 'Primal', 'Protective', 'Untamed']
  }
};

export const TRAITS = ['agility', 'strength', 'finesse', 'instinct', 'presence', 'knowledge'];

export const TRAIT_VALUES = [2, 1, 1, 0, 0, -1];

export const PRIMARY_WEAPONS = {
  physical: [
    { name: 'Broadsword', trait: 'agility', range: 'melee', damage: 'd8', damageType: 'physical', burden: 'one-handed', feature: 'Reliable: +1 to attack rolls' },
    { name: 'Longsword', trait: 'agility', range: 'melee', damage: 'd6+3', damageType: 'physical', burden: 'two-handed', feature: null },
    { name: 'Battleaxe', trait: 'strength', range: 'melee', damage: 'd6+3', damageType: 'physical', burden: 'two-handed', feature: null },
    { name: 'Greatsword', trait: 'strength', range: 'melee', damage: 'd6+4', damageType: 'physical', burden: 'two-handed', feature: 'Massive: −1 to Evasion; on success roll extra die, drop lowest' },
    { name: 'Mace', trait: 'strength', range: 'melee', damage: 'd8+1', damageType: 'physical', burden: 'one-handed', feature: null },
    { name: 'Warhammer', trait: 'strength', range: 'melee', damage: 'd8+2', damageType: 'physical', burden: 'two-handed', feature: 'Heavy: −1 to Evasion' },
    { name: 'Dagger', trait: 'finesse', range: 'melee', damage: 'd6+2', damageType: 'physical', burden: 'one-handed', feature: null },
    { name: 'Quarterstaff', trait: 'instinct', range: 'melee', damage: 'd6+2', damageType: 'physical', burden: 'two-handed', feature: null },
    { name: 'Cutlass', trait: 'presence', range: 'melee', damage: 'd6+3', damageType: 'physical', burden: 'one-handed', feature: null },
    { name: 'Rapier', trait: 'presence', range: 'melee', damage: 'd8', damageType: 'physical', burden: 'one-handed', feature: 'Quick: Mark Stress to target another creature' },
    { name: 'Halberd', trait: 'strength', range: 'very close', damage: 'd6+4', damageType: 'physical', burden: 'two-handed', feature: 'Cumbersome: −1 to Finesse' },
    { name: 'Spear', trait: 'finesse', range: 'very close', damage: 'd6+2', damageType: 'physical', burden: 'two-handed', feature: null },
    { name: 'Shortbow', trait: 'agility', range: 'far', damage: 'd6+2', damageType: 'physical', burden: 'two-handed', feature: null },
    { name: 'Crossbow', trait: 'finesse', range: 'far', damage: 'd6+2', damageType: 'physical', burden: 'one-handed', feature: null },
    { name: 'Longbow', trait: 'agility', range: 'very far', damage: 'd6+3', damageType: 'physical', burden: 'two-handed', feature: 'Cumbersome: −1 to Finesse' }
  ],
  magical: [
    { name: 'Arcane Gauntlets', trait: 'strength', range: 'melee', damage: 'd6+2', damageType: 'magical', burden: 'two-handed', feature: null },
    { name: 'Hallowed Axe', trait: 'strength', range: 'melee', damage: 'd8+1', damageType: 'magical', burden: 'one-handed', feature: null },
    { name: 'Glowing Rings', trait: 'agility', range: 'very close', damage: 'd6+2', damageType: 'magical', burden: 'two-handed', feature: null },
    { name: 'Hand Runes', trait: 'instinct', range: 'very close', damage: 'd8', damageType: 'magical', burden: 'one-handed', feature: null },
    { name: 'Returning Blade', trait: 'finesse', range: 'close', damage: 'd8', damageType: 'magical', burden: 'one-handed', feature: 'Returning: Appears in hand after throw' },
    { name: 'Shortstaff', trait: 'instinct', range: 'close', damage: 'd6+2', damageType: 'magical', burden: 'one-handed', feature: null },
    { name: 'Dualstaff', trait: 'instinct', range: 'far', damage: 'd6+2', damageType: 'magical', burden: 'two-handed', feature: null },
    { name: 'Scepter', trait: 'presence', range: 'far', damage: 'd8', damageType: 'magical', burden: 'two-handed', feature: 'Versatile: Also Presence Melee d6' },
    { name: 'Wand', trait: 'knowledge', range: 'far', damage: 'd6+2', damageType: 'magical', burden: 'one-handed', feature: null },
    { name: 'Greatstaff', trait: 'knowledge', range: 'very far', damage: 'd8', damageType: 'magical', burden: 'two-handed', feature: 'Powerful: Roll extra die, drop lowest' }
  ]
};

export const SECONDARY_WEAPONS = [
  { name: 'Shortsword', trait: 'agility', range: 'melee', damage: 'd6', damageType: 'physical', burden: 'one-handed', feature: 'Paired: +1 to primary weapon damage in Melee' },
  { name: 'Round Shield', trait: 'strength', range: 'melee', damage: 'd4', damageType: 'physical', burden: 'one-handed', feature: 'Protective: +1 to Armor Score' },
  { name: 'Tower Shield', trait: 'strength', range: 'melee', damage: 'd4', damageType: 'physical', burden: 'one-handed', feature: 'Barrier: +2 to Armor Score; −1 to Evasion' },
  { name: 'Small Dagger', trait: 'finesse', range: 'melee', damage: 'd4', damageType: 'physical', burden: 'one-handed', feature: 'Paired: +1 to primary weapon damage in Melee' },
  { name: 'Whip', trait: 'presence', range: 'very close', damage: 'd4', damageType: 'physical', burden: 'one-handed', feature: 'Startling: Mark Stress to push enemies back' },
  { name: 'Grappler', trait: 'finesse', range: 'close', damage: 'd4', damageType: 'physical', burden: 'one-handed', feature: 'Hooked: Pull target into Melee on success' },
  { name: 'Hand Crossbow', trait: 'finesse', range: 'far', damage: 'd4+2', damageType: 'physical', burden: 'one-handed', feature: null }
];

export const ARMOR = [
  { name: 'Gambeson', baseThresholds: { major: 3, severe: 6 }, baseScore: 3, feature: 'Flexible: +1 to Evasion' },
  { name: 'Leather', baseThresholds: { major: 4, severe: 8 }, baseScore: 4, feature: null },
  { name: 'Chainmail', baseThresholds: { major: 5, severe: 10 }, baseScore: 5, feature: 'Heavy: −1 to Evasion' },
  { name: 'Full Plate', baseThresholds: { major: 6, severe: 12 }, baseScore: 6, feature: 'Very Heavy: −1 to Evasion; −1 to Agility' },
  { name: 'None (Unarmored)', baseThresholds: { major: 0, severe: 0 }, baseScore: 0, feature: null }
];

export const DOMAIN_CARDS = {
  arcana: {
    name: 'Arcana',
    description: 'The domain of raw magical power and arcane secrets.',
    cards: [
      { id: 'arcana-1', name: 'Arcane Bolt', level: 1, type: 'action', cost: null, description: 'Make a Spellcast attack against a target within Far range. On success, deal 1d8 magic damage.' },
      { id: 'arcana-2', name: 'Shield of Force', level: 1, type: 'reaction', cost: '1 Stress', description: 'When you or an ally within Close range would take damage, reduce that damage by 1d6.' },
      { id: 'arcana-3', name: 'Detect Magic', level: 1, type: 'action', cost: null, description: 'You sense the presence and general direction of magical auras within Close range for the next 10 minutes.' },
      { id: 'arcana-4', name: 'Mage Armor', level: 1, type: 'passive', cost: null, description: 'While unarmored, your Armor Score is equal to your Spellcast trait modifier (minimum 1).' },
      { id: 'arcana-5', name: 'Dispel', level: 1, type: 'action', cost: '1 Hope', description: 'End one magical effect within Close range. If the effect is from a creature, make an opposed Spellcast roll.' },
      { id: 'arcana-6', name: 'Arcane Recovery', level: 1, type: 'passive', cost: null, description: 'Once per rest, when you roll a critical success on a spell attack, clear 1 Stress.' }
    ]
  },
  blade: {
    name: 'Blade',
    description: 'The domain of martial prowess and weapon mastery.',
    cards: [
      { id: 'blade-1', name: 'Parry', level: 1, type: 'reaction', cost: '1 Stress', description: 'When an enemy hits you with a melee attack, reduce the damage by your weapon\'s damage die.' },
      { id: 'blade-2', name: 'Riposte', level: 1, type: 'reaction', cost: null, description: 'When an enemy misses you with a melee attack, make an immediate melee attack against them.' },
      { id: 'blade-3', name: 'Cleave', level: 1, type: 'action', cost: '1 Hope', description: 'Make a melee attack against up to 2 enemies within reach. Roll once and apply to both.' },
      { id: 'blade-4', name: 'Defensive Stance', level: 1, type: 'action', cost: null, description: 'Until your next turn, you have +2 to Evasion but cannot move or make attacks.' },
      { id: 'blade-5', name: 'Weapon Master', level: 1, type: 'passive', cost: null, description: 'Choose one weapon type. You deal +1 damage with weapons of that type.' },
      { id: 'blade-6', name: 'Disarm', level: 1, type: 'action', cost: null, description: 'Make a melee attack. On success, the target drops one held item instead of taking damage.' }
    ]
  },
  bone: {
    name: 'Bone',
    description: 'The domain of hunting, tracking, and primal survival.',
    cards: [
      { id: 'bone-1', name: 'Hunter\'s Mark', level: 1, type: 'action', cost: null, description: 'Mark a target you can see. You deal +1d4 damage to the marked target. Lasts until you rest or mark a new target.' },
      { id: 'bone-2', name: 'Snare', level: 1, type: 'action', cost: null, description: 'Set a trap in an unoccupied space within Close range. The first creature to enter that space is restrained.' },
      { id: 'bone-3', name: 'Predator\'s Eye', level: 1, type: 'passive', cost: null, description: 'You can see in dim light as if it were bright light. You have advantage on tracking rolls.' },
      { id: 'bone-4', name: 'Crippling Shot', level: 1, type: 'action', cost: '1 Hope', description: 'Make a ranged attack. On success, the target\'s movement speed is halved until the end of their next turn.' },
      { id: 'bone-5', name: 'Primal Strike', level: 1, type: 'action', cost: '1 Stress', description: 'Make a weapon attack with advantage. On success, deal an extra 1d6 damage.' },
      { id: 'bone-6', name: 'Wild Instincts', level: 1, type: 'reaction', cost: null, description: 'When surprised, you can act normally during the first round of combat.' }
    ]
  },
  codex: {
    name: 'Codex',
    description: 'The domain of knowledge, lore, and written magic.',
    cards: [
      { id: 'codex-1', name: 'Comprehend Languages', level: 1, type: 'action', cost: null, description: 'For the next hour, you can understand any spoken or written language.' },
      { id: 'codex-2', name: 'Identify', level: 1, type: 'action', cost: null, description: 'Learn the properties of one magic item you touch, including how to use it.' },
      { id: 'codex-3', name: 'Message', level: 1, type: 'action', cost: null, description: 'Send a short telepathic message to a creature you can see within Far range. They can reply once.' },
      { id: 'codex-4', name: 'Sage Advice', level: 1, type: 'passive', cost: null, description: 'Once per scene, you may ask the GM one yes/no question about lore or history.' },
      { id: 'codex-5', name: 'Scroll of Protection', level: 1, type: 'reaction', cost: '1 Hope', description: 'When you or an ally would take magic damage, reduce it by 2d6.' },
      { id: 'codex-6', name: 'Words of Power', level: 1, type: 'action', cost: '1 Stress', description: 'Speak a word of command. One creature within Close range must make a presence roll or be stunned until their next turn.' }
    ]
  },
  grace: {
    name: 'Grace',
    description: 'The domain of agility, performance, and social manipulation.',
    cards: [
      { id: 'grace-1', name: 'Tumble', level: 1, type: 'action', cost: null, description: 'Move up to your speed without provoking opportunity attacks.' },
      { id: 'grace-2', name: 'Distraction', level: 1, type: 'action', cost: null, description: 'One creature you can see has disadvantage on their next attack roll.' },
      { id: 'grace-3', name: 'Inspiring Words', level: 1, type: 'action', cost: '1 Hope', description: 'An ally who can hear you gains 1d6 temporary HP and +1 to their next roll.' },
      { id: 'grace-4', name: 'Acrobatic Dodge', level: 1, type: 'reaction', cost: '1 Stress', description: 'When hit by an attack, halve the damage taken.' },
      { id: 'grace-5', name: 'Charm', level: 1, type: 'action', cost: null, description: 'Make a presence roll against one creature. On success, they regard you as friendly for 1 minute.' },
      { id: 'grace-6', name: 'Fleet Feet', level: 1, type: 'passive', cost: null, description: 'Your movement speed increases by 10 feet.' }
    ]
  },
  midnight: {
    name: 'Midnight',
    description: 'The domain of shadows, secrets, and forbidden knowledge.',
    cards: [
      { id: 'midnight-1', name: 'Shadow Step', level: 1, type: 'action', cost: '1 Stress', description: 'Teleport to a shadow you can see within Close range.' },
      { id: 'midnight-2', name: 'Cloak of Darkness', level: 1, type: 'action', cost: null, description: 'You are shrouded in darkness for 1 minute. You have advantage on stealth rolls and enemies have disadvantage attacking you in bright light.' },
      { id: 'midnight-3', name: 'Sneak Attack', level: 1, type: 'passive', cost: null, description: 'When you attack with advantage, deal an extra 1d6 damage.' },
      { id: 'midnight-4', name: 'Whisper of Doom', level: 1, type: 'action', cost: '1 Hope', description: 'Whisper to a creature within Close range. They take 1d8 psychic damage and are frightened until the end of their next turn.' },
      { id: 'midnight-5', name: 'Lockpick', level: 1, type: 'passive', cost: null, description: 'You have advantage on rolls to pick locks or disable traps.' },
      { id: 'midnight-6', name: 'Vanish', level: 1, type: 'reaction', cost: '1 Stress', description: 'When you take damage, become invisible until the end of your next turn.' }
    ]
  },
  sage: {
    name: 'Sage',
    description: 'The domain of nature, healing, and ancient wisdom.',
    cards: [
      { id: 'sage-1', name: 'Healing Touch', level: 1, type: 'action', cost: '1 Hope', description: 'Touch a creature to heal them for 2d6 HP.' },
      { id: 'sage-2', name: 'Nature\'s Grasp', level: 1, type: 'action', cost: null, description: 'Vines erupt in a Close area. Creatures in the area must make an agility roll or be restrained.' },
      { id: 'sage-3', name: 'Animal Messenger', level: 1, type: 'action', cost: null, description: 'Summon a small animal to deliver a message to a creature you describe within 10 miles.' },
      { id: 'sage-4', name: 'Barkskin', level: 1, type: 'action', cost: '1 Stress', description: 'Touch a creature. Their Armor Score becomes 4 for 1 hour if it was lower.' },
      { id: 'sage-5', name: 'Purify', level: 1, type: 'action', cost: null, description: 'Remove poison or disease from one creature you touch.' },
      { id: 'sage-6', name: 'Wild Shape', level: 1, type: 'action', cost: '1 Hope', description: 'Transform into a small animal (cat, bird, etc.) for up to 1 hour. You can\'t attack in this form.' }
    ]
  },
  splendor: {
    name: 'Splendor',
    description: 'The domain of light, radiance, and divine power.',
    cards: [
      { id: 'splendor-1', name: 'Divine Light', level: 1, type: 'action', cost: null, description: 'A creature you can see must make an instinct roll or be blinded until the end of their next turn.' },
      { id: 'splendor-2', name: 'Bless', level: 1, type: 'action', cost: '1 Hope', description: 'Up to 3 creatures you can see gain +1 to all rolls for 1 minute.' },
      { id: 'splendor-3', name: 'Radiant Strike', level: 1, type: 'action', cost: '1 Stress', description: 'Make a weapon attack that deals radiant damage instead of its normal type. On success, deal an extra 1d6 radiant damage.' },
      { id: 'splendor-4', name: 'Sanctuary', level: 1, type: 'action', cost: '1 Hope', description: 'Touch a creature. For 1 minute, any creature that attacks them must first make a presence roll.' },
      { id: 'splendor-5', name: 'Guiding Light', level: 1, type: 'passive', cost: null, description: 'You emit bright light in Close range and dim light for another Close range. You can suppress or activate this at will.' },
      { id: 'splendor-6', name: 'Turn Undead', level: 1, type: 'action', cost: '1 Hope', description: 'All undead within Close range must make a presence roll or flee from you for 1 minute.' }
    ]
  },
  valor: {
    name: 'Valor',
    description: 'The domain of courage, protection, and martial leadership.',
    cards: [
      { id: 'valor-1', name: 'Shield Wall', level: 1, type: 'action', cost: null, description: 'Until your next turn, allies adjacent to you gain +2 to Armor Score.' },
      { id: 'valor-2', name: 'Rallying Cry', level: 1, type: 'action', cost: '1 Hope', description: 'All allies who can hear you clear 1 Stress.' },
      { id: 'valor-3', name: 'Intercept', level: 1, type: 'reaction', cost: '1 Stress', description: 'When an ally within Very Close range is hit by an attack, take the damage instead.' },
      { id: 'valor-4', name: 'Challenge', level: 1, type: 'action', cost: null, description: 'One creature you can see must attack you on their next turn if able. They have disadvantage on attacks against others.' },
      { id: 'valor-5', name: 'Bolstering Presence', level: 1, type: 'passive', cost: null, description: 'Allies within Close range have +1 to rolls against fear.' },
      { id: 'valor-6', name: 'Heroic Strike', level: 1, type: 'action', cost: '1 Hope', description: 'Make a melee attack with advantage. On success, deal an extra 2d6 damage.' }
    ]
  }
};

// Helper function to get a class's spellcast trait based on subclass
export function getSpellcastTrait(classId, subclassId) {
  const classData = CLASSES[classId];
  if (!classData || !classData.subclasses[subclassId]) return null;
  return classData.subclasses[subclassId].spellcastTrait;
}

// Helper function to calculate HP at a given level
export function calculateHP(classId, level) {
  const classData = CLASSES[classId];
  if (!classData) return 0;
  return classData.hpFormula.base + (classData.hpFormula.perLevel * level);
}

// Helper function to get domain cards for a class
export function getDomainsForClass(classId) {
  const classData = CLASSES[classId];
  if (!classData) return [];
  return classData.domains.map(domainId => ({
    id: domainId,
    ...DOMAIN_CARDS[domainId]
  }));
}

// Helper function to calculate damage thresholds
export function calculateDamageThresholds(armor, level) {
  if (!armor) return { major: level, severe: level * 2 };
  return {
    major: armor.baseThresholds.major + level,
    severe: armor.baseThresholds.severe + level
  };
}

// Helper function to calculate evasion with modifiers
export function calculateEvasion(classId, armor, secondaryWeapon) {
  const classData = CLASSES[classId];
  if (!classData) return 10;

  let evasion = classData.startingEvasion;

  // Apply armor modifiers
  if (armor) {
    if (armor.feature?.includes('+1 to Evasion')) evasion += 1;
    if (armor.feature?.includes('−1 to Evasion')) evasion -= 1;
  }

  // Apply secondary weapon modifiers
  if (secondaryWeapon?.feature?.includes('−1 to Evasion')) {
    evasion -= 1;
  }

  return evasion;
}

// Helper function to calculate armor score with modifiers
export function calculateArmorScore(armor, secondaryWeapon) {
  if (!armor) return 0;

  let score = armor.baseScore;

  // Apply secondary weapon modifiers
  if (secondaryWeapon) {
    if (secondaryWeapon.feature?.includes('+1 to Armor Score')) score += 1;
    if (secondaryWeapon.feature?.includes('+2 to Armor Score')) score += 2;
  }

  return score;
}
