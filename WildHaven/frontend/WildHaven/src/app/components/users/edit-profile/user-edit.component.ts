import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User } from "../../../models/user";
import { UserService } from "../../../services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
 
@Component({
    selector: "user-edit",
    templateUrl: "./user-edit.component.html",
    providers: [UserService],
    imports: [FormsModule, CommonModule],
    standalone: true
})

export class UserEditComponent implements OnInit{
    public title: string;
    public user: User;
    public identity: any;
    public token: string;
    public status: string;

    profileImage: File | null = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
     this.title = "Actualizar mis datos";
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

    public serverUrl: string = 'http://localhost:3800/uploads/users';  // URL base para la carpeta donde se almacenan las imágenes

    ngOnInit(): void {
        this.user = this._userService.getIdentity();
    }

    onFileChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
          this.profileImage = file;
        }
      }
    

    onSubmit(form: any){

        this._userService.updateUser(this.user, this.profileImage).subscribe(
            response => {
                if(!response.user){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.user.image = response.user.image

                    this.identity = this.user;
                    //PERSISTIR DATOS DEL USUARIO
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('Identity', JSON.stringify(this.user))
                    } else if (typeof sessionStorage !== 'undefined') {
                        sessionStorage.setItem('Identity', JSON.stringify(this.user))
                    } else {
                        // If neither localStorage nor sessionStorage is supported
                        console.log('Web Storage is not supported in this environment.');
                    }
                }
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