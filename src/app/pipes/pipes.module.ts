import { NgModule } from "@angular/core";
import { AddDomainPipe } from "./domain.pipe";
import { AccountTypePipe } from "./user.pipes";

@NgModule({
  imports: [
  ],
  exports: [
    AccountTypePipe,
    AddDomainPipe
  ],
  declarations: [
    AccountTypePipe,
    AddDomainPipe
  ]
})
export class PipesModule {}
