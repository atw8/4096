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

function getsupportedprop(proparray){
    var root = document.documentElement; //reference root element of document
    for (let i = 0; i< proparray.length; i++){ //loop through possible properties
        if (proparray[i] in root.style){ //if property exists on element (value will be string, empty string if not set)
            return proparray[i]; //return that string
        }
    }
}


function settransform(div, change){
    let cssTransform = getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform']);
 
    div.style[cssTransform] = change;
}