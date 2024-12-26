import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { User } from "../../../models/user";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../services/user.service";
import { get } from "http";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [UserService]

})

export class LoginComponent implements OnInit{
    public title: string;
    public status: string;
    public user: User;
    public identity: any;
    public token: string;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = "Identifícate";
        this.status = "";
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
        this.identity = "";
        this.token = "";
    }
    
    ngOnInit(){
        if(this._userService.getIdentity != null){
            this._userService.logout();
        }
        console.log("Componente de login cargado");
    }
    

    onSubmit(form: any){
        this._userService.loginUser(this.user).subscribe(
            response => {
                console.log(response)
                this.identity = response.user;
                this.token = response.token;
                if(!this.identity || !this.identity._id){
                    this.status = "error";
                }else{
                    //PERSISTIR DATOS DEL USUARIO
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('Identity', JSON.stringify(this.identity))
                    } else if (typeof sessionStorage !== 'undefined') {
                        sessionStorage.setItem('Identity', JSON.stringify(this.identity))
                    } else {
                        // If neither localStorage nor sessionStorage is supported
                        console.log('Web Storage is not supported in this environment.');
                      }
                    
                    //PERSISTIR TOKEN DE USUARIO
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('Token', JSON.stringify(this.token))
                    } else if (typeof sessionStorage !== 'undefined') {
                        sessionStorage.setItem('Token', JSON.stringify(this.token))
                    } else {
                        // If neither localStorage nor sessionStorage is supported
                        console.log('Web Storage is not supported in this environment.');
                      }
                    console.log(this.token)

                    this._router.navigate(['/users']); 
                }

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