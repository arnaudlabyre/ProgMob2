import { Component } from '@angular/core';
import { ModalController, NavController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { File, Entry, FileError } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';
import { CategoriesService } from '../../services/categories';

declare var cordova: any;

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html'
})
export class AddPlacePage {
  location: Location = {
    lat: 48.86,
    lng: 2.34
  };
  locationIsSet = false;
  imageUrl = '';
  loader: any;
  listOfCategories = [];
  selectedCategory = 'All';

  constructor(public modalCtrl: ModalController,
              public navCtrl: NavController, 
              private loadingCtrl: LoadingController, 
              private toastCtrl: ToastController, 
              private geolocation: Geolocation,
              private camera: Camera,
              private placesService: PlacesService,
              private categoriesService: CategoriesService,
              private file: File) {
                this.loader = this.loadingCtrl.create({
                  content: 'Getting your Location...'
                });
              }

  ionViewWillEnter() {
    this.listOfCategories = this.categoriesService.getCategories();
  }

  ionViewWillLeave() {
    this.loader.dismiss();
  }

  onSelectCategories(category: string) {
    this.selectedCategory = category;
  }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl, this.selectedCategory);
    form.reset();
    this.location = {
      lat: 48.86,
      lng: 2.34
    };
    this.imageUrl = '';
    this.locationIsSet = false;
    this.navCtrl.pop();
  }

  addCategory(category: string) {
    this.categoriesService.addCategory(category);
  }
  
  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate() {
    this.loader.present();
    this.geolocation.getCurrentPosition()
      .then(
        location => {
          this.loader.dismiss();
          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.locationIsSet = true;
        }
      )
      .catch(
        error => {
          this.loader.dismiss();
          const toast = this.toastCtrl.create({
            message: "Couldn't get location, please pick it manually!",
            duration: 2500
          });
          toast.present();
        }
      );
  }

  onTakePhoto() {
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        imageData => {
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          const path = imageData.replace(/[^\/]*$/,'');
          const newFileName = new Date().getUTCMilliseconds() + '.jpg';
          this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
            .then(
              ( data: Entry ) => {
                this.imageUrl = data.nativeURL;
                this.camera.cleanup();
              }
            )
            .catch(
              (err: FileError) => {
                this.imageUrl = '';
                const toast = this.toastCtrl.create({
                  message: "Couldn't save the image, please try again..",
                  duration: 2500
                });
                toast.present();
                this.camera.cleanup();

              }
            );
        }
      )
      .catch(
        err => {
          this.imageUrl = '';
          const toast = this.toastCtrl.create({
            message: "Couldn't save the image, please try again..",
            duration: 2500
          });
          toast.present();
          this.camera.cleanup();
          this.imageUrl = "assets/imgs/advance-card-alaska.jpg";
          const toastTMP = this.toastCtrl.create({
            message: "Setting default image...",
            duration: 2500
          });
          toastTMP.present();
        }
      );
  }
}