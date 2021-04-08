import { LibraryLoader } from "./LibraryLoader";
import { Hooks } from "./Hook";

export class KeySetup {

    private static instance: KeySetup;

    public KeyTypList: oskeytype[] = [];
    public KeyStrList: string[] = [];

    public static GetIns() {
        if (this.instance == null) {
            this.instance = new KeySetup();
            Hooks.set("PlayerData", this.instance);
        }
        
        return this.instance;
    }

    private constructor() {
        this.KeyTypList.push(OSKEY_Q);
        this.KeyStrList.push("Q");
        this.KeyTypList.push(OSKEY_W);
        this.KeyStrList.push("W");
        this.KeyTypList.push(OSKEY_E);
        this.KeyStrList.push("E");
        this.KeyTypList.push(OSKEY_R);
        this.KeyStrList.push("R");
        this.KeyTypList.push(OSKEY_T);
        this.KeyStrList.push("T");
        this.KeyTypList.push(OSKEY_Y);
        this.KeyStrList.push("Y");
        this.KeyTypList.push(OSKEY_U);
        this.KeyStrList.push("U");
        this.KeyTypList.push(OSKEY_I);
        this.KeyStrList.push("I");
        this.KeyTypList.push(OSKEY_O);
        this.KeyStrList.push("O");
        this.KeyTypList.push(OSKEY_P);
        this.KeyStrList.push("P");
        this.KeyTypList.push(OSKEY_A);
        this.KeyStrList.push("A");
        this.KeyTypList.push(OSKEY_S);
        this.KeyStrList.push("S");
        this.KeyTypList.push(OSKEY_D);
        this.KeyStrList.push("D");
        this.KeyTypList.push(OSKEY_F);
        this.KeyStrList.push("F");
        this.KeyTypList.push(OSKEY_G);
        this.KeyStrList.push("G");
        this.KeyTypList.push(OSKEY_H);
        this.KeyStrList.push("H");
        this.KeyTypList.push(OSKEY_J);
        this.KeyStrList.push("J");
        this.KeyTypList.push(OSKEY_K);
        this.KeyStrList.push("K");
        this.KeyTypList.push(OSKEY_L);
        this.KeyStrList.push("L");
        this.KeyTypList.push(OSKEY_Z);
        this.KeyStrList.push("Z");
        this.KeyTypList.push(OSKEY_X);
        this.KeyStrList.push("X");
        this.KeyTypList.push(OSKEY_C);
        this.KeyStrList.push("C");
        this.KeyTypList.push(OSKEY_V);
        this.KeyStrList.push("V");
        this.KeyTypList.push(OSKEY_B);
        this.KeyStrList.push("B");
        this.KeyTypList.push(OSKEY_N);
        this.KeyStrList.push("N");
        this.KeyTypList.push(OSKEY_M);
        this.KeyStrList.push("M");
        this.KeyTypList.push(OSKEY_SPACE);
        this.KeyStrList.push("SPACE");
        this.KeyTypList.push(OSKEY_1);
        this.KeyStrList.push("1");
        this.KeyTypList.push(OSKEY_2);
        this.KeyStrList.push("2");
        this.KeyTypList.push(OSKEY_3);
        this.KeyStrList.push("3");
        this.KeyTypList.push(OSKEY_4);
        this.KeyStrList.push("4");
        this.KeyTypList.push(OSKEY_5);
        this.KeyStrList.push("5");
        this.KeyTypList.push(OSKEY_6);
        this.KeyStrList.push("6");
        this.KeyTypList.push(OSKEY_7);
        this.KeyStrList.push("7");
        this.KeyTypList.push(OSKEY_8);
        this.KeyStrList.push("8");
        this.KeyTypList.push(OSKEY_9);
        this.KeyStrList.push("9");
        this.KeyTypList.push(OSKEY_0);
        this.KeyStrList.push("0");
    }

    static init(){
        this.GetIns();
    }
}
LibraryLoader.register(KeySetup);