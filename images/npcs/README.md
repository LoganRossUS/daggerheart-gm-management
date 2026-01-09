# Default NPC Images

This directory contains default images for NPC/creature types. When an adversary doesn't have a custom portrait uploaded, the GM Control Panel will use a default image from this directory (if configured) or fall back to a shadowy silhouette placeholder.

## How It Works

1. **Automatic Fallback**: If no portrait is uploaded for an adversary, a default shadowy silhouette will be shown.

2. **Theme-Based Defaults**: You can add images to this directory and configure them in `gm-control-panel.html` to automatically use specific images based on creature themes or traits.

## Adding Custom Default Images

1. Add your image files to this directory (e.g., `undead.png`, `beast.png`, `dragon.png`)

2. Open `gm-control-panel.html` and find the `DEFAULT_NPC_IMAGE_MAP` object (around line 1284)

3. Add mappings for your creature types:

```javascript
const DEFAULT_NPC_IMAGE_MAP = {
  'undead': 'undead.png',
  'beast': 'beast.png',
  'beasts': 'beast.png',
  'dragon': 'dragon.png',
  'ooze': 'ooze.png',
  'oozes': 'ooze.png',
  'construct': 'construct.png',
  'constructs': 'construct.png',
  // Add more mappings as needed
};
```

## Matching Priority

The system looks for default images in this order:

1. **`defaultPortrait` field** - If an adversary has a `defaultPortrait` field in the JSON, that filename is used
2. **Themes** - The adversary's themes array is checked against the map
3. **Traits** - The adversary's traits array is checked against the map
4. **Name** - The adversary's name is searched for keywords from the map
5. **Fallback** - If no match is found, the embedded shadowy silhouette is used

## JSON Example

You can also specify a default portrait directly in your encounter JSON:

```json
{
  "name": "Skeleton Warrior",
  "defaultPortrait": "skeleton.png",
  "themes": ["undead"],
  "traits": ["Undead", "Fearless"],
  ...
}
```

## Recommended Image Format

- **Size**: 200x200 pixels or larger (square aspect ratio works best)
- **Format**: PNG, JPG, WebP, or SVG
- **Style**: Dark, dramatic fantasy art works well with the GM Control Panel theme
