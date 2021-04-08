import { LibraryLoader } from "../librarys/LibraryLoader";
import { Hooks } from "../librarys/Hook";

export class WorldData {

    private static instance: WorldData;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new WorldData();
            Hooks.set("WorldData", this.instance);
        }
        return this.instance;
    }

    public sizeX : number;
    public sizeY : number;
    public sizeZ : number;
    public scale : number;

    private constructor() {
        this.sizeX = 100;
        this.sizeY = 100;
        this.sizeZ = 50;
        this.scale = 100;
    }

    static init(){
        this.GetIns();
    }
}
LibraryLoader.register(WorldData);