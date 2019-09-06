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

var Model = function(storageManager){
    this.boards = [];

    
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
    
    
    
    this.score = 0;
};

Model.prototype.getScore = function(){
    return this.score;
};

Model.prototype.setScore = function(score){
    this.score = score;
};

Model.prototype.addScore = function(val){
    this.setScore(this.getScore() + val);
};

Model.prototype.updateBestScore = function(){
    this.storageManager.setBestScore(Math.max(this.storageManager.getBestScore(), this.getScore()));
};

Model.prototype.getBestScore = function(){
    return this.storageManager.getBestScore();
};

Model.prototype.getBoard = function(){
    return this.boards[this.boards.length - 1];
};

Model.prototype.getWidth = function(){
    return this.defaultBoard.width;
};
Model.prototype.getHeight = function(){  
    return this.defaultBoard.height;
};

Model.prototype.isLoose = function(){
    return this.getBoard().isLoose;
};

Model.prototype.canUndo = function(){
    return this.boards.length > 1;
};

Model.prototype.calculateBoardScore = function(boardChangesScore){
    let ret = 0;
     for(let i = 0; i < boardChangesScore.length; i++){
        ret += getNumberForIndex(boardChangesScore[i]);
    }
    
    return ret;
};

Model.prototype.canMoveDirection = function(direction){
    let board = this.getBoard();
    
    return board.canMoveDirection(direction);
};

Model.prototype.moveDirection = function(direction){
    let newBoard = new Board(this.getWidth(), this.getHeight());
    newBoard.setBoard(this.getBoard());
    
    newBoard.moveDirection(direction);
    
    this.addScore(this.calculateBoardScore(newBoard.getBoardChangesScore()));
    this.updateBestScore();
    
    
    this.boards.push(newBoard);
};

Model.prototype.undo = function(){
    let board = this.getBoard();
    this.addScore(-this.calculateBoardScore(board.getBoardChangesScore()));
    
    this.boards.pop();
    
};


Model.prototype.restart = function(){
    this.boards = [];
    this.setScore(0);
    
    let newBoard = new Board(this.getWidth(), this.getHeight());
    newBoard.setBoard(this.defaultBoard);
    
    if(newBoard.canAddRandomBoardSquare()){
        newBoard.addRandomBoardSquare();
    }
    
    this.boards.push(newBoard);
};

