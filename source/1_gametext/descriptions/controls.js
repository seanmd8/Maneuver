
const CONTROLS_TEXT = {
    header: `Controls`,
    stage: {
        header: `Stage Controls`,
        card: `Choose card`,
        direction: `Make move`,
        toggle: `Preview move`,
        info: `View card info`,
        retry: `Retry`
    },
    shop: {
        header: `Shop Controls`,
        add: `Choose card to add`,
        remove: `Choose card to remove`,
        confirm: `Confirm choice`
    },
    chest: {
        header: `Chest Controls`,
        choose: `Choose item`,
        confirm: `Confirm choice`,
        reject: `Abandon chest`
    }
}
Object.freeze(CONTROLS_TEXT);

const KEYBOARD_SYMBOL_MAP = new Map();
KEYBOARD_SYMBOL_MAP.set(` `, `space`);