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
    templateUrl: './edit-zone.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [ZoneService]

})

export class EditZoneComponent implements OnInit{

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
        this.title = "Modificar zona"
        this.url = GLOBAL.url;
    }


    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');

        this._zoneService.getZone(id).subscribe(
            response => {
                this.zone = response.zone;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
        console.log("Componente zone-edit cargado")    
    }

    onImageSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.zone.image = event.target.files[0];
        }
    }

    onSubmit(form: any){
        const id = this._route.snapshot.paramMap.get('id');

        this._zoneService.updateZone(id, this.zone).subscribe(
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