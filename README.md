# Anime Studio AI — Nakasuki

A mobile-first storyboard and short-clip workshop for the original anime series **NAKASUKI: THE WORLD NEVER APOLOGIZES**.

## Current prototype

- Gemini-powered storyboard creation.
- Model fallback across Gemini Flash models when a model is unavailable or quota-limited.
- Character reference image and continuity notes.
- Per-scene image uploads, visual prompts and subtitles.
- Browser-side WebM export with pan/zoom movement and captions.
- Narration preview and downloadable narration script.
- Designed for 50–60 second clips that can be assembled in CapCut.

## Run locally

Open `index.html` in a modern browser or deploy it as a static site on Cloudflare Pages.

## Gemini API key

Create a key in [Google AI Studio](https://aistudio.google.com/app/apikey), then enter it in the app's AI connection tab.

**Prototype security note:** this initial version stores the key in browser local storage and calls Google's API from the browser. Do not use this setup for a public multi-user production app. Before public launch, move Gemini requests behind a Cloudflare Worker and store the key as a Worker secret.

## Supabase

Supabase is deliberately not required for the first version. It can be added later for user accounts, cloud-saved projects, scene assets, and syncing between devices.

## Current video limitation

The first exporter makes a video from uploaded still images, pan/zoom movement, and subtitles. It does not create full AI character animation. A separate image-to-video provider/model integration is required for true character movement; availability and pricing depend on that provider.

## Deployment

The project can be deployed from this repository with Cloudflare Pages using the Git integration. Build command: none. Output directory: `/`.
