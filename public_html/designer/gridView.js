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

var GridView = function(parentNode, maxParentSize){
    this.parentNode = parentNode;
    
    this.maxParentSize = maxParentSize;
    this.parentSize = {};
    this.parentSize.width = parseInt(parentNode.style.width);
    this.parentSize.height = parseInt(parentNode.style.height);
    
 };
 
GridView.prototype.addTilesListener = function(eventname, handler){
     for(let x = 0; x < this.width; x++){
         for(let y = 0; y < this.height; y++){
             this.view[x][y].addEventListener(eventname, handler.bind(null, x, y));
         }
     }
 };



 
 GridView.prototype.setWidthHeight = function(gridModel){
     
    this.width = gridModel.width;
    this.height = gridModel.height;
     
    this.view = [];
    for(let x = 0; x < this.width ; x++){
        this.view.push([]);
        this.view[x].push(new Array(gridModel.height));
    }

    
    

    
    
    let tileWidth = this.maxParentSize.width/this.width;
    let tileHeight = this.maxParentSize.height/this.height;
    let tileMin = Math.min(tileWidth, tileHeight);
    this.parentSize.width = tileMin*this.width;
    this.parentSize.height = tileMin*this.height;
    this.parentNode.style.width = this.parentSize.width + "px";
    this.parentNode.style.height = this.parentSize.height + "px";
    
    this.parentNode.innerHTML = "";  

    for(let x = 0; x < this.width; x++){
        for(let y = 0; y < this.height; y++){
            let tile = this.createTile(x, y, gridModel.model[x][y]);
            this.parentNode.appendChild(tile);
            
            this.view[x][y] = tile;
        }
    }
    
 };
 
  GridView.prototype.setTile = function(gridModel, x, y){
    let backgroundColor = this.getTileColor(gridModel.getTile(x, y));
     
    let tile = this.view[x][y];
    tile.style.backgroundColor = backgroundColor;
     
     tile.classList.remove("appearAnimation");
     void tile.offsetWidth;
     tile.classList.add("appearAnimation");
    //tile.setAttribute("class","tile");
 };

GridView.prototype.createTile = function(x, y, index){
    let padding = {};
    padding.width = 15;
    padding.height = 15;
    

    let tileSize = {};
    tileSize.width = (this.parentSize.width - (2 + this.width - 1)*padding.width) / this.width;
    tileSize.height = (this.parentSize.height - (2 + this.height - 1)*padding.height) / this.height;
    
    
    let tilePosition = {};
    {
        let xBegin = padding.width;
        let xEnd = this.parentSize.width - tileSize.width - padding.width;
        
        if(1 === this.width){
            tilePosition.left = (xBegin + xEnd)/2;
        }else {
            let xIncrement = x/(this.width - 1);
            tilePosition.left = (xBegin + (xEnd - xBegin)*xIncrement);    
        }

        
        
        let yBegin = padding.height;
        let yEnd = this.parentSize.height - tileSize.height - padding.height;
        
        if(1 === this.height){
            tilePosition.top = (yBegin + yEnd)/2;
        }else {
            let yIncrement = y/(this.height - 1);
            tilePosition.top = (yBegin + (yEnd - xBegin)*(yIncrement));    
        }

        
    }
  
    let tile = document.createElement("div");



   
    tile.style.width = tileSize.width + "px";
    tile.style.height = tileSize.height + "px";
    tile.style.top = tilePosition.top + "px";
    tile.style.left = tilePosition.left + "px";
    
    let backgroundColor = this.getTileColor(index);
    tile.style.backgroundColor = backgroundColor;
    
    tile.setAttribute("class", "tile");

    
    console.debug("the index is " + index);
    if(index < 0){
        tile.visibility = "hidden";
    }

    return tile;
};

GridView.prototype.getTileColor = function(index){
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





