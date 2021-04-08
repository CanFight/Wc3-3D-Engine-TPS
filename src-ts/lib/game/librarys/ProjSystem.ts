import { LibraryLoader } from "./LibraryLoader";
import { Hooks } from "./Hook";
import { Projectile } from "./Projectile";
import { GameMap } from "../world/GameMap";
import { CharList } from "../player/chartypes/CharList";
import { PlayerData } from "../player/PlayerData";
import { WorldData } from "../world/WorldData";

export class ProjSystem {

    private static instance: ProjSystem;
    public static GetIns() {
        if (this.instance == null) {
            this.instance = new ProjSystem();
            Hooks.set("ProjSystem", this.instance);
        }
        return this.instance;
    }

    public static collProj:Projectile|null;
    public static collPid:number;

    private maxDist : number;
    private fps : number;
    private loopTimer : timer;
    private projectiles : Projectile[];
    private gravity : number;

    private constructor(){
        this.loopTimer = CreateTimer();
        this.projectiles = [];
        this.fps = 0.03;
        this.gravity = -25;
        this.maxDist = 0.3 * WorldData.GetIns().scale;
    }

    public addProjectile(p:Projectile){
        this.projectiles.push(p);
    }

    public addProjectileAngled(x:number,y:number,z:number,speed:number,jaw:number,pitch:number,team:number,size:number,time:number,gravity:boolean,wallPierce:boolean,bounce:number,sfx:effect,hitFunc:any){
        this.projectiles.push(new Projectile(x,y,z,
            speed * Math.cos(jaw) * Math.cos(pitch),
            speed * Math.sin(jaw) * Math.cos(pitch),
            speed * Math.sin(pitch),
            team,size,time,sfx,gravity,wallPierce,bounce,hitFunc));
    }

    public addProjectileAngledRanged(x:number,y:number,z:number,speed:number,jaw:number,pitch:number,team:number,size:number,range:number,wallPierce:boolean,bounce:number,sfx:effect,hitFunc:any){
        let sx = speed * Math.cos(jaw) * Math.cos(pitch);
        let sy = speed * Math.sin(jaw) * Math.cos(pitch);
        let sz = speed * Math.sin(pitch);
        this.projectiles.push(new Projectile(x,y,z,sx,sy,sz,team,size,
            range / Math.sqrt(sx * sx + sy * sy + sz * sz) / this.fps,
            sfx,false,wallPierce,bounce,hitFunc));
    }

    public addProjectileRanged(x:number,y:number,z:number,sx:number,sy:number,sz:number,team:number,size:number,range:number,wallPierce:boolean,bounce:number,sfx:effect,hitFunc:any){
        this.projectiles.push(new Projectile(x,y,z,sx,sy,sz,team,size,
            range / Math.sqrt(sx * sx + sy * sy + sz * sz) / this.fps,
            sfx,false,wallPierce,bounce,hitFunc));
    }

