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

var Board = function (width, height) {
    this.width = width;
    this.height = height;


    this.arr = [];
    for (let x = 0; x < this.width; x++) {
        this.arr.push([]);
        this.arr[x].push(new Array(this.height));
    }

    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            this.arr[x][y] = 0;
        }
    }
    

    this.isLoose = false;
    
    this.boardChangesScore = [];
    this.boardChanges = [];
};

Board.prototype.getBoardChangesScore = function(){
    return this.boardChangesScore;
};

Board.prototype.addBoardChangesScore = function(val){
    this.boardChangesScore.push(val);
};




Board.prototype.getBoardChanges = function(){
    return this.boardChanges;
};

Board.prototype.initBoardChanges = function(){
    this.boardChanges = [];
    
    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            let index = this.getBoardSquare(x, y);
            if (index > 0) {
                let boardChange = {};
                
                boardChange.isNew = false;
                boardChange.oldX = x;
                boardChange.oldY = y;
                boardChange.newX = x;
                boardChange.newY = y;
                boardChange.index = index;


                this.boardChanges.push(boardChange);
            }
        }
    }
};

Board.prototype.applyBoardChange = function(x, y, index, direction, newOld){
    
    if(undefined !== newOld && newOld){
        let boardChange = {};
        boardChange.newOld = true;
        
        boardChange.oldX = x;
        boardChange.oldY = y;
        boardChange.newX = x;
        boardChange.newY = y;
        boardChange.index = index;
        
        this.boardChanges.push(boardChange);
    }else {
        
        for(let i = 0; i < this.boardChanges.length; i++){
            if(this.boardChanges[i].newX === x && this.boardChanges[i].newY === y){

                this.boardChanges[i].newX = x + direction.x;
                this.boardChanges[i].newY = y + direction.y;
                
                
                if(undefined !== newOld){
                    this.boardChanges[i].newOld = newOld;
                }
            }
        }

    }
    
};








Board.prototype.setBoardSquare = function (x, y, index) {
    this.arr[x][y] = index;
};



Board.prototype.getBoardSquare = function (x, y) {
    return this.arr[x][y];
};
 



Board.prototype.canMoveDirection = function(direction){
    return this.canMoveDirectionStep(direction) || this.canMergeDirectionStep(direction);
};


Board.prototype.moveDirection = function (direction) {
    
    while(this.canMoveDirectionStep(direction)){
        this.moveDirectionStep(direction);
    }

    if(this.canMergeDirectionStep(direction)){
        this.mergeDirectionStep(direction);
    }
    
    while(this.canMoveDirectionStep(direction)){
        this.moveDirectionStep(direction);
    }
    
    
    this.updateIsLoose();
};

Board.prototype.updateIsLoose = function(){
    if (this.canAddRandomBoardSquare()) {
        this.addRandomBoardSquare();
    }


    //Check if we lose
    let directions = getDefaultDirections();;

    let isLoose = !this.canAddRandomBoardSquare();
    for (let i = 0; i < directions.length && isLoose; i++) {
        let direction = directions[i];

        isLoose = !(this.canMoveDirectionStep(direction) || this.canMergeDirectionStep(direction));
    }
    this.isLoose = isLoose;
};


Board.prototype.getXYStartEndIncrement = function(direction){
    let xStart;
    let xEnd;
    let xIncrement;
    {
        if (direction.x > 0) {
            xStart = this.width - 1;
            xEnd = -1;
            xIncrement = -1;
        } else {
            xStart = 0;
            xEnd = this.width;
            xIncrement = 1;
        }
    }
    
    let yStart;
    let yEnd;
    let yIncrement;
    {
        if (direction.y > 0) {
            yStart = this.height - 1;
            yEnd = -1;
            yIncrement = -1;
        } else {
            yStart = 0;
            yEnd = this.height;
            yIncrement = 1;
        }
    }
    
    let ret = {};
    ret.xStart = xStart;
    ret.xEnd = xEnd;
    ret.xIncrement = xIncrement;
    
    ret.yStart = yStart;
    ret.yEnd = yEnd;
    ret.yIncrement = yIncrement;
    
    return ret;
};

