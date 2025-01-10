import { NgModule } from '@angular/core';
import { CeirCommonModule } from '../ceir-common/ceir-common.module';
import { CeirImageViewerComponent } from './components/ceir.image.viewer.component';
import { DeviceAddComponent } from './device-add.component';
import { DeviceListComponent } from './device-list.component';

@NgModule({
  declarations: [
    CeirImageViewerComponent, DeviceListComponent, DeviceAddComponent
  ],
  imports: [
    CeirCommonModule
  ],
  exports: [
   
  ],
  providers: [
    
  ]
})
export class DeviceModule {
  
}
