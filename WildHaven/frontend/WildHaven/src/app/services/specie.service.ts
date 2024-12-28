import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Specie } from '../models/specie'
import { GLOBAL } from './global'

import { UserService } from './user.service'
import { Form } from '@angular/forms'

@Injectable({
    providedIn: 'root',  // Asegúrate de que el servicio sea un singleton
  })
  
export class SpecieService{
    public url:string;
    private token: string;
    
    constructor(private _http: HttpClient, private userService: UserService){
        this.url = GLOBAL.url;
        this.token = "";
    }

    getSpecies(): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"specie/list", {headers: headers})   
    }

    getSpecie(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"specie/specie/" + id, {headers: headers})   
    }

    createSpecie(formData: FormData): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.post(this.url+"specie/create/",formData, {headers: headers})   
    }

    removeSpecie(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.delete(this.url+"specie/delete/" + id, {headers: headers})   
    }

    updateSpecie(id: String | null, formData: FormData): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.put(this.url+"specie/update/" + id, formData, {headers: headers})   
    }

}
