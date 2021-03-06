import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Location } from '../../models/location';

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html'
})
export class SetLocationPage {
  location: Location;
  marker: Location;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.location = this.navParams.get('location');
    if(this.navParams.get('isSet')) {
      this.marker = this.location;
    }
  }

  onSetMarker(event: any) {
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }

  onConfirm() {
    this.viewCtrl.dismiss({location: this.marker});
  }

  onAbort() {
    this.viewCtrl.dismiss();
  }

}
