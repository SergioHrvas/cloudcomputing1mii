import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InhabitantService } from "../../../services/inhabitant.service";
import { Inhabitant } from "../../../models/inhabitant";
import { GLOBAL } from "../../../services/global";
import { UserService } from "../../../services/user.service";

@Component({
    selector: 'inhabitant',
    templateUrl: './inhabitant-list.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [InhabitantService]

})

export class InhabitantsComponent implements OnInit{

    public url: String;
    public inhabitants: Inhabitant[];
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _inhabitantService: InhabitantService, 
        private _userService: UserService
    ){
        this.inhabitants = [];
        this.status = ""
        this.title = "Lista de habitantes"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this._inhabitantService.getInhabitants().subscribe(
            response => {
                this.inhabitants = response.inhabitants;
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

    removeInhabitant(id: String) {
        this._inhabitantService.removeInhabitant(id).subscribe(
            response => {
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