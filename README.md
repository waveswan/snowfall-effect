# ❄️ Snowfall Effect

Lightweight JavaScript particle library for snow, rain, fire, embers, ash and other customizable particle effects on websites. Fast, dependency-free, and configurable for use as decorative snowfall or dynamic particle-based visuals like fire and rain.

![License](https://img.shields.io/badge/license-MIT-blue)
![Size](https://img.shields.io/badge/size-~7KB-orange)

## Demo

Online demo is available at: https://waveswan.github.io/snowfall-effect/

## Installation

Clone the repository.

## Quick start

Open `docs/index.html` in a browser.

```html
<script type="module">
  import { createSnowfall } from './src/snowfall.js';

  document.addEventListener('DOMContentLoaded', () => {
    const snowfall = createSnowfall({ 
        snowflakeCount: 200
    });
    window.snowfall = snowfall; // optional for debugging
  });
</script>
```

## Options (config)

You can pass a configuration object to `createSnowfall(config)` or call `snowfall.updateConfig(config)` to change options at runtime.

- `snowflakeCount` — number of snowflakes (default: `150`)
- `color` — snowflake color (default: `"#dee4fd"`)
- `radius` — size range `[min, max]` (default: `[0.5, 3]`)
- `speed` — fall speed range `[min, max]` (default: `[1, 3]`)
- `wind` — wind force range `[min, max]` (default: `[-0.5, 2]`)
- `changeFrequency` — how often targets change (in frames, default: `200`)
- `rotationSpeed` — rotation speed range `[min, max]` (default: `[-1, 1]`)
- `opacity` — opacity range `[min, max]` (default: `[1, 1]`)
 - `opacity` — opacity range `[min, max]` (default: `[1, 1]`)
 - `zIndex` — CSS `z-index` applied to the wrapper element (default: `99999`). Use this to place the snowfall above or below other elements.
 - `anchorId` — optional `id` of an element after which the snowfall wrapper will be inserted. If not provided, the script inserts after the page `footer` or the last element. Example: `anchorId: 'header'` will insert wrapper after element with `id="header"`.

Example:

```js
createSnowfall({
  snowflakeCount: 250,
  color: '#ffffff',
  radius: [0.5, 1.6],
  speed: [0.5, 2],
  wind: [-0.5, 4],
  changeFrequency: 250
});
```
 
## Beyond Snow — other effects

Although the library defaults to a snowfall look, the renderer is generic: by adjusting the configuration you can create rain, fire/embers, ash, fireflies or other particle effects.

- For rain: increase `speed`, reduce `radius`, and set `wind` to influence horizontal streaks.
- For fire or embers: use warm colors (`#ff4b2b`, `#ff9a3c`), set `direction: 'up'`, increase `speed` slightly and add variability to `radius` and `opacity`.
- For ash/smoke: use gray colors, low `speed`, higher `opacity` variance, and `direction: 'up'` for rising motion.

Experiment by changing `color`, `radius`, `speed`, `wind`, `opacity`, and `direction` (up/down). The demo presets include `Snow`, `Fire`, `Fireflies`, `Matrix`, and `Rain` to get you started.

### SEO notes

- Primary keywords to target: "snowfall", "particle effect", "JavaScript particles", "snow effect", "rain effect", "fire particles", "canvas particles".
- Put the short description above as the first sentence — GitHub and search engines use the top of the README as the page summary.
- Provide a live demo and clear examples (already included) — pages with demos rank better for developer queries.
- Consider adding a screenshot/OG image at the project root for better social sharing.

## API

- `createSnowfall(config)` — creates the effect and returns a `SnowfallEffect` instance.
- `SnowfallEffect.play()` — start the animation.
- `SnowfallEffect.pause()` — pause the animation.
- `SnowfallEffect.destroy()` — remove DOM and stop the animation.


## License

This project is licensed under the MIT License — see `LICENSE`.