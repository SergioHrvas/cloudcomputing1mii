import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZoneService } from "../../../services/zone.service";
import { Zone } from "../../../models/zone";
import { GLOBAL } from "../../../services/global";
import { UserService } from "../../../services/user.service";

@Component({
    selector: 'zone',
    templateUrl: './zone-list.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [ZoneService]

})

export class ZonesComponent implements OnInit{

    public url: String;
    public zones: Zone[];
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _zoneService: ZoneService,
        private _userService: UserService
    ){
        this.zones = [];
        this.status = ""
        this.title = "Lista de zonas"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this._zoneService.getZones().subscribe(
            response => {
                this.zones = response.zones;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    isAdmin(): boolean {
        return this._userService.isAdmin();
    }
    
    
    removeZone(id: String) {
        this._zoneService.removeZone(id).subscribe(
            response => {
                console.log(response.data);
                window.location.reload()
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