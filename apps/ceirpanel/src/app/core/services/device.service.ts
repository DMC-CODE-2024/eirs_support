import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable } from 'rxjs';
import { ApiUtilService } from './common/api.util.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient, private apiutil: ApiUtilService) { }
  pageView(state: ClrDatagridStateInterface): Observable<unknown>{
    return this.apiutil.post(`/device/page-view`, state);
  }
}
