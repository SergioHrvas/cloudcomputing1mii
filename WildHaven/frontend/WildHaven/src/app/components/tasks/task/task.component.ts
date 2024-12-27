import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { Inhabitant } from "../../../models/inhabitant";

import { GLOBAL } from "../../../services/global";

@Component({
    selector: 'task',
    templateUrl: './task.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [TaskService]

})

export class TaskComponent implements OnInit{

    public url: String;
    public task: Task;
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _taskService: TaskService
    ){
        this.task = new Task(
            "", "", "", undefined, "", undefined, undefined, undefined
        );
        this.status = ""
        this.title = "Zona"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this._taskService.getTask(id).subscribe(
            response => {
                console.log(response)
                this.task = response.task;
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