// ----------------Point.js----------------
// File contains Point class and associated functions.

/**
 * @callback PointOp Function that simulates a binary operation between this point a point or number passed in.
 * @param {Point | number} p2 The other operand.
 *                      If p2 is a Point, the operation will be performed by matching their respective x and y values,
 *                      If p2 is a number, it will be used wherever either p2.x or p2.y would be used.
 * @returns {Point} Returns the resulting point.
 */

class Point{
    /** @type {number} The x value of the point. */
    x;
    /** @type {number} The y value of the point. */
    y;
    /**
     * @param {number} x The x value of the new point.
     * @param {number} y The y value of the new point.
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    /** @type {PointOp} Returns this + p2, which is a new point*/
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    /** @type {PointOp} Does this = this + p2, then returns this.*/
    plus_equals(p2){
        if(typeof p2 === `number`){
            this.x += p2;
            this.y += p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x += p2.x;
            this.y += p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    /** @type {PointOp} Returns this - p2, which is a new point*/
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    /** @type {PointOp} Does this = this - p2, then returns this.*/
    minus_equals(p2){
        if(typeof p2 === `number`){
            this.x -= p2;
            this.y -= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x -= p2.x;
            this.y -= p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    /** @type {PointOp} Returns this * p2, which is a new point*/
    times(p2){
        return this.copy().times_equals(p2);
    }
    /** @type {PointOp} Does this = this * p2, then returns this.*/
    times_equals(p2){
        if(typeof p2 === `number`){
            this.x *= p2;
            this.y *= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x *= p2.x;
            this.y *= p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    /**
     * Function to check if a point's x and y values both have an absolute value <= radius.
     * @param {number} radius How far away from 0 x and y can be.
     * @returns {boolean} If the point is <= radius far from (0, 0).
     */
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    /** @returns {Point} Returns a copy of this point.*/
    copy(){
        return new Point(this.x, this.y);
    }
    /**
     * @returns {number} The taxicab distance away from the origin.
     */
    taxicab_distance(){
        return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
     * Rotates a point by a multiple of 90 degrees around the origin.
     * @param {number} degrees How many degrees it should be rotated by. Must be a multiple of 90.
     * @returns {Point} A rotated copy of the point.
     */
    rotate(degrees){
        if(degrees % 90 !== 0){
            throw new Error(`invalid rotation amount.`);
        }
        degrees = degrees % 360;
        if(degrees === 0){
            return this.copy();
        }
        return new Point(this.y * -1, this.x).rotate(degrees - 90);
    }
    /**
     * @returns true if the point is on the x or y axis, false otherwise.
     * (0, 0) returns false.
     */
    on_axis(){
        var is_origin = point_equals(this, new Point(0, 0));
        return (this.x === 0 || this.y === 0) && !is_origin;
    }
    /**
     * @returns true if the point is on the lines y = x or y = -x, false otherwise.
     * (0, 0) returns false.
     */
    on_diagonal(){
        var is_origin = point_equals(this, new Point(0, 0));
        return (this.x === this.y || this.x === -1 * this.y) && !is_origin;
    }
}

/**
 * Checks to see if 2 points are equal.
 * @param {Point} p1 The first point to compare.
 * @param {Point} p2 The second point to compare.
 * @returns  {boolean} If the points are equal.
 */
function point_equals(p1, p2){
    if(p1.x !== undefined && p1.y !== undefined && p2.x !== undefined && p2.y !== undefined){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(`invalid type`);
    }
}

/**
 * Adds each element in one point array to each eelment in another or a number array.
 * Throws an error if their length doesn't match.
 * @param {Point[]} a1 The point array being added to.
 * @param {Point[] | number[]} a2 The point or number array to add to it.
 * @returns  {Point[]} The resulting point array.
 */
function add_point_arr(a1, a2){
    if(a1.length != a2.length){
        throw new Error(`unequal array lengths`);
    }
    var sum_arr = [];
    for(var i = 0; i < a1.length; ++i){
        sum_arr.push(a1[i].plus(a2[i]));
    }
    return sum_arr;
}

/**
 * Adds a point or number to each element in a point array.
 * @param {Point[]} arr The point array being added to.
 * @param {Point | number} pt The point or number to add to it.
 * @returns  {Point[]} The resulting point array.
 */
function add_to_point_arr(arr, pt){
    var sum_arr = [];
    for(var i = 0; i < arr.length; ++i){
        sum_arr.push(arr[i].plus(pt));
    }
    return sum_arr;
}
