# Casper Network Documentation

## Overview

Welcome to the documentation website for the [Casper Network](https://casper.network/). The documentation lives at this address: https://docs.casperlabs.io/docs.

## Setup

Follow these steps to run the documentation website locally, displayed in your localhost at http://localhost:3000/.

### Pre-requisites

-   Install a code editor, such as Visual Studio Code (`vscode`). You may also want to install editing extensions such as `prettier`, `eslint`, and others listed in the `.vscode/extensions.json` file.
-   Install [Node.js](https://nodejs.org/en/download/) (version 14+).
-   Install `yarn` via `npm` using this command:

    ```
        npm install --global yarn
    ```

### Running the website locally

1. Create a fork of the documentation repository: https://github.com/casper-network/docs/.
2. Clone the fork on your machine.
2. In the forked folder, run the following commands:
    - `yarn install` - This is required only once for a folder
    - `yarn run start` - This will start the localhost server
3. Access http://localhost:3000/ in your browser.
4. See the next section for details on how to [update the content](#updating-existing-content).

### Updating existing content

1. Navigate to the `source/docs/casper` folder.
2. Find the content you want to update and modify the markdown file(s). If you want to add new content, read the [Developer Guide](#developer-guide).
3. [Run the website locally](#running-the-website-locally) to test your changes.
4. Submit changes to the [documentation](https://github.com/casper-network/docs) using a pull request from your forked repository.

**Note**: The website refreshes as you make changes to the markdown files. However, if you change the structure or configuration of the website, you need to re-start the application.

### Adding new content

Adding new content requires structural changes, so read the [Developer Guide](#developer-guide) below.

---

## Developer Guide

If you want to add new content or make structural updates to the documentation, follow this guide.

### Technology Stack

This documentation website uses the following infrastructure:

-   Docusaurus (2.0.0-beta.4)
-   React (17.0.1)
-   Node (>12)

### Project Architecture

The table below shows you the main structure of the documentation framework.

| Folder/File          | Description                               |
| -------------------- | ----------------------------------------- |
| .circleci            | CI/CD pipeline module                     |
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

### Project Deployment

-   Build the project with `yarn build`.
-   Host the project locally using `yarn serve`.

### Additional `yarn` Commands

You might find these commands useful:

-   `yarn start` - Run the project in dev mode
-   `yarn build` - Build the project pages
-   `yarn swizzle` - Eject a Docusaurus core source component to customize it. Do not eject all components; eject a specific component by adding parameters to this command
-   `yarn deploy` - Deploy your Docusaurus project using GitHub hosting
-   `yarn clear` - Remove previous builds
-   `yarn serve` - Host the project
-   `yarn write-translations` - Generate translation modules automatically from pages
-   `yarn write-heading-ids` -Generate translation modules automatically from pages
-   `yarn crowdin:sync` - Build, upload, and download translation modules
-   `yarn run:prettier` - Format the code base
-   `yarn run:eslint` - Check the code style based on eslint
-   `yarn format` - Run `prettier` and `lint` in sequence
-   `yarn reinstall` - Reinstall all `npm` packages
-   `yarn prepare` - This is an internal command for `husky` install; you do not need to run this command because it is included in `yarn install`
-   `yarn commit` - Internal command for `lint-stage`. This command is included in pre-commit hooks, so you do not need to run this command but we include this here for visibility

### Page Development

-   To create a new document, add an `md` or `mdx` file in the [docs/casper](https://github.com/casper-network/docs-app/tree/main/source/docs/casper) directory. Page routing will depend on page hierarchy unless you specify the routing configuration in the `config` folder.
-   To create a blog page, add an `md` or `mdx` file in the [blog](https://github.com/casper-network/docs-app/tree/main/source/blog) directory.
-   To create React pages, follow the pattern in the [src/page](https://github.com/casper-network/docs-app/tree/main/src/pages) directory.

### Component Development

-   Create reusable components in the `src/components` directory based on their purpose.
-   Define or declare the necessary types in the component or in the `src/types` directory.
-   Follow the pattern from the [Background](https://github.com/casper-network/docs-app/tree/main/src/components/atoms/Background) or [Hero](https://github.com/casper-network/docs-app/tree/main/src/components/containers/Hero) components.

### Sidebar, Footer, and Navbar Development

To add or update a sidebar:

-   Open the `config/sidebar.config.js` file.
-   To add a new directory or file in the sidebar, update the `module.exports` structure.
-   Note that item hierarchy depends on the order in which you list the items in this file.

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

To create or update a navbar, open and update the `config/navbar.config.js` file. Note that item hierarchy depends on the item order in this file. For example, if you want to create a navbar called `Staking`, add the following property in the `module.exports` structure:

    ```javascript
        {
          to: `${routePrefix}/staking`,
          activeBasePath: `${routePrefix}/staking`,
          label: "Staking",
          position: "left",
        },
    ```

To create or update a footer, open the `config/footer.config.js` file. Note that item hierarchy depends on the item order in this file. For example, assuming you want to add an item called `Style Guide`, add the following property:

    ```javascript
        title: 'Docs',
        items: [
        {
          label: 'Style Guide',
          to: 'docs/',
        },
    ```

### Theme Development

To create new theme, add a variable in this file: `src/assets/theme/variable.scss` and a theme class in this file: `src/assets/theme/theme.scss`.

To change an existing theme, modify the `config/color.config.js` file.

### Localization Development

-   If you have made changes in the navbar, footer, or sidebar, remove the files that contain changed keys. Otherwise, you can skip this step.
-   Run the `yarn run:i18n` script to tag content updates that need localization.
-   Open the `config/i18n.config.js` file to change the default language or add more languages. You can customize the `scripts/setup-i18n-json.sh` and `setup-i18n-md.sh` modules to add more localization scripts.
-   Next, replace the `crowdin.yml` file, or insert the Crowdin API key (CROWDIN_PERSONAL_ACCESS_TOKEN) into the `.env` file. Then run `yarn run:crowdin` to update the translated files using Crowdin.

### reStructuredText to Markdown Conversion

To migrate reStructuredText (.rst) files to markdown (.md) files, follow these steps:

-   Add new .rst documents into the `docs` directory.
-   Run `yarn run:migrate`.
-   Check that the .rst documents were converted to .md files.
-   Remove the original .rst files.

For more information, reference the `scripts/rst-to-md.sh` script.

### HTML Code Injection

For embedding HTML, follow the example in the `src/html/footer.html` and `config/footer.config.js` files.

### Asset Management

You can add icons and images in the [static](https://github.com/casper-network/docs-app/tree/main/static) folder:

-   Add icons in the `icon` sub-folder, using this pattern: `icon_name.svg`.
-   Add images in the `image` sub-folder, using this pattern: `image_name.png`.

### Search

Open the `config/algolia.config.js` file and replace the `api_key`, `index_name`. Customize the search box or create a new style using the `src/assets/scss/theme.scss` file.

---

## Troubleshooting

### Error: ERR_OSSL_EVP_UNSUPPORTED on yarn run start:

If you get the following error, when starting the instance using Node v17:

```bash
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:67:19)
    at Object.createHash (node:crypto:130:10)
    at BulkUpdateDecorator.hashFactory (/home/vagrant/docs-app/node_modules/webpack/lib/util/createHash.js:145:18)
    at BulkUpdateDecorator.update (/home/vagrant/docs-app/node_modules/webpack/lib/util/createHash.js:46:50)
    at OriginalSource.updateHash (/home/vagrant/docs-app/node_modules/webpack/node_modules/webpack-sources/lib/OriginalSource.js:138:8)
    at NormalModule._initBuildHash (/home/vagrant/docs-app/node_modules/webpack/lib/NormalModule.js:870:17)
    at handleParseResult (/home/vagrant/docs-app/node_modules/webpack/lib/NormalModule.js:936:10)
    at /home/vagrant/docs-app/node_modules/webpack/lib/NormalModule.js:1028:4
    at processResult (/home/vagrant/docs-app/node_modules/webpack/lib/NormalModule.js:745:11)
    at /home/vagrant/docs-app/node_modules/webpack/lib/NormalModule.js:809:5
    at /home/vagrant/docs-app/node_modules/loader-runner/lib/LoaderRunner.js:406:3
    at iterateNormalLoaders (/home/vagrant/docs-app/node_modules/loader-runner/lib/LoaderRunner.js:232:10)
    at Array.<anonymous> (/home/vagrant/docs-app/node_modules/loader-runner/lib/LoaderRunner.js:223:4)
    at runCallbacks (/home/vagrant/docs-app/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:27:15)
    at /home/vagrant/docs-app/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:200:4
    at /home/vagrant/docs-app/node_modules/graceful-fs/graceful-fs.js:123:16 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}
Node.js v17.1.0
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

This is a [known issue on Docusaurus side](https://github.com/facebook/docusaurus/issues/5778) which has been closed.

There is a workaround which consists on setting an environment variable before running the command or in your shell/system environment:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

This issue will be fixed when the version of Docusaurus used in this repo gets updated at least to the version [v2.0.0-beta.9](https://github.com/facebook/docusaurus/releases/tag/v2.0.0-beta.9 ) where the [feature which fixes this bug](https://github.com/facebook/docusaurus/pull/5814) is released.

### Debugging Site Data

Run the project locally and go to `http://localhost:3000/__docusaurus/debug/routes`.

### Git hooks are not working

-   Install husky locally in the root level of the project using this command: `yarn add -D husky`.
-   Create new git hooks using this command: `npx husky add .husky/pre-commit "npm run commit"`.
-   Update the `pre-commit` module with this script:

    ```sh
    #!/bin/sh
    .  "$(dirname "$0")/_/husky.sh"
    npm run commit
    ```

-   Create a new .js file to test the commit flow. You should be able to see the Git hooks triggering.
-   Undo the test commit by using `git reset --hard HEAD`.
