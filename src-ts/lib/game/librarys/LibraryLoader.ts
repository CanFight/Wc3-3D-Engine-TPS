
interface ILibrary { name: string, init(): void }

export class LibraryLoader {

    private static libraries: ILibrary[] = [];

    private constructor() { }
    
    /**
    * Registers a library to be initialized.
    * @param library - The class with a static init method.
    */
   
    static register(library: ILibrary){
        this.libraries.push(library);
    }

    /**
    * Run all libraries init methods.
    */
   
    static runInitializers(){

        let fails = 0;

        for (let index = 0; index < this.libraries.length; index++) {
            const lib = this.libraries[index];
            let success = false;
            try {
                lib.init();
                success = true;
                //lib.initialized = true;
            } catch (err) {
                fails++;
            }
        }

        if (fails > 0){
        }
    }

}
//ceres.addHook("main::after", () => LibraryLoader.runInitializers());