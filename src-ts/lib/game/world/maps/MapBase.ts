import { LibraryLoader } from "../../librarys/LibraryLoader";
import { GameMap } from "../GameMap";
import { Block } from "../Block";

export class MapBase {

    private constructor() {
    }

    static generateMap(){
        let b:Block
        b = new Block(10,10,2,4,4,1,255,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(49,49,0,4,4,1,255,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(55,51,0,4,1,1,150,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(55,61,0,4,1,1,150,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(55,52,1,4,1,1,150,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(55,60,1,4,1,1,150,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(56,53,2,2,1,1,150,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(56,59,2,2,1,1,150,150,150,255);
        GameMap.GetIns().addBlock(b);
        b = new Block(56,54,2,2,5,1,0,0,255,100);
        GameMap.GetIns().addBlock(b);
    }

    static init(){}
}
LibraryLoader.register(MapBase);