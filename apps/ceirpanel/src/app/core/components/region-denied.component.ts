import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/common/auth.service';

@Component({
  selector: 'ceirpanel-access-denied',
  template: `
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center center-screen">
        <div class="col-md-12 text-center align-middle">
          <div class="clearfix">
            <img src="assets/images/ban.svg" alt="" />
            <p class="access-deny">{{"message.outOfRegionMessage" | translate}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [``],
})
export class RegionDeniedComponent {
  constructor(private router: Router, public authService: AuthService) { }

}
