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

var Background = function(parentNode){
    this.parentNode = parentNode;
};


Background.prototype.setBoard = function(board, maxParentNodeSize, eventName, handler){
    this.maxParentNodeSize = maxParentNodeSize;
    this.parentSize = maxParentNodeSize;
    

    this.updateParentSize(board);
    
    
    
    let backs = document.getElementsByClassName('back');
    while (backs[0]) {
        backs[0].parentNode.removeChild(backs[0]);
    }
    
    let backsInner = document.getElementsByClassName("backInner");
    while(backsInner[0]){
        backsInner[0].parentNode.removeChild(backsInner[0]);
    }
        
    for(let x = 0; x < board.width; x++){
        
        for(let y = 0; y < board.height; y++){
            let tile = this.createTile(x, y, board);
            this.parentNode.appendChild(tile);
                       
            if(undefined !== eventName && undefined !== handler){
                tile.addEventListener("mouseup", handler.bind(null, x, y));
            }           
            
            if(board.getBoardSquare(x, y) >= 0){
                let innerTile = this.createInnerTile(x, y, board);
                this.parentNode.appendChild(innerTile);
                
                if(undefined !== eventName && undefined !== handler){
                    innerTile.addEventListener("mouseup", handler.bind(null, x, y));
                }    
            }
        }
    }
};

Background.prototype.updateParentSize = function(board){
    let tileWidth = this.maxParentNodeSize.width/board.width;
    let tileHeight = this.maxParentNodeSize.height/board.height;
    let tileMin = Math.min(tileWidth, tileHeight);
    this.parentSize.width = tileMin*board.width;
    this.parentSize.height = tileMin*board.height;
    this.parentNode.style.width = this.parentSize.width + "px";
    this.parentNode.style.height = this.parentSize.height + "px";
};


