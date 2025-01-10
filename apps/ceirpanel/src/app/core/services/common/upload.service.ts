/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DOCUMENT } from '@angular/common';
import { ConfigService } from 'ng-config-service';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private configService: ConfigService, @Inject(DOCUMENT) private document: any){}
  
  public featureLogo(url: string) {
    return new FileUploader({
      url: url,
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item: { _file: { name: any; size: any; type: any; }; }) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
  }


  public resource(path: string) {
    const uri = _.isEmpty(this.configService.get('api')) ? `${document.location.protocol}//${document.location.host}`: `${this.configService.get('api')}`;
    const url = `${uri}/resource/path?resource=${path}`;
    return `${uri}/resource/path?resource=${path}`;
  }
  

}
