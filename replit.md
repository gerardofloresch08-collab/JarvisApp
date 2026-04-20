# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Mobile**: Expo (React Native) with Expo Router

## Artifacts

### JarvisApp (artifacts/mobile)
Personal AI assistant mobile app with:
- **Chat screen**: Conversational AI chat with animated orb, quick action chips, typing indicator
- **Reminders screen**: Add/toggle/delete reminders with time labels
- **Settings screen**: Appearance, notifications, privacy settings
- **Context**: JarvisContext manages messages and reminders via AsyncStorage
- **AI**: Claude Sonnet via Replit AI Integrations (Anthropic)
- **Colors**: iOS-inspired dark/light palette (blues, greens)
- **Fonts**: Inter (400/500/600/700)

### API Server (artifacts/api-server)
Express 5 backend with:
- Health route
- `/api/jarvis/chat` — Claude Sonnet chat endpoint via Replit AI Integrations

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/mobile run dev` — run mobile Expo app

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## GitHub Integration Note

The user wants to push this project to a public GitHub repo named "JarvisApp". The Replit GitHub OAuth connector was dismissed. If the user wants to retry via OAuth, use connector ID `connector:ccfg_github_01K4B9XD3VRVD2F99YM91YTCAF`. Alternatively, the user can provide a GitHub Personal Access Token (stored as secret `GITHUB_TOKEN`) with `repo` scope, and the agent can use the GitHub API + git to create the repo and push.
