<div align="center">
  <h1>🗣️ My blog to share my thinking about AI tech development and entrepreneurship</h1>
  <p align="center">
    🐦 <a href="https://www.linkedin.com/in/wei-chen-stanford/">Follow me on linkedin</a> • 
  </p>
</div>


To make life easier, we use [nbdev](https://nbdev.fast.ai/getting_started.html) to write the blog.

# How to do CI/CD
Firstly, configure any installation according to this [page](https://quarto.org/docs/publishing/github-pages.html#publish-command).
- Set `gh-pages` branch.

To make any changes, we can just edit the files in the current folder, and then run the following command to update deployment.

```bash
quarto publish gh-pages
```

If you need to rebuild the project, use `quarto render` to rebuild the project. And we can use `quarto preview` to preview the project locally.