# Casper Documentation Developer Guide

If you want to add new content or make structural updates to the documentation, follow this guide. Also, read the [Writing Style Guide](./writing-style-guide.md).

## Technology Stack

This documentation website uses the following infrastructure:

- Docusaurus (2.4.0)
- React (17.0.1)
- Node (>=16.14)

To see the current versions, open the [package.json](./package.json) file.

## Project Architecture

The table below shows you the main structure of the documentation framework.

| Folder/File          | Description                               |
| -------------------- | ----------------------------------------- |
| .docusaurus          | Docusaurus default configuration module   |
| .github              | GitHub module                             |
| .husky               | Husky script module                       |
| .vscode              | Visual Studio Code editor configuration   |
| build                | Docusaurus build packages                 |
| config               | Docusaurus detailed configuration modules |
| source/blog          | Blog page module                          |
| source/docs          | Main documentation .md files              |
| source/i18n          | Localization packages                     |
| scripts              | Bash script module                        |
| src/assets           | Asset modules (style/image/icons)         |
| src/components       | Component module                          |
| src/html             | HTML codebase                             |
| src/mocks            | Mocks data module                         |
| src/pages            | React page module                         |
| src/utils            | Utility module                            |
| static               | Static modules (image/icons)              |
| types                | Type interface definition part            |
| .env                 | Environment variables                     |
| .eslintrc            | Eslint configuration                      |
| .prettierrc          | Prettier configuration                    |
| .textlintrc          | Text lint configuration                   |
| Babel.config.js      | Babel configuration                       |
| Crowdin.yml          | Crowdin configuration                     |
| Docusaurus.config.js | Docusaurus configuration                  |
| package.json         | NPM package list                          |
| Tsconfig.js          | Typescript configuration                  |
| yarn.lock            | Package dependency graph                  |

## Project Deployment

