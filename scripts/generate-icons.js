// Script para gerar ícones PWA como SVG (serão servidos diretamente)
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateSVG(size) {
    const fontSize = Math.round(size * 0.35);
    const subFontSize = Math.round(size * 0.08);
    const strokeWidth = Math.max(1, Math.round(size * 0.015));

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f0f2a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00f0ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="${Math.max(2, size * 0.01)}" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="url(#bg)"/>
  
  <!-- Border glow -->
  <rect x="${strokeWidth}" y="${strokeWidth}" width="${size - strokeWidth * 2}" height="${size - strokeWidth * 2}" rx="${Math.round(size * 0.14)}" fill="none" stroke="url(#accent)" stroke-width="${strokeWidth}" opacity="0.6"/>
  
  <!-- Corner accents -->
  <circle cx="${Math.round(size * 0.2)}" cy="${Math.round(size * 0.2)}" r="${Math.max(2, Math.round(size * 0.02))}" fill="#00f0ff" opacity="0.8"/>
  <circle cx="${Math.round(size * 0.8)}" cy="${Math.round(size * 0.2)}" r="${Math.max(2, Math.round(size * 0.02))}" fill="#ff00ff" opacity="0.8"/>
  <circle cx="${Math.round(size * 0.2)}" cy="${Math.round(size * 0.8)}" r="${Math.max(2, Math.round(size * 0.02))}" fill="#ff00ff" opacity="0.8"/>
  <circle cx="${Math.round(size * 0.8)}" cy="${Math.round(size * 0.8)}" r="${Math.max(2, Math.round(size * 0.02))}" fill="#00f0ff" opacity="0.8"/>
  
  <!-- Code brackets decoration -->
  <text x="${Math.round(size * 0.15)}" y="${Math.round(size * 0.55)}" font-family="monospace" font-size="${Math.round(fontSize * 0.6)}" fill="#00f0ff" opacity="0.3" filter="url(#glow)">&lt;</text>
  <text x="${Math.round(size * 0.78)}" y="${Math.round(size * 0.55)}" font-family="monospace" font-size="${Math.round(fontSize * 0.6)}" fill="#ff00ff" opacity="0.3" filter="url(#glow)">/&gt;</text>
  
  <!-- Main text EB -->
  <text x="50%" y="${Math.round(size * 0.48)}" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="${fontSize}" fill="url(#accent)" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">EB</text>
  
  <!-- Subtitle -->
  <text x="50%" y="${Math.round(size * 0.7)}" font-family="'Segoe UI', Arial, sans-serif" font-weight="300" font-size="${subFontSize}" fill="#00f0ff" text-anchor="middle" opacity="0.7">DEV</text>
</svg>`;
}

// Generate SVG icons
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

sizes.forEach(size => {
    const svg = generateSVG(size);
    const filename = `icon-${size}x${size}.svg`;
    fs.writeFileSync(path.join(iconsDir, filename), svg);
    console.log(`✓ Generated ${filename}`);
});

// Generate apple-touch-icon (180x180)
const appleSvg = generateSVG(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleSvg);
console.log('✓ Generated apple-touch-icon.svg');

// Generate favicon SVG
const faviconSvg = generateSVG(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSvg);
console.log('✓ Generated favicon.svg');

console.log('\n✅ Todos os ícones SVG foram gerados!');
console.log('📝 Nota: Para ícones PNG, use uma ferramenta como sharp ou canvas para converter.');
