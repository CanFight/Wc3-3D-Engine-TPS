import { LibraryLoader } from "./LibraryLoader";
import { PlayerData } from "../player/PlayerData";
import { WorldData } from "../world/WorldData";
import { GameMap } from "../world/GameMap";
import { Block } from "../world/Block";
import { Hooks } from "./Hook";

export class FPSCamera {

    private static instance: FPSCamera;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new FPSCamera();
            Hooks.set("FPSCamera", this.instance);
        }
        return this.instance;
    }

    private CursorAccuracy: number;
    private CursorLock: framehandle;
    private AlphaBlocks: Block[];

    static Use() { };

    public Periodic() {
        let cX = 0;
        let cY = 0;
        let cZ = 0;
        let cH = 0;
        let cD = 0;
        let tempB;
        let wA = 0;
        for (let i = 0; i < 24; i++) {
            cH = 0
            if (PlayerData.GetIns().camOn[i]) {
                if (PlayerData.GetIns().camMode[i] == 1 && Player(i) == GetLocalPlayer()) {
                    let cx = BlzGetLocalClientWidth() / 2.0;
                    let cy = BlzGetLocalClientHeight() / 2.0;
                    BlzSetMousePos(Math.floor(cx + 1), Math.floor(cy + 1))
                    BlzEnableCursor(false);
                }
                PlayerData.GetIns().camJaw[i] = PlayerData.GetIns().camJaw[i] - PlayerData.GetIns().MouseX[i] * PlayerData.GetIns().camSenseJaw[i];
                PlayerData.GetIns().camPitch[i] = PlayerData.GetIns().camPitch[i] - PlayerData.GetIns().MouseY[i] * PlayerData.GetIns().camSensePitch[i];
                if (PlayerData.GetIns().camJaw[i] > 360) {
                    PlayerData.GetIns().camJaw[i] = PlayerData.GetIns().camJaw[i] - 360;
                }
                if (PlayerData.GetIns().camJaw[i] < 0) {
                    PlayerData.GetIns().camJaw[i] = PlayerData.GetIns().camJaw[i] + 360;
                }
                if (PlayerData.GetIns().camPitch[i] > 360) {
                    PlayerData.GetIns().camPitch[i] = PlayerData.GetIns().camPitch[i] - 360;
                }
                if (PlayerData.GetIns().camPitch[i] < 0) {
                    PlayerData.GetIns().camPitch[i] = PlayerData.GetIns().camPitch[i] + 360;
                }
                if (PlayerData.GetIns().camPitch[i] > 80 && PlayerData.GetIns().camPitch[i] < 200) {
                    PlayerData.GetIns().camPitch[i] = 80;
                }
                if (PlayerData.GetIns().camPitch[i] < 270 && PlayerData.GetIns().camPitch[i] > 150) {
                    PlayerData.GetIns().camPitch[i] = 270;
                }
            } else {
                if (Player(i) == GetLocalPlayer()) {
                    BlzEnableCursor(true);
                }
            }

            if (Player(i) == GetLocalPlayer()) {
                cD = PlayerData.GetIns().camDist[i] * WorldData.GetIns().scale;
                for (var b of this.AlphaBlocks) {//restore alpha of old blocks
                    BlzSetSpecialEffectAlpha(b.sfx, b.alpha);
                }
                while (this.AlphaBlocks.length > 0) { //clear array
                    this.AlphaBlocks.pop();
                }
                for (let d = 0; d <= cD + WorldData.GetIns().scale; d += 0.05 * WorldData.GetIns().scale) { //add new blocks
                    for (let c = 0; c <= 6.28; c += 0.628) {
                        cX = PlayerData.GetIns().x[i] + WorldData.GetIns().scale * Math.cos(c) * Math.cos(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD + 1.57) * Cos((PlayerData.GetIns().camPitch[i] - 90) * bj_DEGTORAD) - d * Math.cos(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD) * Math.cos(PlayerData.GetIns().camPitch[i] * bj_DEGTORAD);
                        cY = PlayerData.GetIns().y[i] + WorldData.GetIns().scale * Math.cos(c) * Math.sin(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD + 1.57) * Cos((PlayerData.GetIns().camPitch[i] - 90) * bj_DEGTORAD) - d * Math.sin(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD) * Math.cos(PlayerData.GetIns().camPitch[i] * bj_DEGTORAD);
                        cZ = PlayerData.GetIns().height[i] + PlayerData.GetIns().z[i] + WorldData.GetIns().scale * Math.sin(c) * Math.sin((PlayerData.GetIns().camPitch[i] - 90) * bj_DEGTORAD) - d * Math.sin(PlayerData.GetIns().camPitch[i] * bj_DEGTORAD);
                        
                        if(Math.cos(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD) > 0){
                            if(Math.floor(cX / WorldData.GetIns().scale) > Math.floor(PlayerData.GetIns().x[i] / WorldData.GetIns().scale)){
                                cX = PlayerData.GetIns().x[i];
                            }
                        }else if(Math.cos(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD) < 0){
                            if(Math.floor(cX / WorldData.GetIns().scale) < Math.floor(PlayerData.GetIns().x[i] / WorldData.GetIns().scale)){
                                cX = PlayerData.GetIns().x[i];
                            }
                        }
                        if(Math.sin(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD) > 0){
                            if(Math.floor(cY / WorldData.GetIns().scale) > Math.floor(PlayerData.GetIns().y[i] / WorldData.GetIns().scale)){
                                cY = PlayerData.GetIns().y[i];
                            }
                        }else if(Math.sin(PlayerData.GetIns().camJaw[i] * bj_DEGTORAD) < 0){
                            if(Math.floor(cY / WorldData.GetIns().scale) < Math.floor(PlayerData.GetIns().y[i] / WorldData.GetIns().scale)){
                                cY = PlayerData.GetIns().y[i];
                            }
                        }

                        tempB = (GameMap.GetIns().getCollideBlock(cX, cY, cZ));
                        if (tempB != null) {
                            BlzSetSpecialEffectAlpha(tempB.sfx, 30);
                            this.AlphaBlocks.push(tempB);
                        }
                    }
                }

                cD *= Math.cos(bj_DEGTORAD * (360 - PlayerData.GetIns().camPitch[i]))
                cH = PlayerData.GetIns().camHeight[i] + PlayerData.GetIns().camDist[i] * WorldData.GetIns().scale * Math.sin(bj_DEGTORAD * (360 - PlayerData.GetIns().camPitch[i]));
                cX = PlayerData.GetIns().x[i] - cD * Math.cos(bj_DEGTORAD * PlayerData.GetIns().camJaw[i]);
                cY = PlayerData.GetIns().y[i] - cD * Math.sin(bj_DEGTORAD * PlayerData.GetIns().camJaw[i]);

                SetCameraQuickPosition(cX, cY);
                SetCameraPosition(cX, cY);
                SetCameraField(CAMERA_FIELD_ROTATION, PlayerData.GetIns().camJaw[i], 0.02);
                SetCameraField(CAMERA_FIELD_ANGLE_OF_ATTACK, PlayerData.GetIns().camPitch[i], 0.02);
                SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, 0, 0.02);
                SetCameraField(CAMERA_FIELD_ZOFFSET, PlayerData.GetIns().height[i] + PlayerData.GetIns().z[i] + cH, 0.02);
            }
        }
    }

    private GridUpdate() {
        let pid = GetPlayerId(GetTriggerPlayer());
        let tF = BlzGetTriggerFrame();
        BlzFrameSetEnable(tF, false)
        BlzFrameSetEnable(tF, true)
        if (Player(pid) == GetLocalPlayer() && PlayerData.GetIns().camOn[pid]) {
            BlzFrameCageMouse(this.CursorLock, true);
        } else {
            BlzFrameCageMouse(this.CursorLock, false);
        }
        let x = Number(BlzFrameGetName(tF).substring(11, 13))
        let y = Number(BlzFrameGetName(tF).substring(14, 16))
        PlayerData.GetIns().MouseX[pid] = x - (this.CursorAccuracy - 1) / 2;
        PlayerData.GetIns().MouseY[pid] = y - (this.CursorAccuracy - 1) / 2;
    }

    public SetGridSize(pid: number, ScreenSize: number) {
        let GridSize = ScreenSize / I2R(this.CursorAccuracy);
        if (Player(pid) == GetLocalPlayer()) {
            BlzFrameSetSize(this.CursorLock, ScreenSize, ScreenSize);
        }
        for (let y = 0; y < this.CursorAccuracy; y++) {
            for (let x = 0; x < this.CursorAccuracy; x++) {
                let sx = I2S(x);
                let sy = I2S(y);
                if (x < 10) {
                    sx = "0" + sx
                }
                if (y < 10) {
                    sy = "0" + sy
                }
                let GridFrame = BlzGetFrameByName("CursorGrid(" + sx + "," + sy + ")", 0);
                if (Player(pid) == GetLocalPlayer()) {
                    BlzFrameSetSize(GridFrame, GridSize, GridSize);
                    BlzFrameSetPoint(GridFrame, FRAMEPOINT_TOPLEFT, this.CursorLock, FRAMEPOINT_TOPLEFT, x * GridSize, - y * GridSize);
                }
            }
        }
    }

    public setCamMode(pid: number, mode: number) {
        if (mode == 1) {
            this.SetGridSize(pid, 0.1);
            PlayerData.GetIns().camMode[pid] = 1;
        }
        if (mode == 2) {
            this.SetGridSize(pid, 0.58);
            PlayerData.GetIns().camMode[pid] = 2;
        }
    }

    private constructor() {
        this.AlphaBlocks = [];
        this.CursorAccuracy = 33;
        let trig = CreateTrigger();
        TriggerAddAction(trig, () => this.GridUpdate());
        let ScreenSize = 0.1;
        let GridSize = ScreenSize / I2R(this.CursorAccuracy);
        this.CursorLock = BlzCreateFrameByType("TEXTBUTTON", "CursorLock", BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), "BlankCustomButtonTemplate", 0);
        BlzFrameSetSize(this.CursorLock, ScreenSize, ScreenSize);
        BlzFrameSetPoint(this.CursorLock, FRAMEPOINT_CENTER, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_CENTER, 0, 0);
        for (let y = 0; y < this.CursorAccuracy; y++) {
            for (let x = 0; x < this.CursorAccuracy; x++) {
                let sx = I2S(x);
                let sy = I2S(y);
                if (x < 10) {
                    sx = "0" + sx
                }
                if (y < 10) {
                    sy = "0" + sy
                }
                let GridFrame = BlzCreateFrameByType("TEXTBUTTON", "CursorGrid(" + sx + "," + sy + ")", this.CursorLock, "BlankCustomButtonTemplate", 0);
                BlzFrameSetSize(GridFrame, GridSize, GridSize);
                BlzFrameSetPoint(GridFrame, FRAMEPOINT_TOPLEFT, this.CursorLock, FRAMEPOINT_TOPLEFT, x * GridSize, - y * GridSize);
                BlzFrameSetTexture(GridFrame, "UI\\Alpha.tga", 0, true)
                BlzTriggerRegisterFrameEvent(trig, GridFrame, FRAMEEVENT_MOUSE_ENTER);
                BlzTriggerRegisterFrameEvent(trig, GridFrame, FRAMEEVENT_CONTROL_CLICK);
            }
        }
    }

    static init() {
        this.GetIns();
    }
}
LibraryLoader.register(FPSCamera);