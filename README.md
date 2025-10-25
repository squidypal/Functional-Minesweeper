


### PG29 Evelyn Intro to Programming in HTML5 & JavaScript A3
----------
`.libraries/gameEngine.js` handles the majority of heavy lifting code:
- The `Cell` class, and its functions.
- The `Board` class, which initializes the core game, as well as places the mines.
- All user functions such as reveal a cell, flagging a cell, etc

`./app.js` Is a simpler script using querySelector to set up our user input as well as starting the game initially. 
`./app.js` Also handles the win and lose functions

`./index.html` Incredibly short html script holding only the core 'visuals' of the app

`./style.css` Rather large css file with a strong emphasis on making the site feel very modern, I added animations to buttons and used dull colours to make it look like your everyday 'tech-bro' website
#### Animation code (also used outside of just face):
```js
    .face {
    transition: transform 0.1s ease;
    }

    .face:hover {
    transform: scale(1.1);
    }

    .face:active {
    transform: scale(0.95);
    }
```

#### Download/Install
---------
- Download source code
- If using webstorm simply click on the index .html and click the browser icon
- If not using webstorm, run a server in the folder of the repo
- Go to provided IP address

#### How to use
--------
- Simple click / right click a tile to play
- To reset the game click the face in the top right
