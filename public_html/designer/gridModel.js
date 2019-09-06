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


var GridModel = function(minWidth, maxWidth, width, minHeight, maxHeight, height){
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight= maxHeight;
    
    this.setWidthHeight(width, height);
};

GridModel.prototype.setWidthHeight = function(width, height){
    this.width = width;
    this.height = height;
    
    this.model = [];
    for (let x = 0; x < this.width; x++) {
        this.model.push([]);
        this.model[x].push(new Array(this.height));
    }
    
    for(let x = 0; x < this.width; x++){
        for(let y = 0; y < this.height; y++){
            this.model[x][y] = 0;//this.getIndexNumber(-1);
        }
    }
};

GridModel.prototype.setTile = function(x, y, index){
    this.model[x][y] = index;
};
GridModel.prototype.getTile = function(x, y){
    return this.model[x][y];
};

GridModel.prototype.getIndexNumber = function(index){
    let ret = 0;
    if(index < 0){
        ret = 0;
    }else {
        ret = Math.pow(3, index);
    }
    
    return ret;
};



