function unlock_all_achievements(){
    var achievements = get_achievements();
    for(var achievement of achievements){
        GS.achieve(achievement.name);
    }
}