/**
 * Function to display the guide.
 */
function display_guide(){
    var section_location = UIIDS.guide_box;
    var navbar_location = UIIDS.guide_navbar;

    // Create the image arrays for the sections with images.
    var cards_symbol_arr = make_guidebook_images(CARD_SYMBOLS);
    var confusion_inline_arr = make_guidebook_images(CONFUSION_CARDS.map(card => {
        card = card();
        return {
            src: card.pic,
            name: card.name,
            x: 5,
            y: 5
        }
    }));
    var confusion_text = [
        ...GUIDE_TEXT.confusion, ...CONFUSION_CARDS.map((card, i) => {
        // Adds the space for confusion card images.
        if(i % 4 !== 3){
            return NBS;
        }
        return `\n`;
    })];
    
    var about_links = [
        display.make_anchor(about_page_text.git_link, about_page_text.git_text),
        display.make_anchor(about_page_text.itch_link, about_page_text.itch_text)
    ];

    // Create guidebook text sections.
    var basics_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.basics, GUIDE_TEXT.basics, []);
    var cards_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.cards, GUIDE_TEXT.cards, cards_symbol_arr);
    var enemies_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.enemies, GUIDE_TEXT.enemies, []);
    var shop_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.shop, GUIDE_TEXT.shop, []);
    var bosses_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.bosses, GUIDE_TEXT.bosses, []);
    var chests_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.chests, GUIDE_TEXT.chests, []);
    var sidebar_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.sidebar, GUIDE_TEXT.sidebar, []);
    var confusion_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.confusion, confusion_text, confusion_inline_arr);
    var about_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.about, GUIDE_TEXT.about, about_links);

    GUIDEBOOK_DIVISIONS.set([
        basics_section, 
        cards_section, 
        enemies_section, 
        shop_section, 
        bosses_section, 
        chests_section, 
        sidebar_section,
        confusion_section,
        about_section
    ]);

    var swap = function(id){
        return function(){
            GUIDEBOOK_DIVISIONS.swap(id);
        }
    }

    // Create guidebook navbar.
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.basics, swap(basics_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.cards, swap(cards_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.enemies, swap(enemies_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.shop, swap(shop_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.bosses, swap(bosses_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.chests, swap(chests_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.sidebar, swap(sidebar_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.confusion, swap(confusion_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.about, swap(about_section));

    GUIDEBOOK_DIVISIONS.swap(basics_section);
}