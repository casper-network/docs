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

## PROJECT HIERARCHY

```
----| mcms-docusaurus
----|----.docusaurus (docusaurus cache dir)
----|----.github  (github documentation)
----|----.husky.  (pre-commit hook module)
----|----blog (blog page dir)
----|----config (site & all dynamic customized configuration)
----|----docs  (doc page dir)
----------|----api
----------|----crate
----------|----developer
----------|----integration
----------|----sdk
----------|----user
----|----i18n (localization dir)
----------|----en
----|----src (react source code)
----------|----assets
----------|----components
----------|----mocks (mocks data dir)
----------|----pages
----------|----utils
----|----static (static file dir)
----|----types (global type definition dir)
----|----.env (credential file)
----|----.eslintrc (eslint configuration)
----|----.crowdin.yml (crowdin pipeline)
----|----.docusaurus.config.js (docusaurus configuration)
----|----.prettierrc (code style formatter)
```

---

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
