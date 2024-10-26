import { Component, OnInit} from "@angular/core"

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit{

    public title: string;

    constructor(){
        this.title="¡Bienvenid@ a WildHaven!"
    }

    ngOnInit(){
        console.log("Componente de home cargado");
    }

}