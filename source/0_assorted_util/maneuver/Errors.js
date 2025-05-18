// Library for the various kinds of errors that the game could throw
const ERRORS = {
    invalid_type: `invalid type`,
    missing_property: `missing property`,
    pass_turn: `pass turn to player`,
    skip_animation: `skip animation delay`,
    game_over: `game over`,
    floor_complete: `floor complete`,
    array_size: `array size mismatch`,
    missing_id: `id not found`,
    invalid_value: `invalid value`,
    value_not_found: `value not found`,
    space_full: `space not empty`,
    already_exists: `value already set`,
    map_full: `map full`,
    creature_died: `creature died`,
    out_of_bounds: `out of bounds`,
    divide_by_0: `divide by 0`,
    failed_to_load: `Failed to load`,
}
Object.freeze(ERRORS);

