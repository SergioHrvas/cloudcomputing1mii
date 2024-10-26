import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../models/user'
import { GLOBAL } from './global'

@Injectable({
    providedIn: 'root',  // Asegúrate de que el servicio sea un singleton
  })
  
export class UserService{
    public url:string;
    public identity: any;
    public token: string;
    public stats: any;
    
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
        this.token = "";
        this.identity = null;
        this.stats = null;
        
    }

    loginUser(user: any, gettoken = null): Observable<any>{
        if(user != null){
            user.gettoken = gettoken;
        }
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+"user/login", params, {headers: headers})   
    }

}
