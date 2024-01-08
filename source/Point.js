class Point{
    x;
    y;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    plus_equals(p2){
        if(typeof p2 === `number`){
            this.x += p2;
            this.y += p2;
            return this
        }
        else if(p2.hasOwnProperty(`x`) && p2.hasOwnProperty(`y`)){
            this.x += p2.x;
            this.y += p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    minus_equals(p2){
        if(typeof p2 === `number`){
            this.x -= p2;
            this.y -= p2;
            return this
        }
        else if(p2.hasOwnProperty(`x`) && p2.hasOwnProperty(`y`)){
            this.x -= p2.x;
            this.y -= p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    times(p2){
        return this.copy().times_equals(p2);
    }
    times_equals(p2){
        if(typeof p2 === `number`){
            this.x *= p2;
            this.y *= p2;
            return this
        }
        else if(p2.hasOwnProperty(`x`) && p2.hasOwnProperty(`y`)){
            this.x *= p2.x;
            this.y *= p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    copy(){
        return new Point(this.x, this.y);
    }
}
function point_equals(p1, p2){
    if(p1.hasOwnProperty(`x`) && p1.hasOwnProperty(`y`) && p2.hasOwnProperty(`x`) && p2.hasOwnProperty(`y`)){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(`invalid type`);
    }
}