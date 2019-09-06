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

var DesignManager = function(background, storageManager){
    this.background = background;
    this.storageManager = storageManager;
    
    let serial = this.storageManager.getDefaultBoard();
    if(null === serial){
        this.defaultBoard = new Board(4, 4);
    }else {
        let width = serial.width;
        let height = serial.height;    
        
        this.defaultBoard = new Board(width, height);
        this.defaultBoard.setBoardSerialize(serial);
    }
    
    

    
    this.minWidth = 1;
    this.minHeight = 1;
    
    this.maxWidth = 20;
    this.maxHeight = 20;
    
    
    this.inputWidth = document.getElementById("inputWidth");
    this.inputHeight = document.getElementById("inputHeight");
    
    this.inputWidth.value = this.defaultBoard.width;
    this.inputHeight.value = this.defaultBoard.height;;
    
    inputWidth.onkeyup = this.inputWidthFunc.bind(this);
    inputHeight.onkeyup = this.inputHeightFunc.bind(this);
       
    //Add the resize event
    window.addEventListener("resize", this.resize.bind(this), false);
    
    
    let bottomGame = document.getElementById("bottomGame");
    bottomGame.onclick = this.game.bind(this);
    
    this.refreshBoard();
};

DesignManager.prototype.game = function(event){
    location.href = "index.html";  
};


DesignManager.prototype.normalizeValue = function(_value, minValue, maxValue){
    let value = parseInt(_value);
    if (isNaN(value)) {
        value = _value;
    } else {
        value = Math.max(minValue, value);
        value = Math.min(maxValue, value);
    }

    return value;
};

DesignManager.prototype.inputWidthFunc = function(){
    this.inputWidth.value = this.normalizeValue(this.inputWidth.value, this.minWidth, this.maxWidth);
    this.inputWidthHeightHelper();
};

DesignManager.prototype.inputHeightFunc = function(){
    this.inputHeight.value = this.normalizeValue(this.inputHeight.value, this.minHeight, this.maxHeight);
    
    this.inputWidthHeightHelper();
};

DesignManager.prototype.inputWidthHeightHelper = function(){
    let width = parseInt(this.inputWidth.value);
    let height = parseInt(this.inputHeight.value);
    
    if(!isNaN(width) && !isNaN(height)){
        this.defaultBoard = new Board(width, height);
        
        this.refreshBoard();
    }
};

DesignManager.prototype.resize = function(event){
    this.refreshBoard();
};

DesignManager.prototype.refreshBoard = function(){
    this.storageManager.setDefaultBoard(this.defaultBoard.serialize());
    this.background.setBoard(this.defaultBoard, getMaxParentNodeSize(), "mouseup", this.tileEventListener.bind(this));
};

DesignManager.prototype.tileEventListener = function(x, y, event){
    let index = this.defaultBoard.getBoardSquare(x, y);
    if(index < 0){
        index = 0;
    }else {
        index = -1;
    }
    
    this.defaultBoard.setBoardSquare(x, y, index);
    this.refreshBoard();
};