    private periodic(){
        let removeP : Projectile[] = [];
        let tSx : number;
        let tSy : number;
        let tSz : number;
        let tL : number;
        let tA : number;
        for(var p of this.projectiles){
            ProjSystem.collPid = -1;
            ProjSystem.collProj = null;
            if(p.time > 0){
                if(p.time > 0){
                    p.time -= this.fps;
                }

                 // Math.sqrt(sx * sx + sy * sy + sz * sz) == speed

                if(p.gravity){
                    p.sz += this.gravity;
                }

                tSx = Math.abs(p.sx) * this.fps;
                tSy = Math.abs(p.sy) * this.fps;
                tSz = Math.abs(p.sz) * this.fps;
                while(tSx > 0 || tSy > 0 || tSz > 0){
                    if(tSx > 0){ // check X
                        tA = 0;
                        if(p.sx > 0){
                            tA = 1;
                        }else if(p.sx < 0){
                            tA = -1;
                        }
                        if(tSx > this.maxDist){
                            tL = p.x + this.maxDist * tA;
                            tSx -= this.maxDist;
                        }else{
                            tL = p.x + tSx * tA;
                            tSx = 0;
                        }
                        if(GameMap.GetIns().checkCollide(tL,p.y,p.z,p.wallPierce)){
                            p.x = tL;
                        }else{
                            if(p.bounce > 0){
                                p.sx *= -p.bounce;
                                p.sy *= p.bounce;
                                p.sz *= p.bounce;
                            }else{
                                p.time = 0;
                            }
                        }
                    }
                    if(tSy > 0){ // check Y
                        tA = 0;
                        if(p.sy > 0){
                            tA = 1;
                        }else if(p.sy < 0){
                            tA = -1;
                        }
                        if(tSy > this.maxDist){
                            tL = p.y + this.maxDist * tA;
                            tSy -= this.maxDist;
                        }else{
                            tL = p.y + tSy * tA;
                            tSy = 0;
                        }
                        if(GameMap.GetIns().checkCollide(p.x,tL,p.z,p.wallPierce)){
                            p.y = tL;
                        }else{
                            if(p.bounce > 0){
                                p.sx *= p.bounce;
                                p.sy *= -p.bounce;
                                p.sz *= p.bounce;
                            }else{
                                p.time = 0;
                            }
                        }
                    }
                    if(tSz > 0){ // check Z
                        tA = 0;
                        if(p.sz > 0){
                            tA = 1;
                        }else if(p.sz < 0){
                            tA = -1;
                        }
                        if(tSz > this.maxDist){
                            tL = p.z + this.maxDist * tA;
                            tSz -= this.maxDist;
                        }else{
                            tL = p.z + tSz * tA;
                            tSz = 0;
                        }
                        if(GameMap.GetIns().checkCollide(p.x,p.y,tL,p.wallPierce)){
                            p.z = tL;
                        }else{
                            if(p.bounce > 0){
                                p.sx *= p.bounce;
                                p.sy *= p.bounce;
                                p.sz *= -p.bounce;
                            }else{
                                p.time = 0;
                            }
                        }
                    }

                    //Unit Collision
                    if(p.team >= 0){
                        for(var c of CharList.GetIns().chars){
                            if(p.team != PlayerData.GetIns().team[c.pid]){
                                if(p.size + PlayerData.GetIns().size[c.pid] >= Math.sqrt((p.x - PlayerData.GetIns().x[c.pid]) * (p.x - PlayerData.GetIns().x[c.pid]) + 
                                (p.y - PlayerData.GetIns().y[c.pid]) * (p.y - PlayerData.GetIns().y[c.pid]))){
                                    if(p.z + p.size / 2 > PlayerData.GetIns().z[c.pid] && 
                                    p.z - p.size / 2 < PlayerData.GetIns().z[c.pid] + PlayerData.GetIns().height[c.pid]){
                                        ProjSystem.collProj = p;
                                        ProjSystem.collPid = c.pid;
                                        if(p.hitFunc != null){
                                            p.hitFunc();
                                        }
                                    }   
                                }
                            }
                        }
                    }
                    
                }

                BlzSetSpecialEffectPosition(p.sfx,p.x,p.y,p.z);
                if(p.sx >= 0){
                    BlzSetSpecialEffectYaw(p.sfx, Math.atan2(p.sy, p.sx));
                }else{
                    BlzSetSpecialEffectYaw(p.sfx, Math.atan2(p.sy, p.sx) + 3.14);
                }
                BlzSetSpecialEffectPitch(p.sfx, -Math.atan2(p.sz, Math.sqrt(p.sx * p.sx + p.sy * p.sy)));

            }else{
                ProjSystem.collProj = p;
                ProjSystem.collPid = -1;
                p.hitFunc();
                removeP.push(p);
            }
        }
        for(var p of removeP){
            p.removeClean();
            this.projectiles.splice(this.projectiles.indexOf(p),1);    
        }
    }

    static init(){
        this.GetIns();
        TimerStart(this.GetIns().loopTimer,this.GetIns().fps,true, () => this.GetIns().periodic());
    }
}
LibraryLoader.register(ProjSystem);