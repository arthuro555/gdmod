# gdmod
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/arthuro555)  
A modding API for GDevelop games  
*Installation instructions on [the wiki](https://github.com/arthuro555/gdmod/wiki)*

**THIS SOFTWARE IS STILL A WIP, SOME FEATURES MIGHT NOT WORK!**

**Do NOT** use this on games which require accepting a license/terms of service prohibiting game code decompilation, modification or anything related to it.

## Structure of the project
This project is separated into 4 Modules.
1. **The API module**.  
  It is an API injected into the game and contains some basic APIs to manipulate the game.
  If you are interested to make a game which might need mods (needs to be modded) , fork this repo and add APIs specific to your game here for a better experience while modding.
  
2. **The CLI module**.  
  This is a cli to manage/install mods and the loader in a GDevelop game.
  Although the GUI is recommended, as it is same and easier to use! The CLI will always be maintained though as it is lightweight and runs on more devices than the GUI (a CI for example).

3. **The GUI module**.  
  This is contains an electron application with the feaures of the cli tool. It will probably be built on top of the CLI module.

4. **The Loader module**.  
  It is the part that injects the API and mods into the game and applies patches to the game engine to enable modding.
