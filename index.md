---
layout: page
title: About Me
---
{% include JB/setup %}

## Introduction

I am a web developer in Beijing, currently working at Yahoo!

## Blog Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a> <span>{{ post.date | date_to_string }}</span> </li>
  {% endfor %}
</ul>

## Portfolio

* [Yahoo! Search](http://search.yahoo.com/mobile) for mobile
* [Slide Fiddle](http://slidefiddle.appspot.com/), an online presentation tool based on markdown
