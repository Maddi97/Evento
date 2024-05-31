import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
  name: "toUSDateFormat",
  standalone: true,
})
export class USDateFormatPipe implements PipeTransform {
  transform(value: moment.Moment): string {
    // Parse the input string to a Moment object
    const momentDate = moment(value).format("MM/DD/YYYY");
    // Convert the Moment object to ISO string
    return momentDate;
  }
}
