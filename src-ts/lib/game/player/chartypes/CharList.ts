import { LibraryLoader } from "../../librarys/LibraryLoader";
import { Hooks } from "../../librarys/Hook";
import { CharBase } from "./CharBase";

export class CharList {

    private static instance: CharList;
    
    public static GetIns() {
        if (this.instance == null) {
            this.instance = new CharList();
            Hooks.set("CharList", this.instance);
        }
        return this.instance;
    }

    public chars : CharBase[];  

    public updateChars(){
        for(var c of this.chars){
            c.update();
        }
    }

    public getCharByPid(pid:number) : any{
        for(var c of this.chars){
            if(c.pid == pid){
                return c;
            }
        }  
        return null;
    }

    private constructor() {
        this.chars = [];
    }

    static init() {
        this.GetIns();
        
    }
}
LibraryLoader.register(CharList);
        