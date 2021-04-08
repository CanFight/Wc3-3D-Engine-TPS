import { Hooks } from "../../librarys/Hook";
import { CharBase } from "./CharBase";
import { PlayerChar } from "../PlayerChar";
import { PlayerData } from "../PlayerData";
import { ProjSystem } from "../../librarys/ProjSystem";
import { WorldData } from "../../world/WorldData";
import { AbilityButton } from "../AbilityButton";
import { BuilderUI } from "../../world/BuilderUI";

export class CharRifleman extends CharBase{

    private abiButton:AbilityButton[];

    public update(){
        PlayerChar.GetIns().Periodic(this.pid);   
        for(var b of this.abiButton){
            b.update();
        }
    }

    public dealDamage(pid:number,dmg:number){
        PlayerData.GetIns().life[this.pid] -= dmg;
    }

    public useAbility(i:number){
        if(i == 1 && this.abiButton[0].cd <= 0){
            PlayerChar.GetIns().playAnim(this.pid,ANIM_TYPE_ATTACK,1,1)
            this.abiButton[0].cd = this.abiButton[0].cdMax;
        ProjSystem.GetIns().addProjectileAngled(
            PlayerData.GetIns().x[this.pid],PlayerData.GetIns().y[this.pid],PlayerData.GetIns().z[this.pid] + PlayerData.GetIns().height[this.pid],1500,
            PlayerData.GetIns().camJaw[this.pid] * bj_DEGTORAD,
            PlayerData.GetIns().camPitch[this.pid] * bj_DEGTORAD,
            PlayerData.GetIns().team[this.pid], 0.2 * WorldData.GetIns().scale,3,true,false,0,
            AddSpecialEffect("Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl",0,0),
            () => {
                let p = ProjSystem.collProj;
                
                if(p != null){
                    if(ProjSystem.collPid == -1){
                        //let sfx = AddSpecialEffect("units\\human\\Rifleman\\Rifleman.mdl",p.x,p.y);
                        //BlzSetSpecialEffectZ(sfx,p.z);
                        //DestroyEffect(sfx);
                        PlayerData.GetIns().x[p.team] = p.x;
                        PlayerData.GetIns().y[p.team] = p.y;
                        PlayerData.GetIns().z[p.team] = p.z;
                    }
                    p.time = 0;
                }
            }); 
        }

        if(i == 2 && this.abiButton[1].cd <= 0){
            this.abiButton[1].cd = this.abiButton[1].cdMax;
            PlayerData.GetIns().buildMode[this.pid] = !PlayerData.GetIns().buildMode[this.pid];
            if(Player(this.pid) == GetLocalPlayer()){
                BlzFrameSetVisible(BuilderUI.GetIns().background, PlayerData.GetIns().buildMode[this.pid]); 
            }
        }

        if(i == 3 && this.abiButton[2].cd <= 0){
            this.abiButton[2].cd = this.abiButton[2].cdMax;
            PlayerData.GetIns().flying[this.pid] = !PlayerData.GetIns().flying[this.pid];
        }
    }

    public constructor(pid:number) {
        super(pid);
        PlayerData.GetIns().lifeMax[pid] = 100;
        PlayerData.GetIns().life[pid] = PlayerData.GetIns().lifeMax[pid];
        PlayerData.GetIns().height[pid] = PlayerData.GetIns().height[pid] / 2;
        PlayerData.GetIns().SetPlayerModel(pid, "units\\creeps\MurlocMutant\\MurlocMutant.mdl");
        BlzSetSpecialEffectColorByPlayer(PlayerData.GetIns().model[pid],Player(pid));
        BlzSetSpecialEffectScale(PlayerData.GetIns().model[pid], 1);
        this.abiButton = [];
        this.abiButton.push(new AbilityButton(pid,5,"ReplaceableTextures\\CommandButtons\\BTNCorrosiveBreath.blp", "|cffffcc00H",0));
        
    }

}