import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZoneService } from "../../../services/zone.service";
import { Zone } from "../../../models/zone";
import { Inhabitant } from "../../../models/inhabitant";

import { GLOBAL } from "../../../services/global";

@Component({
    selector: 'zone',
    templateUrl: './zone.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [ZoneService]

})

export class ZoneComponent implements OnInit{

    public url: String;
    public zone: Zone;
    public inhabitants: Inhabitant[]
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _zoneService: ZoneService
    ){
        this.zone = new Zone(
            "", "", "", ""
        );
        this.inhabitants = [];
        this.status = ""
        this.title = "Zona"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this._zoneService.getZone(id).subscribe(
            response => {
                this.zone = response.zone;
                this.inhabitants = response.inhabitants;
                console.log(this.inhabitants)
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