This is a [Next.js](https://nextjs.org) personal portfolio built with static export (`output: "export"`).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Build

```bash
npm run build
```

This produces a static export in the `out/` directory, suitable for GitHub Pages, Netlify, or any static host.

## Contact Form

The contact form submits to `/api/contact`. For this to work:

- **Cloudflare Pages**: The `functions/api/contact.ts` file is used automatically. Set `RESEND_API_KEY` and optionally `TURNSTILE_SECRET_KEY` in Cloudflare Pages environment variables.
- **Other hosts**: Deploy a serverless function that handles POST `/api/contact` and set `NEXT_PUBLIC_CONTACT_API` to its URL at build time.

If the API is unavailable, the form shows an error and suggests emailing directly.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
