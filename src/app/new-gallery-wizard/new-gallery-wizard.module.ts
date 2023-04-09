import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { NewGalleryWizardPage } from "./new-gallery-wizard.page";

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{
            path: '',
            component: NewGalleryWizardPage
        }])],
    exports: [NewGalleryWizardPage],
    declarations: [NewGalleryWizardPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewGalleryWizardModule { }