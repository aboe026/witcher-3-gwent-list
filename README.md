# witcher-3-gwent-list

Enumeration of all Gwent cards from The Witcher 3: Wild Hunt

## Prerequisites

- [NodeJS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [VSCode](https://code.visualstudio.com/)

  - To enable [Editor SDK](https://yarnpkg.com/getting-started/editor-sdks), run

    ```sh
    yarn dlx @yarnpkg/sdks vscode
    ```

    Then in TypeScript file, simultaneously press

    `ctrl` + `shift` + `p`

    and choose option

    `Select TypeScript Version`

    then select value

    `Use Workspace Version`

## Install Dependencies

To install dependencies, run

```sh
yarn install
```

## Convert to JSON

To convert the `cards.xlsx` file to JSON, run:

```sh
yarn start
```

which will create a `cards.json` file

## Lint

to check code for programmatic or stylistic problems, run

```sh
yarn lint
```

To automatically fix lint problems, run

```sh
yarn lint-fix
```

## Upgrade Yarn

To upgrade the version of yarn used in the project, run

```sh
yarn set version latest
```

then [install](#install-dependencies) to have the change picked up.
