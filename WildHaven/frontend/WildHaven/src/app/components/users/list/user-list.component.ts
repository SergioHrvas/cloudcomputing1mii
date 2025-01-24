import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";
import { GLOBAL } from "../../../services/global";

@Component({
    selector: 'user',
    templateUrl: './user-list.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
    providers: [UserService]

})

export class UsersComponent implements OnInit{

    public url: string;
    public users: User[];
    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.users = [];
        this.status = ""
        this.title = "Lista de usuarios"
        this.url = GLOBAL.urlUploads + 'users/';
    }

    ngOnInit() {
        this._userService.getUsers().subscribe(
            response => {
                this.users = response.users;
            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }
    
    getUserImage(user: { image: string }): string {
        return `${this.url}${user.image}`;
      }

    removeUser(id: String) {
        this._userService.removeUser(id).subscribe(
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