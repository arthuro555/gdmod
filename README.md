# gdmod
A modding API for GDevelop games

THIS SOFTWARE IS STILL A WIP, DO NOT USE IT YET!

Do NOT use this on games who requires accepting a lisence prohibiting game code decompilation, modification or anything like that.

## Structure of the project
This project will be separated in 3 Modules.
1. **The API module**.<br/>
  It will be the part that will be injected into the game (The loader) and contains the API to interface with the game. 
  If you are the one who makes the game that should be modded, fork this repo and add APIs specific to your game for a better modding experience.
  Documentation will be added in the wiki tab.
  
2. **The cli module**.<br/>
  This will contain a cli to manage mods and the loader in a moddable game.
  Most people won't use it because and prefer using the GUI. This will be the one that should be used though as it will be the most supported one as CLIs can run almost anywhere unlike GUIs.
  
3. **The GUI module**.<br/>
  This will contain an electron application with the feaures of the cli tool. Will probably be built on top of the CLI module.

This structure will probably change in the future.
