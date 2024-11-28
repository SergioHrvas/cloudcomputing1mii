import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecieService } from "../../../services/specie.service";
import { Specie } from "../../../models/specie";
import { Inhabitant } from "../../../models/inhabitant";

import { GLOBAL } from "../../../services/global";

@Component({
    selector: 'specie',
    templateUrl: './specie.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [SpecieService]

})

export class SpecieComponent implements OnInit{

    public url: String;
    public specie: Specie;
    public inhabitants: Inhabitant[]
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _specieService: SpecieService
    ){
        this.specie = new Specie(
            "", "", "", "", "", ""
        );
        this.inhabitants = [];
        this.status = ""
        this.title = "Zona"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this._specieService.getSpecie(id).subscribe(
            response => {
                console.log(response)
                this.specie = response.specie;
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


}