
class AchievementList{
    #list
    constructor(){
        this.#list = get_achievements();
    }
    achieve(name){
        // Achieves the achievement with the given name.
        var match = this.#list.find((e) => {
            return e.name === name;
        });
        if(match === undefined){
            throw new Error(ERRORS.value_not_found);            
        }
        var achieved = !match.has;
        match.has = true;
        return achieved;
    }
    completed(){
        // Returns a list of the achievements that they have achieved.
        return this.#list.filter((e) => {
            return e.has;
        })
    }
    all(){
        // Returns all achievements.
        return this.#list;
    }
    has(name){
        // Checks if they have the achievement with the chosen name.
        var match = this.#list.find((e) => {
            return e.name === name;
        });
        if(match === undefined){
            throw new Error(ERRORS.value_not_found);
        }
        return match.has;
    }
    get(){
        // Returns a list with all the achiements they have earned.
        return this.completed().map((e) => {
            return e.name;
        });
    }
    set(list){
        // Updates has values to match a list of JSONS that are passed in from the save data.
        if(list === undefined){
            return;
        }
        for(var element of list){
            this.achieve(element);
        }
    }
    count_bosses(){
        // Counts how many unique boss killing achievements have been earned
        var filtered = this.#list.filter((a) => {
            return boss_achievements.find((n) => {return a.name === n &&  a.has}) !== undefined;
        });
        return filtered.length;
    }
    
}