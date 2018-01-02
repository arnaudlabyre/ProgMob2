import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Place } from '../../models/place';
import { Location } from '../../models/location';

import { PlacesService } from '../../services/places';
import { CategoriesService } from '../../services/categories';

import { AddPlacePage } from '../add-place/add-place';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  addPlacePage = AddPlacePage;
  places: Place[] = [];
  placesToPrint: Place[] = [];
  categories: string = 'All';
  listOfCategories = [];

  constructor(private navCtrl: NavController, private placesService: PlacesService, private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.placesService.fetchPlaces()
      .then(
        (places: Place[]) => this.places = places
      );
  }

  ionViewWillEnter() {
    this.places = this.placesService.loadPlaces();
    this.listOfCategories = this.categoriesService.getCategories();
  }

  onOpenPlace(place: Place, index: number) {
    this.navCtrl.push(PlacePage, {place: place, index: index});
  }

  onSelectCategories(category: string) {
    this.categories = category;
  }
}
