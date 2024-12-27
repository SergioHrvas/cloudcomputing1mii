import { Component, OnInit } from "@angular/core"
import { Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from "../../../services/task.service";
import { Task } from "../../../models/task";
import { GLOBAL } from "../../../services/global";
import { routes } from "../../../app.routes";
import { InhabitantService } from "../../../services/inhabitant.service";
import { ZoneService } from "../../../services/zone.service";
import { UserService } from "../../../services/user.service";
import { Zone } from "../../../models/zone";
import { User } from "../../../models/user";
import { Inhabitant } from "../../../models/inhabitant";

@Component({
    selector: 'task',
    templateUrl: './edit-task.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [TaskService]

})

export class EditTaskComponent implements OnInit {

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
    ) {
        this.task = new Task("", "", "", undefined, "", undefined, undefined, undefined);
        this.status = ""
        this.title = "Modificar tarea"
        this.url = GLOBAL.url;
        this.zones = [];
        this.users = [];
        this.inhabitants = [];
        this.statuss = ['Pendiente', 'En progreso', 'Completada']
    }

    get assignedToId(): String {
        return this.task.assignedTo?._id || ''; // Devuelve un valor seguro
      }
      
    set assignedToId(value: String) {
        if (!this.task.assignedTo) {
          this.task.assignedTo = new User("", "", "", "", "", "", "", ""); // Crea un nuevo User si no existe
        }
        this.task.assignedTo._id = value;
      }

    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');

        this._taskService.getTask(id).subscribe(
            response => {
                this.task = response.task;

                console.log(this.task)
            },
            error => {
                console.log(<any>error);
                if (<any>error != null) {
                    this.status = 'error';
                }
            }
        );



        this._zoneService.getZones().subscribe(
            response => {
                if (!response.zones) {
                    this.status = "error"
                }
                else {
                    this.status = "success"
                    this.zones = response.zones
                }
            }
        )

        this._inhabitantService.getInhabitants().subscribe(
            response => {
                if (!response.inhabitants) {
                    this.status = "error"
                }
                else {
                    this.status = "success"
                    this.inhabitants = response.inhabitants
                }
            }
        )

        this._userService.getUsers().subscribe(
            response => {
                if (!response.users) {
                    this.status = "error"
                }
                else {
                    this.status = "success"
                    this.users = response.users
                }
            }
        )
        console.log("Componente task-edit cargado")
    }

    onSubmit(form: any) {
        const id = this._route.snapshot.paramMap.get('id');

        this._taskService.updateTask(id, this.task).subscribe(
            response => {
                if (!response.task) {
                    this.status = "error"
                }
                else {
                    this.status = "success"
                    this.task = response.task;
                }
                this._router.navigate(['/tasks']); // Redirige a la lista de tareas
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = "error";
                }
            }
        )
    }


}