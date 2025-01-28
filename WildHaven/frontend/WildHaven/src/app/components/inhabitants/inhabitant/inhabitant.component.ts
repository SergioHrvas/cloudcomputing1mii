import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InhabitantService } from "../../../services/inhabitant.service";
import { Inhabitant } from "../../../models/inhabitant";

import { GLOBAL } from "../../../services/global";
import { Zone } from "../../../models/zone";
import { Specie } from "../../../models/specie";
import { sponsorship } from "../../../models/sponsorship";
import { UserService } from "../../../services/user.service";

@Component({
    selector: 'inhabitant',
    templateUrl: './inhabitant.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [InhabitantService]

})

export class InhabitantComponent implements OnInit{

    public url: string;
    public inhabitant: Inhabitant;
    private status: String;
    public title: String;

    public sponsorships: sponsorship[];
    public sponsored: boolean;


    public fechaFormateada: String = "";

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _inhabitantService: InhabitantService,
        private _userService: UserService
    ){
        this.inhabitant = new Inhabitant(
            "", "", "", "", "", "", undefined, [{
                date: new Date(),
                reason: "",
                treatments: "",
                vetName: "",
            }], true,new Specie("", "", "", "", "", ""), new Zone("", "", "", "")
        );
        this.status = ""
        this.title = "Zona"
        this.url = GLOBAL.urlUploads + 'inhabitants/';
        this.sponsorships = [];
        this.sponsored = false;
    }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this._inhabitantService.getInhabitant(id).subscribe(
            response => {
                this.inhabitant = response.inhabitant;
                
                console.log(this.inhabitant.birth)

                if (this.inhabitant.birth) {
                    // Si es una cadena, conviértela a un objeto Date
                    if (typeof this.inhabitant.birth === 'string') {
                        this.inhabitant.birth = new Date(this.inhabitant.birth);
                    }
                
                    // Verifica que ahora sea un objeto Date válido
                    if (this.inhabitant.birth instanceof Date && !isNaN(this.inhabitant.birth.getTime())) {
                        const dia = String(this.inhabitant.birth.getUTCDate()).padStart(2, '0'); // Día con 2 dígitos
                        const mes = String(this.inhabitant.birth.getUTCMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
                        const año = this.inhabitant.birth.getUTCFullYear(); // Año con 4 dígitos
                
                        // Formatear la fecha en DD-MM-YYYY
                        this.fechaFormateada = `${dia}-${mes}-${año}`;
                    } else {
                        console.error("this.inhabitant.birth no es un objeto Date válido.");
                    }
                } else {
                    console.error("this.inhabitant.birth no está definido.");
                }
                this.sponsored = response.sponsored;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    sponsorInhabitant(id: string){
        const user = this._userService.getIdentity();

        const data = {
            id: id.toString(),
        };
        
        
        var data_string = JSON.stringify(data)
        
        this._inhabitantService.sponsorInhabitant(data_string).subscribe(
            response => {
                window.location.reload();

            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    unsponsorInhabitant(id: string){
        const user = this._userService.getIdentity();

        const data = {
            id: id.toString(),
        };
        
        var data_string = JSON.stringify(data)

        this._inhabitantService.unsponsorInhabitant(data_string).subscribe(
            response => {
                window.location.reload();
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