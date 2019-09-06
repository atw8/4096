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

var GameView = function (background, parentNode, model) {
    this.background = background;
    this.parentNode = parentNode;
    
    this.messageContainer = document.querySelector(".gameMessage");
    this.scoreContainer = document.querySelector(".scoreContainer");
    this.bestContainer = document.querySelector(".bestContainer");
    
    this.undoContainer = document.querySelector(".bottomUndo");
    
    
    this.score = 0;
};



GameView.prototype.showGameMessage = function(){
    this.messageContainer.classList.add("gameMessageShow");
};

GameView.prototype.clearGameMessage = function(){
    this.messageContainer.classList.remove("gameMessageShow");
};

GameView.prototype.showBottomUndo = function(canUndo){
    let display;
    if(canUndo){
        display = "inline-block";
    }else {
        display = "none";
    }
    
    this.undoContainer.style.display = display;
};



GameView.prototype.updateScore = function(score){
    while(this.scoreContainer.firstChild){
        this.scoreContainer.removeChild(this.scoreContainer.firstChild);
    }
    
    let difference = score - this.score;
    this.score = score;
    
    this.scoreContainer.textContent = this.score;
    
    if(difference > 0){
        let addition = document.createElement("div");
        addition.classList.add("scoreAddition");
        addition.textContent = "+" + difference;
        
        this.scoreContainer.appendChild(addition);
    }    
};

GameView.prototype.updateBestScore = function(bestScore){
    this.bestContainer.textContent = bestScore;
};


GameView.prototype.update = function (board, showAnimation, score, bestScore, canUndo) {
    this.updateScore(score);
    this.updateBestScore(bestScore);
    this.showBottomUndo(canUndo);
    
    if(board.isLoose){
        this.showGameMessage();
    }else {
        this.clearGameMessage();
    }
    
    let innerTiles = document.getElementsByClassName('tileInner');
    while (innerTiles[0]) {
        innerTiles[0].parentNode.removeChild(innerTiles[0]);
    }


    let boardChanges = board.getBoardChanges();
    for(let i = 0; i < boardChanges.length; i++){
        let boardChange = boardChanges[i];      
        let innerTile = this.createInnerTile(boardChange.index, board);
        
        if(undefined !== boardChange.newOld && showAnimation){
            if(boardChange.newOld){
                innerTile.setAttribute("class", innerTile.getAttribute("class") + " " + "tileNew"); 
            }else {
                innerTile.setAttribute("class", innerTile.getAttribute("class") + " " + "tileOld");
            }
        }
        
        
        let oldPosition = this.background.getTileInnerPosition(boardChange.oldX, boardChange.oldY, board);
        let newPosition = this.background.getTileInnerPosition(boardChange.newX, boardChange.newY, board);
        
        let oldTransform = "translate(" + oldPosition.left + "px," + oldPosition.top + "px)";
        let newTransform = "translate(" + newPosition.left + "px," + newPosition.top + "px)";

        if(showAnimation){
            settransform(innerTile, oldTransform);

            window.requestAnimationFrame(function () {
                settransform(innerTile, newTransform);
            }.bind(this));  
        }else {
            settransform(innerTile, newTransform);
        }
        


       this.parentNode.appendChild(innerTile);
    }
};


GameView.prototype.createInnerTile = function (index, board) {
    let innerTile = document.createElement("div");
    //innerTile.setAttribute("class", "");

    let tileSize = this.background.getTileInnerSize(board);

    innerTile.style.width = tileSize.width + "px";
    innerTile.style.height = tileSize.height + "px";

    innerTile.style.lineHeight = tileSize.height + "px";
    innerTile.style.fontSize = Math.min(tileSize.width, tileSize.height) * 0.35 + "px";

    innerTile.style.backgroundColor = this.getInnerTileBackground(index);
    innerTile.innerHTML = getNumberForIndex(index);
    innerTile.setAttribute("class", "tileInner");

    return innerTile;
};





GameView.prototype.getInnerTileBackground = function (index) {
    let backgroundColor;

    if (index <= 0) {
        backgroundColor = "rgb(205, 193, 180)";
    } else {
        switch (index) {
            case 1:
                backgroundColor = "#eee4da";
                break;
            case 2:
                backgroundColor = "#ede0c8";
                break;
            case 3:
                backgroundColor = "#f2b179";
                break;
            case 4:
                backgroundColor = "#f59563";
                break;
            case 5:
                backgroundColor = "#f67c5f";
                break;
            case 6:
                backgroundColor = "#f65e3b";
                break;
            case 7:
                backgroundColor = "#edcf72";
                break;
            case 8:
                backgroundColor = "#edcc61";
                break;
            case 9:
                backgroundColor = "#edc850";
                break;
            case 10:
                backgroundColor = "#edc53f";
                break;
            case 11:
                backgroundColor = "#edc22e";
                break;
            default:
                backgroundColor = "#3c3a32";
                break;
        }
    }

    return backgroundColor;
};



