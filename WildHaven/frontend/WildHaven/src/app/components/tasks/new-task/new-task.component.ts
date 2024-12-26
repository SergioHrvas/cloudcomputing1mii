import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { GLOBAL } from "../../../services/global";
import { Zone } from "../../../models/zone";
import { ZoneService } from "../../../services/zone.service";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";
import { Inhabitant } from "../../../models/inhabitant";
import { InhabitantService } from "../../../services/inhabitant.service";

@Component({
    selector: 'task',
    templateUrl: './new-task.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [TaskService]

})

export class NewTaskComponent implements OnInit{

    public url: String;
    public task: Task;
    private status: String;
    public title: String;

    public zones: Zone[];
    public users: User[];
    public inhabitants: Inhabitant[];
    public statuss: String[];
    
    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _taskService: TaskService,
        private _zoneService: ZoneService,
        private _inhabitantService: InhabitantService,
        private _userService: UserService
    ){
        this.task = new Task("","","", undefined, "Pendiente", undefined, undefined, undefined);
        this.status = ""
        this.title = "Crear Tarea"
        this.url = GLOBAL.url;
        this.zones = [];
        this.users = [];
        this.inhabitants = [];
        this.statuss = ['Pendiente', 'En progreso', 'Completada']

    }

    ngOnInit(): void {
        console.log("Componente new-task cargado")    
        
        this._zoneService.getZones().subscribe(
            response => {
                if(!response.zones){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.zones = response.zones
                }
            }
        )

        this._inhabitantService.getInhabitants().subscribe(
            response => {
                if(!response.inhabitants){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.inhabitants = response.inhabitants
                }
            }
        )

        this._userService.getUsers().subscribe(
            response => {
                if(!response.users){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.users = response.users
                }
            }
        )

    }

    onSubmit(form: any){
        this._taskService.createTask(this.task).subscribe(
            response => {
                if(!response.task){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.task = response.task;
                }
                this._router.navigate(['/tasks']); // Redirige a la lista de zonas
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = "error";
                }
            }
        )
    }


}