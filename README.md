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

Push to `main` and the site is live in ~2 minutes. That's it.

The **Deploy site** GitHub Actions workflow runs automatically on every push to `main` that touches content files (posts, assets, config, templates, scripts, etc.) and:

1. Builds the Jekyll site with `JEKYLL_ENV=production`
2. Purges unused CSS
3. Deploys to GitHub Pages via the official `actions/deploy-pages` action

PRs against `main` run the build as a check but do not deploy. Pure documentation changes (`README.md`, etc.) do not trigger a deploy.

### Before pushing

Run Prettier to avoid a failing CI check:

```bash
npx prettier . --write
git add .
git commit -m "your message"
git push
```

### Manual deploy trigger

Go to **Actions → Deploy site → Run workflow** to trigger a deployment without a commit.

### One-time setup (new repo)

1. Go to **Settings → Pages** and set source to **GitHub Actions**.
2. Go to **Settings → Actions → General → Workflow permissions** and enable **Read and write permissions**.

---

## Commands

| Command                                 | Description                       |
| --------------------------------------- | --------------------------------- |
| `bundle install`                        | Install dependencies              |
| `bundle exec jekyll serve`              | Start dev server (localhost:4000) |
| `bundle exec jekyll serve --livereload` | Start dev server with live reload |
| `bundle exec jekyll build`              | Build site to `_site/`            |
