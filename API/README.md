## API

Here are the tools to load mods, and make it easier to code them.

### Extensions Loader
The extension loader hot loads GDevelop extensions, as they are not included in every game (unused ones are filtered out by export), to be able to access GDevelops full functionality inside mods.
The list of includes is generated automatically using some modifications to GDCore (to be able to access includes from javascript) and a simple script. You can find it all here: https://github.com/arthuro555/GDevelop/tree/gdmod-generate-includes-list.
