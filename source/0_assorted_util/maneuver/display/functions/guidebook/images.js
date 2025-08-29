/**
 * Function to get an array of images for the card symbols to use when displaying the guide..
 * @returns {HTMLElement[]} The array of images.
 */
function make_guidebook_images(arr){
    var images = [];
    for(var img of arr){
        images.push(display.create_image(img.src, `${img.name} symbol`, new Point(img.x, img.y).times(CARD_SYMBOL_SCALE)));
    }
    return images;
}
