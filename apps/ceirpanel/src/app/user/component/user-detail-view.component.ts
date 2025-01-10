/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';


@Component({
  selector: 'ceirpanel-user-detail-view',
  template: `
  <div class="card m-0 p-0">
    <div class="card-header"></div>
    <div class="card-block m-1 p-0">
    <clr-tabs clrLayout="horizontal" class="w-100">
        <clr-tab>
        <button clrTabLink id="link1" class="p6 m-0 p-0 text-truncate w-100">Name</button>
        <clr-tab-content id="content1" *clrIfActive class="m-0 p-0">
            <ol class="list-group list-group-numbered m-0 p-0">
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">First Name</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.firstName}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Last Name</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.lastName}}</span>
            </li>
            </ol>
        </clr-tab-content>
        </clr-tab>
        <clr-tab>
        <button clrTabLink id="link1" class="p6 m-0 p-0 text-truncate w-100">Address</button>
        <clr-tab-content id="content1" *clrIfActive class="m-0 p-0">
            <ol class="list-group list-group-numbered m-0 p-0">
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Address</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.address}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Country</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.country}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Province</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.province}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">District</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.district}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Commune</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.commune}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Village</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.village}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Street</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.street}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Locality</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.locality}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Postal</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.postalCode}}</span>
            </li>
            </ol>
        </clr-tab-content>
        </clr-tab>
        <clr-tab>
        <button clrTabLink id="link1" class="p6 m-0 p-0 text-truncate w-100">ID</button>
        <clr-tab-content id="content1" *clrIfActive class="m-0 p-0">
            <ol class="list-group list-group-numbered m-0 p-0">
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Organization</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.address}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Designation and Title</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.country}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">National ID</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.province}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Uploaded National ID</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.district}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Uploaded User Profile Photo</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.commune}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Employee ID</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.employeeId}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Employee ID Card(File)</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.street}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Nature of Employment</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.locality}}</span>
            </li>
            </ol>
        </clr-tab-content>
        </clr-tab>
        <clr-tab>
        <button clrTabLink id="link1" class="p6 m-0 p-0 text-truncate w-100">Reporting</button>
        <clr-tab-content id="content1" *clrIfActive class="m-0 p-0">
            <ol class="list-group list-group-numbered m-0 p-0">
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Reporting Authiroty Name</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.firstName}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Reporting Authiroty Email ID</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.lastName}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Reporting Authiroty Contact Number</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.lastName}}</span>
            </li>
            </ol>
        </clr-tab-content>
        </clr-tab>
        <clr-tab>
        <button clrTabLink id="link1" class="p6 m-0 p-0 text-truncate w-100">Contact</button>
        <clr-tab-content id="content1" *clrIfActive class="m-0 p-0">
            <ol class="list-group list-group-numbered m-0 p-0">
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Email ID</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.firstName}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Contact Number</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.lastName}}</span>
            </li>
            </ol>
        </clr-tab-content>
        </clr-tab>
        <clr-tab>
        <button clrTabLink id="link1" class="p6 m-0 p-0 text-truncate w-100">Security</button>
        <clr-tab-content id="content1" *clrIfActive class="m-0 p-0">
            <ol class="list-group list-group-numbered m-0 p-0">
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Question1</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.address}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Question2</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.country}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Question3</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.province}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Answer1</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.district}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Answer2</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.commune}}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start m-0 p-1">
                <div class="ms-2 me-auto">
                <div class="p1">Answer3</div>
                </div>
                <span class="badge badge-light-blue">{{detail?.profile?.employeeId}}</span>
            </li>
            </ol>
        </clr-tab-content>
        </clr-tab>
    </clr-tabs>
    </div>
    </div>
  `,
  styles: [`
  :host ::ng-deep .clr-input-group {
    width: 100% !important;
  }
  `],
  providers: []
})
export class UserDetailViewComponent {
  @Input() detail!: any;
}