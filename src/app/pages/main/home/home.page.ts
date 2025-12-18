import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { Product } from 'src/app/models/product.model';

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
  
  constructor() { }

  ngOnInit() {
  }
  user(): User{
    return this.utilsSvc.getFromLocalStorage( 'user' );
  }
  ionViewWillEnter(){// Cada vez que se entra a la pagina
    this.getProducts();
  }
  // Obtener productos
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firesbaseSvc.getCollectionData(path).subscribe({
      next: (res: any)  => {
        console.log('Productos: ', res);
        this.products = res;
        sub.unsubscribe();
      }
    }); 
  }
  // cerrar sesion
  singOut() {
    this.firesbaseSvc.signOut();
  }

  addUpdateProduct(product?: Product) {
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,  
      cssClass: 'add-update-modal',
    });
  }
}
