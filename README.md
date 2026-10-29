# VB Visual

**See how code works, one step at a time.**

VB Visual is a free, open-source collection of interactive visualizations for programming fundamentals and data structures. Instead of reading about how a linked list insert or a heap sift-down works, you watch it happen. Each step is animated next to the code that performs it.

[![CI](https://github.com/panda-sai/vb-dsa-visual/actions/workflows/ci.yml/badge.svg)](https://github.com/panda-sai/vb-dsa-visual/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Topics

| Logic Building | Data Structures |
| --- | --- |
| Conditionals | Arrays |
| Loops | Strings |
| Functions | Linked Lists |
| Recursion | Hashing |
| | Stacks |
| | Queues |
| | Trees (BST & AVL) |
| | Heaps (Min & Max) |
| | Graphs (BFS & DFS) |

**Coming soon:** Sorting Algorithms, Operating Systems (Process Scheduling), DBMS. Want to help build one? See [Contributing](#contributing).

## Getting started

You need **Node.js 20.9+** (see `.nvmrc`). There are no environment variables, accounts, or external services to set up.

```bash
git clone https://github.com/panda-sai/vb-dsa-visual.git
cd vb-dsa-visual
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build (fully static) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting |

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Compiler enabled)
- [React 19](https://react.dev)
- TypeScript
- CSS Modules for per-topic styling, plus global design tokens in `src/app/globals.css`

Every page is pre-rendered as static HTML. The app has no backend, database, or login.

## Project structure

```
src/
├── app/
│   ├── <topic>/            # One folder per visualization (arrays, trees, graphs, …)
│   │   ├── page.tsx        # The interactive page
│   │   ├── page.module.css # Topic-specific styles
│   │   └── *-logic.ts      # (some topics) pure data-structure logic, kept separate from UI
│   ├── subjects/[id]/      # Subject listing pages (Logic Building, Data Structures, …)
│   ├── contact/
│   ├── layout.tsx          # Navbar + footer
│   └── globals.css         # Design tokens and shared styles
├── components/             # Navbar, Logo, TopicNavigator (prev/next links)
└── config/
    ├── topics.ts           # Registry of topics and subjects. Start here to add one
    └── site.ts             # Site name, repo URL, contact and donation links
```

## Contributing

Contributions are very welcome, whether that's a typo fix, a bug report, a better explanation, or a whole new visualization. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started. Issues labelled [`good first issue`](https://github.com/panda-sai/vb-dsa-visual/labels/good%20first%20issue) are a good entry point.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Support the project

VB Visual is free and always will be. If it helped you learn something, you can support its development with a small contribution via [Razorpay](https://razorpay.me/@vamsibhavani) (UPI, cards, netbanking), or by using the **Sponsor** button at the top of this repo. Starring the repo and sharing it with friends helps a lot too. ⭐

## License

[MIT](LICENSE) © Vamsi Bhavani
