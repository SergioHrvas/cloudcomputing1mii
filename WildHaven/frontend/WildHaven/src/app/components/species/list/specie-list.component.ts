import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecieService } from "../../../services/specie.service";
import { Specie } from "../../../models/specie";
import { GLOBAL } from "../../../services/global";

@Component({
    selector: 'specie',
    templateUrl: './specie-list.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [SpecieService]

})

export class SpeciesComponent implements OnInit{

    public url: String;
    public species: Specie[];
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _specieService: SpecieService
    ){
        this.species = [];
        this.status = ""
        this.title = "Lista de especies"
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this._specieService.getSpecies().subscribe(
            response => {
                this.species = response.species;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    removeSpecie(id: String) {
        this._specieService.removeSpecie(id).subscribe(
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