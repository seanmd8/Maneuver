/** @type {TileGenerator} */
function shatter_sphere_tile(){
    return rand_no_repeats(
        [shatter_sphere_d_tile, shatter_sphere_o_tile], 1
    )[0]();
}