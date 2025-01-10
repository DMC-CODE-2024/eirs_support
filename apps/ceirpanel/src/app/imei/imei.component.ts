import { Component } from '@angular/core';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ceirpanel-imei',
  templateUrl: './imei.component.html',
  styleUrls: ['./imei.component.css'],
  standalone: true,
  imports: [CeirCommonModule, RecaptchaModule, RecaptchaFormsModule,TranslateModule]
})
export class ImeiComponent {
  imei = {imei: ''};
  public log: string[] = [];
  public addTokenLog(message: string, token: string | null) {
    this.log.push(`${message}: ${this.formatToken(token)}`);
  }
  public formatToken(token: string | null) {
    return token !== null
      ? `${token.substring(0, 7)}...${token.substring(token.length - 7)}`
      : 'null';
  }
}
