import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: false,
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firesbaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {

    if (this.form.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firesbaseSvc.signIn(this.form.value as User).then(res =>{
        console.log('Usuario logeado:', res.user);
        this.getUserInfo( res.user.uid );
      }).catch(err =>{
        console.error('Error al logearse:', err);
        this.utilsSvc.presentToast({
          message: err.message,
          duration: 3000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() =>{
        loading.dismiss();
      })

    }


    
  }

  async getUserInfo(uid: string) {
    {
      if (this.form.valid) {
        const loading = await this.utilsSvc.loading();
        await loading.present();

        let path = `users/${uid}`;

        this.firesbaseSvc
          .getDocument(path)
          .then((user: User) => {
            this.utilsSvc.saveInLocalStorage('user', user);
            this.utilsSvc.routerLink('/main/home');
            this.form.reset();

            this.utilsSvc.presentToast({
              message: `Bienvenido de nuevo ${user.name}`,
              duration: 1500,
              color: 'primary',
              position: 'middle',
              icon: 'person-circle-outline',
            });

          })
          .catch((err) => {
            console.error('Error al logearse:', err);
            this.utilsSvc.presentToast({
              message: err.message,
              duration: 3000,
              color: 'primary',
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
}
