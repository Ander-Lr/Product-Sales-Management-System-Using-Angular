import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from '../../../models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firesbaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil'))
      .dataUrl;

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firesbaseSvc.uploadImage(imagePath, dataUrl!);

    this.firesbaseSvc
      .updateDocument(path, { image: user.image })
      .then(async (res) => {
       
        this.utilsSvc.saveInLocalStorage('user',user);


        this.utilsSvc.presentToast({
          message: 'Imaegn actualizada exitosamente',
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
