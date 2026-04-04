# Alex Chen — Personal Website

Personal website built with [Jekyll](https://jekyllrb.com/), deployed via GitHub Pages.

---

## Local Development

### Prerequisites

Install Ruby via Homebrew (one-time setup):

```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install bundler
```

### Install dependencies

```bash
bundle install
```

### Start dev server

```bash
bundle exec jekyll serve
```

Open [http://localhost:4000/](http://localhost:4000/) in your browser. The site auto-rebuilds when you save changes.

For live reload in the browser:

```bash
bundle exec jekyll serve --livereload
```

---

## Development 
For the development of site, I follow the steps below:
- Use some markdown files as draft to write what ever I want;
- Use the AI tools to help me reformat so that it is compatible with the site;

---

## Deployment

The site is automatically deployed to GitHub Pages on every push to `main` (or `master`) that touches content files (posts, assets, config, templates, scripts, etc.). Pure documentation changes like `README.md` do not trigger a deploy.

The workflow builds the site, purges unused CSS, then pushes the output to the `gh-pages` branch. PRs against `main`/`master` also run the build as a check, but do not deploy.

### Setup (one-time)

1. In your GitHub repo, go to **Settings → Actions → General → Workflow permissions** and enable **Read and write permissions**.
2. Push to `main` — the **Deploy site** workflow builds the site and pushes to the `gh-pages` branch automatically.
3. Go to **Settings → Pages** and set the source branch to `gh-pages`.

### Manual deploy trigger

Go to **Actions → Deploy site → Run workflow** to trigger a deployment manually without pushing a commit.

---

## Commands

| Command                                 | Description                       |
| --------------------------------------- | --------------------------------- |
| `bundle install`                        | Install dependencies              |
| `bundle exec jekyll serve`              | Start dev server (localhost:4000) |
| `bundle exec jekyll serve --livereload` | Start dev server with live reload |
| `bundle exec jekyll build`              | Build site to `_site/`            |
