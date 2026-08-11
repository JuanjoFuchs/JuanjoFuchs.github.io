---
layout: page
title: Categories
description: "Every post on the blog, grouped by category."
permalink: /categories/
---

{% assign sorted_categories = site.categories | sort %}

<ul class="category-jump">
{%- for category in sorted_categories %}
  <li><a href="#{{ category[0] | slugify }}">{{ category[0] }} <span class="aside-count">{{ category[1].size }}</span></a></li>
{%- endfor %}
</ul>

{% for category in sorted_categories %}
<h2 id="{{ category[0] | slugify }}">{{ category[0] }}</h2>

<ul class="post-list-compact">
  {%- assign posts = category[1] | sort: "date" | reverse -%}
  {%- for post in posts %}
  <li>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
    <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
  </li>
  {%- endfor %}
</ul>
{% endfor %}
