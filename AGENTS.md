# Task: Establish Permanent Engineering Rules for Dot Code Frontend

I want to establish permanent project-wide engineering rules for this Next.js project.

These rules must be automatically followed in every future task, conversation, feature, and code modification.

## 1. First: Understand the Existing Project

Before creating the rules, inspect the existing project structure selectively.

The existing project includes:

- `src/app/`
- `src/components/`
- `src/hooks/`
- `src/lib/`
- `src/services/`
- `src/store/`
- `src/types/`
- `src/validation/`

The project also contains:

- `FRONTEND_API_REFERENCE.md`
- `FRONTEND_REFERENCE.md`
- An existing Dashboard implementation.

### Dashboard Analysis Requirements

Study the existing Dashboard implementation as an architectural reference.

Understand:

1. Component organization and naming conventions.
2. Service layer and API communication.
3. TypeScript types and interfaces.
4. Zustand state management.
5. Custom hooks and their responsibilities.
6. React Query usage, if applicable.
7. Validation patterns.
8. Authentication and authorization boundaries.
9. Existing UI conventions and reusable components.

Do not read every file indiscriminately.

Start with the relevant entry points, layouts, services, hooks, types, and representative Dashboard pages and components.

Expand the inspection only when a dependency or implementation detail requires it.

Do not read:
- `node_modules/`
- `.next/`
- Generated build files.
- Entire dependency lockfiles.
- Unrelated assets or files.

Do not print large file contents into the conversation.

The goal is to understand and reuse good existing patterns, not duplicate the entire Dashboard.

## 2. Permanent Project Rules

Create the following file at the Frontend workspace root:

`AGENTS.md`

This file must contain permanent, concise, actionable engineering rules.

These rules must remain active in every future task.

## 3. SEO and Server-Side Rendering (HIGH PRIORITY)

SEO is a primary requirement for this public portfolio website.

### Server Rendering

- Use Next.js App Router Server Components by default.
- Fetch public content from the existing Backend API on the server whenever appropriate.
- Projects, services, technologies, categories, and other public content must be available in the initial server-rendered HTML.
- Do not depend on client-side JavaScript to initially display SEO-critical content.
- Avoid unnecessary Client Components.
- Do not use `useEffect` for initial data fetching when server-side fetching is appropriate.

### Metadata

Implement proper Next.js metadata conventions:

- Static metadata where appropriate.
- `generateMetadata()` for dynamic pages.
- Unique title and description for each page.
- Canonical URLs.
- Open Graph metadata.
- Twitter metadata.
- Appropriate robots directives.
- Correct Arabic and English metadata.
- Language alternates and `hreflang` where appropriate.

### Technical SEO

- Generate an appropriate sitemap.
- Configure robots.txt.
- Use semantic HTML.
- Use proper heading hierarchy.
- Add structured data (JSON-LD) when relevant and supported by actual project data.
- Optimize images and metadata assets.
- Ensure public project pages can be indexed.
- Avoid duplicate metadata and duplicate URLs.

### Backend Integration

- Read `FRONTEND_API_REFERENCE.md` before implementing API integration.
- Never invent endpoints, response properties, or API contracts.
- Never access the database directly from the public frontend.
- Use the existing Backend API.
- Keep server-side credentials private.
- Never expose secrets through `NEXT_PUBLIC_` environment variables.

### Caching

Choose an explicit caching and revalidation strategy based on content requirements.

Do not assume every request should be cached indefinitely.

Use appropriate Next.js caching and revalidation mechanisms supported by the installed Next.js version.

## 4. Clean Code and Component Architecture (HIGH PRIORITY)

Write clean, readable, maintainable, production-quality code.

### Component Responsibilities

- Every component must have a clear responsibility.
- Avoid massive components containing UI, API requests, state management, and business logic together.
- Separate UI presentation from data fetching and business logic.
- Keep components focused and reasonably sized.
- Extract reusable components only when reuse or separation of responsibility provides real value.
- Avoid unnecessary abstractions and excessive component fragmentation.
- Avoid deeply nested conditional rendering.
- Use descriptive names for components, variables, functions, and files.

### Architecture

Respect the existing project structure and conventions.

Use appropriate separation between:

- App routes and layouts.
- Page sections.
- Reusable UI components.
- API services.
- Custom hooks.
- State management.
- TypeScript types.
- Validation schemas.

Do not create new folders or architectural layers without a clear reason.

Do not duplicate existing functionality.

Do not rewrite working modules without a demonstrated need.

### Code Quality

- Prefer explicit and readable code.
- Avoid unnecessary abstractions.
- Avoid speculative features.
- Avoid unnecessary dependencies.
- Avoid duplicate logic.
- Avoid premature optimization.
- Do not generate large amounts of code for simple requirements.
- Do not introduce unused variables, imports, components, or files.
- Do not use `any` unless there is a justified reason.
- Never use placeholder or fabricated data in production features.

