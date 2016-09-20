# EAE-RP2-Defender
Remake of 1980s classic arcade game: Defender


DEVELOPMENT SETUP INSTRUCTIONS

1. Install Node.js
https://nodejs.org/en/download/

2. Install Python 3.52 or so (most recent)
https://www.python.org/downloads/

3. Install typings and typescript globally 
	a. Open command prompt
		i. npm install typings -g
		ii. npm install typescript -g

4. Download the Visual Studio Phaser Typescript Template
https://visualstudiogallery.msdn.microsoft.com/e6eeccc4-3963-4e3d-8181-77d94ae67d9a

5. Clone git project to a local directory of your choice
(From gitbash within the directory of your choice)
git clone https://github.com/briveramelo/EAE-RP2-Defender.git

TESTING INSTRUCTIONS

1. Locate the "index.html" file (in the "build" folder)

2. Open a command window within this directory.
How-to pro-tips: 
	a. Find empty space, hold shift + right click.
	b. Select "Open command window here"

3. Start a local web server with the command "py -m http.server"
	(remember when we installed python? 'py' calls a python command,
	http.server calls a function called "http.server" to start our local server,
	and -m ensures we can call the 'module', 'server', from the http script

4. Type "localhost:8000" (or whatever address your command window says it's opened to)
Into the Google Chrome address bar

5. Open chrome debug tools with Ctrl+Shft+i

6. Play the game! Test it out! Have Fun!


RULES
1. HAVE FUN!

2. Only edit .ts (typescript) files. Do not edit .js or .jsmap files.
This will cause a break in the linkage.
Typescript files are set up to generate .js files,
so editing the .js file will sever this generation pipeline

looks like everything in master is up to date