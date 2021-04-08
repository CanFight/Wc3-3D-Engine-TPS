import { LibraryLoader } from "../librarys/LibraryLoader";
import { Hooks } from "../librarys/Hook";
import { WorldData } from "../world/WorldData";

export class PlayerData {
    
    public team: number[]; 
    public MouseX: number[];
    public MouseY: number[]; 
    public x: number[];
    public y: number[];
    public z: number[]; 
    public size: number[]; 
    public height: number[]; 
    public life: number[]; 
    public lifeMax: number[]; 
    public camJaw: number[]; 
    public camPitch: number[]; 
    public camDist: number[]; 
    public camHeight: number[]; 
    public camSenseJaw: number[]; 
    public camSensePitch: number[];
    public buildMode:boolean[];
    public flying: boolean[];
    public camOn: boolean[];
    public camMode: number[];  
    public speed: number[]; 
    public speedX: number[]; 
    public speedY: number[]; 
    public speedZ: number[]; 
    public model: effect[];   
    public active: boolean[];
    public jumpA: boolean[];
    public jumpP: number[];       
    
    private static instance: PlayerData;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new PlayerData();
            Hooks.set("PlayerData", this.instance);
        }
        return this.instance;
    }

    public SetPlayerModel(pid:number,path:string){
        DestroyEffect(this.model[pid]);
        this.model[pid] = AddSpecialEffect(path,PlayerData.GetIns().x[pid],PlayerData.GetIns().y[pid]);
    }
    
    private constructor() {
        this.buildMode = [];
        this.MouseX = [];
        this.MouseY = [];
        this.team = [];
        this.x = [];
        this.y = [];
        this.z = [];
        this.camJaw = [];
        this.life = [];
        this.lifeMax = [];
        this.camPitch = [];
        this.camDist = [];
        this.camHeight = [];
        this.camSenseJaw = [];
        this.camSensePitch = [];
        this.camOn = [];
        this.camMode = [];
        this.speed = [];
        this.model = [];
        this.active = [];
        this.size = [];
        this.height = [];
        this.speedX = [];
        this.speedY = [];
        this.speedZ = [];
        this.flying = [];
        this.jumpA = [];
        this.jumpP = [];
        for(let i = 0; i < 23; i++){
            this.buildMode.push(false);
            this.MouseX.push(0);
            this.MouseY.push(0);
            this.team.push(i);
            this.x.push(0);
            this.y.push(0);
            this.z.push(5 * WorldData.GetIns().scale);
            this.jumpA.push(false);
            this.jumpP.push(0.10 * WorldData.GetIns().scale);
            this.speedX.push(0);
            this.speedY.push(0);
            this.speedZ.push(0);
            this.y.push(0);
            this.size.push(0.5 * WorldData.GetIns().scale)
            this.height.push(1.8 * WorldData.GetIns().scale)
            this.life.push(100);
            this.lifeMax.push(100);
            this.camJaw.push(0);
            this.camPitch.push(0);
            this.camDist.push(5);
            this.camHeight.push(0.5 * WorldData.GetIns().scale);
            this.camSenseJaw.push(0.2);
            this.camSensePitch.push(0.2);
            this.camOn.push(true);
            this.camMode.push(1);
            this.speed.push(0.08 * WorldData.GetIns().scale);
            this.flying.push(true);
            this.active.push(GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING);
            if(this.active[i]){
                this.model.push(AddSpecialEffect("",0,0));
            }else{
                this.model.push();
            }
            BlzSetSpecialEffectScale(this.model[i], 2);
            this.speedZ.push(0);
        }
    }

    static init(){
        this.GetIns();
    }
}
LibraryLoader.register(PlayerData);