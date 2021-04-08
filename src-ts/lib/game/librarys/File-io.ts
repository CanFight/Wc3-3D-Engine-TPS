
export class File {

    //written by Trigger Happy
    
    // The string limit per Preload call.

    private static preloadLimit = 200;

    // The list of abilities used to read and write data. 
    // You can add more abilities to increase the max content length for files.
    private static abilityList: number[] = [FourCC("Amls"), FourCC("Aroc"), FourCC("Amic"), FourCC("Amil"), FourCC("Aclf"), FourCC("Acmg"), FourCC("Adef"), FourCC("Adis"), FourCC("Afbt"), FourCC("Afbk")];
    
    // The maximum number of characters that can be written to a file.
    public static readonly maxLength = File.preloadLimit * File.abilityList.length;

    private constructor(){ }
    
    /**
     * Write text to a file that can be read later.
     * @param filename Filename of the file.
     * @param contents Contents to write to the file.
     */
    
    static write(filename: string, contents: string){
        PreloadGenClear();
        PreloadGenStart();

        for (let i = 0; i < (contents.length / 200); i++) {
            const abilityId = File.abilityList[i];
            const buffer = contents.substr(i * File.preloadLimit, File.preloadLimit);
            Preload(`\" )\ncall BlzSetAbilityActivatedIcon(${abilityId}, "${buffer}")\n//`);
        }
        
        Preload("\" )\nendfunction\nfunction a takes nothing returns nothing\n //");
        PreloadGenEnd("LuaFpsMap\\" + filename);

        return this;
    }

    /**
    * Read text from a generated file.
    * @param filename Filename of the file.
    */
    static read(filename: string){
        let output: string = '';
        let originalTooltip: string[] = [];
        let doneReading = false;

        for (let i = 0; i < this.abilityList.length; i++) {
            originalTooltip[i] = BlzGetAbilityActivatedIcon(this.abilityList[i]);
        }
        
        Preloader("LuaFpsMap\\" + filename);

        for (let i = 0; i < this.abilityList.length; i++) {
            if (!doneReading){
                const buffer = BlzGetAbilityActivatedIcon(this.abilityList[i]);
                
                if (buffer == originalTooltip[i]){
                    doneReading = true;
                } else {
                    output += buffer;
                }
            }
            BlzSetAbilityActivatedIcon(this.abilityList[i], originalTooltip[i]);
        }

        return output;
    }
}