Background.prototype.createTile = function(x, y, board){
    let tile = document.createElement("div");  
    
    let tileSize = this.getTileSize(board);
    let tilePosition = this.getTilePosition(x, y, board);
    
    tile.style.width = tileSize.width + 1 +"px";
    tile.style.height = tileSize.height + 1 + "px";
    var cssTransform = getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
    tile.style[cssTransform] = "translate(" + tilePosition.left + "px" + "," + tilePosition.top + "px" + ")";

    
    //let backgroundColor = this.getTileColor(index);
    tile.setAttribute("class", "back");
      
    let isSquareTop = true;
    if(0 === y || board.getBoardSquare(x, y - 1) < 0){
        isSquareTop = false;
    }
    let isSquareBottom = true;
    if(board.height - 1 === y || board.getBoardSquare(x, y + 1) < 0){
        isSquareBottom = false;
    }
    let isSquareLeft = true;
    if(0 === x || board.getBoardSquare(x - 1, y) < 0){
        isSquareLeft = false;
    }
    
    let isSquareRight = true;
    if(board.width - 1 === x || board.getBoardSquare(x + 1, y) < 0){
        isSquareRight = false;
    }
    
    
    //Deal with the border radius  
    let borderRadius = 10;
    
    let multiplier = 1.9;
    
    if(board.getBoardSquare(x, y) < 0){
        //Add the topRightCrap

        let topRightCrap = document.createElement("div");
        {
            topRightCrap.setAttribute("class", "backEmptyTopRight");

            topRightCrap.style.width = multiplier*(tileSize.width / 2 - borderRadius) + "px";
            topRightCrap.style.height = multiplier*(tileSize.height / 2 - borderRadius) + "px";
            
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
            topLeftCrap.setAttribute("class", "backEmptyTopLeft");

            topLeftCrap.style.width = multiplier*(tileSize.width / 2 - borderRadius) + "px";
            topLeftCrap.style.height = multiplier*(tileSize.height / 2 - borderRadius) + "px";

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
            bottomRightCrap.setAttribute("class", "backEmptyBottomRight");

            bottomRightCrap.style.width = multiplier*(tileSize.width / 2 - borderRadius) + "px";
            bottomRightCrap.style.height = multiplier*(tileSize.height / 2 - borderRadius) + "px";

            bottomRightCrap.style.borderBottomWidth = borderRadius + "px";
            bottomRightCrap.style.borderRightWidth = borderRadius + "px";

            if (isSquareBottom && isSquareRight && board.getBoardSquare(x + 1, y + 1) >= 0) {
                bottomRightCrap.style.borderBottomRightRadius = borderRadius + "px";
            }
           tile.appendChild(bottomRightCrap);
        }   
        
        let bottomLeftCrap = document.createElement("div");
        {
            bottomLeftCrap.setAttribute("class", "backEmptyBottomLeft");

            bottomLeftCrap.style.width = multiplier*(tileSize.width / 2 - borderRadius) + "px";
            bottomLeftCrap.style.height = multiplier*(tileSize.height / 2 - borderRadius) + "px";

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


Background.prototype.getTileSize = function(board){
    
    let tileSize = {};
    tileSize.width = ((this.parentSize.width) / board.width);
    tileSize.height = ((this.parentSize.height) / board.height);
    
    return tileSize;
};


Background.prototype.getTilePosition = function(x, y, board){
    let tileSize = this.getTileSize(board);

    
    let tilePosition = {};
    {
        let xBegin = 0;
        let xEnd = this.parentSize.width - tileSize.width;
        
        if(1 === board.width){
            tilePosition.left = (xBegin + xEnd)/2;
        }else {
            let xIncrement = x/(board.width - 1);
            tilePosition.left = (xBegin + (xEnd - xBegin)*xIncrement);    
        }

        
        
        let yBegin = 0;
        let yEnd = this.parentSize.height - tileSize.height - 0;
        
        if(1 === board.height){
            tilePosition.top = (yBegin + yEnd)/2;
        }else {
            let yIncrement = y/(board.height - 1);
            tilePosition.top = (yBegin + (yEnd - xBegin)*(yIncrement));    
        }
    }
    
    return tilePosition;
};



Background.prototype.getTileInnerSize = function(board){
    let tileInnerSize = this.getTileSize(board);
    tileInnerSize.width *= 0.75;
    tileInnerSize.height *= 0.75;
    
    return tileInnerSize;
};



Background.prototype.getTileInnerPosition = function(x, y, board){
    let tileSize = this.getTileSize(board);
    let tileInnerSize = this.getTileInnerSize(board);
    
    
    let tilePosition = {};
    {
        let xBegin = (tileSize.width - tileInnerSize.width)/2;
        let xEnd = this.parentSize.width - tileInnerSize.width - (tileSize.width - tileInnerSize.width)/2;
        
        if(1 === board.width){
            tilePosition.left = (xBegin + xEnd)/2;
        }else {
            let xIncrement = x/(board.width - 1);
            tilePosition.left = (xBegin + (xEnd - xBegin)*xIncrement);    
        }

        
        
        let yBegin = (tileSize.height - tileInnerSize.height)/2;
        let yEnd = this.parentSize.height - tileInnerSize.height - (tileSize.height - tileInnerSize.height)/2;
        
        if(1 === board.height){
            tilePosition.top = (yBegin + yEnd)/2;
        }else {
            let yIncrement = y/(board.height - 1);
            tilePosition.top = (yBegin + (yEnd - xBegin)*(yIncrement));    
        }
    }
    
    return tilePosition;
};


Background.prototype.createInnerTile = function(x, y, board){
    let index = board.getBoardSquare(x, y);
    
    let innerTile = document.createElement("div");
    innerTile.setAttribute("class", "backInner");
    
    let tileSize = this.getTileInnerSize(board);
    let tilePosition = this.getTileInnerPosition(x, y, board);
    
    innerTile.style.width = tileSize.width + "px";
    innerTile.style.height = tileSize.height + "px";
    
    innerTile.style.lineHeight = tileSize.height + "px";
    innerTile.style.fontSize = Math.min(tileSize.width, tileSize.height)*0.8 + "px";
    
    var cssTransform = getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
    innerTile.style[cssTransform] = "translate(" + tilePosition.left + "px" + "," + tilePosition.top + "px" + ")";
    //innerTile.style.backgroundColor = this.getIndexTileColor(index);
    
    return innerTile;
};

