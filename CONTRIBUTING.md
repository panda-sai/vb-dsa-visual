# Contributing to VB Visual

Thanks for helping make computer science easier to see! This guide explains how to get set up and what we look for in a pull request.

## Ways to contribute

- **Report a bug**: something animates wrong, a step is skipped, or the layout breaks on your device.
- **Improve an explanation**: clearer wording, a better code sample, or a fixed complexity note.
- **Polish the UI**: accessibility, mobile layout, performance.
- **Add a new visualization**: see [Adding a new topic](#adding-a-new-topic) below.

For anything bigger than a small fix, please **open an issue first** so we can agree on the approach before you put in the work.

## Development setup

Requirements: Node.js 20.9 or newer (`nvm use` picks up `.nvmrc`).

```bash
git clone https://github.com/<your-username>/vb-dsa-visual.git
cd vb-dsa-visual
npm install
npm run dev
```

No environment variables or external services are needed.

## Before you open a pull request

Run these locally. CI runs the same checks and will block the merge if they fail:

```bash
npm run lint
npm run typecheck
npm run build
```

Also:

- Test your change in the browser at desktop **and** mobile widths.
- Keep PRs focused: one fix or feature per PR.
- Include a screenshot or short GIF for any visual change.
- Use clear commit messages, e.g. `trees: fix AVL rotation highlight`.

## Adding a new topic

1. **Register it** in [`src/config/topics.ts`](src/config/topics.ts):

   ```ts
   { id: '14', slug: 'tries', title: 'Tries', category: 'data-structures', difficulty: 'Intermediate', status: 'active' },
   ```

   The order of `TOPICS_CONFIG` decides the previous/next navigation, and `status: 'coming-soon'` shows the card as disabled.

2. **Create the page** at `src/app/<slug>/page.tsx` with a `page.module.css` next to it. Use an existing topic such as `stacks/` or `heaps/` as a template. Mark the page `'use client'` and render `<TopicNavigator currentSlug="<slug>" />` at the bottom.

3. **Keep logic separate from UI** for anything non-trivial. Put the data-structure operations in a `<slug>-logic.ts` file (see `heaps/heap-logic.ts` or `trees/tree-logic.ts`). Generator functions that `yield` each intermediate state work well for step-by-step animation.

4. **Add an icon** for the topic card in `src/app/subjects/[id]/page.tsx` (`getIcon`).

### Guidelines for visualizations

- Every animated step should map to a visible line or idea in the code panel.
- Disable controls while an animation is running so users can't create inconsistent state.
- Validate user input and show a helpful status message instead of failing silently.
- Reuse the CSS variables in `src/app/globals.css` (colors, spacing, radii) to keep the look consistent.

## Reporting bugs

Use the [bug report template](https://github.com/panda-sai/vb-dsa-visual/issues/new?template=bug_report.yml). Include the page, the steps to reproduce, what you expected, and your browser and device.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
