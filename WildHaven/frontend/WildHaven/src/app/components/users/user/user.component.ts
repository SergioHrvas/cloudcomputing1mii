import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";
import { Inhabitant } from "../../../models/inhabitant";

import { GLOBAL } from "../../../services/global";

@Component({
selector: 'user',
templateUrl: './user.component.html',
standalone: true,
imports: [FormsModule, CommonModule],
providers: [UserService]

})

export class UserComponent implements OnInit{

public url: String;
public user: User;
public inhabitants: Inhabitant[]
private status: String;
public title: String;

constructor(        
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
){
    this.user = new User(
        "", "", "", "", "", "", "", ""
    );
    this.inhabitants = [];
    this.status = ""
    this.title = "Zona"
    this.url = GLOBAL.urlUploads + 'users/';
}

ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    this._userService.getUser(id).subscribe(
        response => {
            console.log(response)
            this.user = response.user;
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