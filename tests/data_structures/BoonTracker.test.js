var imports = require('../../Maneuver.js');

function get_test_boons(){
    var test_boon_names = {
        minimal_boon: `minaml`,
        repeating_boon: `repeating`,
        prereq_true_boon: `prereq true`,
        prereq_false_boon: `prereq false`,
        on_pick_boon: `on pick`,
        unlock_boon: `unlock`,
        mix_boon: `mix`
    }
    
    var minimal_boon = function(){
        return {
            name: test_boon_names.minimal_boon,
            pic: ``,
            description: ``
        }
    }
    var repeating_boon = function(){
        return {
            name: test_boon_names.repeating_boon,
            pic: ``,
            description: ``,
            unlocks: [repeating_boon]
        }
    }
    
    var prereq_true_boon = function(){
        var prereq_function = function(){
            return true;
        }
        return {
            name: test_boon_names.prereq_true_boon,
            pic: ``,
            description: ``,
            prereq: prereq_function
        }
    }

    var prereq_false_boon = function(){
        var prereq_function = function(){
            return false;
        }
        return {
            name: test_boon_names.prereq_false_boon,
            pic: ``,
            description: ``,
            prereq: prereq_function
        }
    }

    var on_pick_boon = function(){
        var on_pick = function(){
            console.log(test_boon_names.on_pick_boon);
        }
        return {
            name: test_boon_names.on_pick_boon,
            pic: ``,
            description: ``
        }
    }
    var unlock_boon = function(){
        return {
            name: test_boon_names.unlock_boon,
            pic: ``,
            description: ``,
            unlocks: [minimal_boon]
        }
    }
    var mix_boon = function(){
        var prereq_function = function(){
            return true;
        }
        var on_pick = function(){
            console.log(test_boon_names.mix_boon);
        }
        return {
            name: test_boon_names.mix_boon,
            pic: ``,
            description: ``,
            prereq: prereq_function,
            on_pick: on_pick,
            unlocks: [minimal_boon]
        }
    }

    return {
        names: test_boon_names,
        minimal_boon,
        repeating_boon,
        prereq_true_boon,
        prereq_false_boon,
        on_pick_boon,
        unlock_boon,
        mix_boon
    }
}

describe(`BoonTracker`, () => {
    // Imports used or being tested.
    const BoonTracker = imports.BoonTracker;
    const ERRORS = imports.ERRORS;
    

    // Common testing vars.
    let boons;
    let test_boons = get_test_boons();
    let names = test_boons.names;
    let BOON_LIST = [
        test_boons.minimal_boon,
        test_boons.repeating_boon,
        test_boons.prereq_true_boon,
        test_boons.prereq_false_boon,
        test_boons.on_pick_boon,
        test_boons.unlock_boon,
        test_boons.mix_boon
    ];
  
    beforeEach(() => {
        boons = new BoonTracker(BOON_LIST);
    });

    it(`knows how many of a given boon it has`, () => {
        expect(boons.has(names.repeating_boon)).toBe(0);
        boons.pick(names.repeating_boon)
        expect(boons.has(names.repeating_boon)).toBe(1);
        boons.pick(names.repeating_boon)
        expect(boons.has(names.repeating_boon)).toBe(2);
    })
  
  
});