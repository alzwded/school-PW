school-PW
=========

programare web (teme, proiect, etc)

testat doar cu IE9 şi chromium 25

TODO
====

DONE ~~architecture change to tie an instance to its referenced scripts and csses; attach destructors / uninitializers to that thing~~

~~basically:~~
~~var scriptMap = {~~
~~	href~~
~~	script element tag~~
~~	ref count~~
~~}~~
~~~~
~~var cssMap = {~~
~~	href~~
~~	css element tag~~
~~	ref count~~
~~}~~
~~~~
~~var instanceMap = {~~
~~	id = uniqueName~~
~~	scriptHrefs = array of href of script~~
~~	cssHrefs = array of href of css~~
~~	destructors = array of js code~~
~~}~~
~~~~
~~in close widget:~~
~~	decrease ref count of referenced scripts~~
~~	if rc < 1 remove from document~~
~~	decrease ref count of referenced csses~~
~~	if rc < 1 remove from document~~
~~	call destructors~~