Build and run the project as shown in the [README](./README.md#running-the-website-locally).

### Additional `yarn` commands

You might find these commands useful:

- `yarn start` - Run the project in dev mode
- `yarn build` - Build the project pages
- `yarn swizzle` - Eject a Docusaurus core source component to customize it. Do not eject all components; eject a specific component by adding parameters to this command
- `yarn deploy` - Deploy your Docusaurus project using GitHub hosting
- `yarn clear` - Remove previous builds
- `yarn serve` - Host the project
- `yarn write-translations` - Generate translation modules automatically from pages
- `yarn write-heading-ids` -Generate translation modules automatically from pages
- `yarn crowdin:sync` - Build, upload, and download translation modules
- `yarn run:prettier` - Format the code base
- `yarn run:eslint` - Check the code style based on eslint
- `yarn format` - Run `prettier` and `lint` in sequence
- `yarn reinstall` - Reinstall all `npm` packages
- `yarn prepare` - This is an internal command for `husky` install; you do not need to run this command because it is included in `yarn install`
- `yarn commit` - Internal command for `lint-stage`. This command is included in pre-commit hooks, so you do not need to run this command but we include this here for visibility

## Page Development

- To create a new document, add an `md` or `mdx` file at an intuitive location in the source directory, [docs/casper](./source/docs/casper/). Page routing will depend on page hierarchy unless you specify the routing in the [config](./config/) folder. 
   - You will need to [update the sidebar](#sidebar-footer-and-navbar-development) to include the new file.
   - To add an overview page or a new tutorial, use a template from the [templates](.github/templates) folder.
   - Add images in the [static/image](./static/image/) directory.
- To create React pages, follow the pattern in the [src/page](./src/pages/) directory.

## Component Development

- Create reusable components in the [src/components](./src/components/) directory based on their purpose.
- Define or declare the necessary types in the component or in the [types](./types/) directory.
- Follow the pattern from the [Background](./src/components/atoms/Background/) or [Hero](./src/components/containers/Hero/) components.

## Sidebar, Footer, and Navbar Development

To add or update a sidebar:

- Open the [config/sidebar.config.js](./config/sidebar.config.js) file.
- To add a new directory or file in the sidebar, update the `module.exports` structure.
- Note that item hierarchy depends on the order in which you list the items in this file.

For example, if you want to add a new directory called `workflow`, then add the following code as a property in `module.exports`:

```javascript
module.exports = {
    workflow: [
        "workflow/index",
        "workflow/staking",
		...
    ],
    ...
```

To create or update a navbar, open and update the [config/navbar.config.js](./config/navbar.config.js) file. Note that item hierarchy depends on the item order in this file. For example, if you want to create a navbar called `Staking`, add the following property in the `module.exports` structure:

```javascript
    {
        to: `${routePrefix}/staking`,
        activeBasePath: `${routePrefix}/staking`,
        label: "Staking",
        position: "left",
    },
```

To create or update a footer, open the [config/footer.config.js](./config/footer.config.js) file. Note that item hierarchy depends on the item order in this file. For example, assuming you want to add an item called `Style Guide`, add the following property:

```javascript
    title: 'Docs',
    items: [
    {
        label: 'Style Guide',
        to: 'docs/',
    },
```

## Theme Development

To create new theme, add a variable in this file: [scss/variable.scss](./src/assets/scss/variable.scss) and a theme class in the [scss/theme.scss](./src/assets/scss/theme.scss) file.

To change an existing theme, modify the [config/color.config.js](./config/color.config.js) file.

For example, you can switch to the light theme:

```javascript
module.exports = {
    defaultMode: "light",
    respectPrefersColorScheme: false,
    disableSwitch: false,
};
```

<!-- TODO comment out when localization becomes available. 
## Localization Development

- If you have made changes in the navbar, footer, or sidebar, remove the files that contain changed keys. Otherwise, you can skip this step.
- Run the `yarn run:i18n` script to tag content updates that need localization.
- Open the [config/i18n.config.js](./config/i18n.config.js) file to change the default language or add more languages. You can customize the [scripts/setup-i18n-json.sh](./scripts/setup-i18n-json.sh) and [setup-i18n-md.sh](./scripts/setup-i18n-md.sh) modules to add more localization scripts.
- Next, replace the `crowdin.yml` file, or insert the Crowdin API key (CROWDIN_PERSONAL_ACCESS_TOKEN) into the `.env` file. Then run `yarn run:crowdin` to update the translated files using Crowdin.

Configure the next variables in [config/site.navbar.config.js](./config/site.navbar.config.js).

```
module.exports = {
    ...
    'locales': [
      { internal: 'es', external: 'es-es' },
      { internal: 'en', external: 'en-us' }
    ],
    'defaultExternalLocales': 'en-us'
  },
```
-->

## reStructuredText to Markdown Conversion

To migrate reStructuredText (.rst) files to markdown (.md) files, follow these steps:

- Add the new `.rst` documents into the top-level directory.
- Run `yarn run:migrate`.
- Check that the `.rst` documents were converted to `.md` files.
- Remove the original `.rst` files.

For more information, reference the [scripts/rst-to-md.sh](./scripts/rst-to-md.sh) script.

## HTML Code Injection

For embedding HTML, follow the example in the [src/html/footer.html](./src/html/footer.html) and [config/footer.config.js](./config/footer.config.js) files.

## Asset Management

You can add icons and images in the [static](./static/) folder.

- Add icons in the `icon` sub-folder, using this pattern: `icon_name.svg`.
- Add images in the `image` sub-folder, using this pattern: `image_name.png`.

## Search

Open the [config/algolia.config.js](./config/algolia.config.js) file and specify the `apiKey` and `indexName`. Customize the search box or create a new style using the [src/assets/scss/theme.scss](./src/assets/scss/theme.scss) file.

## Custom header

If the Docusaurus version is updated, the navbar, footer and side bar could stop working. In that case, run this command to restructure the navbar:

```bash
npm run swizzle @docusaurus/theme-classic Navbar -- --eject
```

For more information, visit `https://docusaurus.io/docs/swizzling`.

Use the following environment variables to enable the navbar:

```    
DIRECTUS_URL=REPLACE_WITH_YOUR_DIRECTUS_URL
DIRECTUS_GRAPHQL_URL=REPLACE_WITH_YOUR_DIRECTUS_GRAPH_URL
DIRECTUS_TOKEN=REPLACE_WITH_YOUR_DIRECTUS_TOKEN
SITE_URL=REPLACE_WITH_YOUR_SITE_URL
ALGOLIA_SITE_APP_ID=REPLACE_WITH_YOUR_ALGOLIA_SITE_APP_ID
ALGOLIA_SITE_API_KEY=REPLACE_WITH_YOUR_ALGOLIA_SITE_API_KEY
ALGOLIA_SITE_INDEX_NAME=REPLACE_WITH_YOUR_ALGOLIA_SITE_INDEX_NAME
```

## Troubleshooting

### Debugging site data

Run the project locally and go to `http://localhost:3000/__docusaurus/debug/routes`.

### Git hooks

If Git hooks are not working, try the following:

- Install `husky` locally in the root level of the project using this command:

    ```bash
    `yarn add -D husky`
    ```

- Create new Git hooks using this command: 

    ```bash
    npx husky add .husky/pre-commit "npm run commit"
    ```

- Update the `pre-commit` module with this script:

    ```sh
    #!/bin/sh
    .  "$(dirname "$0")/_/husky.sh"
    npm run commit
    ```

- Create a new `.js` file to test the commit flow. You should be able to see the Git hooks triggering.

- Undo the test commit by using the following command:

    ```bash
    git reset --hard HEAD
    ```