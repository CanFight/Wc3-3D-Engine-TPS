import { LibraryLoader } from "./LibraryLoader";
import { Hooks } from "./Hook";

export class Projectile {

    public x : number;
    public y : number;
    public z : number;
    public sx : number;
    public sy : number;
    public sz : number;
    public team : number;
    public size : number;
    public time : number;
    public gravity : boolean;
    public wallPierce : boolean;
    public bounce : number;
    public sfx : effect;
    public hitFunc : any;

    public removeClean(){
        DestroyEffect(this.sfx);
    }

    public constructor(x:number,y:number,z:number,sx:number,sy:number,sz:number,team:number,size:number,time:number,sfx:effect, gravity:boolean, wallPierce:boolean, bounce:number,hitFunc:any){
        this.x = x;
        this.y = y;
        this.z = z;
        this.sx = sx;
        this.sy = sy;
        this.sz = sz;
        this.team = team;
        this.size = size;
        this.time = time;
        this.sfx = sfx;
        this.gravity = gravity;
        this.wallPierce = wallPierce;
        this.bounce = bounce;
        this.hitFunc = hitFunc;
    }

}