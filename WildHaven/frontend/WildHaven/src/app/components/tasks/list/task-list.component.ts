import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { GLOBAL } from "../../../services/global";

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
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _taskService: TaskService
    ){
        this.tasks = [];
        this.status = ""
        this.title = "Lista de tareas"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this._taskService.getTasks().subscribe(
            response => {
                this.tasks = response.tasks;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
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