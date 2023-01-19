import { Component } from '@angular/core';
import { FileDetail } from 'src/app/model/file-detail.model';
import { PdfServiceService } from 'src/app/services/pdf-service.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  incomingFiles: File[] = [];
  infilesOnServer: FileDetail[] | undefined;
  outFileFromServer: FileDetail | undefined;
  mergeComplete: boolean | undefined;
  uploadComplete: boolean | undefined;
  fileNumberError: string | undefined;
  fileNumberErrorString: string = "Only 10 or less files allowed to upload";
  fileExtensionError: string = "only pdf files are allowed";

  constructor(private pdfService: PdfServiceService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: Event){
    this.uploadComplete = false;
    var htmlInputEvent = event.target as HTMLInputElement;
    //console.log(htmlInputEvent.files);
    const fileList = htmlInputEvent.files;
    if(this.validateFilesInput(fileList as FileList)){
      this.droppedFiles(fileList);
    }else{
      this.uploadComplete = true;
    }
  }

  validateFilesInput(fileList: FileList){
    if(fileList && fileList?.length > 10 || this.incomingFiles.length > 10 || (fileList?.length + this.incomingFiles.length) > 10 ) {
      this.fileNumberError = this.fileNumberErrorString;
      alert( this.fileNumberErrorString);
      return false;
    }
    // validate files extension
    for(let i=0; i< fileList.length; i++){
         var ext = fileList[i].name.split(".").pop();
         if(ext != 'pdf'){
          alert(this.fileExtensionError);
          return false;
         }
    }
    return true;
  }

  mergeFiles(){
    this.mergeComplete = false;
    let fileNames: string[] = [];
    if(this.infilesOnServer){
        this.infilesOnServer.forEach(f=>{
          if(f.name){
            fileNames.push(f.name);
          }
        });
    }
    this.pdfService.mergeFiles(fileNames).forEach(res => {
      this.outFileFromServer = res;
      if(res.name){
        this.getMergedFileFromServer(res.name);
      }
      this.mergeComplete = true;
    });
  }

  getMergedFileFromServer(fileName:string) {
    this.pdfService.downloadFile(fileName).subscribe(blob=>{
      let url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf'}));
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
    setTimeout(
      ()=>{
        window.URL.revokeObjectURL(url);
      }
    );
    });
  }

  droppedFiles(event: FileList| null): void {
    this.uploadComplete = false;
    if(this.validateFilesInput(event!)){
      if(event && event.length >0){
        const fileCount = event.length;
        if(this.incomingFiles.length ==0){
          for(let i=0; i<fileCount ; i++){
            this.incomingFiles[i] = event[i];
          }
          this.pdfService.uploadFiles(this.incomingFiles).forEach(res => {
            this.infilesOnServer = res;
            this.uploadComplete = true;
          });
        }else {
          var length = this.incomingFiles.length;
          var newFiles: File[] = [];
          for(let i=0; i<fileCount ; i++){
            this.incomingFiles[length+i] = event[i];
            newFiles[i] = event[i];
          }
          this.pdfService.uploadFiles(newFiles).forEach(res => {
            this.infilesOnServer = this.infilesOnServer?.concat(res);
            this.uploadComplete = true;
          });
        }
      }
    }

  }
}
