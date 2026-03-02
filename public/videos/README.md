# 🎬 Vídeos do Portfolio

Coloque seus vídeos aqui com os seguintes nomes:

| Arquivo            | Descrição                                      |
|--------------------|-------------------------------------------------|
| `myka-demo.mp4`    | Demo geral do app da Myka Procópio             |
| `myka-detalhes.mp4`| Detalhes de UX — agendamento, galeria etc.     |
| `myka-admin.mp4`   | Painel admin — gestão de clientes e financeiro  |

## Dicas para os vídeos

- **Formato:** MP4 (H.264) — compatível com todos os navegadores
- **Resolução ideal:** 720p ou 1080p
- **Aspect ratio:** 9:16 (vertical/celular) ou 16:9 (horizontal)
- **Tamanho máximo recomendado:** 15MB por vídeo (para Vercel)
- **Compressão:** Use https://handbrake.fr ou ffmpeg para comprimir

### Comando ffmpeg para comprimir:
```bash
ffmpeg -i entrada.mp4 -vcodec libx264 -crf 28 -preset fast -vf scale=720:-2 -an myka-demo.mp4
```
(Remove áudio com `-an` e reduz para 720p)

## ⚠️ Importante para deploy na Vercel

A Vercel tem limite de **100MB** por deploy. Se seus vídeos forem grandes:
1. Comprima bem (CRF 28-32)
2. Ou hospede no YouTube/Vimeo e use embed
3. Ou use Cloudflare R2 / AWS S3 para servir os vídeos
