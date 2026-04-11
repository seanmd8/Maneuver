const boon_prereq_descriptions = {
    none: 
        `Prerequisites: None.`,
    blood_alchemy:
        `Prerequisites: You must have at least 3 health and not have Limitless.`,
    burn_bright:
        `Prerequisites: You must not have Limitless.`,
    clean_mind:
        `Prerequisites: You must be at least 2 cards above your minimum deck size. `
        +`Cannot be given by other boons.`,
    creative:
        `Prerequisites: You must have at least 10 cards in your deck.`,
    duplicate:
        `Prerequisites: Cannot be given by other boons.`,
    expend_vitality:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    fortitude: 
        `Prerequisites: You must not have Limitless.`,
    grab_bag:
        `Prerequisites: Cannot be given by other boons.`,
    gruntwork:
        `Prerequisites: You must not have Limitless.`,
    hoarder:
        `Prerequisites: You must be less than 15 floors deep.`,
    medical_investment: 
        `Prerequisites: You must not have Limitless.`,
    pandoras_box:
        `Prerequisites: You must have at least 3 max health and not have Limitless. `
        +`Cannot be given by other boons.`,
    perfect_the_basics:
        `Prerequisites: You must have at least 2 basic cards in your deck.`,
    practice_makes_perfect:
        `Prerequisites: You must be less than 15 floors deep and not have Limitless.`,
    roar_of_challenge:
        `Prerequisites: You must not have Limitless.`,
    safe_passage:
        `Prerequisites: You must have health less than your max health or have Limitless. `
        +`Cannot be given by other boons`,
    shattered_glass:
        `Prerequisites: You must have at least 3 max health and not have Limitless.`,
    soul_voucher:
        `Prerequisites: You must be less than 15 floors deep, have at least 2 max health, `
        +`and not have Limitless.`,
    spiked_shoes:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    spontaneous:
        `Prerequisites: You must have at least 10 cards in your deck.`,
}
Object.freeze(boon_prereq_descriptions);