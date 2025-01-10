import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DualListComponent } from './dual-list.component';
import { ClarityModule } from '@clr/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [CommonModule, FormsModule, ClarityModule, DragDropModule],
  declarations: [ DualListComponent ],
	exports:      [ DualListComponent ]
})
export class DualListboxModule {}
