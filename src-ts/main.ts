/** @noSelfInFile **/

import { LibraryLoader } from "./lib/game/librarys/LibraryLoader";
import { Chat } from "./lib/game/librarys/Chat";
import { FPSCamera } from "./lib/game/librarys/FPSCamera";
import { UserInterface } from "./lib/game/librarys/UserInterface";
import { KeyInput } from "./lib/game/librarys/KeyInput";
import { KeySetup } from "./lib/game/librarys/KeySetup";
import { GameMap } from "./lib/game/world/GameMap";
import { PlayerChar } from "./lib/game/player/PlayerChar";
import { Block } from "./lib/game/world/Block";
import { Builder } from "./lib/game/world/Builder";
import { File } from "./lib/game/librarys/File-io";
import { CharList } from "./lib/game/player/chartypes/CharList";
import { CharRifleman } from "./lib/game/player/chartypes/CharRifleman";
import { CharBase } from "./lib/game/player/chartypes/CharBase";
import { ProjSystem } from "./lib/game/librarys/ProjSystem";

function tsMain(){
    print("main");
    UserInterface.init();
    TimerStart(CreateTimer(),0.5,false, () => {
        File.write("Welcome.txt","1337")
        EnableDragSelect(false,false);
        GameMap.init();
        GameMap.DemoMap();
        PlayerChar.init();
        KeyInput.init();
        Chat.init();
        FPSCamera.init();
        Builder.init();
        CharList.init();
        ProjSystem.init();
        SetTimeOfDay(12);
        SuspendTimeOfDay(true);
        CharList.GetIns().chars.push(new CharRifleman(0));
        CharList.GetIns().chars.push(new CharRifleman(1));
        CharList.GetIns().chars.push(new CharRifleman(2));
        CharList.GetIns().chars.push(new CharRifleman(3));
        CharList.GetIns().chars.push(new CharRifleman(4));
        SetPlayerName(Player(24),"|cffff0000[|cff00ff00System|cffff0000]|r")
        SetPlayerColor(Player(24), PLAYER_COLOR_SNOW)
        for(let pid = 0; pid < 24; pid++){
            FogModifierStart(CreateFogModifierRect(Player(pid), FOG_OF_WAR_VISIBLE, GetWorldBounds(), true, false));            
        }
        TimerStart(CreateTimer(), 0.02, true, () => {
            FPSCamera.GetIns().Periodic();
            CharList.GetIns().updateChars();
        });
        }
    );
}
ceres.addHook("main::after", () => tsMain());