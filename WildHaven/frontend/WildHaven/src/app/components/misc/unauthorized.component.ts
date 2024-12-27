import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'unauthorized',
    templateUrl: './unauthorized.component.html',
    standalone: true,
    imports: [FormsModule, CommonModule],
})

export class UnauthorizedComponent implements OnInit{

    private status: String;
    public title: String;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
    ){
 
        this.status = ""
        this.title = "Acceso no autorizado"

    }


    ngOnInit(): void {
        console.log("Componente unauthorized cargado")    
    }


}