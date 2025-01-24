import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../models/user'
import { GLOBAL } from './global'
import { json } from 'stream/consumers'

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

    loginUser(user: any): Observable<any>{
        
        user.gettoken = true

        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        
        return this._http.post(this.url+"user/login", params, {headers: headers})   
    }

    saveUser(user_to_register: User): Observable<any>{
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+"user/register", params, {headers: headers})
        
    }




    updateUser(id: String | null, formData: FormData): Observable<any>{
        this.token = this.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.put(this.url+"user/update/" + id, formData, {headers: headers})   
    }


    getIdentity(){
        var item = null;
        if (typeof localStorage !== 'undefined') {
            item = localStorage.getItem('Identity');
        } else if (typeof sessionStorage !== 'undefined') {
            item = sessionStorage.getItem('Identity');
          } else {
            // If neither localStorage nor sessionStorage is supported
            console.log('Web Storage is not supported in this environment.');
          }
        
        var identity = item != null ? JSON.parse(item) : JSON.parse("null");

        if(identity != "undefined"){
            this.identity = identity;
        }
        else{
            this.identity = null;
        }
        return this.identity;
    }
    

    public getToken(){
        var item;
        if (typeof localStorage !== 'undefined') {
            item = localStorage.getItem('Token');
        } else if (typeof sessionStorage !== 'undefined') {
            item = sessionStorage.getItem('Token');
          } else {
            // If neither localStorage nor sessionStorage is supported
            console.log('Web Storage is not supported in this environment.');
          }
        
        var token = item != null ? JSON.parse(item) : JSON.parse("null");

        if(token != "undefined"){
            this.token = token;
        }
        else{
            this.token = "";
        }
        return this.token;
    }


    // Método para comprobar si el usuario está autenticado
    isAuthenticated(): boolean {
        if (typeof localStorage !== 'undefined') {
            return !!localStorage.getItem('Token');  
        } else if (typeof sessionStorage !== 'undefined') {
            return !!sessionStorage.getItem('Token');  
        } else {
            // If neither localStorage nor sessionStorage is supported
            console.log('Web Storage is not supported in this environment.');
            return false;
          }
    }

    
    // Método para comprobar si el usuario está autenticado
    isAdmin(): boolean {
        var identity = this.getIdentity()
        
        if(identity === null){
            return false;
        }
        return (identity.role === "ROLE_ADMIN")
    }

    logout() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('Token');
            localStorage.removeItem('Identity')

        } else if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('Token');
            sessionStorage.removeItem('Identity')
        } else {
            // If neither localStorage nor sessionStorage is supported
            console.log('Web Storage is not supported in this environment.');
          }
    }


    getUsers(): Observable<any>{
        this.token = this.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"user/list", {headers: headers})   
    }


    removeUser(id: String | null): Observable<any>{
        this.token = this.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.delete(this.url+"user/delete/" + id, {headers: headers})   
    }

    getUser(id: String | null): Observable<any>{
        this.token = this.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"user/user/" + id, {headers: headers})   
    }
    
}
