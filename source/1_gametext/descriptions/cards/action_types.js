const action_types = {
    move: `Move`,
    attack: `Attack`,
    teleport: `Teleport`,
    stun: `Stun`,
    move_until: `Move Until`,
    attack_until: `Attack Until`,
    heal: `Heal`,
}
Object.freeze(action_types);

const color_options = {
    red: `rgb(255 0 0)`,
    blue: `rgb(13 58 209)`,
    yellow: `rgb(255 255 0)`,
    light_blue: `rgb(100 149 237)`,
    green: `rgb(50 205 50)`,
    grey: `rgb(169 169 169)`,
    dark_grey: `rgb(105 105 105)`,
}
Object.freeze(color_options);

const action_type_colors = {
    move: color_options.blue,
    attack: color_options.red,
    teleport: color_options.light_blue,
    stun: color_options.yellow,
    move_until: color_options.blue,
    attack_until: color_options.red,
    heal: color_options.green,
    do_nothing: color_options.dark_grey,
    none: color_options.grey,
}
Object.freeze(action_type_colors);

const COLOR_MAP = new Map([
    [action_types.move, action_type_colors.move],
    [action_types.attack, action_type_colors.attack],
    [action_types.teleport, action_type_colors.teleport],
    [action_types.stun, action_type_colors.stun],
    [action_types.move_until, action_type_colors.move_until],
    [action_types.attack_until, action_type_colors.attack_until],
    [action_types.heal, action_type_colors.heal],
]);