import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { NotFoundComponent } from "./not-found.component";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [IonicModule,
    RouterModule.forChild([{
        path: '**',
        component: NotFoundComponent
    }])],
    exports: [NotFoundComponent],
    declarations: [NotFoundComponent]
})
export class NotFoundModule {}