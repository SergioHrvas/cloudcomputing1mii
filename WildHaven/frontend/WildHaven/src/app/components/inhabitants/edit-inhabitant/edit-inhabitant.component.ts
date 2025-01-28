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
import { SpecieService } from "../../../services/specie.service";

@Component({
    selector: 'edit-inhabitant',
    templateUrl: './edit-inhabitant.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [InhabitantService]

})

export class EditInhabitantComponent implements OnInit{

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
        this.title = "Modificar habitante"
        this.url = GLOBAL.url;
        this.zones = []
        this.species = []
    }


    ngOnInit(): void {
        console.log("Componente inhabitant-edit cargado")    

        const id = this._route.snapshot.paramMap.get('id');
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

        this._inhabitantService.getInhabitant(id).subscribe(
            response => {
                this.inhabitant = response.inhabitant;

                this.inhabitant.birth = response.inhabitant.birth.split("T")[0]; // Extrae solo la parte de la fecha
    
                // Verifica que la zona y especie están correctamente asignados
                if (this.inhabitant.zone && this.zones.length) {
                    this.inhabitant.zone = this.zones.find(zone => zone._id === this.inhabitant.zone?._id) || undefined;
                }
    
                if (this.inhabitant.specie && this.species.length) {
                    this.inhabitant.specie = this.species.find(specie => specie._id === this.inhabitant.specie?._id) || undefined;
                }
            },
            error => {
                console.log(<any>error);
                this.status = 'error';
            }
        );
    

        


            
    }

    onImageSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
          this.imageInhabitant = file;
        }
    }

    onSubmit(form: any){
        const id = this._route.snapshot.paramMap.get('id');

        const formData = new FormData();
        
        Object.entries(this.inhabitant).forEach(([key, value]) => {
            if(value){
                if((key == "specie") || (key == "zone")){
                    formData.append(key, value._id?.toString() || '');
                }
                else{
                    formData.append(key, value?.toString() || '');
                }
            }
        });

        // Solo añadir la imagen si está seleccionada
        if (this.imageInhabitant) {
            formData.append('image', this.imageInhabitant, this.imageInhabitant.name);
        }

        this._inhabitantService.updateInhabitant(id, formData).subscribe(
            response => {
                if(!response.inhabitant){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.inhabitant = response.inhabitant;
                }
                this._router.navigate(['/inhabitants']); // Redirige a la lista de einhabitants
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