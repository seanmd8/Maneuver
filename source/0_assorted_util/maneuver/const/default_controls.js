// Default keyboard controls
const DEFAULT_CONTROLS = {
    stage: {
        direction: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
        card: [`h`, `j`, `k`, `l`],
        info: [`i`],
        retry: [`r`]
    },
    shop: {
        add: [`q`, `w`, `e`, `r`, `t`, `y`],
        remove: [`a`, `s`, `d`, `f`, `g`, `h`],
        confirm: [` `],
    },
    chest: {
        choose: [`h`, `j`, `k`, `l`, `;`],
        confirm: [` `],
        reject: [`escape`]
    },
    toggle: {
        alt: [`shift`]
    }
}
Object.freeze(DEFAULT_CONTROLS);

