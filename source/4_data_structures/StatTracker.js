class StatTracker{
    #turn_number;
    #turns_per_floor;
    #damage;
    #turn_damage;
    #chests;
    #damage_dealt;
    #boss_kill_start;
    #total_damage_per_floor;
    #kills;
    #destroyed;
    #chest_kills;
    #total_kills_per_floor;

    constructor(){
        this.#turn_number = 0;
        this.#turns_per_floor = [0];
        this.#damage = 0;
        this.#turn_damage = 0;
        this.#chests = 0;
        this.#damage_dealt = 0;
        this.#boss_kill_start = 0;
        this.#total_damage_per_floor = [0];
        this.#kills = 0;
        this.#destroyed = 0;
        this.#chest_kills = 0;
        this.#total_kills_per_floor = [0];
    }
    increment_turn(){
        ++this.#turn_number;
    }
    finish_floor(){
        this.#turns_per_floor.push(this.#turn_number);
        this.#total_damage_per_floor.push(this.#damage_dealt);
        this.#total_kills_per_floor.push(this.#kills);
        var floor_count = this.#turns_per_floor.length;
        if(floor_count === 11){
            if(this.#turn_number <= 100){
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
    increment_damage_dealt(){
        ++this.#damage_dealt;
    }
    damage_boss(){
        if(this.#boss_kill_start === undefined){
            this.#boss_kill_start = this.#turn_number;
            return;
        }
        this.#boss_kill_start = Math.min(this.#boss_kill_start, this.#turn_number);
    }
    reset_boss_damage(){
        this.#boss_kill_start = undefined;
    }
    increment_kills(){
        ++this.#kills;
    }
    increment_destroyed(){
        ++this.#destroyed;
    }
    increment_chest_kills(){
        ++this.#chest_kills;
        if(this.#chest_kills === 7){
            GS.achieve(achievement_names.manic_vandal);
        }
    }
    get_stats(){
        return {
            turn_number: this.#turn_number,
            turns_per_floor: this.#turns_per_floor,
            damage: this.#damage,
            turn_damage: this.#turn_damage,
            chests: this.#chests,
            damage_dealt: this.#damage_dealt,
            boss_kill_start: this.#boss_kill_start,
            total_damage_per_floor: this.#total_damage_per_floor,
            kills: this.#kills,
            destroyed: this.#destroyed,
            chest_kills: this.#chest_kills,
            total_kills_per_floor: this.#total_kills_per_floor
        }
    }
}