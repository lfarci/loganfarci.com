---
title: "Flouz: A Small Personal Finance Tool"
description: "A quick note on flouz, a local CLI tool I'm building to track bank transactions with SQLite and AI-powered categorization."
publishedAt: "2026-04-16"
featured: false
tags: ["Personal Finance", "TypeScript", "SQLite", "AI"]
author: "Logan Farci"
coauthoredWithAgent: true
---

I've been working on a small side project called [flouz](https://github.com/lfarci/flouz) — an AI-powered CLI tool for managing personal bank transactions. It's mostly an excuse to experiment with a few things I've been wanting to try.

## What It Does

Flouz stores your transactions and bank account information in a local SQLite database. There's no server, no cloud sync, no account required — everything stays on your machine. The data is yours and only yours.

The current focus is on using AI to automatically categorize transactions, which is the tedious part of any personal finance workflow. The goal is to make that process hands-off.

## Why Build It

I wanted a simple tool that fits my workflow without depending on a third-party service. Most personal finance apps require you to connect your bank account to their servers, which I'd rather avoid. A local SQLite file is easy to back up, inspect, and own.

It's also a good playground. AI-assisted categorization, CLI design, and local-first architecture are all things I want to get better at, and this project gives me a concrete reason to explore them.

## What's Next

The plan is to gradually make flouz more generic so it can be useful to anyone interested in personal finance tooling. It's released under the MIT license, so feel free to use it, fork it, or contribute.

The repository is at [github.com/lfarci/flouz](https://github.com/lfarci/flouz).
