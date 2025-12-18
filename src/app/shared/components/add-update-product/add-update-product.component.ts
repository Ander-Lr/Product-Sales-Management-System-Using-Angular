import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: false,
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  firesbaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  /* Toma/Seleccion una imagen*/
  async takeImage() {
    const URL = (await this.utilsSvc.takePicture('image del producto')).dataUrl;
    this.form.controls.image.setValue(URL);
  }

  async submit() {
    if (this.form.valid) {
      let path = `users/${this.user.uid}/products`;

      const loading = await this.utilsSvc.loading();
      await loading.present();
      // Subir la imagen y obtener url

      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firesbaseSvc.uploadImage(imagePath, dataUrl!);
      this.form.controls.image.setValue(imageUrl);
      delete this.form.value.id;

      this.firesbaseSvc
        .addDocument(path, this.form.value)
        .then(async (res) => {
          await this.firesbaseSvc.updateUser(this.form.value.name);
          this.utilsSvc.presentToast({
            message: 'Producto agregado exitosamente',
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
}
