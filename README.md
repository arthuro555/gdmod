# gdmod
A modding API for GDevelop games  
*Installation instructions on [the wiki](https://github.com/arthuro555/gdmod/wiki)*

THIS SOFTWARE IS STILL A WIP, SOME FEATURES MIGHT NOT WORK!

Do NOT use this on games who requires accepting a lisence prohibiting game code decompilation, modification or anything like that.

## Structure of the project
This project will is separated in 4 Modules.
1. **The API module**.  
  It is an API injected into the game and contains some basic APIs to interface with the game. 
  If you are the one who makes the game that should be modded, fork this repo and add APIs specific to your game here for a better modding experience.
  
2. **The CLI module**.  
  This is a cli to manage/install mods and the loader in a GDevelop game.
  You should better use the GUI, as it is the same but easier to use. This will always be maintained tho as it is lightweight and runs on potentially more devices than the GUI (a CI for example).
  
3. **The GUI module**.  
  This is contain an electron application with the feaures of the cli tool. Will probably be built on top of the CLI module.

4. **The Loader module**.  
  It is the part that injects the API and mods into the game and apply patches to the game engine to enable modding.
