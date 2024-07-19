var imports = require('../../ManeuverTest.js');


describe(`TagList`, () => {
    // Imports used or being tested.
    const TagList = imports.TagList;
    const ERRORS = imports.ERRORS;

    // Common testing vars.
    let tags;
    let tag1 = `hello`;
    let tag2 = `world`;
    let goblygook = 3;
  
    beforeEach(() => {
        tags = new TagList();
    });
  
    it(`should have a tag that is added to it`, () => {
        tags.add(tag1);
        expect(tags.has(tag1)).toBe(true);
    });
  
    it(`should remove tags correctly`, () => {
        tags.add(tag1);
        expect(tags.remove(tag1)).toBe(true);
        expect(tags.has(tag1)).toBe(false);
    });

    it(`should only find the correct tag`, () => {
        expect(tags.has(tag2)).toBe(false);
        tags.add(tag1);
        expect(tags.has(tag2)).toBe(false);
    });

    it(`throws an error when you add an item of the wrong type`, () => {
        expect(() => {
            tags.add(goblygook);
        }).toThrowError(ERRORS.invalid_type);
    });

    it(`throws an error when you remove an item of the wrong type`, () => {
        expect(() => {
            tags.remove(goblygook);
        }).toThrowError(ERRORS.invalid_type);
    });

    it(`throws an error when you check for an item of the wrong type`, () => {
        expect(() => {
            tags.has(goblygook);
        }).toThrowError(ERRORS.invalid_type);
    });

    it(`returns false when removing an element that isn't there`, () => {
        expect(tags.remove(tag1)).toBe(false);
        tags.add(tag1);
        expect(tags.remove(tag1)).toBe(true);
        expect(tags.remove(tag1)).toBe(false);
    });

    it(`shouldn't do partial matches`, () => {
        tags.add(`1`);
        tags.add(`123`);
        expect(tags.has(`12`)).toBe(false);
    });
  
});