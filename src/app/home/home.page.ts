import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  firesbaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() {}

  singOut() {
    this.firesbaseSvc.signOut();
  }
}
