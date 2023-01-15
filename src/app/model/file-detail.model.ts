export class FileDetail {

     fileUrl: string | undefined;
     message: string | undefined;
     name: string | undefined;

    FileDetail( fileUrl: string,  message: string, name: string){
        this.fileUrl = fileUrl;
        this.message = message;
        this.name = name;
    }
   

}
