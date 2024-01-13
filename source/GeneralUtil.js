// ----------------GeneralUtil.js----------------
// File for utility functions not connected to any specific project.

/**
 * @param {number} ms 
 * @returns {Promise<*>}
 */
function delay(ms){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, ms);
    })
}
/**
 * @template T
 * @param {T} element 
 * @param {T[]} arr 
 * @returns {number}
 */
function search(element, arr){
    for(var i = 0; i < arr.length; ++i){
        if(element === arr[i]){
            return i;
        }
    }
    return -1;
}
/**
 * @template T
 * @param {T[]} source 
 * @param {number} draws 
 * @returns {T[]}
 */
function rand_no_repeates(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        var rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
/**
 * @param {string} message 
 * @param {number} wrap_length 
 * @param {string} [delimiter = undefined]
 * @returns {string}
 */
function wrap_str(message, wrap_length, delimiter = undefined){
    var new_message = ``;
    var str_arr = [];
    if(message.indexOf(`\n`) > -1){
        str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){
        var start = 0;
        while(start < message.length){
            var end = Math.min(message.length, start + wrap_length);
            str_arr.push(message.slice(start, end));
            start = end;
        }
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${str_arr[i]}\n`
        }
    }
    else{
        str_arr = message.split(` `);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line = `${line}${str_arr[i]} `;
            if(line.length >= wrap_length){
                new_message = `${new_message}${line.slice(0, -1)}\n`
                line = ``;
            } 
        }
        if(line.length >= 0){
            new_message = `${new_message}${line.slice(0, -1)}\n`
        } 
    }
    return new_message.slice(0, -1);
}
/**
 * @overload
 * @param {number} num
 * @return {number}
 * 
 * @overload
 * @param {Point} num
 * @return {Point}
 * 
 * @param {*} num
 * @returns {*}
 */
function sign(num){
    // Returns whether num is positive, negative, or 0
    if(typeof num === `number`){
        if(num > 0){
            return 1;
        }
        if(num < 0){
            return -1;
        }
        return 0;
    }
    else{
        return new Point(sign(num.x), sign(num.y));
    }
}
/**
 * @returns {number}
 */
function random_sign(){
    // Randomly returns 1 or -1.
    return 2 * random_num(2) - 1;
}
/**
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
 */
function randomize_arr(arr){
    // Returns a copy of the given array with it's order randomized.
    arr = copy_arr(arr);
    var random_arr = [];
    while(arr.length > 0){
        var index = random_num(arr.length);
        random_arr.push(arr[index]);
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
    return random_arr;
}
/**
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
 */
function copy_arr(arr){
    //returns a copy of the given array.
    var arr2 = [];
    for(var i = 0; i < arr.length; ++i){
        arr2[i] = arr[i];
    }
    return arr2;
}
/**
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
 */
function reverse_arr(arr){
    var new_arr = [];
    for(var i = arr.length - 1; i >= 0; --i){
        new_arr.push(arr[i]);
    }
    return new_arr;
}
/**
 * @param {number} x 
 * @returns {number}
 */
function random_num(x){
    return Math.floor(Math.random() * x);
}
/**
 * @param {[]} a1 
 * @param {[]} a2
 * @returns {boolean}
 */
function array_equals(a1, a2){
    if(!(a1.length === a2.length)){
        return false;
    }
    for(var i = 0; i < a1.length; ++i){
        if(!(a1[i] === a2[i])){
            return false;
        }
    }
    return true;
}
