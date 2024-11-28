import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecieService } from "../../../services/specie.service";
import { Specie } from "../../../models/specie";
import { GLOBAL } from "../../../services/global";
import { routes } from "../../../app.routes";

@Component({
    selector: 'specie',
    templateUrl: './new-specie.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [SpecieService]

})

export class NewSpecieComponent implements OnInit{

    public url: String;
    public specie: Specie;
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _specieService: SpecieService
    ){
        this.specie = new Specie("","","","", "", "");
        this.status = ""
        this.title = "Crear Especie"
        this.url = GLOBAL.url;
    }


    ngOnInit(): void {
        console.log("Componente new-specie cargado")    
    }

    onImageSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.specie.image = event.target.files[0];
        }
    }

    onSubmit(form: any){
        this._specieService.createSpecie(this.specie).subscribe(
            response => {
                if(!response.specie){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.specie = response.specie;
                }
                this._router.navigate(['/species']); // Redirige a la lista de zonas
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