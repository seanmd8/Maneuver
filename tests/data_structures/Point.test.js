var imports = require('../../ManeuverTest.js');


describe(`Point`, () => {
    // Imports used or being tested.
    const Point = imports.Point;
    const ERRORS = imports.ERRORS;
    const point_equals = imports.point_equals;

    // Common testing vars.

    it(`is properly constructed`, () => {
        let p = new Point(1, -2);
        expect(p.x === 1);
        expect(p.y === -2);
    })

    it(`checks for equality`, () => {
        let p1 = new Point(1, 1);
        expect(point_equals(p1, p1)).toBe(true);
        let p2 = new Point(1, 1);
        expect(point_equals(p1, p2)).toBe(true);
        let p3 = new Point(-1, -1);
        expect(point_equals(p1, p3)).toBe(false);
    })

    it(`adds a number correctly`, () => {
        let p1 = new Point(1, 1);
        let p2 = p1.plus(3);
        let expected = new Point(4, 4);
        expect(point_equals(p2, expected)).toBe(true);
        p1.plus_equals(3);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`adds a point correctly`, () => {
        let p1 = new Point(2, 2);
        let p2 = new Point(3, 4);
        let p3 = p1.plus(p2);
        let expected = new Point(5, 6);
        expect(point_equals(p3, expected)).toBe(true);
        p1.plus_equals(p2);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`subtracts a number correctly`, () => {
        let p1 = new Point(1, 1);
        let p2 = p1.minus(3);
        let expected = new Point(-2, -2);
        expect(point_equals(p2, expected)).toBe(true);
        p1.minus_equals(3);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`subtracts a point correctly`, () => {
        let p1 = new Point(2, 2);
        let p2 = new Point(3, 4);
        let p3 = p1.minus(p2);
        let expected = new Point(-1, -2);
        expect(point_equals(p3, expected)).toBe(true);
        p1.minus_equals(p2);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`multiplies by a number correctly`, () => {
        let p1 = new Point(1, 1);
        let p2 = p1.times(3);
        let expected = new Point(3, 3);
        expect(point_equals(p2, expected)).toBe(true);
        p1.times_equals(3);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`multiplies by a point correctly`, () => {
        let p1 = new Point(2, 2);
        let p2 = new Point(3, 4);
        let p3 = p1.times(p2);
        let expected = new Point(6, 8);
        expect(point_equals(p3, expected)).toBe(true);
        p1.times_equals(p2);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`divides by a number correctly`, () => {
        let p1 = new Point(3, 3);
        let p2 = p1.divide(3);
        let expected = new Point(1, 1);
        expect(point_equals(p2, expected)).toBe(true);
        p1.divide_equals(3);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`divides by a point correctly`, () => {
        let p1 = new Point(6, 9);
        let p2 = new Point(3, 3);
        let p3 = p1.divide(p2);
        let expected = new Point(2, 3);
        expect(point_equals(p3, expected)).toBe(true);
        p1.divide_equals(p2);
        expect(point_equals(p1, expected)).toBe(true);
    })

    it(`throws invalid type errors for operators`, () => {
        let p1 = new Point(1, 1);
        let str = `foo`;
        expect(() => p1.plus(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.plus_equals(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.minus(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.minus_equals(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.times(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.times_equals(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.divide(str)).toThrowError(ERRORS.invalid_type);
        expect(() => p1.divide_equals(str)).toThrowError(ERRORS.invalid_type);

        expect(() => point_equals(p1, str)).toThrowError(ERRORS.invalid_type);
        expect(() => point_equals(str, p1)).toThrowError(ERRORS.invalid_type);

    })

    it(`throws a divide by 0 error`, () => {
        let p1 = new Point(1, 1);
        let x_0 = new Point(0, 1);
        let y_0 = new Point(1, 0);

        expect(() => p1.divide(0)).toThrowError(ERRORS.divide_by_0);
        expect(() => p1.divide_equals(0)).toThrowError(ERRORS.divide_by_0);
        expect(() => p1.divide(x_0)).toThrowError(ERRORS.divide_by_0);
        expect(() => p1.divide_equals(x_0)).toThrowError(ERRORS.divide_by_0);
        expect(() => p1.divide(y_0)).toThrowError(ERRORS.divide_by_0);
        expect(() => p1.divide_equals(y_0)).toThrowError(ERRORS.divide_by_0);

        x_0.divide(p1);
        y_0.divide(p1);
    })

    it(`checks if a point is within a radius of the center`, () => {
        let p1 = new Point(0, 0);
        expect(p1.within_radius(1)).toBe(true);
        expect(p1.within_radius(0)).toBe(true);
        let ps = [
            new Point(2, 2),
            new Point(2, -2),
            new Point(-2, 2),
            new Point(-2, -2)
        ];
        for(let p of ps){
            expect(p.within_radius(0)).toBe(false);
            expect(p.within_radius(1)).toBe(false);
            expect(p.within_radius(2)).toBe(true);
            expect(p.within_radius(3)).toBe(true);
        }
    })

    it(`copies itself properly`, () => {
        let p1 = new Point(1, 1);
        let p2 = p1.copy();
        expect(point_equals(p1, p2)).toBe(true);
        p1.plus_equals(1);
        expect(point_equals(p1, p2)).toBe(false);
    })

    it(`calculates taxicab distance properly`, () => {
        let p1 = new Point(0, 0);
        expect(p1.taxicab_distance()).toBe(0);
        let ps = [
            new Point(2, 2),
            new Point(2, -2),
            new Point(-2, 2),
            new Point(-2, -2),
            new Point(4, 0),
            new Point(-4, 0),
            new Point(0, 4),
            new Point(0, -4)
        ];
        for(let p of ps){
            expect(p.taxicab_distance()).toBe(4);
        }
    })

    it(`rotates around the origin properly`, () => {
        let p1 = new Point(3, 1);
        let r0 = p1.copy();
        let r90 = new Point(-1, 3);
        let r180 = new Point(-3, -1);
        let r270 = new Point(1, -3);
        expect(point_equals(p1.rotate(0), r0)).toBe(true);
        expect(point_equals(p1.rotate(90), r90)).toBe(true);
        expect(point_equals(p1.rotate(180), r180)).toBe(true);
        expect(point_equals(p1.rotate(270), r270)).toBe(true);
        expect(point_equals(p1.rotate(360), r0)).toBe(true);
        expect(point_equals(p1.rotate(-90), r270)).toBe(true);
        expect(point_equals(p1.rotate(720), r0)).toBe(true);
    })

    it(`throws an invalid value error for invalid rotations`, () => {
        let p1 = new Point(3, 1);
        expect(() => p1.rotate(3)).toThrowError(ERRORS.invalid_value);
    })

    it(`checks if it is on an axis`, () => {
        let invalid = [
            new Point(0, 0),
            new Point(3, 1),
            new Point(1, 1),
            new Point(-1, -1),
            new Point( 1, 3)
        ];
        let valid = [
            new Point(1, 0),
            new Point(0, 1),
            new Point(-1, 0),
            new Point(0, -1),
            new Point(20, 0)
        ];
        for(let p of invalid){
            expect(p.on_axis()).toBe(false);
        }
        for(let p of valid){
            expect(p.on_axis()).toBe(true);
        }
    })

    it(`checks if it is on a diagonal`, () => {
        let invalid = [
            new Point(0, 0),
            new Point(3, 1),
            new Point(0, 1),
            new Point(1, 0),
            new Point(-1, 2)
        ];
        let valid = [
            new Point(1, 1),
            new Point(-1, 1),
            new Point(-1, -1),
            new Point(1, -1),
            new Point(20, 20)
        ];
        for(let p of invalid){
            expect(p.on_diagonal()).toBe(false);
        }
        for(let p of valid){
            expect(p.on_diagonal()).toBe(true);
        }
    })

    


});