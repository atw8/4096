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

var GameView = function(parentNode, maxParentNodeSize, board){
    this.parentNode = parentNode;
    this.maxParentNodeSize = maxParentNodeSize;
    this.parentSize = maxParentNodeSize;
    
    this.width = board.width;
    this.height = board.height;
    
    
    this.arr = [];
    for (let x = 0; x < this.width; x++) {
        this.arr.push([]);
        this.arr[x].push(new Array(this.height));
    }
    
    this.init(board);
};

GameView.prototype.init = function(board){
    //Update the size of the pareentNode
    let tileWidth = this.maxParentNodeSize.width/this.width;
    let tileHeight = this.maxParentNodeSize.height/this.height;
    let tileMin = Math.min(tileWidth, tileHeight);
    this.parentSize.width = tileMin*this.width;
    this.parentSize.height = tileMin*this.height;
    this.parentNode.style.width = this.parentSize.width + "px";
    this.parentNode.style.height = this.parentSize.height + "px";
    
    
    
    this.parentNode.innerHTML = "";
    
    for(let x = 0; x < this.width; x++){
        for(let y = 0; y < this.height; y++){
            let tile = this.createTile(x, y, board);
            this.parentNode.appendChild(tile);
        }
    }
    
    
    this.renderAllIndexTiles(board);
    
};

GameView.prototype.renderAllIndexTiles = function(board){
    for(let x = 0; x < this.width; x++){
        for(let y = 0; y < this.height; y++){
            if(board.getBoardSquare(x, y) > 0){
                this.renderIndexTile(x, y, board);
            }
        }
    }
};

GameView.prototype.renderIndexTile = function(x, y, board){
    let innerTile = document.createElement("div");
    innerTile.setAttribute("class", "tileInner");
    
    let tileSize = this.getTileInnerSize();
    let tilePosition = this.getTileInnerPosition(x, y);
    
    innerTile.style.width = tileSize.width + "px";
    innerTile.style.height = tileSize.height + "px";
    
    innerTile.style.top = tilePosition.top + "px";
    innerTile.style.left = tilePosition.left + "px";
    
    let index = board.getBoardSquare(x, y);
    innerTile.style.backgroundColor = this.getIndexTileColor(index);
    innerTile.innerHTML = this.getIndexTileNumber(index);
    this.parentNode.appendChild(innerTile);
    
};

GameView.prototype.getIndexTileNumber = function(index){
    let number = Math.pow(3, index - 1);
    
    return number;
};