## 5. React and Next.js Performance (HIGH PRIORITY)

### Client Components

- Server Components are the default.
- Add `"use client"` only when browser-side interaction or client-side React features are genuinely required.
- Keep Client Components as small and isolated as possible.
- Do not turn entire pages or layouts into Client Components just because one child requires interaction.
- Separate interactive components from server-rendered content.

### State Management

- Keep state as close as possible to the component that needs it.
- Do not lift state unnecessarily.
- Avoid global state for local UI concerns.
- Use Zustand only for genuinely shared client-side state.
- Avoid unnecessary Context providers.
- Prefer derived values over duplicated state.
- Do not store data that can be calculated from existing props or state.

### Re-rendering

- Avoid unnecessary re-renders.
- Avoid placing frequently changing state in high-level components.
- Avoid passing frequently changing values through large component trees unnecessarily.
- Use React.memo, useMemo, and useCallback only when there is a measurable or justified benefit.
- Do not apply memoization everywhere.

### Effects and Data Fetching

- Avoid unnecessary useEffect.
- Do not use effects to synchronize values that can be derived during rendering.
- Fetch initial public data on the server whenever appropriate.
- Use React Query only where client-side server-state management is actually needed.
- Avoid duplicate API requests.

### Loading and Error Handling

- Use appropriate loading and error boundaries.
- Use Next.js loading.tsx and error.tsx where appropriate.
- Avoid unnecessary full-page loading states.
- Keep loading states localized to the section that needs them.

## 6. TypeScript and API Standards

- Use strict TypeScript.
- Define proper API response types.
- Avoid duplicating types.
- Reuse existing shared types where appropriate.
- Keep API requests inside the established service layer.
- Validate external data when necessary.
- Handle API errors explicitly.
- Never silently ignore important failures.
- Follow the existing Backend API contract exactly.

## 7. Performance and Asset Optimization

- Use next/image where appropriate.
- Use next/font or the project's existing font strategy.
- Avoid unnecessarily large images.
- Use lazy loading for non-critical content.
- Prioritize above-the-fold content.
- Avoid layout shifts.
- Avoid unnecessary JavaScript.
- Avoid heavy animation libraries for simple CSS transitions.
- Respect prefers-reduced-motion.
- Preserve responsive behavior.

## 8. Token and Context Efficiency (VERY IMPORTANT)

Work efficiently without wasting context or tokens.

1. Inspect only files relevant to the current task.
2. Never read the entire project unless explicitly necessary.
3. Do not repeatedly inspect unchanged files.
4. Use the existing project structure as your primary reference.
5. Do not dump large source files into the conversation.
6. Avoid repeating information already established.
7. Do not generate unnecessary documentation.
8. Do not create unnecessary files.
9. Avoid implementing features that were not requested.
10. If a requirement is unclear, inspect the existing implementation before asking questions.
11. Prefer concise final reports listing changed files, important decisions, and verification results.

Token efficiency must never come at the expense of understanding the relevant code or producing correct implementations.

## 9. Mandatory Workflow for Every Task

Before writing code:

1. Understand the requested feature.
2. Identify the relevant existing files.
3. Inspect only the necessary dependencies and implementations.
4. Check the existing architecture and conventions.
5. Read the API reference when the task involves Backend integration.
6. Identify the simplest maintainable implementation.
7. Confirm whether the work belongs on the server or client.

During implementation:

1. Follow these permanent rules.
2. Reuse existing functionality where appropriate.
3. Keep changes focused.
4. Avoid unrelated modifications.
5. Preserve existing behavior.
6. Do not invent missing requirements.

After implementation:

1. Check TypeScript errors.
2. Run relevant lint checks.
3. Run the appropriate build or tests when practical.
4. Verify that no unnecessary Client Components were introduced.
5. Verify SEO and server rendering when relevant.
6. Report what changed and any remaining issues.

## 10. Conflict Resolution

These permanent rules must be followed for all future work.

When a specific user request conflicts with an architectural recommendation, explain the conflict briefly and follow the user's explicit decision unless it creates a security, correctness, or technical impossibility.

Do not silently change project architecture.

---

IMPORTANT:

Create `AGENTS.md` at the workspace root.

Do not modify existing application code during this task.

Do not install or update dependencies.

After creating the file, report:

1. The Dashboard files you inspected.
2. The architecture and conventions you identified.
3. The location of the new AGENTS.md.
4. Confirmation that the permanent rules are discoverable by Antigravity.
5. Any important existing architectural issues that should be addressed later.

Keep the final report concise.