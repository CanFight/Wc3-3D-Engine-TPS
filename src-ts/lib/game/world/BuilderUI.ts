import { Hooks } from "../librarys/Hook";
import { Builder } from "./Builder";

export class BuilderUI {

    private static instance: BuilderUI;

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new BuilderUI();
            Hooks.set("BuilderUI", this.instance);
        }
        return this.instance;
    }

    public background : framehandle;
    private colorSpectrum : framehandle;
    private darkSpectrum : framehandle;
    private brightSpectrum : framehandle;
    private colorModel : framehandle;
    private alpha : framehandle;
    private sizeX : framehandle;
    private sizeY : framehandle;
    private sizeZ : framehandle;
    private range : framehandle;
    private black : number[];
    private white : number[];
    private red : number[];
    private green : number[];
    private blue : number[];

    private syncIntRecieve(){
        let s = "";
        let d = "";
        let n = 0;
        let pid = GetPlayerId(GetTriggerPlayer());
        if(BlzGetTriggerSyncPrefix() == "syncBuild"){
            s = BlzGetTriggerSyncData();
            if(s.substring(0,6) == "colorR"){
                d = s.substring(6,s.length);
                n = Number(d);
                this.red[pid] = n;
                Builder.GetIns().cRed[pid] = n + Math.floor((255 - n) * this.white[pid] - n * this.black[pid]);
            }
            if(s.substring(0,6) == "colorG"){
                d = s.substring(6,s.length);
                n = Number(d);
                this.green[pid] = n;
                Builder.GetIns().cGreen[pid] = n + Math.floor((255 - n) * this.white[pid] - n * this.black[pid]);
            }
            if(s.substring(0,6) == "colorB"){
                d = s.substring(6,s.length);
                n = Number(d);
                this.blue[pid] = n;
                Builder.GetIns().cBlue[pid] = n + Math.floor((255 - n) * this.white[pid] - n * this.black[pid]);
            }
            if(s.substring(0,5) == "black"){
                d = s.substring(5,s.length);
                this.black[pid] = Number(d) / 100;
                Builder.GetIns().cRed[pid] = this.red[pid] + Math.floor((255 - this.red[pid]) * this.white[pid] - this.red[pid] * this.black[pid]);
                Builder.GetIns().cGreen[pid] = this.green[pid] + Math.floor((255 - this.green[pid]) * this.white[pid] - this.green[pid] * this.black[pid]);
                Builder.GetIns().cBlue[pid] = this.blue[pid] + Math.floor((255 - this.blue[pid]) * this.white[pid] - this.blue[pid] * this.black[pid]);
            }
            if(s.substring(0,5) == "white"){
                d = s.substring(5,s.length);
                this.white[pid] = Number(d) / 100;
                Builder.GetIns().cRed[pid] = this.red[pid] + Math.floor((255 - this.red[pid]) * this.white[pid] - this.red[pid] * this.black[pid]);
                Builder.GetIns().cGreen[pid] = this.green[pid] + Math.floor((255 - this.green[pid]) * this.white[pid] - this.green[pid] * this.black[pid]);
                Builder.GetIns().cBlue[pid] = this.blue[pid] + Math.floor((255 - this.blue[pid]) * this.white[pid] - this.blue[pid] * this.black[pid]);
            }
            if(s.substring(0,5) == "alpha"){
                d = s.substring(5,s.length);
                Builder.GetIns().cAlpha[pid] = Number(d);
            }
            if(s.substring(0,5) == "sizeX"){
                d = s.substring(5,s.length);
                Builder.GetIns().sX[pid] = Number(d);
            }
            if(s.substring(0,5) == "sizeY"){
                d = s.substring(5,s.length);
                Builder.GetIns().sY[pid] = Number(d);
            }
            if(s.substring(0,5) == "sizeZ"){
                d = s.substring(5,s.length);
                Builder.GetIns().sZ[pid] = Number(d);
            }
            if(s.substring(0,5) == "range"){
                d = s.substring(5,s.length);
                Builder.GetIns().range[pid] = Number(d);
            }
        }
    }
    private syncInt(pid:number, head:string, data:number){
        if(Player(pid) == GetLocalPlayer()){
            BlzSendSyncData("syncBuild",head + Math.floor(data));
        } 
    }

    private setSizeX(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let v = 0;
        if(Player(pid) == GetLocalPlayer()){
            v = Math.floor(1 + 4 * BlzFrameGetValue(BlzGetTriggerFrame()));
            BlzFrameSetText(this.sizeX, "|cffffcc00Size X = " + v);
            this.syncInt(pid,"sizeX",v); 
        }
    }
    private setSizeY(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let v = 0;
        if(Player(pid) == GetLocalPlayer()){
            v = Math.floor(1 + 4 * BlzFrameGetValue(BlzGetTriggerFrame()));
            BlzFrameSetText(this.sizeY, "|cffffcc00Size Y = " + v);
            this.syncInt(pid,"sizeY",v); 
        }
    }
    private setSizeZ(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let v = 0;
        if(Player(pid) == GetLocalPlayer()){
            v = Math.floor(1 + 4 * BlzFrameGetValue(BlzGetTriggerFrame()));
            BlzFrameSetText(this.sizeZ, "|cffffcc00Size Z = " + v);
            this.syncInt(pid,"sizeZ",v); 
        }
    }
    private setRange(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let v = 0;
        if(Player(pid) == GetLocalPlayer()){
            v = Math.floor(1 + 41 * BlzFrameGetValue(BlzGetTriggerFrame()));
            BlzFrameSetText(this.range, "|cffffcc00Range = " + v);
            this.syncInt(pid,"range",v); 
        }
    }

    private setBlack(){
        let pid = GetPlayerId(GetTriggerPlayer());
        if(Player(pid) == GetLocalPlayer()){
            this.syncInt(pid,"black",Math.floor(BlzFrameGetValue(BlzGetTriggerFrame()) * 100)) 
        }
    }
    private setWhite(){
        let pid = GetPlayerId(GetTriggerPlayer());
        if(Player(pid) == GetLocalPlayer()){
            this.syncInt(pid,"white",Math.floor(BlzFrameGetValue(BlzGetTriggerFrame()) * 100)) 
        }
    }

    private setColor(){
        let pid = GetPlayerId(GetTriggerPlayer());
        if(Player(pid) == GetLocalPlayer()){
            let angle = 359.9 * BlzFrameGetValue(BlzGetTriggerFrame());
            BlzFrameSetTexture(this.colorModel, "UI\\Colors\\ColorTex" + Math.floor(angle/10) + ".tga", 0, true);
            this.syncInt(pid,"colorR",Math.min(255, Math.max(0, Math.floor(Math.abs(((180 - angle) * 510) / 120.)) - 255))) 
            this.syncInt(pid,"colorG",Math.min(255, Math.max(0, Math.floor(510 - Math.abs(((angle - 120) * 510) / 120.)))))
            this.syncInt(pid,"colorB",Math.min(255, Math.max(0, Math.floor(510 - Math.abs(((angle - 240) * 510) / 120.)))))
        }
    }

    private setAlpha(){
        let pid = GetPlayerId(GetTriggerPlayer());
        let v = 0;
        if(Player(pid) == GetLocalPlayer()){
            v = Math.floor(255 - 255 * BlzFrameGetValue(BlzGetTriggerFrame()));
            BlzFrameSetText(this.alpha, "|cffffcc00Alpha = " + v);
            this.syncInt(pid,"alpha",v); 
        }
    }

    private constructor() {
        this.black = [];
        this.white = [];
        this.red = [];
        this.green = [];
        this.blue = [];
        for(let i = 0; i < 24; i++){
            this.black.push(0);
            this.white.push(0);
            this.red.push(255);
            this.green.push(0);
            this.blue.push(0);
        }
        let trigg;
        let fh;
        this.background = BlzCreateFrameByType("BACKDROP", "BuildUIBG", BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME,0), "ButtonBackdropTemplate",  0)
        BlzFrameSetSize(this.background, 0.15, 0.3)
        BlzFrameSetPoint(this.background,FRAMEPOINT_TOPRIGHT,BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),FRAMEPOINT_TOPRIGHT,0,0)
        BlzFrameSetTexture(this.background, "UI\\Alpha.tga", 0, true) 
        BlzFrameSetVisible(this.background, false);
        
        this.colorModel = BlzCreateFrameByType("BACKDROP", "ColorModel", this.background, "ButtonBackdropTemplate",  0);
        BlzFrameSetSize(this.colorModel, 0.14, 0.06);
        BlzFrameSetPoint(this.colorModel,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.04);
        BlzFrameSetTexture(this.colorModel, "UI\\Colors\\ColorTex0.tga", 0, true);
        
        
        fh = BlzCreateFrameByType("BACKDROP", "background", this.background, "ButtonBackdropTemplate",  0);
        BlzFrameSetSize(fh, 0.14, 0.03);
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.01)
        BlzFrameSetTexture(fh, "UI\\ColorSpectrum.tga", 0, true);
        this.colorSpectrum  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(this.colorSpectrum, 0.14,0.03)
        BlzFrameSetPoint(this.colorSpectrum,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.01)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setColor());
        BlzTriggerRegisterFrameEvent(trigg,this.colorSpectrum,FRAMEEVENT_SLIDER_VALUE_CHANGED); 
        fh = BlzGetFrameByName("StandardScrollBarBackdropTemplate",0);
        BlzFrameSetTexture(fh, "UI\\Alpha.tga", 0, true)
        BlzFrameSetSize(fh, 0.14,0.03) 
        
        
        fh = BlzCreateFrameByType("BACKDROP", "background", this.background, "ButtonBackdropTemplate",  0);
        BlzFrameSetSize(fh, 0.14, 0.03);
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.04)
        BlzFrameSetTexture(fh, "UI\\DarkSpectrum.tga", 0, true);
        this.darkSpectrum  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(this.darkSpectrum, 0.14,0.03)
        BlzFrameSetPoint(this.darkSpectrum,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.04)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setBlack());
        BlzTriggerRegisterFrameEvent(trigg,this.darkSpectrum,FRAMEEVENT_SLIDER_VALUE_CHANGED); 
        fh = BlzGetFrameByName("StandardScrollBarBackdropTemplate",0);
        BlzFrameSetTexture(fh, "UI\\Alpha.tga", 0, true)
        BlzFrameSetSize(fh, 0.14,0.03)
        
        
        fh = BlzCreateFrameByType("BACKDROP", "background", this.background, "ButtonBackdropTemplate",  0);
        BlzFrameSetSize(fh, 0.14, 0.03);
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.07)
        BlzFrameSetTexture(fh, "UI\\BrightSpectrum.tga", 0, true);
        this.brightSpectrum  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(this.brightSpectrum, 0.14,0.03)
        BlzFrameSetPoint(this.brightSpectrum,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.07)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setWhite());
        BlzTriggerRegisterFrameEvent(trigg,this.brightSpectrum,FRAMEEVENT_SLIDER_VALUE_CHANGED); 
        fh = BlzGetFrameByName("StandardScrollBarBackdropTemplate",0);
        BlzFrameSetTexture(fh, "UI\\Alpha.tga", 0, true)
        BlzFrameSetSize(fh, 0.14,0.03)

        
        this.alpha = BlzCreateFrameByType("TEXT", "cText", this.background, "CText_10",  0);
        BlzFrameSetSize(this.alpha, 0.14,0.01)
        BlzFrameSetPoint(this.alpha,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.10)
        BlzFrameSetText(this.alpha, "|cffffcc00Alpha = 255");
        BlzFrameSetTextAlignment(this.alpha,TEXT_JUSTIFY_CENTER ,TEXT_JUSTIFY_CENTER )
        fh  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(fh, 0.14,0.02)
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.11)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setAlpha());
        BlzTriggerRegisterFrameEvent(trigg,fh,FRAMEEVENT_SLIDER_VALUE_CHANGED); 

        this.sizeX = BlzCreateFrameByType("TEXT", "cText", this.background, "CText_10",  0);
        BlzFrameSetSize(this.sizeX, 0.14,0.01)
        BlzFrameSetPoint(this.sizeX,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.13)
        BlzFrameSetText(this.sizeX, "|cffffcc00Size X = 1");
        BlzFrameSetTextAlignment(this.sizeX,TEXT_JUSTIFY_CENTER ,TEXT_JUSTIFY_CENTER )
        fh  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(fh, 0.14,0.02)
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.14)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setSizeX());
        BlzTriggerRegisterFrameEvent(trigg,fh,FRAMEEVENT_SLIDER_VALUE_CHANGED); 

        this.sizeY = BlzCreateFrameByType("TEXT", "cText", this.background, "CText_10",  0);
        BlzFrameSetSize(this.sizeY, 0.14,0.01)
        BlzFrameSetPoint(this.sizeY,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.16)
        BlzFrameSetText(this.sizeY, "|cffffcc00Size Y = 1");
        BlzFrameSetTextAlignment(this.sizeY,TEXT_JUSTIFY_CENTER ,TEXT_JUSTIFY_CENTER )
        fh  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(fh, 0.14,0.02)
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.17)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setSizeY());
        BlzTriggerRegisterFrameEvent(trigg,fh,FRAMEEVENT_SLIDER_VALUE_CHANGED); 
        
        this.sizeZ = BlzCreateFrameByType("TEXT", "cText", this.background, "CText_10",  0);
        BlzFrameSetSize(this.sizeZ, 0.14,0.01)
        BlzFrameSetPoint(this.sizeZ,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.19)
        BlzFrameSetText(this.sizeZ, "|cffffcc00Size Z = 1");
        BlzFrameSetTextAlignment(this.sizeZ,TEXT_JUSTIFY_CENTER ,TEXT_JUSTIFY_CENTER )
        fh  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(fh, 0.14,0.02)
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.20)
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setSizeZ());
        BlzTriggerRegisterFrameEvent(trigg,fh,FRAMEEVENT_SLIDER_VALUE_CHANGED); 
        
        this.range = BlzCreateFrameByType("TEXT", "cText", this.background, "CText_10",  0);
        BlzFrameSetSize(this.range, 0.14,0.01)
        BlzFrameSetPoint(this.range,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.22)
        BlzFrameSetText(this.range, "|cffffcc00Range = 20");
        BlzFrameSetTextAlignment(this.range,TEXT_JUSTIFY_CENTER ,TEXT_JUSTIFY_CENTER )
        fh  = BlzCreateFrame("StandardSliderTemplate", this.background, 0,0)
        BlzFrameSetSize(fh, 0.14,0.02)
        BlzFrameSetPoint(fh,FRAMEPOINT_TOP,this.background,FRAMEPOINT_TOP,0,-0.23)
        BlzFrameSetValue(fh,0.5);
        trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.setRange());
        BlzTriggerRegisterFrameEvent(trigg,fh,FRAMEEVENT_SLIDER_VALUE_CHANGED); 

        let trig = CreateTrigger();
        TriggerAddAction(trig, () => this.syncIntRecieve());
        for(let i = 0; i < 23; i++){
                BlzTriggerRegisterPlayerSyncEvent(trig, Player(i), "syncBuild", false);
        }
    }
    
    static init(){
        this.GetIns();
    }
}