
class StatTracker{
    #turn_number;
    #turns_per_floor;
    #damage;
    #turn_damage;
    #chests;

    constructor(){
        this.#turn_number = 0;
        this.#turns_per_floor = [0];
        this.#damage = 0;
        this.#turn_damage = 0;
        this.#chests = 0;
    }
    increment_turn(){
        ++this.#turn_number;
    }
    finish_floor(){
        this.#turns_per_floor.push(this.#turn_number);
        var floor_count = this.#turns_per_floor.length;
        if(floor_count === 11){
            if(this.#turn_number <= 90){
                GS.achieve(achievement_names.speed_runner);
            }
            if(this.#damage === 0){
                GS.achieve(achievement_names.without_a_scratch);
            }
        }
        var last_two = this.#turns_per_floor.slice(-2);
        return last_two[1] - last_two[0];
    }
    increment_damage(){
        ++this.#damage;
        if(this.#damage === 10){
            GS.achieve(achievement_names.shrug_it_off);
        }
    }
    increment_turn_damage(){
        this.increment_damage();
        ++this.#turn_damage;
        if(this.#turn_damage === 5){
            GS.achieve(achievement_names.clumsy);
        }
    }
    increment_chests(){
        ++this.#chests
        if(this.#chests === 6){
            GS.achieve(achievement_names.collector);
        }
    }
    get_stats(){
        return {
            turn_number: this.#turn_number,
            turns_per_floor: this.#turns_per_floor,
            damage: this.#damage,
            turn_damage: this.#turn_damage,
            chests: this.#chests
        }
    }
    
}