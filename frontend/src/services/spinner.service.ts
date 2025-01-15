import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  constructor(private spinnerService: NgxSpinnerService) {}

  public showSpinner() {
    this.spinnerService.show();
  }

  public hideSpinner() {
    this.spinnerService.hide();
  }
}
