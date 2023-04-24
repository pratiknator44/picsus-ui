// this pipe adds the domain to the image src to display full address
import { Pipe, PipeTransform } from "@angular/core";
import { APIvars } from "../enums/apivars.enum";
@Pipe({
    name: 'addDomain'
})
export class AddDomainPipe implements PipeTransform {

    transform(word: string, extension?: string) {

        if(extension) {
            word = word.split('.')[0]+'.'+extension;
        }
        return APIvars.domain + '/' + word;
    }
}
