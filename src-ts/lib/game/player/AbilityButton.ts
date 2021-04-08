export class AbilityButton {

    public pid: number;
    public cd: number;
    public cdMax: number;
    public icon: framehandle;
    public cdMask: framehandle;
    public cdText: framehandle;
    public keyText: framehandle;

    public update(){
        if(this.cd > 0){
            BlzFrameSetVisible(this.cdText, true);
            BlzFrameSetText(this.cdText, "|cffffcc00" + Math.ceil(this.cd).toString());
            BlzFrameSetSize(this.cdMask, 0.04, 0.04 * (this.cd / this.cdMax)); 
            BlzFrameSetVisible(this.cdMask, true);
            this.cd -= 0.02;
            if(this.cd <= 0){
                this.cd = 0;
                BlzFrameSetVisible(this.cdText, false);
                BlzFrameSetVisible(this.cdMask, false);
            }
        }
    }

    public constructor(pid:number, cdMax:number, iconTexture:string, keyText:string, xOffset:number) {
        this.pid = pid;
        this.cd = 0;
        this.cdMax = cdMax;
        this.icon = BlzCreateFrameByType("BACKDROP", "AbiIcon", BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME,0), "ButtonBackdropTemplate",  0)
        BlzFrameSetSize(this.icon, 0.04, 0.04)
        BlzFrameSetPoint(this.icon,FRAMEPOINT_BOTTOM,BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),FRAMEPOINT_BOTTOM,xOffset,0.01)
        BlzFrameSetTexture(this.icon, iconTexture, 0, true) 
        BlzFrameSetVisible(this.icon, Player(pid) == GetLocalPlayer());

        this.cdMask = BlzCreateFrameByType("BACKDROP", "AbiIconCdMask", this.icon, "ButtonBackdropTemplate",  0)
        BlzFrameSetSize(this.cdMask, 0.04, 0)
        BlzFrameSetPoint(this.cdMask,FRAMEPOINT_BOTTOM,this.icon,FRAMEPOINT_BOTTOM,0,0)
        BlzFrameSetTexture(this.cdMask, "UI\\GenericBackground.tga", 0, true) 
        BlzFrameSetVisible(this.cdMask, false);

        this.cdText = BlzCreateFrameByType("TEXT", "cText", this.icon, "CText_20",  0);
        BlzFrameSetSize(this.cdText, 0.04,0.04)
        BlzFrameSetPoint(this.cdText,FRAMEPOINT_CENTER,this.icon,FRAMEPOINT_CENTER,0,0)
        BlzFrameSetText(this.cdText, "");
        BlzFrameSetTextAlignment(this.cdText,TEXT_JUSTIFY_CENTER ,TEXT_JUSTIFY_CENTER )
        BlzFrameSetVisible(this.cdText, false);

        this.keyText = BlzCreateFrameByType("TEXT", "cText", this.icon, "CText_15",  0);
        BlzFrameSetSize(this.keyText, 0.04,0.04)
        BlzFrameSetPoint(this.keyText,FRAMEPOINT_BOTTOM,this.icon,FRAMEPOINT_TOP,0,0)
        BlzFrameSetText(this.keyText, keyText);
        BlzFrameSetTextAlignment(this.keyText, TEXT_JUSTIFY_BOTTOM,TEXT_JUSTIFY_CENTER )
        BlzFrameSetVisible(this.keyText, true);
        
    }
}