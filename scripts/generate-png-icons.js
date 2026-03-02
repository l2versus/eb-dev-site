// ══════════════════════════════════════════════════════════════════════════════
// 🎨 Gerar ícones PWA em PNG a partir de logo-icon.png
// Uso: node scripts/generate-png-icons.js
// ══════════════════════════════════════════════════════════════════════════════

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SOURCE = path.join(__dirname, "..", "public", "icons", "logo-icon.png");
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generate() {
    if (!fs.existsSync(SOURCE)) {
        console.error("❌ Arquivo não encontrado:", SOURCE);
        console.error("   Salve a imagem do logo como public/icons/logo-icon.png");
        process.exit(1);
    }

    console.log("🎨 Gerando ícones PNG a partir de logo-icon.png...\n");

    for (const size of sizes) {
        const filename = `icon-${size}x${size}.png`;
        await sharp(SOURCE)
            .resize(size, size, { fit: "cover", background: { r: 10, g: 10, b: 15, alpha: 1 } })
            .png({ quality: 95 })
            .toFile(path.join(OUT_DIR, filename));
        console.log(`  ✅ ${filename}`);
    }

    // Apple Touch Icon (180x180)
    await sharp(SOURCE)
        .resize(180, 180, { fit: "cover", background: { r: 10, g: 10, b: 15, alpha: 1 } })
        .png({ quality: 95 })
        .toFile(path.join(OUT_DIR, "apple-touch-icon.png"));
    console.log("  ✅ apple-touch-icon.png");

    // Favicon 32x32
    await sharp(SOURCE)
        .resize(32, 32, { fit: "cover", background: { r: 10, g: 10, b: 15, alpha: 1 } })
        .png({ quality: 95 })
        .toFile(path.join(OUT_DIR, "favicon-32x32.png"));
    console.log("  ✅ favicon-32x32.png");

    // Favicon 16x16
    await sharp(SOURCE)
        .resize(16, 16, { fit: "cover", background: { r: 10, g: 10, b: 15, alpha: 1 } })
        .png({ quality: 95 })
        .toFile(path.join(OUT_DIR, "favicon-16x16.png"));
    console.log("  ✅ favicon-16x16.png");

    // Favicon ICO (usando o 32x32 como base)
    // Nota: para .ico real, usaria uma lib específica. O PNG funciona como favicon no Next.js

    console.log("\n🎉 Todos os ícones PNG gerados com sucesso!");
}

generate().catch(console.error);
