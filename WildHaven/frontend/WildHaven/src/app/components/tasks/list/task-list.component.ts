import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { GLOBAL } from "../../../services/global";
import { UserService } from "../../../services/user.service";

@Component({
    selector: 'task',
    templateUrl: './task-list.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [TaskService]

})

export class TasksComponent implements OnInit{

    public url: String;
    public tasks: Task[];
    public myTasks: Task[];
    public myOwnTasks: Task[]
    private status: String;
    public title: String;

    constructor(        
        private _taskService: TaskService,
        private _userService: UserService
    ){
        this.tasks = [];
        this.myOwnTasks = [];
        this.myTasks = [];
        this.status = ""
        this.title = "Lista de tareas"
        this.url = GLOBAL.url;
    }

    isAdmin(): boolean {
        return this._userService.isAdmin();
      }

    ngOnInit() {
        this._taskService.getMyTasks().subscribe(
            response => {
                this.myTasks = response.tasks;
                this.tasks = this.myTasks;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
        this._taskService.getMyOwnedTasks().subscribe(
            response => {
                this.myOwnTasks = response.tasks;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    charge(tipo: String){
        if(tipo == "assignedToMe"){
            this.tasks = this.myTasks
        }else{
            this.tasks = this.myOwnTasks
        }
    }

    removeTask(id: String) {
        this._taskService.removeTask(id).subscribe(
            response => {
                window.location.reload()
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }


}