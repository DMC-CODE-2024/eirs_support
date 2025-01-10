import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from 'ng-config-service';
import { StatusComponent } from './components/status.component';

@NgModule({
    declarations: [StatusComponent],
    imports: [
        CommonModule, TranslateModule
    ],
    providers: [ConfigService],
    exports: [StatusComponent]
})
export class CeirCoreModule { }