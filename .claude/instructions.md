# Ghana Land ERP - Project Instructions

**IMPORTANT: Follow all these instructions unless explicitly told otherwise by the user.**

## Project Context
This is the Ghana Land ERP system with a standalone demo application. Always work on the `standalone` branch unless explicitly instructed otherwise.

## Working Branch
- **Default Branch**: `standalone` (NOT main)
- **Before any work**: Verify you're on the standalone branch with `git branch`
- **If on main**: Switch to standalone with `git checkout standalone`

## Key Directories
- `/Users/nikolay/github/ghana/ghana/standalone-demo` - Standalone demo app (port 3001)
- `/Users/nikolay/github/ghana/ghana/frontend` - Original frontend (port 3000)
- `/Users/nikolay/github/ghana/ghana/backend` - Original backend (port 5001)

## Default Working Directory
When working on standalone features, assume the working directory is:
```
/Users/nikolay/github/ghana/ghana/standalone-demo
```

## Startup Checklist
1. Check current branch: `git branch`
2. If context is needed, read: `/Users/nikolay/github/ghana/ghana/CONTEXT_SUMMARY.md`
3. For standalone demo work, navigate to: `standalone-demo/`

## Demo Users (All passwords: password123)
- **Surveyor**: ama.adjei@example.com (ID: 430ab24f-6fba-449a-84b7-885eadefc674)
- **Lands Officer**: abena.osei@example.com
- **Admin**: kwame.nkrumah@example.com
- **Citizen**: kofi.mensah@example.com

## Technology Stack
- React 18.2.0
- Material-UI (MUI)
- React Leaflet for maps
- Mock API (no real backend for standalone)
- localStorage for persistence

## Important Files
- `standalone-demo/src/pages/SubmitSurveyPage.js` - Survey submission with GPS features
- `standalone-demo/src/pages/ParcelsPage.js` - Parcel management
- `standalone-demo/src/services/api.js` - Mock API endpoints
- `standalone-demo/src/contexts/AuthContext.js` - Authentication

## Development Commands
Start standalone demo:
```bash
cd /Users/nikolay/github/ghana/ghana/standalone-demo
PORT=3001 BROWSER=none npm start
```

## Code Style Preferences
- Use functional components with hooks
- Prefer MUI components for UI
- Use camelCase for JavaScript variables
- Add comments for complex GPS/surveying logic
- Keep mock data realistic for Ghana context
- **Clean, minimalist UI design** - no unnecessary decorations
- **No emojis or icons in text** unless explicitly requested
- **Security**: Never hardcode tokens, passwords, or API keys - use environment variables

## Git Workflow
- Always commit to `standalone` branch
- Use descriptive commit messages
- Include "Co-Authored-By: Claude" in commits
- Push changes to `origin/standalone`

## Context Recovery
If context is lost, read: `CONTEXT_SUMMARY.md` in project root
