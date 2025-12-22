# ❄️ Snowfall Effect

Lightweight vanilla JavaScript library for creating a realistic falling snow effect on websites.

![License](https://img.shields.io/badge/license-MIT-blue)


## Demo

Open `demo/index.html` in a browser or online demo is available at: https://waveswan.github.io/snowfall-effect/

## Features

- 🎯 Zero dependencies — pure JavaScript
- ⚡ High performance — rendering via Canvas API
- 🎨 Full customization — color, size, speed, wind, and count
- 📱 Responsive — automatically adapts to viewport size
- 🔧 Simple API — easy to integrate and control

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd snowfall-effect
```

To preview the demo locally you can use `http-server` via `npx`:

```bash
npx http-server demo -c-1 -p 8080
# then open http://localhost:8080
```

## Quick start

Use the ES module directly in HTML (see `demo/index.html`):

```html
<script type="module">
  import { createSnowfall } from './src/snowfall.js';

  document.addEventListener('DOMContentLoaded', () => {
    const snowfall = createSnowfall({ snowflakeCount: 200 });
    window.snowfall = snowfall; // optional for debugging
  });
</script>
```

## API

- `createSnowfall(config)` — creates the effect and returns a `SnowfallEffect` instance.
- `SnowfallEffect.play()` — start the animation.
- `SnowfallEffect.pause()` — pause the animation.
- `SnowfallEffect.destroy()` — remove DOM and stop the animation.

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

Example:

```js
createSnowfall({
  snowflakeCount: 200,
  color: '#ffffff',
  radius: [0.5, 2],
  speed: [0.5, 2],
  wind: [-0.5, 1.5],
  changeFrequency: 180
});
```

## License

This project is licensed under the MIT License — see `LICENSE`.