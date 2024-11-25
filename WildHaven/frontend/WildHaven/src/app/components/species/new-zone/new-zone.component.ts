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
        if (event.target.files && event.target.files[0]) {
            this.zone.image = event.target.files[0];
        }
    }

    onSubmit(form: any){
        this._zoneService.createZone(this.zone).subscribe(
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