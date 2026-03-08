# Alex Chen — Personal Website

Personal website of Alex Chen, AI researcher and startup founder. Built with Next.js, featuring technical articles, research notes, and project showcases. Supports LaTeX math, syntax-highlighted code blocks, and GitHub Issues-powered comments via Utterances.

---

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- [pnpm](https://pnpm.io/)

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
pnpm build
pnpm start
```

---

## Adding Content

### Writing articles

1. Create a `.md` file in `app/(articles)/md/`.
2. Register it in `app/(articles)/list.ts`:

```ts
import myPost from "./md/my-post.md";

{
  id: "5",
  title: "My New Post",
  description: "A brief description of the post.",
  content: myPost,
  createdAt: "2026-02-11",
  group: "Article",   // or "News"
  tag: "Tutorial",
  cover: "/home/image_project.png",  // optional
}
```

### Supported Markdown features

- GFM (tables, task lists, strikethrough)
- LaTeX math — inline `$...$` and block `$$...$$`
- Code blocks with syntax highlighting
- Obsidian-style callouts (`> [!tip]`, `> [!note]`, `> [!warning]`)
- Images, HTML video, iframes

---

## Comments (Utterances)

Article detail pages support comments powered by [Utterances](https://github.com/utterance/utterances), which stores discussions as GitHub Issues.

### Setup

1. Install the Utterances GitHub App: [github.com/apps/utterances](https://github.com/apps/utterances)
2. Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_UTTERANCES_REPO=your-username/your-repo
```

3. Restart the dev server.

If the variable is unset, the comments section is hidden automatically.

---

## Project Structure

```
├── app/
│   ├── (articles)/
│   │   ├── list.ts          # Article registry and metadata
│   │   └── md/              # Markdown source files
│   ├── (component)/         # Shared UI components
│   ├── (landing-page)/      # Home page
│   ├── article/             # Article list page
│   ├── news/                # News list page
│   └── details/             # Article detail page
├── public/                  # Static assets
└── components/              # Generic/reusable components
```

---

## Scripts

| Command      | Description               |
| ------------ | ------------------------- |
| `pnpm dev`   | Start development server  |
| `pnpm build` | Build for production      |
| `pnpm start` | Run production server     |
| `pnpm lint`  | Run ESLint                |
