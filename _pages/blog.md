---
layout: default
permalink: /blog/
title: Blog
description: Writing by Alex Chen on AI systems, generative AI inference, GPU kernels, reinforcement learning for LLMs, and robot learning.
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 10
  sort_field: date
  sort_reverse: true
  trail:
    before: 1 # The number of links before the current page
    after: 3 # The number of links after the current page
---

<div class="post lp">
  <header class="post-header">
    <h1 class="post-title">{{ page.title }}</h1>
    <p class="post-description">{{ site.blog_description }}</p>
    {% if site.display_tags.size > 0 or site.display_categories.size > 0 %}
      <p class="post-tags">
        {% for category in site.display_categories %}
          <a class="lp-chip" href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ site.category_labels[category] | default: category }}</a>
        {% endfor %}
        {% for tag in site.display_tags %}
          <a class="lp-chip lp-chip-quiet" href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">#{{ tag }}</a>
        {% endfor %}
      </p>
    {% endif %}
  </header>

{% if page.pagination.enabled %}
{% assign postlist = paginator.posts %}
{% else %}
{% assign postlist = site.posts %}
{% endif %}

  <ul class="lp-posts lp-posts-full">
    {% for post in postlist %}
      {% assign category = post.categories | first %}
      {% if post.redirect == blank %}
        {% assign href = post.url | relative_url %}
      {% elsif post.redirect contains '://' %}
        {% assign href = post.redirect %}
      {% else %}
        {% assign href = post.redirect | relative_url %}
      {% endif %}
      {% if post.external_source == blank %}
        {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
      {% else %}
        {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
      {% endif %}
      <li>
        <div>
          <a class="lp-post-title" href="{{ href }}">{{ post.title }}</a>
          {% if post.description %}<p>{{ post.description }}</p>{% endif %}
          {% if category %}
            <a class="lp-chip" href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ site.category_labels[category] | default: category }}</a>
          {% endif %}
          <span class="lp-read-time">{{ read_time }} min read{% if post.external_source %} &middot; {{ post.external_source }}{% endif %}</span>
        </div>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %-d, %Y' }}</time>
      </li>
    {% endfor %}
  </ul>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div>
