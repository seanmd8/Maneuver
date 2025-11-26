const sentry_mode_descriptions = {
    core: {
        turret: 
            `Currently the nodes are set to act as turrets.\n`
            +`While in this mode, the sentry will continuously create paper constructs.`,
        saw: 
            `Spinning saws will damage everything around it or touching it, then it will move 1 space `
            +`orthogonally.\n`
            +`After 3 turns, it will revert.`,
        cannon: 
            `Currently preparing to shoot volleys of fireballs.\n`
            +`After 2 volleys, it will revert.`,
    },
    node: {
        turret: `Fires beams orthogonally that hit the first thing in their path.`,
        saw: `Spinning saws will damage everything around it or touching it.`,
        cannon: `Shoots a fireball in the direction it is aimed.`,
        double_cannon: `Shoots 2 fireballs in the direction it is aimed.`,
    }
}
Object.freeze(sentry_mode_descriptions);