import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User } from "../../../models/user";
import { UserService } from "../../../services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GLOBAL } from "../../../services/global";
 
@Component({
    selector: "edit-profile",
    templateUrl: "./edit-profile.component.html",
    providers: [UserService],
    imports: [FormsModule, CommonModule],
    standalone: true
})

export class EditProfileComponent implements OnInit{
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

    public serverUrl: string = GLOBAL.urlUploads + 'users/';
  // URL base para la carpeta donde se almacenan las imágenes

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
        const id = this.user._id

        const formData = new FormData();

        Object.entries(this.user).forEach(([key, value]) => {
            if (value && key != "_id") {
                formData.append(key, value?.toString() || '');
            }
        });


        // Solo añadir la imagen si está seleccionada
        if (this.profileImage) {
            formData.append('image', this.profileImage, this.profileImage.name);
        }


        this._userService.updateProfile(id, formData).subscribe(
            response => {
                if(!response.user){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.user.image = response.user.image

                    this.identity = this.user;
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