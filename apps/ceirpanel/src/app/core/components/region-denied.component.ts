import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ceirpanel-access-denied',
  template: `
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12 text-center">
          <div class="clearfix">
            <h4 class="pt-3">This App is currently not available in your country or region</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [``],
})
export class RegionDeniedComponent {
  constructor(private router: Router) { }

}
