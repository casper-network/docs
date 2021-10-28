# MCMS-DOCUSAURUS

## OVERVIEW

**mcms-docusaurus** is the documentation website for casper network

---

## TECH STACK

-   Docusaurus (2.0.0-beta.4)
-   React (17.0.1)
-   Node (>12)

---

## COMMANDS

**start** - run the project in dev mode

**build** - build the project pages

**swizzle** - eject docusaurus core source components to customize it. (Do not eject all component, you are supposed to eject some specific component only to add params at the end of command)

**deploy** - deploy docusaurus project using github hosting

**clear** - remove all built source of docusaurus

**serve** - host project based on built source

**write-translations** - generate translation modules automatically from pages

**write-heading-ids** - generate translation modules automatically from pages

**crowdin:sync** - build/upload/download translation modules thru crowdin cloud side

**run:prettier** - format codebase based on prettier

**run:eslint** - check code style based on eslint

**format** - run `prettier`, `lint` checking in sequence

**reinstall** - reinstall all npm packages

**prepare** - internal command for husky install (Don't need to run this command manually, usually, it will be run automatically when running `yarn install`)

**commit** - lint-stage internal command (Don't need to run this command manually, usually, it will be run automatically by pre-commit hooks)

---

## SETUP ENVIRONMENT

-   Install following global libraries: `npm`
-   Install following editor, applications: `vscode`
-   Install following `vs-code` extensions: `prettier`, `eslint`, and those one that listed in `.vscode/extensions.json`
-   Install npm packages using `yarn` command in the root level of project (`mcms-docusaurus`)
-   Run the project using `yarn start` command in the root level of project (`mcms-docusaurus`)
-   Start the build process

---

## Run Docusaurus in Localhost

### Pre-requisites

-   Install node js - [node js download page](https://nodejs.org/en/download/)
-   Install yarn via npm --> -`npm install --global yarn`

### Steps to Start

1. Clone the `docs-app` repository https://github.com/casper-network/casper-node/docs-app to your local machine
2. Go to the cloned `docs-app` directory
3. Run the following commands:
    - `yarn install` - This is required only once for a folder
    - `yarn run start` - This will start the localhost server
4. Access http://localhost:3000/ in your browser

## Project Architecture

Project Architecture Setup main structure of Docusaurus framework and extended some parts

| folder/file          | description                              |
| -------------------- | ---------------------------------------- |
| .circlec             | CI/CD pipeline module                    |
| .docusaurus          | Docusaurus default configuration module  |
| .github              | Github module                            |
| .husky               | Husky script module                      |
| .vscode              | vscode editor configuration              |
| blog                 | Blog page module                         |
| build                | Docusaurus build packages                |
| config               | Docusaurus detaied configuration modules |
| docs                 | Docs page module                         |
| i18n                 | Localization packages                    |
| scripts              | Bash script module                       |
| src / assets         | Asset modules (style / image / icons)    |
| src / components     | Component module                         |
| src / html           | HTML codebase                            |
| src / mocks          | Mocks data module                        |
| src / pages          | React page module                        |
| src / utils          | Utility module                           |
| static               | Static modules (image / icons)           |
| types                | Type interface definition part           |
| .env                 | Environment variables                    |
| .eslintrc            | Eslint configuration                     |
| .prettierrc          | Prettier configuration                   |
| .textlintrc          | Text lint configuration                  |
| Babel.config.js      | Babel configuration                      |
| Crowdin.yml          | Crowdin configuration                    |
| Docusaurus.config.js | Docusaurus configuration                 |
| package.json         | NPM package list                         |
| Tsconfig.js          | Typescript configuration                 |
| yarn.lcok            | Package dependency graph                 |

---

## Developer Guide

### Project Setup

-   Setup node environment (more than 14.0)
-   Install node packages and setup i18n module and start in development following commands

    ```bash
    yarn install yarn run:i18n yarn start
    ```

### Project Deployment

-   Build project by using `yarn build` command and serve it locally using `yarn serve`

### Development Guide

#### Page Development

-   Create React page
    -   Create target_page_name directory `target_page_name.jsx` and `target_page_name.scss`
    -   Follow the codebase pattern from `Demo`, `Home` page codebase
-   Create blog page
    -   Create `target_page_name.md` or `mdx` file in `blog` directory
-   Create docs page
    -   Create `target_page_name.md` or `mdx` file in `docs` directory
    -   Page routing will depend on page hierarchy if no any specific routing configuration

#### Component Development

-   Create reusable components in `src/components` directory based on their purpose
-   Define or declare needed type in the component file-level or src/types directory
-   Follow the codebase pattern from `Background`, `Hero` components codebase

#### Sidebar / Footer / Navbar Development

-   Create / update Sidebar

    -   Browser `config/sidebar.config.js`
    -   For example, assume the directory name is `workflow`, then add the following code as a property

    ```javascript
        workflow: [ "workflow/index", "workflow/staking", ],
    ```

    -   Sidebar item hierarchy will depend on their list order

-   Create / update Navbar Browser `config/sidebar.config.js`

    -   For example, assume the item name is `Staking`, then add the following code as a property

    ```javascript
        {
          to: `${routePrefix}/staking`,
          activeBasePath: `${routePrefix}/staking`,
          label: "Staking",
          position: "left",
        },
    ```

    -   Navbar item hierarchy will depend on their list order

-   Create / update Footer Browser `config/footer.config.js`

    -   For example, assume the item name is `Style Guide`, then add the following code as a property

    ```javascript
        title: 'Docs',
        items: [
        {
          label: 'Style Guide',
          to: 'docs/',
        },
    ```

    -   Navbar item hierarchy will depend on their list order

#### Theme Development

-   Create new Theme variable
    -   open `src/assets/theme/variable.scss`
-   Create new Theme class
    -   open `src/assets/theme/theme.scss`
-   Change Theme switch icon / default theme - open `config/color.config.js`

#### Localization Development

-   Remove files that contain changed keys if you have made changes in navbar/footer/sidebar, otherwise, you can skip this step
-   Run yarn run:i18n script if you have made new changes in docs or page
-   Open `config/i18n.config.js` to change default language or add more language Customize `scripts/setup-i18n-json.sh, setup-i18n-md.sh` module to update i18n scripts
-   Run `yarn run:crowdin` to sync translation working with Crowdin side after ensuring replacement of `crowdin.yml` file or insertion of Crowdin API key (CROWDIN_PERSONAL_ACCESS_TOKEN) into `.env` file

#### RST - MD Conversion

-   Add new RST documents into `docs` directory
-   Run `yarn run:migrate`
-   All RST module has been converted into `md` file and removed original files

For more information, reference `scripts/rst-to-md.sh`

#### HTML code injection

-   Open `src/html` directory and see footer.html
-   Depends on needs, you can follow the footer module code pattern `config/footer.config.js`

#### Asset Management

-   Add new icons
    -   add them `static/icons` and they wil be served `site_url/icons/icon_name.svg`
-   Add new icons
    -   add them `static/images` and they will be served `site_url/images/image_name.png`

Document Search Development Open `config/algolia.config.js` and replace api_key, index_name with yours Customize search box or form style using `src/assets/scss/theme.scss`

---

## GITHUB FLOW

This project is using mono project structure using github subtrees for the partial publication about documentation, i18n localization

-   docs-apps: docusaurus project app codebase we can use regular github `pull`/`push` command about this source
-   source: public source module that include documentation, blog, i18n localization modules This source will be synced with [this repo](https://github.com/casper-network/documentation) remotely

Git Subtree Commands

```
git subtree pull --prefix source https://github.com/casper-network/documentation main --squash
```

```
git subtree push --prefix source https://github.com/casper-network/documentation main
```

-   We are using `chore/subtree` branch as a sync branch with documentation repo.
-   For example, we are gonna `pull` new contribution changes that has been made in `master` branch of `documentation` repo, then we can use pull command in the `chore/subtree` branch of `docs-app` repo
-   This will make squash commit of making newly added commit of `master` branch of documentation repo into `chore/subtree` branch.
-   We can merge these changes into `master` branch of `docs-app`.
-   If we want to make changes into `documentation` in the `docs-app` repo directly, then you can switch into `chore/subtree` branch firstly
-   After making changes, you can make `commit`/`push` about that, and made another push using git subtree `push` command
-   in the Documentation repo, you can pull these changes in master branch.
-   In this way, these 2 repos will be synced with new changes all the time

## DEBUG DOCUSAURUS SITE DATA

run the project and go to `http://localhost:3000/__docusaurus/debug/routes`

---

## TROUBLESHOOTING

### Git husky is not working

-   Install husky locally in the root level of project using this command `yarn add -D husky`
-   Create new git hooks using this command `npx husky add .husky/pre-commit "npm run commit"`
-   Update `pre-commit` module like the following:

```sh
  #!/bin/sh
  .  "$(dirname "$0")/_/husky.sh"
  npm run commit
```

-   Create new .js file and make a test commit, you should be able to see git hooks working status
-   Undo test commit `git reset --hard HEAD`
