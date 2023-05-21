import { Component, NgZone } from '@angular/core';
import { PushService } from './services/push.service';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { ToastController } from '@ionic/angular';
import { APIvars } from './enums/apivars.enum';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private _router: Router, private _ngZone: NgZone, private toast: ToastController ) {
    this.initApp();
  }

  initApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this._ngZone.run(async () => {
          // Example url: https://beerswift.app/tabs/tab2
          // slug = /tabs/tab2
          const slug = event.url.split(APIvars.domain+'/#').pop();
          (await this.toast.create({
            message: "slug " + slug,
            duration: 20000,
            position: 'top'
          })).present();

          if (slug) {
              this._router.navigate([slug]);
          }
          // If no match, do nothing - let regular routing
          // logic take over
      });
  });
  }
}
