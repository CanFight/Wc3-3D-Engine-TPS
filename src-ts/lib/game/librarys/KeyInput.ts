import { LibraryLoader } from "../librarys/LibraryLoader";
import { KeySetup } from "./KeySetup";
import { Hooks } from "./Hook";
import { Builder } from "../world/Builder";
import { PlayerChar } from "../player/PlayerChar";
import { PlayerData } from "../player/PlayerData";
import { BuilderUI } from "../world/BuilderUI";
import { ProjSystem } from "./ProjSystem";
import { Projectile } from "./Projectile";
import { WorldData } from "../world/WorldData";
import { CharList } from "../player/chartypes/CharList";

export class KeyInput {

    public KeyUp: oskeytype[] = [];
    public KeyDown: oskeytype[] = [];
    public KeyRight: oskeytype[] = [];
    public KeyLeft: oskeytype[] = [];
    public KeyJump: oskeytype[] = [];
    public KeyFlyUp: oskeytype[] = [];
    public KeyFlyDown: oskeytype[] = [];
    public KeyBlockP: oskeytype[] = [];
    public KeyBlockD: oskeytype[] = [];
    public KeyBlockC: oskeytype[] = [];
    public KeyAbi1: oskeytype[] = [];
    public KeyAbi2: oskeytype[] = [];
    public KeyAbi3: oskeytype[] = [];

    public KeyOptCam: oskeytype[] = [];

    private static instance: KeyInput;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new KeyInput();
            Hooks.set("PlayerData", this.instance);
        }
        return this.instance;
    }

    private KeyPress(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let pressedKey = BlzGetTriggerPlayerKey();
        if(pressedKey == OSKEY_Q){
            if(Player(pid) == GetLocalPlayer()){
                BlzSetMousePos(R2I(BlzGetLocalClientWidth() / 2.0 + 1),R2I(BlzGetLocalClientHeight() / 2.0 + 1))
            }
        }
        if(pressedKey == KeyInput.GetIns().KeyUp[pid]){
            PlayerChar.GetIns().KeyUp[pid] = true; 
        }
        if(pressedKey == KeyInput.GetIns().KeyDown[pid]){
            PlayerChar.GetIns().KeyDown[pid] = true; 
        }
        if(pressedKey == KeyInput.GetIns().KeyLeft[pid]){
            PlayerChar.GetIns().KeyLeft[pid] = true; 
        }
        if(pressedKey == KeyInput.GetIns().KeyRight[pid]){
            PlayerChar.GetIns().KeyRight[pid] = true; 
        }
        if(pressedKey == KeyInput.GetIns().KeyJump[pid]){
            PlayerChar.GetIns().KeyJump[pid] = true;  
        }
        if(pressedKey == KeyInput.GetIns().KeyFlyUp[pid]){
            PlayerChar.GetIns().KeyFlyUp[pid] = true; 
        }
        if(pressedKey == KeyInput.GetIns().KeyFlyDown[pid]){
            PlayerChar.GetIns().KeyFlyDown[pid] = true; 
        }
        if(pressedKey == KeyInput.GetIns().KeyBlockP[pid]){
            Builder.GetIns().placeBlock(pid);
        }
        if(pressedKey == KeyInput.GetIns().KeyBlockD[pid]){
            Builder.GetIns().destroyBlock(pid);
            PlayerChar.GetIns().playAnim(pid,ANIM_TYPE_ATTACK,1.4,0.5);
        }
        if(pressedKey == KeyInput.GetIns().KeyBlockC[pid]){
            Builder.GetIns().getBlockColor(pid);
        }
        if(pressedKey == KeyInput.GetIns().KeyOptCam[pid]){
            PlayerData.GetIns().camOn[pid] = !PlayerData.GetIns().camOn[pid];
            let frame = BlzGetFrameByName("UpperButtonBarFrame",0);
            if(Player(pid) == GetLocalPlayer()){
                BlzSetMousePos(R2I(BlzGetLocalClientWidth() / 2.0 + 1),R2I(BlzGetLocalClientHeight() / 2.0 + 1))
                BlzFrameSetVisible(frame, !PlayerData.GetIns().camOn[pid]);
            }
        }
        if(pressedKey == KeyInput.GetIns().KeyAbi1[pid]){
            CharList.GetIns().getCharByPid(pid).useAbility(1);
        }
        if(pressedKey == KeyInput.GetIns().KeyAbi2[pid]){
            CharList.GetIns().getCharByPid(pid).useAbility(2);
        }
        if(pressedKey == KeyInput.GetIns().KeyAbi3[pid]){
            CharList.GetIns().getCharByPid(pid).useAbility(3);
        }
    }

    private KeyRelease(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let pressedKey = BlzGetTriggerPlayerKey();
        if(pressedKey == KeyInput.GetIns().KeyUp[pid]){
            PlayerChar.GetIns().KeyUp[pid] = false; 
        }
        if(pressedKey == KeyInput.GetIns().KeyDown[pid]){
            PlayerChar.GetIns().KeyDown[pid] = false; 
        }
        if(pressedKey == KeyInput.GetIns().KeyLeft[pid]){
            PlayerChar.GetIns().KeyLeft[pid] = false; 
        }
        if(pressedKey == KeyInput.GetIns().KeyRight[pid]){
            PlayerChar.GetIns().KeyRight[pid] = false; 
        }
        if(pressedKey == KeyInput.GetIns().KeyJump[pid]){
            PlayerChar.GetIns().KeyJump[pid] = false;  
        }
        if(pressedKey == KeyInput.GetIns().KeyFlyUp[pid]){
            PlayerChar.GetIns().KeyFlyUp[pid] = false; 
        }
        if(pressedKey == KeyInput.GetIns().KeyFlyDown[pid]){
            PlayerChar.GetIns().KeyFlyDown[pid] = false; 
        }
    }

    private constructor() {
        let triggPress = CreateTrigger();
        let triggRelease = CreateTrigger();
        TriggerAddAction(triggPress, () => this.KeyPress());
        TriggerAddAction(triggRelease, () => this.KeyRelease());
        
        KeySetup.init();

        for(let i = 0; i < 24; i++){
            this.KeyUp.push(OSKEY_W);
            this.KeyDown.push(OSKEY_S);
            this.KeyLeft.push(OSKEY_A);
            this.KeyRight.push(OSKEY_D);
            this.KeyJump.push(OSKEY_SPACE);
            this.KeyFlyUp.push(OSKEY_F);
            this.KeyFlyDown.push(OSKEY_V);
            this.KeyBlockP.push(OSKEY_E);
            this.KeyBlockD.push(OSKEY_R);
            this.KeyBlockC.push(OSKEY_T);
            this.KeyOptCam.push(OSKEY_1);
            this.KeyAbi1.push(OSKEY_H);
            this.KeyAbi2.push(OSKEY_B);
            this.KeyAbi3.push(OSKEY_N);

            for(let j = 0; j < KeySetup.GetIns().KeyTypList.length; j++){
                BlzTriggerRegisterPlayerKeyEvent(triggPress,Player(i),KeySetup.GetIns().KeyTypList[j],0,true);
                BlzTriggerRegisterPlayerKeyEvent(triggRelease,Player(i),KeySetup.GetIns().KeyTypList[j],0,false);
            }

        }
    }

    static Use(){};

    

    static init(){
        this.GetIns();
    }
}
LibraryLoader.register(KeyInput);