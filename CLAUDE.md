# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese health and wellness website (zuoxibiao.com) that displays an optimal daily schedule with health tips. It's a static Jekyll site hosted on GitHub Pages focusing on healthy living routines and traditional Chinese health wisdom.

## Architecture

- **Static Site**: Pure HTML/CSS/JavaScript with Jekyll for GitHub Pages
- **Single Page Application**: Main content in `index.html` with dynamic current time highlighting
- **Content Structure**:
  - `index.html`: Main page with health schedule timeline
  - `_layouts/default.html`: Jekyll layout template (minimal)
  - `css/style_1.0.0.css`: Main stylesheet
  - `maxim.txt`: Health-related quotes loaded via AJAX
  - `js/jquery_1.4.2.min.js`: jQuery library for interactivity

## Key Features

- **Real-time Schedule Highlighting**: JavaScript automatically highlights the current time period in the health schedule
- **Random Health Quotes**: Loads random motivational quotes about health from `maxim.txt`
- **Responsive Timeline**: Scrolls to and highlights current time period based on system time
- **Analytics**: Baidu Analytics integration for Chinese market

## Development

Since this is a static Jekyll site for GitHub Pages:

- **Deployment**: Automatic via GitHub Pages when pushing to `gh-pages` branch
- **Domain**: Custom domain configured via `CNAME` file (zuoxibiao.com)
- **No Build Process**: Direct HTML/CSS/JS files, no compilation needed
- **Content Updates**: Edit `index.html` directly for schedule content, `maxim.txt` for quotes

## File Structure

- `index.html`: Main health schedule page with embedded JavaScript
- `_config.yml`: Jekyll configuration (minimal - just baseurl)
- `maxim.txt`: Newline-separated health quotes/proverbs
- `css/style_1.0.0.css`: All styling for the site
- `img/`: Logo and background images
- `CNAME`: Domain configuration for GitHub Pages