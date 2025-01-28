import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User } from "../../../models/user";
import { UserService } from "../../../services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GLOBAL } from "../../../services/global";
 
@Component({
    selector: "profile",
    templateUrl: "./profile.component.html",
    providers: [UserService],
    imports: [FormsModule, CommonModule],
    standalone: true
})

export class Profile implements OnInit{
    public title: string;
    public user: User;
    public identity: any;
    public token: string;
    public status: string;

    public url = GLOBAL.urlUploads + 'users/';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
     this.title = "Mi perfil";
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
     this.user = this._userService.getIdentity();

     this.identity = this._userService.getIdentity();
     this.token = this._userService.getToken();
     this.status=""
    }

    public serverUrl: string = GLOBAL.urlUploads + 'users/';
  // URL base para la carpeta donde se almacenan las imágenes

    ngOnInit(): void {
        this.user = this._userService.getIdentity();
    }

}