import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Zone } from '../models/zone'
import { GLOBAL } from './global'

@Injectable({
    providedIn: 'root',  // Asegúrate de que el servicio sea un singleton
  })
  
export class ZoneService{
    public url:string;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getZones(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.get(this.url+"zone/list", {headers: headers})   
    }
}
