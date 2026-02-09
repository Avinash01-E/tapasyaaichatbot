# Tapasya AI Assistant

Hybrid AI chatbot widget using Next.js, Node.js, DeepSeek, Qdrant, and MySQL.

## Quick Start
1. Copy `.env.example` to `.env.local` and fill values.
2. Create schema: run the SQL in `db/schema.sql`.
3. Install dependencies: `npm install`.
4. Run dev server: `npm run dev`.

## Embed
Use the script below on any site:

```html
<script src="/tapasya-widget.js" data-tapasya-origin="http://localhost:3000"></script>
```

## Notes
- Rule-based intents live in `lib/rules.js`.
- Semantic search is via Qdrant in `lib/qdrant.js`.
- DeepSeek chat/embeddings are in `lib/deepseek.js`.
