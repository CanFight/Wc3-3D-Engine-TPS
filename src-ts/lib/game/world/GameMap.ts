import { LibraryLoader } from "../librarys/LibraryLoader";
import { Block } from "./Block";
import { Hooks } from "../librarys/Hook";
import { WorldData } from "./WorldData";
import { File } from "../librarys/File-io";

export class GameMap {

    private static instance: GameMap;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new GameMap();
            Hooks.set("GameMap", this.instance);
        }
        return this.instance;
    }
    private map : (Block | null)[][][];
    private blocks : Block[];

    public removeBlock(b:Block){
        b.removeClean();
        for(let x = 0; x < b.sX; x++){
            for(let y = 0; y < b.sY; y++){
                for(let z = 0; z < b.sZ; z++){
                    if(this.map[b.x + x][b.y + y][b.z + z] == b && !(
                        (b.x + x < 0 || b.y + y < 0 || b.z + z < 0 || b.x + x >= WorldData.GetIns().sizeX
                        || b.y + y >= WorldData.GetIns().sizeY || b.z + z >= WorldData.GetIns().sizeZ )
                    )){
                        this.map[b.x + x][b.y + y][b.z + z] = null;
                    }
                }
            }    
        }  
    }
    
    public getBlock(x:number, y:number, z:number) : Block | null{
        for(var b of this.blocks){
            if(x >= b.x && x < b.x + b.sX && y >= b.y && y < b.y + b.sY && z >= b.z && z < b.z + b.sZ){
                return b;
            }
        }
        return null;
    }
    
    public removeBlocks(x:number, y:number, z:number){
        let bl : Block[] = [];
        for(var b of this.blocks){
            if(x >= b.x && x < b.x + b.sX && y >= b.y && y < b.y + b.sY && z >= b.z && z < b.z + b.sZ){
                this.removeBlock(b);
                bl.push(b);
            }
        }
        for(var b of bl){
            this.blocks.splice(this.blocks.indexOf(b),1);    
        }
    }

    public addBlock(b:Block){
        if(b.x < 0 || b.y < 0 || b.z < 0){
            b.removeClean();
            return;
        }
        GameMap.GetIns().blocks.push(b);
        for(let x = 0; x < b.sX; x++){
            for(let y = 0; y < b.sY; y++){
                for(let z = 0; z < b.sZ; z++){
                    if(this.map[b.x + x][b.y + y][b.z + z] == null && !(
                        (b.x + x < 0 || b.y + y < 0 || b.z + z < 0 || b.x + x >= WorldData.GetIns().sizeX
                        || b.y + y >= WorldData.GetIns().sizeY || b.z + z >= WorldData.GetIns().sizeZ )
                    )){
                        this.map[b.x + x][b.y + y][b.z + z] = b;
                    }
                }
            }    
        }
    }

    public toTextForMap(pid:number){
        let data = "";
        let files = 0;
        for(var b of this.blocks){
            if(data.length > 800){
                if(Player(pid) == GetLocalPlayer()){
                    File.write("MapToCode\\Blocks_" + files + ".txt", data);
                }
                data = "";
                files++;
            }
            data += "\r\n" + b.getConsString();
        }
        if(Player(pid) == GetLocalPlayer()){
            File.write("MapToCode\\Blocks_" + files + ".txt", data);
        }
        print("MapWriten");
    }

    public clearMap(){
        for(let i = 0; i < GameMap.GetIns().blocks.length; i++){
            this.removeBlock(GameMap.GetIns().blocks[i]);
        }
        GameMap.GetIns().blocks = [];
        BlzDisplayChatMessage(Player(24),0,"Map Cleared");
    }

    public saveMap(pid:number, name:string){
        let data = "";
        let files = 0;
        for(var b of this.blocks){
            if(data.length >= 1975){ //232
                if(Player(pid) == GetLocalPlayer()){
                    File.write("Maps\\"+ name +"\\Blocks_" + files + ".txt", data);
                }
                data = "";
                files++;
            }
            data += b.getSaveString();
        }
        if(Player(pid) == GetLocalPlayer()){
            File.write("Maps\\"+ name +"\\Blocks_" + files + ".txt", data);
            File.write("Maps\\"+ name +"\\Blocks_Init.txt", "" + files);
        }
        BlzDisplayChatMessage(Player(24),0,"MapSaved");
    }

    

    private static syncDataRead(){
        let pack = "";
        let data = "";
        let x = 0;
        let y = 0;
        let z = 0;
        let sx = 0;
        let sy = 0;
        let sz = 0;
        let red = 0;
        let green = 0;
        let blue = 0;
        let alpha = 0;
        if(BlzGetTriggerSyncPrefix() == "loadMap"){
            pack = BlzGetTriggerSyncData();

            while(pack.length >= 24){
                data = pack.substring(0,24);
                x = Number(data.substring(0,3));
                y = Number(data.substring(3,6));
                z = Number(data.substring(6,9));
                sx = Number(data.substring(9,10));
                sy = Number(data.substring(10,11));
                sz = Number(data.substring(11,12));
                red = Number(data.substring(12,15));
                green = Number(data.substring(15,18));
                blue = Number(data.substring(18,21));
                alpha = Number(data.substring(21,24));

                this.GetIns().addBlock(new Block(x,y,z,sx,sy,sz,red,green,blue,alpha));

                pack = pack.substring(24, pack.length);
            }
            
        }
    }
    
    public loadMap(pid:number, name:string){
        let data = "";
        let dataPiece = "";
        let syncs = 0;
        this.clearMap();
        if(Player(pid) == GetLocalPlayer()){
            let files = Number(File.read("Maps\\"+ name +"\\Blocks_Init.txt"));
            for(let i = 0; i <= files; i++){
                data = data + File.read("Maps\\"+ name +"\\Blocks_" + i + ".txt");
                BlzDisplayChatMessage(Player(24),0,"File " + I2S(i) + "  L: " + I2R(data.length))
                dataPiece = "";
                while(data.length >= 240){
                    dataPiece = data.substring(0,240);
                    data = data.substring(240, data.length);
                    BlzSendSyncData("loadMap", dataPiece);  
                    syncs++;
                }
            }
            if(data.length >= 24){
                BlzSendSyncData("loadMap", data);
            }
        }
        BlzDisplayChatMessage(Player(24),0,"Syncs " + I2S(syncs))
        BlzDisplayChatMessage(Player(24),0,"Map Loaded");
    }

    public static DemoMap(){
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
        //-===========
        // code for Retera Land
            for(let k = 0; k < 8; k++) {
                for(let j = 0; j < 8; j++) {
                    if( k == 2 && j == 2 ) {
                        b = new Block(4+k*4,4+j*4,15,4,4,1,255,255,140,255);
                        GameMap.GetIns().addBlock(b);
                    } else {
                        b = new Block(4+k*4,4+j*4,20,4,4,1,60,255,60,255);
                        GameMap.GetIns().addBlock(b);
                        b = new Block(4+k*4,4+j*4,19,4,4,1,230,60,0,255);
                        GameMap.GetIns().addBlock(b);
                    }
                    if( k != 5 || j != 5 ) {
                        b = new Block(4+k*4,4+j*4,10,4,4,1,255,255,255,255);
                        GameMap.GetIns().addBlock(b);
                    }
                }
            }
            b = new Block(55,28,0,1,4,1,60,255,60,255);
            GameMap.GetIns().addBlock(b);
            for(let k = 0; k < 19; k++) {
                b = new Block(36+k,28,19-k,1,4,1,60,255,60,255);
                GameMap.GetIns().addBlock(b);
                b = new Block(36+k,28,18-k,1,4,1,230,60,0,255);
                GameMap.GetIns().addBlock(b);
            }
            b = new Block(4,4,4,1,1,1,0,0,255,255);
            GameMap.GetIns().addBlock(b);
            b = new Block(4,4,3,1,1,1,0,0,255,255);
            GameMap.GetIns().addBlock(b);
            b = new Block(4,4,2,1,1,1,0,0,255,255);
            GameMap.GetIns().addBlock(b);
            for(let k = 0; k < 40; k++) {
                let subk = Math.floor(k/4)
                b = new Block(4+31*R2I(k%2),4+31*R2I(Math.floor(k/2)%2),9-subk,1,1,1,255-subk*25,255-subk*25,255-subk*25,255);
                GameMap.GetIns().addBlock(b);
                if( subk > 3 ) {
                    b = new Block(12+19*R2I(k%2),12+19*R2I(Math.floor(k/2)%2),20-subk,1,1,1,255,255,0,255);
                    GameMap.GetIns().addBlock(b);
                    let antisubk = 9-subk;
                    if( k % 4 == 0 ) {
                        for(let j = 0; j < antisubk; j++) {
                            b = new Block(12+19*R2I(k%2),12+19*R2I(Math.floor(k/2)%2)+subk,20-subk-j,4,1,1,255,255,0,255);
                            GameMap.GetIns().addBlock(b);
                        }
                    }
                }
            }
            for(let k = 0; k < 10; k++) {
                b = new Block(60,60,k,1,1,1,255,255,255,255);
                GameMap.GetIns().addBlock(b);
            }
            b = new Block(60,60,10,5,5,1,255,255,255,255);
            GameMap.GetIns().addBlock(b);
        
        
    }
    
    public checkCollide(x:number, y:number, z:number, ignoreWalls:boolean) : boolean {
        x = (x + WorldData.GetIns().sizeX / 2 * WorldData.GetIns().scale) / WorldData.GetIns().scale;
        y = (y + WorldData.GetIns().sizeY / 2 * WorldData.GetIns().scale) / WorldData.GetIns().scale;
        z /= WorldData.GetIns().scale;
        x = Math.floor(x);
        y = Math.floor(y);
        z = Math.floor(z);
        if(x < 0 || y < 0 || z < 0 || x >= WorldData.GetIns().sizeX || y >= WorldData.GetIns().sizeY || z >= WorldData.GetIns().sizeZ ){
            return false;
        }
        return GameMap.GetIns().map[x][y][z] == null || ignoreWalls;
    }

    public getCollideBlock(x:number, y:number, z:number) : Block | null {
        x = (x + WorldData.GetIns().sizeX / 2 * WorldData.GetIns().scale) / WorldData.GetIns().scale;
        y = (y + WorldData.GetIns().sizeY / 2 * WorldData.GetIns().scale) / WorldData.GetIns().scale;
        z /= WorldData.GetIns().scale;
        x = Math.floor(x);
        y = Math.floor(y);
        z = Math.floor(z);
        if(x < 0 || y < 0 || z < 0 || x >= WorldData.GetIns().sizeX || y >= WorldData.GetIns().sizeY || z >= WorldData.GetIns().sizeZ ){
            return null;
        }

        if(GameMap.GetIns().map[x][y][z] != null){
            return GameMap.GetIns().map[x][y][z];
        }

        return null;
    }

    private constructor() {
        this.blocks = [];
        this.map = [];
        for(let x = 0; x < WorldData.GetIns().sizeX; x++){
            this.map[x] = [];
            for(let y = 0; y < WorldData.GetIns().sizeY; y++){
                this.map[x][y] = [];
                for(let z = 0; z < WorldData.GetIns().sizeZ; z++){
                    this.map[x][y][z] = null;
                }
            }    
        }
     }


    static init(){
        this.GetIns();
        
        let trig = CreateTrigger();
        TriggerAddAction(trig, () => this.syncDataRead());
        for(let i = 0; i < 23; i++){
            BlzTriggerRegisterPlayerSyncEvent(trig, Player(i), "loadMap", false);
        }
    }
}
LibraryLoader.register(GameMap);