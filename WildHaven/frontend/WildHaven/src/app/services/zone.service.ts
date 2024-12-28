import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Zone } from '../models/zone'
import { GLOBAL } from './global'

import { UserService } from './user.service'

@Injectable({
    providedIn: 'root',  // Asegúrate de que el servicio sea un singleton
  })
  
export class ZoneService{
    public url:string;
    private token: string;
    
    constructor(private _http: HttpClient, private userService: UserService){
        this.url = GLOBAL.url;
        this.token = "";
    }

    getZones(): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"zone/list", {headers: headers})   
    }

    getZone(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"zone/zone/" + id, {headers: headers})   
    }

    createZone(formData: FormData): Observable<any>{
        console.log(formData)
        this.token = this.userService.getToken();


        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.post(this.url+"zone/create/",formData, {headers: headers})   
    }
 
    removeZone(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.delete(this.url+"zone/delete/" + id, {headers: headers})   
    }

    updateZone(id: String | null, params: FormData): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.put(this.url+"zone/update/" + id, params, {headers: headers})   
    }

}
