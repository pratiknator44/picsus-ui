import { Component, OnInit } from '@angular/core';
import { APIvars } from '../enums/apivars.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {

  imageSrc: string;
  constructor(private _router: Router) { }

  ngOnInit() {
    this.imageSrc = APIvars.domain+'/app-images/404.gif'; //http://localhost:3000/app-images/jdev.jpg
  }

  gotBack() {
    this._router.navigate(['/tabs/tab3']);
  }

}
