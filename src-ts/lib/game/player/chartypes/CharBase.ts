import { Hooks } from "../../librarys/Hook";
import { PlayerData } from "../PlayerData";

export class CharBase {

    public pid:number;
    
    public update(){}


    public dealDamage(pid:number,dmg:number){
        PlayerData.GetIns().life[this.pid] -= dmg;
    }

    public useAbility(i:number){}

    public constructor(pid:number) {
        this.pid = pid;
    }
}