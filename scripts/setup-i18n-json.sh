# Translate JSON files

# JSON translation files are used for everything that is not contained in a Markdown document:

# React/JSX code
# Layout navbar and footer labels
# Docs sidebar category labels
# ...

# Reference: https://docusaurus.io/docs/i18n/tutorial

yarn docusaurus write-translations
cp -r i18n/** source/i18n
cd .. && rm -r i18n

# CAUTION: only run following scripts when setup fr translation modules
# yarn docusaurus write-translations -- --locale fr