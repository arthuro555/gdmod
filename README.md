![GDMod logo](https://github.com/arthuro555/gdmod/raw/master/logo.png)

# GDMod [![Check code style and typing](https://github.com/arthuro555/gdmod/actions/workflows/code-style-and-typing.yml/badge.svg)](https://github.com/arthuro555/gdmod/actions/workflows/code-style-and-typing.yml)

A modding API for [GDevelop](https://gdevelop-app.com/) games.

> Note: This software is still in early stages, the API is not stable and may get breaking changes.  
> Disclaimer: Do not use this software on games which prohibit game code decompilation, modification etc.

## Project structure

GDMod is separated in multiple packages:
| Package | Description |
|:-------:|-------------|
| [`@gdmod/api`](https://github.com/arthuro555/gdmod/tree/master/packages/API) | A browser library that contains functions to interact with the game, load and run mods. |
| [`@gdmod/cli`](https://github.com/arthuro555/gdmod/tree/master/packages/CLI) | A command line interface to do common tasks like installing mods or patching games. |
| [`@gdmod/local-loader`](https://github.com/arthuro555/gdmod/tree/master/packages/local-loader) | A script to inject `@gdmod/api` into a local build of a game. |
| [`@gdmod/web-loader`](https://github.com/arthuro555/gdmod/tree/master/packages/web-loader) | A chrome extension to inject `@gdmod/api` into web build build of a game. |

## Contributing

### Setup

This project is separated into packages and maintained using `lerna`. To code on this repo you need `yarn`.
To setup the project run `yarn` at the root of the project, and to start the development watcher that will build the code when modified, run `yarn start`. If you are using VSCode, you can with one click on "Allow" run those automatically everytime you open the repo.

### Testing

You can run unit tests by running `yarn test` at the root of the directory. You can also test your changes by running GDMod locally via either the CLI or the Chrome extension.

### Code style

Before submitting a PR, make sure the code has been autoformatted with prettier. You can do so by running `yarn format` at the root of the repository.

## Useful links

- [Installation instructions](https://github.com/arthuro555/gdmod/wiki/Installation-Guide)
- [API documentation](https://arthuro555.github.io/gdmod/).

## FAQ

Q: What is a mod?  
A: A mod is like an unofficial extension, it is community written code that modifies parts of a game.

Q: Do I need to code to make mods with GDMod?  
A: It depends. If you want to do any logic (e.g. what you would do with events in GDevelop), yes, you will have to write JavaScript.
For more trivial tasks (e.g. replacing resources), you can do it in most cases codeless.

## Discord community

You can join the [GDMod discord server](https://discord.com/invite/TeBdMf3Sh9) to get help or talk with the community.
