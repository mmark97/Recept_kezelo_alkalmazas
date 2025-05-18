import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'recipesapp-65543',
        appId: '1:854973143516:web:b77657599ca4a77fd2d719',
        storageBucket: 'recipesapp-65543.firebasestorage.app',
        apiKey: 'AIzaSyAMkkzi2ZHB9EeY_ldc7NW3awVy4f136TU',
        authDomain: 'recipesapp-65543.firebaseapp.com',
        messagingSenderId: '854973143516',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
