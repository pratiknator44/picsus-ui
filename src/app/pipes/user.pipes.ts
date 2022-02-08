import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'acType'
})
export class AccountTypePipe implements PipeTransform {

  type = {0: 'Free', 1: 'Premium', 2: 'Long Term'}
  transform(index: number) {
      return this.type[index];
  }
}
