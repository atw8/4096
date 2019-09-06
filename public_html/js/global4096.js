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

function getNumberForIndex(index){
    return Math.pow(2, index - 1);
}

function getMaxParentNodeSize(){
    let maxParentNodeSize = {};
    maxParentNodeSize.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)*0.9;
    maxParentNodeSize.height = ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 130 - 110)*0.9;
    
    //maxParentNodeSize.width = 700;
    //maxParentNodeSize.height = 700;
    return maxParentNodeSize;
}

function getDefaultDirections(){
    let directions = [];
    
    let directionUp = {};
    directionUp.x = 0;
    directionUp.y = 1;
    
    let directionDown = {};
    directionDown.x = 0;
    directionDown.y = -1;
    
    let directionLeft = {};
    directionLeft.x = -1;
    directionLeft.y = 0;
    
    let directionRight = {};
    directionRight.x = 1;
    directionRight.y = 0;
    
    directions.push(directionUp);
    directions.push(directionDown);
    directions.push(directionLeft);
    directions.push(directionRight);
    
   /*
    let directionUpRight = {};
    directionUpRight.x = 1;
    directionUpRight.y = 1;
    
    let directionDownRight = {};
    directionDownRight.x = 1;
    directionDownRight.y = -1;
    
    let directionDownLeft = {};
    directionDownLeft.x = -1;
    directionDownLeft.y = -1;
    
    let directionUpLeft = {};
    directionUpLeft.x = -1;
    directionUpLeft.y = 1;
    
    directions.push(directionUpRight);
    directions.push(directionDownRight);
    directions.push(directionDownLeft);
    directions.push(directionUpLeft);
    */
    return directions;
    
};
