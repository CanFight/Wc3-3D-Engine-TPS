import { LibraryLoader } from "../librarys/LibraryLoader";
import { GameMap } from "./GameMap";
import { WorldData } from "./WorldData";

export class Block {

    public x:number;
    public y:number;
    public z:number;
    public sX:number;
    public sY:number;  
    public sZ:number;
    public alpha:number;
    public red:number;
    public green:number;
    public blue:number;
    public sfx: effect;

    public getConsString():string {
        return "b = new Block(" + this.x + "," + this.y + "," + this.z + "," + this.sX + "," + this.sY + "," + this.sZ + "," + this.alpha + "," + this.red + "," + this.green + "," + this.blue + ")";  
    }
    
    public getSaveString():string { //24
        let s = "";
        if(this.x < 10){
            s += "00" + this.x
        }else if(this.x < 100){
            s += "0" + this.x
        }else{
            s += this.x
        }
        if(this.y < 10){
            s += "00" + this.y
        }else if(this.y < 100){
            s += "0" + this.y
        }else{
            s += this.y
        }
        if(this.z < 10){
            s += "00" + this.z
        }else if(this.z < 100){
            s += "0" + this.z
        }else{
            s += this.z
        }
        s += this.sX + "" + this.sY + ""  + this.sZ
        if(this.red < 10){
            s += "00" + this.red
        }else if(this.red < 100){
            s += "0" + this.red
        }else{
            s += this.red
        }
        if(this.green < 10){
            s += "00" + this.green
        }else if(this.green < 100){
            s += "0" + this.green
        }else{
            s += this.green
        }
        if(this.blue < 10){
            s += "00" + this.blue
        }else if(this.blue < 100){
            s += "0" + this.blue
        }else{
            s += this.blue
        }
        if(this.alpha < 10){
            s += "00" + this.alpha
        }else if(this.alpha < 100){
            s += "0" + this.alpha
        }else{
            s += this.alpha
        }
        return s
    }

    public removeClean(){
        DestroyEffect(this.sfx);
    }

    public constructor(x:number,y:number,z:number,sX:number,sY:number,sZ:number,red:number,green:number,blue:number,alpha:number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.z = Math.floor(z);
        this.sX = Math.floor(sX); 
        this.sY = Math.floor(sY);
        this.sZ = Math.floor(sZ);
        this.alpha = alpha;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.sfx = AddSpecialEffect("DeityCube.mdx",0,0); //block model by Retera
        BlzSetSpecialEffectColor(this.sfx,this.red,this.green,this.blue);
        BlzSetSpecialEffectAlpha(this.sfx,this.alpha);
        BlzSetSpecialEffectMatrixScale(this.sfx,this.sX * WorldData.GetIns().scale / 128,this.sY * WorldData.GetIns().scale / 128,this.sZ * WorldData.GetIns().scale / 128);
        BlzSetSpecialEffectPosition(this.sfx,
            (this.x - WorldData.GetIns().sizeX / 2) * WorldData.GetIns().scale + this.sX * WorldData.GetIns().scale / 2,
            (this.y - WorldData.GetIns().sizeY / 2) * WorldData.GetIns().scale + this.sY * WorldData.GetIns().scale / 2,
            this.z * WorldData.GetIns().scale);
    }

    static init(){
    }
}
LibraryLoader.register(Block);