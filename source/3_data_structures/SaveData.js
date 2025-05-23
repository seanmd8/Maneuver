
/*
 * Class to save and load data to and from files and localstorage.
 * If you want to add new fields:
 *      - Add new default JSON fields in the default_data.
 *      - Change the load function to move the data from a JSON to a Class object.
 *      - Change the save function to move the data to JSON format.
*/

class SaveData{
    controls;
    achievements;
    load_function;
    save_function;
    constructor(load, save){
        this.load_function = load;
        this.save_function = save;
        this.load();
    }
    load(){
        var data = this.load_function();
        data = SaveData.#load_missing(data);
        this.controls = new KeyBind();
        this.controls.set(data.controls);
        this.achievements = new AchievementList();
        this.achievements.set(data.achievements)
    }
    save(){
        var data = {
            controls: this.controls.get(),
            achievements: this.achievements.get()
        }
        this.save_function(data);        
    }
    set_controls(new_controls){
        this.controls.set(new_controls);
        this.save();
    }
    achieve(name){
        var gained = this.achievements.achieve(name);
        if(gained){
            this.save();
        }
        return gained;
    }
    reset_achievements(){
        this.achievements = new AchievementList();
        this.save();
    }
    

    // Static functions
    static load_file_function(save_name){
        return () => {
            const fs = require('fs');
            try{
                var data = fs.readFileSync(`./saves/${save_name}.txt`, `utf8`);
                data = JSON.parse(data);
            }
            catch(err){
                var data = undefined;
            }
            return data;
        }
    }
    static load_local_function(save_name){
        return () => {
            const data = display.get_local_storage(`Maneuver.saves.${save_name}`);
            return data ? JSON.parse(data) : undefined;
        }
    }
    static load_blank(){
        return () => {
            return undefined;
        }
    }
    static save_file_function(save_name){
        return (data) => {
            const fs = require(`fs`);
            fs.writeFile(`./saves/${save_name}.txt`, JSON.stringify(data), (err) => {
                if(err){
                    throw err;
                }
            });
        }
    }
    static save_local_function(save_name){
        return (data) => {
            display.set_local_storage(`Maneuver.saves.${save_name}`, JSON.stringify(data));
        }
    }
    static save_blank(){
        return (data) => {}
    }
    static #load_missing(data){
        var blank = SaveData.default_data();
        if(data === undefined){
            return blank;
        }
        SaveData.#load_missing_recursive(data, blank);
        return data;
    }
    static #load_missing_recursive(data, default_data){
        if( // Base case: current field is not an object.
            typeof default_data !== 'object' || 
            Array.isArray(default_data) || 
            default_data === null
        ){
            return;
        }
        for(var prop in default_data){
            if(data[prop] === undefined){
                data[prop] = default_data[prop];
            }
            else{
                this.#load_missing_recursive(data[prop], default_data[prop]);
            }
        }
    }
    static default_data(){
        return {
            controls: new KeyBind().get()
        }
    }
}
