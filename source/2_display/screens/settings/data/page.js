function setup_data_page(){
    display.display_message(UIIDS.data_header, reset_text.header);
    display.reset_section(UIIDS.settings_data, reset_cards, reset_text.cards);
    display.reset_section(UIIDS.settings_data, reset_boons, reset_text.boons);
    display.reset_section(UIIDS.settings_data, reset_areas, reset_text.areas);
    display.reset_section(UIIDS.settings_data, reset_achievements, reset_text.achievements);
    display.reset_section(UIIDS.settings_data, reset_history, reset_text.history);
    display.reset_section(UIIDS.settings_data, reset_journal, reset_text.journal);
}