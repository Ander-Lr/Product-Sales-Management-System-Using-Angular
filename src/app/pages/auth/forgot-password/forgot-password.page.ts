  import { Component, OnInit, inject } from '@angular/core';
  import { FormControl, FormGroup, Validators } from '@angular/forms';
  import { User } from '../../../models/user.models';
  import { FirebaseService } from 'src/app/services/firebase.service';
  import { UtilsService } from 'src/app/services/utils.service';

  @Component({
    standalone: false,
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
  })
  export class ForgotPasswordPage implements OnInit {
    form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    firesbaseSvc = inject(FirebaseService);
    utilsSvc = inject(UtilsService);

    ngOnInit() {}

    async submit() {

      if (this.form.valid){
        const loading = await this.utilsSvc.loading();
        await loading.present();

        this.firesbaseSvc.sendRecoveryEmail(this.form.value.email).then(res =>{
    
          this.utilsSvc.presentToast({
            message: 'Si el correo esta registrado, recibiras un enlace de recuperacion',
            duration: 3000,
            color: 'primary',
            position: 'middle',
            icon: 'mail-outline'
          });

        this.utilsSvc.routerLink('/auth');
        this.form.reset();  



        }).catch(err =>{
          console.error(err);
          this.utilsSvc.presentToast({
            message: err.message,
            duration: 3000,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        }).finally(() =>{
          loading.dismiss();
        })

      }


      
    }

    
  }
