import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";
import { GLOBAL } from "../../../services/global";
import { routes } from "../../../app.routes";
import { Specie } from "../../../models/specie";
import { Zone } from "../../../models/zone";
import { ZoneService } from "../../../services/zone.service";
import { response } from "express";
import { SpecieService } from "../../../services/specie.service";

@Component({
    selector: 'user',
    templateUrl: './new-user.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [UserService]

})

export class NewUserComponent implements OnInit{

    public url: String;
    public user: User;
    private status: String;
    public title: String;

    public roles: String[]

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
    ){
        this.user = new User("","","","", "", "", "", "");
        this.status = ""
        this.title = "Crear Usuario"
        this.url = GLOBAL.url;
        this.roles = ["USER", "ADMIN"]
    }


    ngOnInit(): void {
        console.log("Componente new-user cargado")    
        
        
    }

    onImageSelected(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.user.image = event.target.files[0];
        }
    }

    onSubmit(form: any){
        this._userService.saveUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.user = response.user;
                }
                this._router.navigate(['/users']); // Redirige a la lista de zonas
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