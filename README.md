# Facticity

An AI-powered fact-checking platform built with **Next.js** (migrated from React + Vite).  
The app provides real-time verification of claims across text, audio, video, and documents, and is being actively extended into a **Base Mini App** and a new UI with **shadcn/ui**.

## Tech Stack

- **Framework:** Next.js 15 (App Router)  
- **UI:** Material-UI (in active use), [shadcn/ui](https://ui.shadcn.com/) (under migration)  
- **Styling:** CSS modules & global styles  
- **Authentication:** Auth0 + Privy (hybrid setup)  
- **Build Tooling:** Next.js native build & optimizations  
- **Deployment:** Vercel / containerized (nginx, Docker)  
- **Onchain Integration:** Coinbase OnchainKit + MiniKit (in progress under `base-mini-app-conversion` branch)


## Dev Practices

- Always create **temporary feature branches** when working on new features/bugs, and merge them into your working branch via PRs.  
- Create **new components** whenever possible to prevent bloating in src/components in a logical sub-folder.
- Add **short comment lines** to explain code flow and blocks, making it easier for other devs to maintain.  
- For **backend/API URLs or long hardcoded texts**, use environment variables instead of hardcoding.  
  - Define them in `.env.local` for development and `.env.production` for production.  
  - Access them in code with `process.env.NEXT_PUBLIC_*`.  
  - Example:  
    ```env
    # .env.local
    NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
    ```  
    ```ts
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    ```



## Branching & Workflow

We maintain **two active feature branches** and one integration branch:

- `base-mini-app-conversion` → Work related to converting the app into a Base Mini App (MiniKit, OnchainKit, wallet context, manifest, etc.)  
- `shadcn-ui` → Work related to revamping the frontend layout with shadcn/ui components  
- `dev` → The **common integration branch**. All changes from the feature branches must be merged here via **Pull Requests**.  
- `master` → Stable release branch. Only merge from `dev` via **Pull Requests** once features are tested and stable.  

### Workflow Rules

1. Developers commit directly to their assigned feature branch (`base-mini-app-conversion` or `shadcn-ui`).  
2. Changes are merged into `dev` **only via PRs**.  
3. From `dev`, when stable, changes are promoted to `master` via PRs.  
4. **Important:** Always pull the latest `dev` branch before committing new work on your feature branch. This keeps collisions minimal.  
5. Use meaningful commit messages and small, reviewable PRs.  


###  Getting Started (Next.js)

In the project directory, run:
```bash
npm run dev
