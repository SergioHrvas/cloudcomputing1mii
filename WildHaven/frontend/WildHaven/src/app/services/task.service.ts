import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Task } from '../models/task'
import { GLOBAL } from './global'

import { UserService } from './user.service'

@Injectable({
    providedIn: 'root',  // Asegúrate de que el servicio sea un singleton
  })
  
export class TaskService{
    public url:string;
    private token: string;
    
    constructor(private _http: HttpClient, private userService: UserService){
        this.url = GLOBAL.url;
        this.token = "";
    }

    getTasks(): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"task/list", {headers: headers})   
    }

    
    getMyTasks(): Observable<any>{
        this.token = this.userService.getToken();
        var identity = this.userService.getIdentity();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        console.log(identity)
        return this._http.get(this.url+"task/tasksToUser/" + identity._id, {headers: headers})   
    }

        
    getMyOwnedTasks(): Observable<any>{
        this.token = this.userService.getToken();
        var identity = this.userService.getIdentity();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        console.log(identity)
        return this._http.get(this.url+"task/tasksByUser/" + identity._id, {headers: headers})   
    }


    getTask(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.get(this.url+"task/task/" + id, {headers: headers})   
    }

    createTask(task: Task): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.post(this.url+"task/create/", task, {headers: headers})   
    }

    removeTask(id: String | null): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.token)

        return this._http.delete(this.url+"task/delete/" + id, {headers: headers})   
    }

    updateTask(id: String | null, params: FormData): Observable<any>{
        this.token = this.userService.getToken();

        let headers = new HttpHeaders().set("Authorization", this.token)

        return this._http.put(this.url+"task/update/" + id, params, {headers: headers})   
    }
}
