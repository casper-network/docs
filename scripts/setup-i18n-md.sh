# Translate Markdown files

# Reference: https://docusaurus.io/docs/i18n/tutorial

cd ../
# Translate the docs
mkdir -p source/i18n/en/docusaurus-plugin-content-docs/current
cp -r source/docs/** source/i18n/en/docusaurus-plugin-content-docs/current

# mkdir -p i18n/fr/docusaurus-plugin-content-docs/current
# cp -r docs/** i18n/fr/docusaurus-plugin-content-docs/current

# Translate the blog
mkdir -p source/i18n/en/docusaurus-plugin-content-blog
cp -r source/blog/** source/i18n/en/docusaurus-plugin-content-blog

# mkdir -p i18n/fr/docusaurus-plugin-content-blog
# cp -r blog/** i18n/fr/docusaurus-plugin-content-blog

# TODO: resolve throwing error stopping script issue
# Translate the pages
# mkdir -p i18n/en/docusaurus-plugin-content-pages
# cp -r src/pages/**.md i18n/en/docusaurus-plugin-content-pages
# cp -r src/pages/**.mdx i18n/en/docusaurus-plugin-content-pages