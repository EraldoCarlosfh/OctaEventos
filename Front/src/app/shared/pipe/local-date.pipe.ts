import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

  transform(date: any): any {
    let dateOut: moment.Moment = moment(date, "DD/MM/YYYY hh:mm:ss");
    return dateOut.format("DD/MM/YYYY");
  }

}
