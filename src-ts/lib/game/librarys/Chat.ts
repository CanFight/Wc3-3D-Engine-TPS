import { LibraryLoader } from "./LibraryLoader";
import { FPSCamera } from "./FPSCamera";
import { PlayerData } from "../player/PlayerData";
import { File } from "./File-io";
import { GameMap } from "../world/GameMap";
import { Builder } from "../world/Builder";
import { BuilderUI } from "../world/BuilderUI";

type ChatCommandCallback = (chatParams: string) => any;

export class Chat {

    private static commandCallbacks: Map<string, ChatCommandCallback> = new Map<string, ChatCommandCallback>();

    private constructor() { }

    static addCommand(prefix: string, callback: ChatCommandCallback){
        Chat.commandCallbacks.set(prefix, callback);
    }

    private static onChat(){
        let s = GetEventPlayerChatString();
        let pid = GetPlayerId(GetTriggerPlayer());
        if(s == "-cam 1"){
            FPSCamera.GetIns().setCamMode(pid, 1);
        }
        if(s == "-cam 2"){
            FPSCamera.GetIns().setCamMode(pid, 2);
        }
        if(s.substring(0,6) == "-camS "){
            let sense = Number(s.substring(6,s.length)); 
            PlayerData.GetIns().camSenseJaw[pid] = sense;
            PlayerData.GetIns().camSensePitch[pid] = sense;
            DisplayTimedTextToPlayer(Player(pid),0,0,10,"Camera Sense: " + sense);
        }
        
        if(s.substring(0,5) == "-fov "){
            let input = Number(s.substring(5,s.length)); 
            if(GetLocalPlayer() == Player(pid)){
                SetCameraField(CAMERA_FIELD_FIELD_OF_VIEW, input , 2);   
            }
        }
        if(s.substring(0,5) == "-ren "){
            let input = Number(s.substring(5,s.length)); 
            if(GetLocalPlayer() == Player(pid)){
                SetCameraField(CAMERA_FIELD_FARZ, input , 2);   
            }
        }
        if(s.substring(0,7) == "-speed "){
            let input = Number(s.substring(7,s.length)); 
            PlayerData.GetIns().speed[pid] = input;
        }
        if(s.substring(0,7) == "-GetMap"){
            GameMap.GetIns().toTextForMap(pid);
        }
        if(s.substring(0,9) == "-SaveMap "){
            GameMap.GetIns().saveMap(pid, s.substring(9,s.length));
        }
        if(s.substring(0,9) == "-LoadMap "){
            GameMap.GetIns().loadMap(pid, s.substring(9,s.length));
        }
        if(s.substring(0,9) == "-ClearMap"){
            GameMap.GetIns().clearMap();
        }
        if(s.substring(0,4) == "-fly"){
            PlayerData.GetIns().flying[pid] = !PlayerData.GetIns().flying[pid];
        }
    }

    static init(){
        const t = CreateTrigger();
        TriggerAddAction(t, () => this.onChat());
        for (let index = 0; index < 24; index++) {
            TriggerRegisterPlayerChatEvent(t, Player(index), "-", false);
        }
    }
}
LibraryLoader.register(Chat);