import { Component } from "@angular/core";
import { APIvars } from "../enums/apivars.enum";

@Component({
    selector: 'pi-about',
    templateUrl: 'about.page.html',
    styleUrls: ['about.page.scss']
})
export class AboutPage {

    domain: string
    constructor() {
        this.domain = APIvars.domain+'/app-images/'; //http://localhost:3000/app-images/jdev.jpg
    }
}