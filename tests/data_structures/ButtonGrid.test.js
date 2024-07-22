// ToDo
var imports = require('../../ManeuverTest.js');


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
        var buttons = options.show_buttons(1);
        for(var row in buttons){
            for(var button in row){
                expect(button.description).toBe(Bs.null_move_button);
            }
        }
    })

    it(`adds directional buttons correctly`, () => {
        var directions = [Bs.N, Bs.E, Bs.S, Bs.W, Bs.NE, Bs.NW, Bs.SE, Bs.SW];
        for(var direction of directions){
            options.add_button(direction, [pmove(0, 0)]);
        }
        var buttons = options.show_buttons(1);
        var correct = [
            [Bs.NE, Bs.N, Bs.NW],
            [Bs.E, Bs.null_move_button, Bs.W],
            [Bs.SE, Bs.S, Bs.SW]
        ]
        for(var x = 0; x < 3; ++x){
            for(var y = 0; y < 3; ++y){
                expect(buttons[x][y].description).toBe(correct[x][y]);
            }
        }
    })

    it(`adds C button correctly`, () => {
        options.add_button(Bs.C, [pmove(0, 0)]);
        expect(buttons[1][1].description).toBe(Bs.C);
    })

    it(`adds Spin button correctly`, () => {
        options.add_button(Bs.SPIN, [pmove(0, 0)]);
        expect(buttons[1][1].description).toBe(Bs.SPIN);
    })

    it(`adds buttons to the correct manual position`, () => {
        for(let i = 9; i > 0; --i){
            options.add_button(`${i}`, [pmove(0, 0)], i);
        }
        var buttons = options.show_buttons(1);
        buttons = [...buttons[0], ...buttons[1], ...buttons[2]];
        for(let i = 0; i < 9; ++i){
            expect(buttons[i].description).toBe(`${i + 1}`);
        }
    })

    it(`overrides the automatic position when a position is passed in`, () => {
        options.add_button(Bs.N, [pmove(0, 0)], 4);
        expect(buttons[0][1].description).toBe(Bs.null_move_button);
        expect(buttons[1][0].description).toBe(Bs.N);
    })

    it(`throws an error when an invalid position is passed in`, () => {
        expect(options.add_button(`foo`, [pmove(0, 0)], -1)).toThrowError(ERRORS.invalid_value);
        expect(options.add_button(`foo`, [pmove(0, 0)], 0)).toThrowError(ERRORS.invalid_value);
        expect(options.add_button(`foo`, [pmove(0, 0)], 10)).toThrowError(ERRORS.invalid_value);
        expect(options.add_button(Bs.N, [pmove(0, 0)], 100)).toThrowError(ERRORS.invalid_value);
    })

    it(`throws an error when no position is passed in and one cannot be deduced from the label`, () => {
        expect(options.add_button(`foo`, [pmove(0, 0)])).toThrowError(ERRORS.invalid_value);
    })

    it(`correctly can be made into an instant`, () => {
        //ToDo
    })
});
