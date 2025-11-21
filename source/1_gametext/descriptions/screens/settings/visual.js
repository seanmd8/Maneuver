const visual_settings_titles = {
    main: `Visuals and Animation`,
    animation_speed: `Animation Speed:`,
    text_size: `Text Size:`,
    grid: `Grid Visibility:`,
    button_color: `Move Button Colors:`,
}
Object.freeze(visual_settings_titles);

const animation_speeds = [
    {text: `Turbo`,  value: 0},
    {text: `Fast`,   value: 1},
    {text: `Medium`, value: 2},
    {text: `Slow`,   value: 3},
];

const button_color_options = [
    {text: `On`,  value: true},
    {text: `Off`, value: false},
];