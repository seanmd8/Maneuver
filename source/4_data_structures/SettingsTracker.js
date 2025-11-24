class SettingsTracker{
    #animation_speed;
    #text_size;
    #move_color;
    #checkered_overlay;

    constructor(){
        this.reset();
    }
    reset(){
        this.#animation_speed = 1;
        this.#text_size = undefined;
        this.#move_color = true;
        this.#checkered_overlay = 0;
    }
    set(settings = {}){
        this.#animation_speed = settings.animation_speed !== undefined ? settings.animation_speed : this.#animation_speed;
        this.#text_size = settings.text_size !== undefined ? settings.text_size : this.#text_size;
        this.#move_color = settings.move_color !== undefined ? settings.move_color : this.#move_color;
        this.#checkered_overlay = settings.checkered_overlay !== undefined ? settings.checkered_overlay : this.#checkered_overlay;
    }
    get(){
        return {
            animation_speed: this.#animation_speed,
            text_size: this.#text_size,
            move_color: this.#move_color,
            checkered_overlay: this.#checkered_overlay,
        }
    }
    delay(){
        return ANIMATION_DELAY_OPTIONS[this.#animation_speed];
    }
    do_color(){
        return this.#move_color;
    }
    overlay(){
        return this.#checkered_overlay;
    }
}