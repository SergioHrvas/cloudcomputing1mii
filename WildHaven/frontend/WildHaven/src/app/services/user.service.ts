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

    saveUser(user_to_register: User): Observable<any>{
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+"user/register", params, {headers: headers})
        
    }



    updateUser(user_to_edit: User, profileImage: File | null): Observable<any>{
        
        const formData = new FormData();
        formData.append('name', user_to_edit.name.toString());
        formData.append('surname', user_to_edit.surname.toString());
        formData.append('email', user_to_edit.email.toString());
        // Solo añadir la imagen si está seleccionada
        if (profileImage) {
            formData.append('image', profileImage, profileImage.name);
        }
        
            
        let headers = new HttpHeaders().set("Authorization", this.getToken());

        console.log(formData)
        return this._http.put(this.url+"user/update/" + user_to_edit._id, formData, {headers: headers})
        
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
        var item;
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

    
}
