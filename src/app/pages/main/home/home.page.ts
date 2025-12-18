import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firesbaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }
  singOut() {
    this.firesbaseSvc.signOut();
  }
}
