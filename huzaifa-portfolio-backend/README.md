# Huzaifa Portfolio Backend

Production-ready Node.js/TypeScript backend.

## Quick Start

\`\`\`bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
\`\`\`

Server: http://localhost:5000

## Features
- JWT Auth with Token Rotation
- CSRF Protection
- Rate Limiting
- Token Reuse Detection
- Spam Detection

## API
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/contact
- GET /api/v1/health
