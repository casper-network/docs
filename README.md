# Casper Network Documentation

## Overview

Welcome to the documentation website for the [Casper Network](https://casper.network/). The documentation lives at this address: https://docs.casper.network/.

Information on writing style guidelines for documentation can be found in [CONTRIBUTE.md](./CONTRIBUTE.md).

## Setup

Follow these steps to run the documentation website locally, displayed in your localhost at http://localhost:3000/.

### Pre-requisites

-   Install a code editor, such as Visual Studio Code (`vscode`). You may also want to install editing extensions such as `prettier`, `eslint`, and others listed in the `.vscode/extensions.json` file.
-   Install [Node.js](https://nodejs.org/en/download/) (version 16.14+).
-   Install `yarn` via `npm` using this command:

    ```
        npm install --global yarn
    ```

### Running the website locally

1. Create a fork of the documentation repository in GitHub: https://github.com/casper-network/docs/.
2. Clone the fork on your machine.

    ```
    git clone https://github.com/USERNAME/docs
    ```

3. In the forked folder, run this command, which is required to run only once for a folder:

    ```
    yarn install
    ```

4. Start the localhost server:

    ```
    yarn run start
    ```

5. Access http://localhost:3000/ in your browser.

The following section details how to [update the content](#updating-existing-content).

### Updating existing content

1. Navigate to the `source/docs/casper` folder.
2. Find the content you want to update and modify the markdown file(s). If you want to add new content, read the [Developer Guide](#developer-guide).
3. [Run the website locally](#running-the-website-locally) to test your changes.
4. Submit changes to the [documentation](https://github.com/casper-network/docs) using a pull request from your forked repository.

**Note**: The website refreshes as you make changes to the markdown files. However, if you change the structure or configuration of the website, you need to re-start the application.

### Adding new content

Adding new content requires structural changes, so read the [Developer Guide](./DEVELOPERS.md).
