/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortByOrder",
})
export class SortByOrderPipe implements PipeTransform {
  transform(value: Array<any>[], order: "asc" | "desc" = "asc"): Array<any> {
    value = value.sort((a:any, b:any) => {
      if (order === "asc") {
        return a.displayOrder - b.displayOrder;
      } else if (order === "desc") {
        return b.displayOrder - a.displayOrder;
      }
      return 0;
    });
    return value;
  }
}