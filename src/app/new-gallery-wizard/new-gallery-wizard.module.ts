import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NewGalleryWizardPage } from "./new-gallery-wizard.page";

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([{
            path: '',
            component: NewGalleryWizardPage
        }])],
    exports: [NewGalleryWizardPage],
    declarations: [NewGalleryWizardPage]
})
export class NewGalleryWizardModule { }