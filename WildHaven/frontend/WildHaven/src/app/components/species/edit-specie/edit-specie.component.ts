import { Component, OnInit } from "@angular/core"
import { Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecieService } from "../../../services/specie.service";
import { Specie } from "../../../models/specie";
import { GLOBAL } from "../../../services/global";
import { routes } from "../../../app.routes";

@Component({
    selector: 'specie',
    templateUrl: './edit-specie.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [SpecieService]

})

export class EditSpecieComponent implements OnInit {

    public url: String;
    public specie: Specie;
    private status: String;
    public title: String;

    imageSpecie: File | null = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _specieService: SpecieService
    ) {
        this.specie = new Specie("", "", "", "", "", "");
        this.status = ""
        this.title = "Modificar especie"
        this.url = GLOBAL.url;
    }


    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');

        this._specieService.getSpecie(id).subscribe(
            response => {
                this.specie = response.specie;
            },
            error => {
                console.log(<any>error);
                if (<any>error != null) {
                    this.status = 'error';
                }
            }
        );
        console.log("Componente specie-edit cargado")
    }

    onImageSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.imageSpecie = file;
        }
    }

    onSubmit(form: any) {
        const id = this._route.snapshot.paramMap.get('id');

        const formData = new FormData();

        Object.entries(this.specie).forEach(([key, value]) => {
            if (value && key != "_id") {
                formData.append(key, value?.toString() || '');
            }
        });


        // Solo añadir la imagen si está seleccionada
        if (this.imageSpecie) {
            formData.append('image', this.imageSpecie, this.imageSpecie.name);
        }

        this._specieService.updateSpecie(id, formData).subscribe(
            response => {
                if (!response.specie) {
                    this.status = "error"
                }
                else {
                    this.status = "success"
                    this.specie = response.specie;
                }
                this._router.navigate(['/species']); // Redirige a la lista de especies
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = "error";
                }
            }
        )
    }
}