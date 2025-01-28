import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Inhabitant } from '../models/inhabitant'
import { GLOBAL } from './global'

import { UserService } from './user.service'
import { Form } from '@angular/forms'

@Injectable({
    providedIn: 'root',  // Asegúrate de que el servicio sea un singleton
  })
  
export class InhabitantService{
    public url:string;
    private token: string;
    
    constructor(private _http: HttpClient, private userService: UserService){
        this.url = GLOBAL.url;
        this.token = "";
    }

    getInhabitants(): Observable<any>{
        this.token = this.userService.getToken();

        return this._http.get(this.url+"inhabitant/list")
    }

    getInhabitant(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"inhabitant/inhabitant/" + id, {headers: headers})   
    }

    createInhabitant(formData : FormData): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.post(this.url+"inhabitant/create/",formData, {headers: headers})   
    }

    removeInhabitant(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.delete(this.url+"inhabitant/delete/" + id, {headers: headers})   
    }

    updateInhabitant(id: String | null, formData: FormData): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.put(this.url+"inhabitant/update/" + id, formData, {headers: headers})   
    }

    sponsorInhabitant(data: String): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token).set("Content-Type", "application/json"); // Asegura que el contenido se envía como JSON

        return this._http.post(this.url+"sponsorship/sponsorship", data, {headers: headers})   
    }


    unsponsorInhabitant(data: String): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token).set("Content-Type", "application/json"); // Asegura que el contenido se envía como JSON

        return this._http.put(this.url+"sponsorship/finishSponsorship", data, {headers: headers})   
    }


    getMySponsorships(): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token).set("Content-Type", "application/json"); // Asegura que el contenido se envía como JSON

        return this._http.get(this.url+"sponsorship/mySponsorships", {headers: headers})   
    }


}
