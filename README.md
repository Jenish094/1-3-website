# 1/3 | Team 41103C

Static site in `public/`, one Cloudflare Pages Function in `functions/api/` that calls the VEX events API.

## Cloudflare Pages setup
- Build command: `node scripts/make-manifest.js`
- Build output directory: `public`
- Settings > Variables and Secrets: add secret `VEX_API_TOKEN` (your API token). Optional: `VEX_API_BASE` (defaults to `https://events.vex.com/api/v2`).
- Custom domain: `41103c.jenish.tech`

Never commit the token to the repo.

## Replays
Drop video files (mp4, webm, mov) into `public/videos/` and push. The filename is the title shown on the site, for example `Pedare Regional_Q14.mp4`.
Cloudflare Pages rejects files over 25 MB. Compress first:
`ffmpeg -i in.mp4 -vf scale=-2:720 -crf 28 -preset slow out.mp4`

## Local preview
Create `.dev.vars` containing `VEX_API_TOKEN=your_token`, then run `npx wrangler pages dev public`.
