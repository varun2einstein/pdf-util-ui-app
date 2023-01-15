import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileDetail } from '../model/file-detail.model';

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }


  uploadFiles(files:File[]){
     let uploadApi = this.apiUrl.concat("upload");
     let formData = new FormData();
     files.forEach(f=>{
      formData.append("files", f);
     });
     let filesObservable: Observable<FileDetail[]>  = this.http.post<FileDetail[]>(uploadApi, formData);
     return filesObservable;
  }

  mergeFiles(fileNames: string[]){
    let mergeApi = this.apiUrl.concat("merge");
    let fNames:string = fileNames.toString();
    
    let mergeFileObservable: Observable<FileDetail> = this.http.get<FileDetail>(mergeApi, {params:{files: fNames}});
    return mergeFileObservable;
  }

  downloadFile(fineName:string){
    let downloadApi = this.apiUrl.concat("download").concat("/"+fineName);
    let downloadObservable: Observable<Blob> =  this.http.get(downloadApi, {
      responseType: 'blob'
    });
    return downloadObservable;
  }

}
