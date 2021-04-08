import { Hooks } from "../librarys/Hook";
import { LibraryLoader } from "../librarys/LibraryLoader";
import { GameMap } from "./GameMap";
import { PlayerData } from "../player/PlayerData";
import { WorldData } from "./WorldData";
import { Block } from "./Block";

export class Builder {

    /*
    private Color colorByAngle(final double angle) {
        final int red = Math.min(255, Math.max(0, (int) (Math.abs(((180 - angle) * 510) / 120.)) - 255));
        final int green = Math.min(255, Math.max(0, (int) (510 - Math.abs(((angle - 120) * 510) / 120.))));
        final int blue = Math.min(255, Math.max(0, (int) (510 - Math.abs(((angle - 240) * 510) / 120.))));
        return new Color(red, green, blue);
    }
    */

    private static instance: Builder;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new Builder();
            Hooks.set("Builder", this.instance);
        }
        return this.instance;
    }

    public loopTimer:timer;
    public placeMode:boolean[];
    public sfx:effect[][];
    public range:number[];
    public x:number[];
    public y:number[];
    public z:number[];
    public bX:number[];
    public bY:number[];
    public bZ:number[];
    public sX:number[];
    public sY:number[];
    public sZ:number[];
    public cRed:number[];
    public cGreen:number[];
    public cBlue:number[];
    public cAlpha:number[];

    private constructor() {
        this.loopTimer = CreateTimer();
        this.placeMode = [];
        this.range = [];
        this.sfx = [];
        this.x = [];
        this.y = [];
        this.z = [];
        this.bX = [];
        this.bY = [];
        this.bZ = [];
        this.sX = [];
        this.sY = [];
        this.sZ = [];
        this.cRed = [];
        this.cGreen = [];
        this.cBlue = [];
        this.cAlpha = [];
        for(let i = 0; i < 24; i++){
            this.placeMode.push(false);
            this.range.push(20);
            this.x.push(1);
            this.y.push(1);
            this.z.push(1);
            this.bX.push(2);
            this.bY.push(2);
            this.bZ.push(2);
            this.sX.push(1);
            this.sY.push(1);
            this.sZ.push(1);
            this.cRed.push(255);
            this.cGreen.push(0);
            this.cBlue.push(0);
            this.cAlpha.push(255);
            this.sfx[i] = [];
            for(let j = 0; j < 8; j++){
                this.sfx[i][j] = AddSpecialEffect("DeityCube.mdx",0,0);
                BlzSetSpecialEffectAlpha(this.sfx[i][j],0);
                BlzSetSpecialEffectScale(this.sfx[i][j],0.078125); // 128 * 0.078125 = 10;
            }
            this.sfx[i][8] = AddSpecialEffect("DeityCube.mdx",0,0);
            BlzSetSpecialEffectAlpha(this.sfx[i][8],0);
            
        }
    }

    public periodic(){
        let tx = 0;
        let ty = 0;
        let tz = 0;
        let lx = 0;
        let ly = 0;
        let lz = 0;
        let found = false;
        for(let pid = 0; pid < 24; pid++){
            if(PlayerData.GetIns().buildMode[pid]){
                tx = 0;
                ty = 0;
                tz = 0;
                lx = 0;
                ly = 0;
                lz = 0;
                found = false;
                for(let i = 1; i <= this.range[pid] * 5 && !found; i++){
                    tx = Math.floor(PlayerData.GetIns().x[pid] + i / 5 * WorldData.GetIns().scale * Math.cos(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD) * Math.cos(PlayerData.GetIns().camPitch[pid] * bj_DEGTORAD));
                    ty = Math.floor(PlayerData.GetIns().y[pid] + i / 5 * WorldData.GetIns().scale  * Math.sin(PlayerData.GetIns().camJaw[pid] * bj_DEGTORAD) * Math.cos(PlayerData.GetIns().camPitch[pid] * bj_DEGTORAD));
                    tz = Math.floor(PlayerData.GetIns().height[pid] + 0.8 * WorldData.GetIns().scale + PlayerData.GetIns().z[pid] + i / 5 * WorldData.GetIns().scale * Math.sin(PlayerData.GetIns().camPitch[pid] * bj_DEGTORAD));
                    if(!GameMap.GetIns().checkCollide(tx,ty,tz,false) || i == this.range[pid] * 5){ 
                        this.x[pid] = Math.floor(tx / WorldData.GetIns().scale + WorldData.GetIns().sizeX / 2);
                        this.y[pid] = Math.floor(ty / WorldData.GetIns().scale + WorldData.GetIns().sizeY / 2);
                        this.z[pid] = Math.floor(tz / WorldData.GetIns().scale);
                        found = true;
                    }
                    if(!found && (tx != lx || ty != ly || tz != lz)){
                        lx = tx;
                        ly = ty;
                        lz = tz;
                    }
                }
                lx = Math.floor(lx / WorldData.GetIns().scale + WorldData.GetIns().sizeX / 2);
                ly = Math.floor(ly / WorldData.GetIns().scale + WorldData.GetIns().sizeY / 2);
                lz = Math.floor(lz / WorldData.GetIns().scale);
                if(lx - this.x[pid] > 0){
                    lx = 1;
                }else if(lx - this.x[pid] < 0){
                    lx = this.sX[pid] * -1;
                }else{
                    lx = 0;
                }
                if(ly - this.y[pid] > 0){
                    ly = 1;
                }else if(ly - this.y[pid] < 0){
                    ly = this.sY[pid] * -1;
                }else{
                    ly = 0;
                }
                if(lz - this.z[pid] > 0){
                    lz = 1;
                }else if(lz - this.z[pid] < 0){
                    lz = this.sZ[pid] * -1;
                }else{
                    lz = 0;
                }
                this.bX[pid] = Math.floor((this.x[pid] + lx));
                this.bY[pid] = Math.floor((this.y[pid] + ly));
                this.bZ[pid] = Math.floor((this.z[pid] + lz));
                if(Player(pid) == GetLocalPlayer()){
                    BlzResetSpecialEffectMatrix(this.sfx[pid][8]);
                    BlzSetSpecialEffectMatrixScale(this.sfx[pid][8],this.sX[pid] * WorldData.GetIns().scale / 128,this.sY[pid] * WorldData.GetIns().scale / 128,this.sZ[pid] * WorldData.GetIns().scale / 128);
                    BlzSetSpecialEffectAlpha(this.sfx[pid][8], this.cAlpha[pid])
                    BlzSetSpecialEffectColor(this.sfx[pid][8], this.cRed[pid], this.cGreen[pid], this.cBlue[pid])
                    BlzSetSpecialEffectPosition(this.sfx[pid][8],
                        (this.bX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale + this.sX[pid] * WorldData.GetIns().scale / 2,
                        (this.bY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale + this.sY[pid] * WorldData.GetIns().scale / 2,
                        this.bZ[pid] * WorldData.GetIns().scale);

                    for(let i = 0; i < 8; i++){
                        BlzSetSpecialEffectAlpha(this.sfx[pid][i], 255)
                    }
                    BlzSetSpecialEffectPosition(this.sfx[pid][0],
                        (this.bX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        this.bZ[pid]  * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][1],
                        (this.bX[pid] + this.sX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        this.bZ[pid]  * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][2],
                        (this.bX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] + this.sY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        this.bZ[pid]  * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][3],
                        (this.bX[pid] + this.sX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] + this.sY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        this.bZ[pid]  * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][4],
                        (this.bX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        (this.bZ[pid] + this.sZ[pid]) * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][5],
                        (this.bX[pid] + this.sX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        (this.bZ[pid] + this.sZ[pid]) * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][6],
                        (this.bX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] + this.sY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        (this.bZ[pid] + this.sZ[pid]) * WorldData.GetIns().scale - 5);
                    BlzSetSpecialEffectPosition(this.sfx[pid][7],
                        (this.bX[pid] + this.sX[pid] - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale,
                        (this.bY[pid] + this.sY[pid] - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale,
                        (this.bZ[pid] + this.sZ[pid]) * WorldData.GetIns().scale - 5);
                }
                 
            }else if(Player(pid) == GetLocalPlayer()){
                for(let i = 0; i < 9; i++){
                    BlzSetSpecialEffectPosition(this.sfx[pid][i],0,0,10000);
                    BlzSetSpecialEffectAlpha(this.sfx[pid][i], 255)
                }
                BlzSetSpecialEffectColor(this.sfx[pid][8], 0, 0, 0)
            }
        }
    }

    public getBlockColor(pid:number){
        if(PlayerData.GetIns().buildMode[pid]){
            let b = GameMap.GetIns().getBlock(this.x[pid],this.y[pid],this.z[pid]);
            if(b != null){
                this.cRed[pid] = b.red;
                this.cGreen[pid] = b.green;
                this.cBlue[pid] = b.blue;
                this.cAlpha[pid] = b.alpha;
            }
        }
    }

    public placeBlock(pid:number){
        if(PlayerData.GetIns().buildMode[pid]){
            GameMap.GetIns().addBlock(new Block(this.bX[pid],this.bY[pid],
            this.bZ[pid],this.sX[pid],this.sY[pid],this.sZ[pid],this.cRed[pid],
            this.cGreen[pid],this.cBlue[pid],this.cAlpha[pid]));
        }
    }

    public destroyBlock(pid:number){
        if(PlayerData.GetIns().buildMode[pid]){
            GameMap.GetIns().removeBlocks(this.x[pid], this.y[pid], this.z[pid]);
        }
    }

    static init(){
        this.GetIns();
        TimerStart(this.GetIns().loopTimer,0.2,true, () => this.GetIns().periodic());
    }
}
LibraryLoader.register(Builder);