GameView.prototype.getIndexTileColor = function(index){
    let backgroundColor;
    
    if(index < 0){
        backgroundColor = "white";
    }else {
        switch(index){
            case 0:
                backgroundColor = "rgb(205, 193, 180)";
                break;
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


GameView.prototype.createTile = function(x, y, board){
    let tile = document.createElement("div");  
    
    let tileSize = this.getTileSize();
    let tilePosition = this.getTilePosition(x, y);
    
    tile.style.width = tileSize.width + "px";
    tile.style.height = tileSize.height + "px";
    tile.style.top = tilePosition.top + "px";
    tile.style.left = tilePosition.left + "px";
    
    //let backgroundColor = this.getTileColor(index);
    
    tile.setAttribute("class", "tile");
    
    
    
    
    
    let isSquareTop = true;
    if(0 === y || board.getBoardSquare(x, y - 1) < 0){
        isSquareTop = false;
    }
    let isSquareBottom = true;
    if(this.height - 1 === y || board.getBoardSquare(x, y + 1) < 0){
        isSquareBottom = false;
    }
    let isSquareLeft = true;
    if(0 === x || board.getBoardSquare(x - 1, y) < 0){
        isSquareLeft = false;
    }
    
    let isSquareRight = true;
    if(this.width - 1 === x || board.getBoardSquare(x + 1, y) < 0){
        isSquareRight = false;
    }
    
    
    //Deal with the border radius  
    let borderRadius = 6;
    
    if(board.getBoardSquare(x, y) < 0){
        //Add the topRightCrap

        let topRightCrap = document.createElement("div");
        {
            topRightCrap.setAttribute("class", "tileEmptyTopRight");

            topRightCrap.style.width = tileSize.width / 2 - borderRadius + "px";
            topRightCrap.style.height = tileSize.height / 2 - borderRadius + "px";

            topRightCrap.style.borderTopWidth = borderRadius + "px";
            topRightCrap.style.borderRightWidth = borderRadius + "px";

            if (isSquareTop && isSquareRight && board.getBoardSquare(x + 1, y - 1) >= 0) {
                topRightCrap.style.borderTopRightRadius = borderRadius + "px";
            }
            tile.appendChild(topRightCrap);          
        }

        
        //Add the topLeftCrap
        let topLeftCrap = document.createElement("div");
        {
            topLeftCrap.setAttribute("class", "tileEmptyTopLeft");

            topLeftCrap.style.width = tileSize.width / 2 - borderRadius + "px";
            topLeftCrap.style.height = tileSize.height / 2 - borderRadius + "px";

            topLeftCrap.style.borderTopWidth = borderRadius + "px";
            topLeftCrap.style.borderLeftWidth = borderRadius + "px";


            if (isSquareTop && isSquareLeft && board.getBoardSquare(x - 1, y - 1) >= 0) {
                topLeftCrap.style.borderTopLeftRadius = borderRadius + "px";
            }
            tile.appendChild(topLeftCrap);      
        }

        //Add the bottomRightCrap
        
        let bottomRightCrap = document.createElement("div");
        {
            bottomRightCrap.setAttribute("class", "tileEmptyBottomRight");

            bottomRightCrap.style.width = tileSize.width / 2 - borderRadius + "px";
            bottomRightCrap.style.height = tileSize.height / 2 - borderRadius + "px";

            bottomRightCrap.style.borderBottomWidth = borderRadius + "px";
            bottomRightCrap.style.borderRightWidth = borderRadius + "px";

            if (isSquareBottom && isSquareRight && board.getBoardSquare(x + 1, y + 1) >= 0) {
                bottomRightCrap.style.borderBottomRightRadius = borderRadius + "px";
            }
           tile.appendChild(bottomRightCrap);
        }   
        
        let bottomLeftCrap = document.createElement("div");
        {
            bottomLeftCrap.setAttribute("class", "tileEmptyBottomLeft");

            bottomLeftCrap.style.width = tileSize.width / 2 - borderRadius + "px";
            bottomLeftCrap.style.height = tileSize.height / 2 - borderRadius + "px";

            bottomLeftCrap.style.borderBottomWidth = borderRadius + "px";
            bottomLeftCrap.style.borderLeftWidth = borderRadius + "px";

            if (isSquareBottom && isSquareLeft && board.getBoardSquare(x - 1, y + 1) >= 0) {
                bottomLeftCrap.style.borderBottomLeftRadius = borderRadius + "px";
            }
            tile.appendChild(bottomLeftCrap);
        }    
        
        
        
    }else {


        //deal with the border-radius;
        if(!isSquareTop && !isSquareLeft){
            tile.style.borderTopLeftRadius = borderRadius + "px";
        }
        if(!isSquareTop && !isSquareRight){
            tile.style.borderTopRightRadius = borderRadius + "px";
        }
        if(!isSquareBottom && !isSquareLeft){
            tile.style.borderBottomLeftRadius = borderRadius + "px";
        }
        if(!isSquareBottom && !isSquareRight){
            tile.style.borderBottomRightRadius = borderRadius + "px";
        }
    }    
  
    
    return tile;

};



GameView.prototype.getTileInnerSize = function(){
    let tileInnerSize = this.getTileSize();
    tileInnerSize.width *= 0.8;
    tileInnerSize.height *= 0.8;
    
    return tileInnerSize;
};

GameView.prototype.getTileSize = function(){
    
    let tileSize = {};
    tileSize.width = ((this.parentSize.width) / this.width);
    tileSize.height = ((this.parentSize.height) / this.height);
    
    return tileSize;
};

GameView.prototype.getTileInnerPosition = function(x, y){
    let tileSize = this.getTileSize();
    let tileInnerSize = this.getTileInnerSize();
    
    
    let tilePosition = {};
    {
        let xBegin = (tileSize.width - tileInnerSize.width)/2;
        let xEnd = this.parentSize.width - tileInnerSize.width - (tileSize.width - tileInnerSize.width)/2;
        
        if(1 === this.width){
            tilePosition.left = (xBegin + xEnd)/2;
        }else {
            let xIncrement = x/(this.width - 1);
            tilePosition.left = (xBegin + (xEnd - xBegin)*xIncrement);    
        }

        
        
        let yBegin = (tileSize.height - tileInnerSize.height)/2;
        let yEnd = this.parentSize.height - tileInnerSize.height - (tileSize.height - tileInnerSize.height)/2;
        
        if(1 === this.height){
            tilePosition.top = (yBegin + yEnd)/2;
        }else {
            let yIncrement = y/(this.height - 1);
            tilePosition.top = (yBegin + (yEnd - xBegin)*(yIncrement));    
        }
    }
    
    return tilePosition;
};


GameView.prototype.getTilePosition = function(x, y){
    let tileSize = this.getTileSize();

    
    let tilePosition = {};
    {
        let xBegin = 0;
        let xEnd = this.parentSize.width - tileSize.width;
        
        if(1 === this.width){
            tilePosition.left = (xBegin + xEnd)/2;
        }else {
            let xIncrement = x/(this.width - 1);
            tilePosition.left = (xBegin + (xEnd - xBegin)*xIncrement);    
        }

        
        
        let yBegin = 0;
        let yEnd = this.parentSize.height - tileSize.height - 0;
        
        if(1 === this.height){
            tilePosition.top = (yBegin + yEnd)/2;
        }else {
            let yIncrement = y/(this.height - 1);
            tilePosition.top = (yBegin + (yEnd - xBegin)*(yIncrement));    
        }
    }
    
    return tilePosition;
};


