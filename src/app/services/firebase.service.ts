import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);
  /*Autenticacion*/

  getAuth() {
    return getAuth();
  }

  // Acceder
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // registrar
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  // Acutlizar nombre user
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }
  // Enviar Email para recuperar contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //cerrar sesión
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // Base de datos Firestore
  /**
   * Obtener datos de una coleccion
   */
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }

  // setear documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

    // Actualizar documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

    // Eliminar documento
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }
  // Obtener documento
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  /*Agregar Documento*/
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // Almacenamiento

  // Subirr imagen
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  // Obtener ruta de la imagen con su URL
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // Eliminar archivo
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
