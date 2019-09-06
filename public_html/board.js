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

var Board = function(width, height){
    this.width = width;
    this.height = height;
    
    
    this.arr = [];
    for (let x = 0; x < this.width; x++) {
        this.arr.push([]);
        this.arr[x].push(new Array(this.height));
    }
    
    for(let x = 0; x < this.width; x++){
        for(let y = 0; y < this.height; y++){
            this.arr[x][y] = 1;
        }
    }
 };
 
 Board.prototype.setBoardSquare = function(x, y, index){
     this.arr[x][y] = index;
 };
 
 Board.prototype.getBoardSquare = function(x, y){
     return this.arr[x][y];
 };
 