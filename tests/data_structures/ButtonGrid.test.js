// ToDo
var imports = require('../../Maneuver.js');


describe(`ButtonGrid`, () => {
    // Imports used or being tested.
    const ButtonGrid = imports.ButtonGrid;
    const Bs = imports.BUTTON_LABELS;
    const ERRORS = imports.ERRORS;

    // Common testing vars.
    var options;

  
    beforeEach(() => {
        options = new ButtonGrid();
    });

    it(`has blank buttons initially`, () => {
        /*
        for(var row of options.#buttons){

        }
        expect(options.total).toBe(0);
        */

    })

    it(`adds directional buttons correctly`, () => {
        
    })

    it(`adds C button correctly`, () => {
        
    })

    it(`adds Spin button correctly`, () => {
        
    })

    it(`adds buttons to the correct manual position`, () => {
        
    })

    it(`overrides the automatic position when a position is passed in`, () => {
        
    })

    it(`throws an error when an invalid position is passed in`, () => {
        
    })

    it(`throws an error when no position is passed in and one cannot be deduced from the label`, () => {
        
    })

    it(`correctly can be made into an instant`, () => {
        
    })
});