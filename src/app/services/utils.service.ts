import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  /*Loading*/
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  /*Toast*/
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  /* Enruta a cualquier pagina disponible*/
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  /* Guardar elemento en local storage*/
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  /* Obtiene elemento en local storage*/
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
}
