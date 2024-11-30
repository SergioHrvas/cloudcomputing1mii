import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZoneService } from "../../../services/zone.service";
import { Zone } from "../../../models/zone";
import { GLOBAL } from "../../../services/global";
import { routes } from "../../../app.routes";

@Component({
    selector: 'zone',
    templateUrl: './new-zone.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [ZoneService]

})

export class NewZoneComponent implements OnInit{

    public url: String;
    public zone: Zone;
    private status: String;
    public title: String;

    imageZone: File | null = null;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _zoneService: ZoneService
    ){
        this.zone = new Zone("","","","");
        this.status = ""
        this.title = "Crear zona"
        this.url = GLOBAL.url;
    }


    ngOnInit(): void {
        console.log("Componente user-edit cargado")    
    }

    onImageSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
          this.imageZone = file;
        }
    }

    onSubmit(form: any){
        const formData = new FormData();
        formData.append('name', this.zone.name.toString());
        formData.append('description', this.zone.description.toString());
        // Solo añadir la imagen si está seleccionada
        if (this.imageZone) {
            formData.append('image', this.imageZone, this.imageZone.name);
        }

        this._zoneService.createZone(formData).subscribe(
            response => {
                if(!response.zone){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.zone = response.zone;
                }
                this._router.navigate(['/zones']); // Redirige a la lista de zonas
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