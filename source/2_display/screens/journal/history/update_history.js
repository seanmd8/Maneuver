function update_history(){
    const history = GS.data.get_runs();
    const button_id = `${UIIDS.journal_navbar} ${journal_navbar_labels.history}`;
    display.toggle_visibility(button_id, history.length > 0)
    display.update_history(history);
}