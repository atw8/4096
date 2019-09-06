/* 
 * Copyright (C) 2016 Dmitry Ivanov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


"use strict";

var GameManager = function(model, gameView, background){
    this.model = model;
    this.gameView = gameView;
    this.background = background;
    

    
    
    this.actions = [];

    this.DIR = { UND: -1, MOVE :1, RESTART: 11, UNDO: 12};
    
            
    //this.keydownBind = this.keydown.bind(this);    
    //document.addEventListener("keydown", this.keydownBind, false);
    
    
    let restartButton = document.getElementById("gameMessageRetry");
    restartButton.onclick = this.restart.bind(this);
    
    let restartButton2 = document.getElementById("bottomRetry");
    restartButton2.onclick = this.restart.bind(this);
    
    let undoButton = document.getElementById("bottomUndo");
    undoButton.onclick = this.undo.bind(this);
    
    //Add the resize event
    window.addEventListener("resize", this.resize.bind(this), false);
    
    this.gameLoopBind = this.gameLoop.bind(this);
    this.gameLoopBind();
    
    
    let designerButton = document.getElementById("bottomDesigner");
    designerButton.onclick = this.designer.bind(this);
    
    
    
    
    this.touchBegan = {};
    this.touchEnded = {};

    document.addEventListener("touchstart", this.onTouchBegan.bind(this));
    document.addEventListener("touchend", this.onTouchEnded.bind(this));
    
    document.addEventListener("mousedown", this.onMouseBegan.bind(this));
    document.addEventListener("mouseup", this.onMouseEnded.bind(this));
};

GameManager.prototype.onMouseBegan = function(event){
    this.touchBegan.x = event.clientX;
    this.touchBegan.y = event.clientY;
    
    event.preventDefault();
};


GameManager.prototype.onMouseEnded = function(event){
    this.touchEnded.x = event.clientX;
    this.touchEnded.y = event.clientY;
    
    this.touchHelper();
    
    event.preventDefault();
};



GameManager.prototype.onTouchBegan = function(event){
    // Ignore if touching with more than 1 finger
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches.length > 1) {
        return;
    }
    
    this.touchBegan.x = event.touches[0].clientX;
    this.touchBegan.y = event.touches[0].clientY;
    
};


GameManager.prototype.onTouchEnded = function(event){
    // Ignore if touching with more than 1 finger
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches.length > 1) {
        return;
    }
    
    this.touchEnded.x = event.changedTouches[0].clientX;
    this.touchEnded.y = event.changedTouches[0].clientY;

    this.touchHelper();
    
};

GameManager.prototype.touchHelper = function(){
    let dx = this.touchEnded.x - this.touchBegan.x;
    let dy = this.touchEnded.y - this.touchBegan.y;
    

    
    function getMoveDirectionConstant(direction, dx, dy){
        let multiplier = 0;
        if(direction.x*dx > 0){
            multiplier = dx/direction.x;
        }else if(direction.y*dy > 0){
            multiplier = dy/direction.y;
        }
        
        return Math.abs(multiplier*direction.x - dx) + Math.abs(multiplier*direction.y - dy);
    }
    
    let dist = Math.pow(dx,2) + Math.pow(dy, 2);
    if(dist > 1){ // some constant
        let directions = getDefaultDirections();
        
        let moveDirection = directions[0];
        let moveDirectionConstant = getMoveDirectionConstant(directions[0], dx, dy);
        
        for(let i = 1; i < directions.length; i++){
            let direction = directions[i];
            let directionConstant = getMoveDirectionConstant(direction, dx, dy);
            
            if(directionConstant < moveDirectionConstant){
                moveDirection = direction;
                moveDirectionConstant = directionConstant;
            }
        }
        
        let action = {};
        action.dir = this.DIR.MOVE;
        action.moveDirection = moveDirection;
        
        this.actions.push(action);
    }
};

GameManager.prototype.designer = function(event){
    location.href = "designer.html";
};

GameManager.prototype.resize = function(event){
    this.background.setBoard(this.model.getBoard(), getMaxParentNodeSize());
    this.gameView.update(this.model.getBoard(), false, this.model.getScore(), this.model.getBestScore(), this.model.canUndo());

};

GameManager.prototype.keydown = function (event) {
    return;
    
    let dir = this.DIR.UND;
    let moveDirection = {};
    moveDirection.x = 0;
    moveDirection.y = 0;

    if (undefined === event.key) {
        switch (event.which) {
            case 40: //Down
                dir = this.DIR.MOVE;
                moveDirection.x = 0;
                moveDirection.y = 1;
                break;
            case 38: //Up
                dir = this.DIR.MOVE;
                moveDirection.x = 0;
                moveDirection.y = -1;
                break;
            case 37: //LEFT
                dir = this.DIR.MOVE;
                moveDirection.x = -1;
                moveDirection.y = 0;
                break;
            case 39: //RIGHT
                dir = this.DIR.MOVE;
                moveDirection.x = 1;
                moveDirection.y = -1;
                break;
        }
    } else {
        switch (event.key) {
            case "Down":
            case "ArrowDown":
                dir = this.DIR.MOVE;
                moveDirection.x = 0;
                moveDirection.y = 1;
                break;
            case "Up":
            case "ArrowUp":
                dir = this.DIR.MOVE;
                moveDirection.x = 0;
                moveDirection.y = -1;
                break;
            case "Left":
            case "ArrowLeft":
                dir = this.DIR.MOVE;
                moveDirection.x = -1;
                moveDirection.y = 0;
                break;
            case "Right":
            case "ArrowRight":
                dir = this.DIR.MOVE;
                moveDirection.x = 1;
                moveDirection.y = 0;
                break;
        }


    }
    
    if (dir !== this.DIR.UND) {
        event.preventDefault();
        let action = {};
        action.dir = dir;
        action.moveDirection = moveDirection;

        this.actions.push(action);
    }
};


GameManager.prototype.gameLoop = function(){
    let updateGameView = false;
    let showAnimation = true;
    while(this.actions.length !== 0){
        
        
        let action = this.actions.shift();
        
        switch(action.dir){
            case this.DIR.MOVE:
                let moveDirection = action.moveDirection;
                if(this.model.canMoveDirection(moveDirection)){
                    this.model.moveDirection(moveDirection);
                    updateGameView = true;
                }

                break;
            case this.DIR.RESTART:
                this.model.restart();
                updateGameView = true;
                break;
            case this.DIR.UNDO:
                this.model.undo();
                showAnimation = false;
                updateGameView = true;
                break;
        }
    }  
    
    
    if(updateGameView){
        this.gameView.update(this.model.getBoard(), showAnimation, this.model.getScore(), this.model.getBestScore(), this.model.canUndo());
    }
    
    requestAnimationFrame(this.gameLoopBind);
};

GameManager.prototype.restart = function(event){
    let action = {};
    action.dir = this.DIR.RESTART;
    this.actions.push(action);
    
    event.preventDefault();
};

GameManager.prototype.undo = function(event){
    let action = {};
    action.dir = this.DIR.UNDO;
    this.actions.push(action);
    
    event.preventDefault();
};