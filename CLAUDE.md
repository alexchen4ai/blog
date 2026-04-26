@AGENTS.md

## Pre-Commit Rule

Before every commit, run Prettier to avoid a failing CI check:

```bash
npx prettier . --write
git add .
git commit -m "your message"
git push
```

## Local Dev

```bash
bundle install
bundle exec jekyll serve --livereload
```

Site runs at http://localhost:4000/.

## Deployment

Push to `main` deploys automatically via GitHub Actions. PRs run the build as a check but do not deploy.
