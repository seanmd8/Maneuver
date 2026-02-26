class RunHistory{
    #history
    constructor(runs = []){
        this.#history = runs;
    }
    add_run(stat_tracker, floors, end_message, max_health, boons, deck, achievements){
        var stats = stat_tracker.get_stats();
        const a_names = achievements.completed().map((a) => {return a.name});
        var run = {
            run_number: this.#history.length + 1,
            end_message,
            victory: a_names.includes(achievement_names.victory),

            floors: floors,
            turns: stats.turn_number,
            kills: stats.kills,

            dealt: stats.damage_dealt,
            taken: stats.damage,
            max_health: max_health,
            
            added: deck.total_added,
            removed: deck.total_removed,
            chests: stats.chests,

            boons: boons.get_names(),
            deck: deck.get_names(),
            achievements: a_names,
        }
        this.#history.push(run);
    }
    get_runs(){
        return this.#history;
    }
}