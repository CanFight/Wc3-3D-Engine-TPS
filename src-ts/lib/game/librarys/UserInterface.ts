import { LibraryLoader } from "./LibraryLoader";
import { BuilderUI } from "../world/BuilderUI";

export class UserInterface {

    private static CrossHair: framehandle;
    static Use(){};

    private static TextInput(){
        print(BlzFrameGetText(BlzGetTriggerFrame()));
    }

    static init(){
        BlzLoadTOCFile("UI\\Toc.toc")
        let gameUI = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0)
        BlzHideOriginFrames(true);

        let frame : framehandle;
        BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME,0), gameUI)
        frame = BlzGetFrameByName("ConsoleUI", 0);
        BlzFrameSetAllPoints(frame, gameUI);
        BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOM, gameUI, FRAMEPOINT_BOTTOM, -1, -1);
        
        let screenOffset = (0.8 - BlzGetLocalClientWidth() / BlzGetLocalClientHeight() * 0.6) / 2

        BlzFrameSetPoint(BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0), FRAMEPOINT_BOTTOM, gameUI, FRAMEPOINT_BOTTOM, 0, 0.01);
        
        BlzFrameSetPoint(BlzGetOriginFrame(ORIGIN_FRAME_UBERTOOLTIP, 0), FRAMEPOINT_BOTTOMRIGHT, gameUI, FRAMEPOINT_BOTTOMRIGHT, 0 - screenOffset, 0);
        
        /*let trigg = CreateTrigger();
        TriggerAddAction(trigg, () => this.TextInput());
        let fh  = BlzCreateFrame("StandardDecoratedEditBoxTemplate", BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME,0), 0,0)
        BlzFrameSetSize(fh, 0.2,0.03)
        BlzFrameSetAbsPoint(fh, FRAMEPOINT_CENTER, 0.4,0.2)
        BlzTriggerRegisterFrameEvent(trigg,fh,FRAMEEVENT_EDITBOX_TEXT_CHANGED);*/
        this.CrossHair = BlzCreateFrameByType("BACKDROP", "CrossHair", BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME,0), "ButtonBackdropTemplate",  0)
        BlzFrameSetSize(this.CrossHair, 0.032, 0.032)
        BlzFrameSetPoint(this.CrossHair,FRAMEPOINT_CENTER,BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI,0),FRAMEPOINT_CENTER,0,0)
        BlzFrameSetTexture(this.CrossHair, "UI\\CrossHair.tga", 0, true)

        frame = BlzGetFrameByName("UpperButtonBarFrame",0);
        BlzFrameSetVisible(frame, false);
        frame = BlzGetFrameByName("UpperButtonBarQuestsButton",0);
        BlzFrameClearAllPoints(frame);
        BlzFrameSetAbsPoint(frame,FRAMEPOINT_TOPLEFT,0 + screenOffset,0.6);
        frame = BlzGetFrameByName("UpperButtonBarMenuButton",0);
        BlzFrameClearAllPoints(frame);
        BlzFrameSetAbsPoint(frame,FRAMEPOINT_TOPLEFT,0 + screenOffset,0.578);
        frame = BlzGetFrameByName("UpperButtonBarAlliesButton",0);
        BlzFrameClearAllPoints(frame);
        BlzFrameSetAbsPoint(frame,FRAMEPOINT_TOPLEFT,0 + screenOffset,0.556);
        frame = BlzGetFrameByName("UpperButtonBarChatButton",0);
        BlzFrameClearAllPoints(frame);
        BlzFrameSetAbsPoint(frame,FRAMEPOINT_TOPLEFT,0 + screenOffset,0.534);

        frame = BlzGetFrameByName("ResourceBarFrame",0);
        BlzFrameSetVisible(frame, true);
        BlzFrameClearAllPoints(frame);
        BlzFrameSetAbsPoint(frame,FRAMEPOINT_TOPRIGHT,0.8 - screenOffset + BlzFrameGetWidth(frame),0.6 + BlzFrameGetHeight(frame));

        BuilderUI.init();
    }
}
LibraryLoader.register(UserInterface);