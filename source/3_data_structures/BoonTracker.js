

class BoonTracker{
    #choices;
    #boons;
    #lost_boons;
    total;
    constructor(initial_choices){
        this.#choices = initial_choices.map(b => b());
        this.#boons = [];
        this.#lost_boons = [];
        this.total = 0;
    }
    get_choices(amount){
        var choice_list = randomize_arr(this.#choices);
        var picks = [];
        while(picks.length < amount && choice_list.length > 0){
            var boon = choice_list.pop();
            if(boon.prereq === undefined || boon.prereq()){
                picks.push(boon);
            }
        }
        return picks;
    }
    has(name){
        var count = 0;
        for(var boon of this.#boons){
            if(boon.name === name){
                ++count;
            }
        }
        return count;
    }
    pick(name){
        for(var i = 0; i < this.#choices.length; ++i){
            var boon = this.#choices[i];
            if(boon.name === name){
                this.#choices.splice(i, 1);
                if(boon.unlocks !== undefined){
                    this.#choices.push(...boon.unlocks.map(f => f()));
                }
                if(boon.on_pick !== undefined){
                    boon.on_pick();
                }
                this.#boons.push(boon);
                ++this.total;
                return true;
            }
        }
        return false;
    }
    lose(name){
        for(var i = 0; i < this.#boons.length; ++i){
            var boon = this.#boons[i];
            if(boon.name === name){
                this.#boons.splice(i, 1);
                this.#lost_boons.push(boon);
                return true;
            }
        }
        return false;
    }
    get_gained(){
        return this.#boons.map(b => {return {
            name: b.name,
            pic: b.pic,
            on_click: function(){say(b.description)}
        }});
    }
    get_lost(){
        return this.#lost_boons.map(b => {return {
            name: b.name,
            foreground: [`${IMG_FOLDER.other}lost.png`],
            pic: b.pic,
            on_click: function(){say(b.description)}
        }});
    }

}

