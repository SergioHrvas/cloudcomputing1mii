import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InhabitantService } from "../../../services/inhabitant.service";
import { Inhabitant } from "../../../models/inhabitant";
import { GLOBAL } from "../../../services/global";
import { routes } from "../../../app.routes";
import { Specie } from "../../../models/specie";
import { Zone } from "../../../models/zone";
import { ZoneService } from "../../../services/zone.service";
import { response } from "express";
import { SpecieService } from "../../../services/specie.service";

@Component({
    selector: 'inhabitant',
    templateUrl: './new-inhabitant.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [InhabitantService]

})

export class NewInhabitantComponent implements OnInit{

    public url: String;
    public inhabitant: Inhabitant;
    private status: String;
    public title: String;

    public zones: Zone[];
    public species: Specie[]

    imageInhabitant: File | null = null;
    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _inhabitantService: InhabitantService,
        private _zoneService: ZoneService,
        private _specieService: SpecieService
    ){
        this.inhabitant = new Inhabitant("","","","", "", "", undefined, [{
            date: undefined,
            reason: "",
            treatments:"",
            vetName: ""
        }], false, undefined, undefined);
        this.status = ""
        this.title = "Crear Habitante"
        this.url = GLOBAL.url;
        this.zones = []
        this.species = []

    }


    ngOnInit(): void {
        console.log("Componente new-inhabitant cargado")    
        
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

        this._specieService.getSpecies().subscribe(
            response => {
                if(!response.species){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.species = response.species
                }
            }
        )
    }

    onImageSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
          this.imageInhabitant = file;
        }
    }

    onSubmit(form: any){
        const formData = new FormData();
        
        Object.entries(this.inhabitant).forEach(([key, value]) => {
            if(value){
                formData.append(key, value?.toString() || '');
            }
        });

        // Solo añadir la imagen si está seleccionada
        if (this.imageInhabitant) {
            formData.append('image', this.imageInhabitant, this.imageInhabitant.name);
        }

        this._inhabitantService.createInhabitant(formData).subscribe(
            response => {
                if(!response.inhabitant){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.inhabitant = response.inhabitant;
                }
                this._router.navigate(['/inhabitants']); // Redirige a la lista de zonas
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