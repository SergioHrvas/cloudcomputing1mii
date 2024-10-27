import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: [UserService],
    imports: [FormsModule, RouterModule, CommonModule],
    standalone: true
})

export class RegisterComponent implements OnInit{
    public title: string;
    public user: User;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = "Regístrate";
        this.user = new User(
            "",
            "",
            "",
            "",
            "",
            "ROLE_USER",
            "",
            "",
        )
        this.status="";
    }
    
    onSubmit(form: any){
        this._userService.saveUser(this.user).subscribe(
            response => {
                if(response.user && response.user._id){
                    console.log(response.user);

                    this.status = 'success';
                    form.reset(); 
                }else{
                    this.status = 'error';
                }

            },
            error => {
                console.log(<any>error);
            }
        );
    }

    ngOnInit(){
        if(this._userService.getIdentity != null){
            this._userService.logout();
        }
        console.log("Componente de registro cargado");
    }
}