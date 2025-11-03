function unlock_all_boons(){
    const boons = BOON_LIST;
    for(var boon of boons){
        GS.data.add_boon(boon().name);
    }
}