Board.prototype.canMoveDirectionStep = function(direction){
    let ret = false;
    let loopParam = this.getXYStartEndIncrement(direction);
    
    for (let x = loopParam.xStart; x !== loopParam.xEnd && !ret; x += loopParam.xIncrement) {
        for (let y = loopParam.yStart; y !== loopParam.yEnd && !ret; y += loopParam.yIncrement) {
            let index = this.getBoardSquare(x, y);
            if (index > 0) {
                let newX = x + direction.x;
                let newY = y + direction.y;

                if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && 0 === this.getBoardSquare(newX, newY)) {
                    ret = true;
                }
            }
        }
    }
    
    return ret;
};

Board.prototype.moveDirectionStep = function (direction) {
    let loopParam = this.getXYStartEndIncrement(direction);

    for (let x = loopParam.xStart; x !== loopParam.xEnd; x += loopParam.xIncrement) {
        for (let y = loopParam.yStart; y !== loopParam.yEnd; y += loopParam.yIncrement) {
            let index = this.getBoardSquare(x, y);
            if (index > 0) {
                let newX = x + direction.x;
                let newY = y + direction.y;

                if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && 0 === this.getBoardSquare(newX, newY)) {
                    this.setBoardSquare(x, y, 0);
                    this.setBoardSquare(newX, newY, index);

                    this.applyBoardChange(x, y, index, direction);
                }
            }
        }
    }
};

Board.prototype.canMergeDirectionStep = function (direction) {
    let ret = false;
    let loopParam = this.getXYStartEndIncrement(direction);

    for (let x = loopParam.xStart; x !== loopParam.xEnd && !ret; x += loopParam.xIncrement) {
        for (let y = loopParam.yStart; y !== loopParam.yEnd && !ret; y += loopParam.yIncrement) {
            let index = this.getBoardSquare(x, y);
            if (index > 0) {
                let newX = x + direction.x;
                let newY = y + direction.y;

                if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && index === this.getBoardSquare(newX, newY)) {
                    ret = true;
                }
            }
        }
    }
    
    return ret;
};

Board.prototype.mergeDirectionStep = function (direction) {
    let loopParam = this.getXYStartEndIncrement(direction);

    for (let x = loopParam.xStart; x !== loopParam.xEnd; x += loopParam.xIncrement) {
        for (let y = loopParam.yStart; y !== loopParam.yEnd; y += loopParam.yIncrement) {
            let index = this.getBoardSquare(x, y);
            if (index > 0) {
                let newX = x + direction.x;
                let newY = y + direction.y;

                if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && index === this.getBoardSquare(newX, newY)) {
                    this.setBoardSquare(x, y, 0);
                    this.setBoardSquare(newX, newY, index + 1);
                    
                    this.addBoardChangesScore(index + 1);
                    
                    this.applyBoardChange(x, y, index, direction, false);
                    this.applyBoardChange(newX, newY, index + 1, undefined, true);  
                }
            }
        }
    }
};


Board.prototype.canAddRandomBoardSquare = function(){
    let ret = false;
    for(let x = 0; x < this.width && !ret; x++){
        for(let y = 0; y < this.height && !ret; y++){
            if(this.getBoardSquare(x, y) === 0){
                ret = true;
            }
        }
    }  
    
    return ret;
};

Board.prototype.addRandomBoardSquare = function(){
    let x;
    let y;
    do {
        x = Math.floor(Math.random() * (this.width - 0)) + 0;
        y = Math.floor(Math.random() * (this.height - 0)) + 0;
    }while(this.getBoardSquare(x, y) !== 0);
    
    
    let index = 1;
    
    /*
    let random = Math.random();
    let lower = 0.0;
    let increment = 0.5;
    while(random >= lower){
        index++;
        lower += increment;
        increment /= 2.0;
    }
    */
    this.setBoardSquare(x, y, index);
    this.applyBoardChange(x, y, index,undefined, true);
};


Board.prototype.setBoard = function (board) {
    if (board.width === this.width && board.height === this.height) {

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.setBoardSquare(x, y, board.getBoardSquare(x, y));
            }
        }
    }
    this.isLoose = board.isLoose;
    
    this.initBoardChanges();
};

Board.prototype.setBoardSerialize = function(serial) {
    if(serial.width === this.width && serial.height === this.height){
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                this.setBoardSquare(x, y, serial.arr[x][y]);
            }
        }
    }
    
    this.isLoose = false;
    
    this.initBoardChanges();
};


Board.prototype.serialize = function(){
    let serial = {};
    serial.width = this.width;
    serial.height = this.height;
    
    serial.arr = this.arr;
    
    return serial;
};