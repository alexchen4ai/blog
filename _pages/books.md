---
layout: page
title: bookshelf
permalink: /books/
nav: false
---

> What an astonishing thing a book is. It's a flat object made from a tree with flexible parts on which are imprinted lots of funny dark squiggles. But one glance at it and you're inside the mind of another person, maybe somebody dead for thousands of years. Across the millennia, an author is speaking clearly and silently inside your head, directly to you. Writing is perhaps the greatest of human inventions, binding together people who never knew each other, citizens of distant epochs. Books break the shackles of time. A book is proof that humans are capable of working magic.
>
> — Carl Sagan, Cosmos (1980)

<ul class="post-list">
{% assign books = site.books | sort: "date" | reverse %}
{% for book in books %}
  <li>
    <h3><a class="post-title" href="{{ book.url | relative_url }}">{{ book.title }}</a></h3>
    <p class="post-meta">
      {{ book.author }}
      {% if book.released %} &nbsp;&middot;&nbsp; {{ book.released }}{% endif %}
      {% if book.stars %}
        &nbsp;&middot;&nbsp;
        {% assign full_stars = book.stars | floor %}
        {% for i in (1..full_stars) %}<i class="fa-solid fa-star fa-sm"></i>{% endfor %}
      {% endif %}
      {% if book.status %} &nbsp;&middot;&nbsp; <em>{{ book.status }}</em>{% endif %}
    </p>
    {% if book.description %}
      <p>{{ book.description }}</p>
    {% else %}
      <p>{{ book.content | strip_html | truncatewords: 40 }}</p>
    {% endif %}
    <p class="post-tags">
      {% if book.buy_link %}
        <a href="{{ book.buy_link }}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square fa-sm"></i> Read online</a>
      {% endif %}
      {% for category in book.categories %}
        &nbsp;&middot;&nbsp;
        <a href="{{ category | slugify | prepend: '/books/category/' | relative_url }}"><i class="fa-solid fa-tag fa-sm"></i> {{ category }}</a>
      {% endfor %}
    </p>
  </li>
{% endfor %}
</ul>
