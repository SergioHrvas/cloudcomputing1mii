import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User } from "../../../models/user";
import { Sponsorship } from "../../../models/sponsorship";
import { UserService } from "../../../services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GLOBAL } from "../../../services/global";
import { InhabitantService } from "../../../services/inhabitant.service";
 
@Component({
    selector: "my-sponsorships",
    templateUrl: "./my-sponsorships.component.html",
    providers: [UserService],
    imports: [FormsModule, CommonModule],
    standalone: true
})

export class MySponsorshipsComponent implements OnInit{
    public title: string;
    public user: User;
    public identity: any;
    public token: string;
    public status: string;

    public sponsorships: Sponsorship[]

    public url = GLOBAL.urlUploads + 'users/';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _inhabitantService: InhabitantService
    ){
     this.title = "Mis apadrinamientos";
     this.user = new User(
        "",
        "",
        "",
        "",
        "",
        "ROLE_USER",
        "",
        "",
    )
     this.user = this._userService.getIdentity();

     this.identity = this._userService.getIdentity();
     this.token = this._userService.getToken();
     this.status=""
     this.sponsorships = []
    }

    public serverUrl: string = GLOBAL.urlUploads + 'users/';
  // URL base para la carpeta donde se almacenan las imágenes

    ngOnInit(): void {
        this._inhabitantService.getMySponsorships().subscribe(
            response => {
                this.sponsorships = response.sponsorships;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    formatDate(date: Date): string {
        var fechaFormateada = ""   
        var fecha = date;        
        if (date) {
            // Si es una cadena, conviértela a un objeto Date
            if (typeof fecha === 'string') {
                fecha = new Date(fecha);
            }
        
            // Verifica que ahora sea un objeto Date válido
            if (fecha instanceof Date && !isNaN(fecha.getTime())) {
                const dia = String(fecha.getUTCDate()).padStart(2, '0'); // Día con 2 dígitos
                const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
                const año = fecha.getUTCFullYear(); // Año con 4 dígitos
        
                // Formatear la fecha en DD-MM-YYYY
                var fechaFormateada = `${dia}-${mes}-${año}`;
            } else {
                console.error("this.inhabitant.birth no es un objeto Date válido.");
            }
        }

        return fechaFormateada;
    }
}