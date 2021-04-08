import { LibraryLoader } from "../librarys/LibraryLoader";
import { Hooks } from "../librarys/Hook";
import { PlayerData } from "./PlayerData";
import { GameMap } from "../world/GameMap";
import { WorldData } from "../world/WorldData";

export class PlayerChar {

    private static instance: PlayerChar;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new PlayerChar();
            Hooks.set("PlayerChar", this.instance);
        }
        return this.instance;
    }

    private animType: animtype[];
    private animTime: number[];
    public KeyUp: boolean[] = [];
    public KeyDown: boolean[] = [];
    public KeyRight: boolean[] = [];
    public KeyLeft: boolean[] = [];
    public KeyJump: boolean[] = [];
    public KeyFlyUp: boolean[] = [];
    public KeyFlyDown: boolean[] = [];

    public Periodic(pid: number) {
        let newX: number;
        let newY: number;
        let newZ: number;
        let walkDir: number;
        let i = 0;

        if (PlayerData.GetIns().active[pid]) {
            if (PlayerData.GetIns().speedX[pid] > 0){
                i = 1;
            }else if(PlayerData.GetIns().speedX[pid] < 0){
                i = -1;
            }
            PlayerData.GetIns().speedX[pid] = (Math.abs(PlayerData.GetIns().speedX[pid]) - 0.005 * WorldData.GetIns().scale) * i;
            
            i = 0;
            if (PlayerData.GetIns().speedY[pid] > 0){
                i = 1;
            }else if(PlayerData.GetIns().speedY[pid] < 0){
                i = -1;
            }
            PlayerData.GetIns().speedY[pid] = (Math.abs(PlayerData.GetIns().speedY[pid]) - 0.005 * WorldData.GetIns().scale) * i;
            
            newX = PlayerData.GetIns().x[pid] + PlayerData.GetIns().speedX[pid];
            newY = PlayerData.GetIns().y[pid] + PlayerData.GetIns().speedY[pid];
            newZ = PlayerData.GetIns().z[pid];
            walkDir = 0;
            if (this.KeyLeft[pid] && !this.KeyRight[pid]) {//Left
                newX = newX + PlayerData.GetIns().speed[pid] * Math.cos(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD + 1.57) * 0.7;
                newY = newY + PlayerData.GetIns().speed[pid] * Math.sin(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD + 1.57) * 0.7;
                walkDir = 0.6;
            }
            if (!this.KeyLeft[pid] && this.KeyRight[pid]) {//Right
                newX = newX + PlayerData.GetIns().speed[pid] * Math.cos(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD - 1.57) * 0.7;
                newY = newY + PlayerData.GetIns().speed[pid] * Math.sin(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD - 1.57) * 0.7;
                walkDir = 0.6;
            }
            if (this.KeyUp[pid] && !this.KeyDown[pid]) { //Forward
                newX = newX + PlayerData.GetIns().speed[pid] * Math.cos(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD)
                newY = newY + PlayerData.GetIns().speed[pid] * Math.sin(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD)
                walkDir = 1.0;
            }
            if (!this.KeyUp[pid] && this.KeyDown[pid]) {//Backwards
                newX = newX + PlayerData.GetIns().speed[pid] * Math.cos(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD + 3.1415) * 0.7;
                newY = newY + PlayerData.GetIns().speed[pid] * Math.sin(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD + 3.1415) * 0.7;
                walkDir = -0.6;
            }

            if (GameMap.GetIns().checkCollide(newX, PlayerData.GetIns().y[pid], PlayerData.GetIns().z[pid] + PlayerData.GetIns().height[pid] / 10, PlayerData.GetIns().flying[pid]) &&
                GameMap.GetIns().checkCollide(newX, PlayerData.GetIns().y[pid], PlayerData.GetIns().z[pid] + PlayerData.GetIns().height[pid] / 2, PlayerData.GetIns().flying[pid]) &&
                GameMap.GetIns().checkCollide(newX, PlayerData.GetIns().y[pid], PlayerData.GetIns().z[pid] + PlayerData.GetIns().height[pid], PlayerData.GetIns().flying[pid])) { //Check X Collision
                PlayerData.GetIns().x[pid] = newX;
            }
            if (GameMap.GetIns().checkCollide(PlayerData.GetIns().x[pid], newY, PlayerData.GetIns().z[pid] + PlayerData.GetIns().height[pid] / 10, PlayerData.GetIns().flying[pid]) &&
                GameMap.GetIns().checkCollide(PlayerData.GetIns().x[pid], newY, PlayerData.GetIns().z[pid] + PlayerData.GetIns().height[pid] / 2, PlayerData.GetIns().flying[pid]) &&
                GameMap.GetIns().checkCollide(PlayerData.GetIns().x[pid], newY, PlayerData.GetIns().z[pid] + PlayerData.GetIns().height[pid], PlayerData.GetIns().flying[pid])) { //Check Y Collision
                PlayerData.GetIns().y[pid] = newY;
            }

            if (this.KeyJump[pid] && !PlayerData.GetIns().flying[pid] && PlayerData.GetIns().jumpA[pid] && PlayerData.GetIns().speedZ[pid] == 0) {
                PlayerData.GetIns().jumpA[pid] = false;
                PlayerData.GetIns().speedZ[pid] = PlayerData.GetIns().jumpP[pid];
            }

            if (PlayerData.GetIns().model[pid] != null) {
                BlzSetSpecialEffectPosition(PlayerData.GetIns().model[pid], PlayerData.GetIns().x[pid], PlayerData.GetIns().y[pid], PlayerData.GetIns().z[pid])
                BlzSetSpecialEffectOrientation(PlayerData.GetIns().model[pid], PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD, 0, 0);
                if (this.animTime[pid] <= 0) {
                    if (walkDir != 0) {
                        if(this.animType[pid] != ANIM_TYPE_WALK){
                            BlzPlaySpecialEffect(PlayerData.GetIns().model[pid], ANIM_TYPE_WALK);
                        }
                        this.animType[pid] = ANIM_TYPE_WALK;
                        BlzSetSpecialEffectTimeScale(PlayerData.GetIns().model[pid], walkDir);
                    } else {
                        if(this.animType[pid] != ANIM_TYPE_STAND){
                            BlzPlaySpecialEffect(PlayerData.GetIns().model[pid], ANIM_TYPE_STAND);
                        }
                        this.animType[pid] = ANIM_TYPE_STAND;
                        BlzSetSpecialEffectTimeScale(PlayerData.GetIns().model[pid], 1.0);
                    }
                } else {
                    this.animTime[pid] -= 0.02;
                }
            }
            if (PlayerData.GetIns().flying[pid]) {
                if (this.KeyFlyUp[pid] && !this.KeyFlyDown[pid]) {
                    newZ += PlayerData.GetIns().speed[pid];
                    PlayerData.GetIns().speedZ[pid] = PlayerData.GetIns().speed[pid];
                }
                if (!this.KeyFlyUp[pid] && this.KeyFlyDown[pid]) {
                    newZ -= PlayerData.GetIns().speed[pid];
                    PlayerData.GetIns().speedZ[pid] = PlayerData.GetIns().speed[pid] * -1;
                }
            } else {
                PlayerData.GetIns().speedZ[pid] -= 0.005 * WorldData.GetIns().scale;
                newZ += PlayerData.GetIns().speedZ[pid];
            }
            if (PlayerData.GetIns().speedZ[pid] < 0) {
                if (GameMap.GetIns().checkCollide(PlayerData.GetIns().x[pid], PlayerData.GetIns().y[pid], newZ, PlayerData.GetIns().flying[pid])) {
                    PlayerData.GetIns().z[pid] = newZ;
                } else {
                    PlayerData.GetIns().speedZ[pid] = 0;
                    PlayerData.GetIns().jumpA[pid] = true;
                }
            } else {
                if (GameMap.GetIns().checkCollide(PlayerData.GetIns().x[pid], PlayerData.GetIns().y[pid], newZ + PlayerData.GetIns().height[pid], PlayerData.GetIns().flying[pid])) {
                    PlayerData.GetIns().z[pid] = newZ;
                } else {
                    PlayerData.GetIns().speedZ[pid] = 0;
                }
            }

            //DisplayTimedTextToPlayer(Player(pid),0,0,10, PlayerData.GetIns().x[pid] + ", " + PlayerData.GetIns().y[pid] + ", " + PlayerData.GetIns().z[pid]);

        }

    }

    public playAnim(pid: number, aType: animtype, aSpeed: number, aTime: number) {
        this.animType[pid] = aType;
        this.animTime[pid] = aTime;
        BlzPlaySpecialEffect(PlayerData.GetIns().model[pid], aType);
        BlzSetSpecialEffectTimeScale(PlayerData.GetIns().model[pid], aSpeed);
    }

    private constructor() {
        this.animType = [];
        this.animTime = [];
        for (let i = 0; i < 24; i++) {
            this.animType.push(ANIM_TYPE_STAND);
            this.animTime.push(0);
            this.KeyUp.push(false);
            this.KeyDown.push(false);
            this.KeyRight.push(false);
            this.KeyLeft.push(false);
            this.KeyJump.push(false);
            this.KeyFlyUp.push(false);
            this.KeyFlyDown.push(false);
        }
    }

    static init() {
        this.GetIns();
    }
}
LibraryLoader.register(PlayerChar);