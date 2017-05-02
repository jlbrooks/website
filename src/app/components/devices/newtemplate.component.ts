import { Component } from '@angular/core';
import { MdInputModule, MdSnackBar, MdDialog } from '@angular/material';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device';

@Component({
  selector: 'new-template',
  templateUrl: './newtemplate.component.html',
  styleUrls: ['./newtemplate.component.scss']
})
export class NewTemplateComponent {
  name: string = "";
  description: string = "";
  device: Device = null;

  constructor(private deviceService: DeviceService, private route: ActivatedRoute,
              private router: Router,
              public snackBar: MdSnackBar, public dialog: MdDialog) {

  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.deviceService.getDeviceById(params['id']))
      .subscribe(
        result => this.device = result,
        error => this.router.navigate(['/home'])
      );
  }

  add() {
    if(this.name != "" && this.description != "") {
      var body: any = {
        name: this.name,
        description: this.description,
        device_id: this.device._id
      };

      this.deviceService.saveTemplate(body).subscribe(
        result => {
          console.log(result);
          // this.snackBar.open("Save Template Success!", this.name, { duration: 2000 }).afterDismissed().subscribe(
          this.dialog.open(SuccessDialogComponent).afterClosed().subscribe(
            result => this.router.navigate(['/home/devicetemplates/'])
          );
        },
        error => this.snackBar.open(error.message, this.name, { duration: 2000 })
      );

    }
    else {
      this.snackBar.open("Name and description are empty!", "ERROR", { duration: 2000 });
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
