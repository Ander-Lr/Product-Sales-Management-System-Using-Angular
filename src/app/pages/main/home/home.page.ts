import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Product } from 'src/app/models/product.model';
import { orderBy, where } from 'firebase/firestore';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firesbaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;

  constructor() {}

  ngOnInit() {}
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    // Cada vez que se entra a la pagina
    this.getProducts();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.getProducts(), event.target.complete();
    }, 1000);
  }

  getProfits() {
    return this.products.reduce(
      (index, product) => index + product.price * product.soldUnits,
      0
    );
  }

  // Obtener productos
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    this.loading = true;

    let query = [
      // Ordernar por unidades vendidas y descendente
      orderBy('soldUnits', 'desc'),
      // Filtrar productos con mas de 30 unidades vendidas
      //where( 'soldUnits', '>=', 30)
    ];

    let sub = this.firesbaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log('Productos: ', res);
        this.products = res;

        this.loading = false;

        sub.unsubscribe();
      },
    });
  }
  // cerrar sesion
  singOut() {
    this.firesbaseSvc.signOut();
  }

  // Agregar o actualizar producto
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });

    if (success) {
      this.getProducts();
    }
  }
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }
  // Eliminar producto
  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firesbaseSvc.getFilePath(product.image);
    await this.firesbaseSvc.deleteFile(imagePath);

    this.firesbaseSvc
      .deleteDocument(path)
      .then(async (res) => {
        this.products = this.products.filter((p) => p.id !== product.id);

        this.utilsSvc.presentToast({
          message: 'Producto eliminado exitosamente',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.utilsSvc.dismissModal({
          success: true,
        });
      })
      .catch((err) => {
        console.error(err);

        this.utilsSvc.presentToast({
          message: err.message,
          duration: 3000,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
