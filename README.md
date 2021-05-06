![GDMod logo](https://github.com/arthuro555/gdmod/raw/master/logo.png)
# GDMod [![Check code style and typing](https://github.com/arthuro555/gdmod/actions/workflows/code-style-and-typing.yml/badge.svg)](https://github.com/arthuro555/gdmod/actions/workflows/code-style-and-typing.yml)
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/arthuro555)  
A modding API for [GDevelop](https://gdevelop-app.com/) games.  

> Note: This software is still in early stages, the API is not stable and may get breaking change.  
> Disclaimer: Please do not use this on games which require prohibit game code decompilation, modification etc. 

## Structure of the project
This project is separated into 3 parts.

1. **The API**.  
  It is injected into the game by loaders and contains some basic APIs to manipulate the game and load mods.
  
2. **The CLI**.  
  This is a CLI made to install the loader in a GDevelop game, and assist with devlopping mods.

3. **The Loader module**.  
  It is the part that injects the API into a game. It is also responsible for patching the game to make it compatible with the API and to give an interface to the user to interact with the API (un/loading mods).
  
## Useful links
- [Installation instructions](https://github.com/arthuro555/gdmod/wiki/Installation-Guide)  
- [API documentation](https://arthuro555.github.io/gdmod/).  
  
## FAQ

Q: What is a mod?  
A: A mod is like an unofficial extension, it is a community written code that modifies parts of a game.

Q: Do I need to code to make mods with GDMod?  
A: It depends. If you want to do any logic (e.g. what you would do with events in GDevelop), yes, you will have tp write javascript. 
For more trivial stuff (replacing resources), you can in most cases do it codeless.

## Discord community
You can join the [GDMod discord server](https://discord.com/invite/TeBdMf3Sh9) to get help or talk with the community.
