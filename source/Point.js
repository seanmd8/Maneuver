/**
 * @callback PointOp
 * @param {Point | number}
 * @returns {Point}
 */

class Point{
    x;
    y;
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    /** @type {PointOp} */
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    /** @type {PointOp} */
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
    /** @type {PointOp} */
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    /** @type {PointOp} */
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
    /** @type {PointOp} */
    times(p2){
        return this.copy().times_equals(p2);
    }
    /** @type {PointOp} */
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
     * @param {number} radius
     * @returns {boolean}
     */
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    /**
     * @returns {Point}
     */
    copy(){
        return new Point(this.x, this.y);
    }
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 * @returns  {boolean}
 */
function point_equals(p1, p2){
    if(p1.x !== undefined && p1.y !== undefined && p2.x !== undefined && p2.y !== undefined){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(`invalid type`);
    }
}