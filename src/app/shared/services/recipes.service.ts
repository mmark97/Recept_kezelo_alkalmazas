import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { firstValueFrom, take } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Recipe } from '../models/Recipe';
import { Tag } from '../models/Tag';
import { User } from '../models/User';
import { Review } from '../models/Review';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  constructor(private authService: AuthService, private firestore: Firestore) {}

  async commentRecipe(
    recipeId: string,
    review: Partial<Review>
  ): Promise<boolean> {
    const user = await firstValueFrom(
      this.authService.currentUser.pipe(take(1))
    );

    if (!user) {
      throw new Error('No authenticated user found');
    }

    const recipeDocRef = doc(this.firestore, `Recipes/${recipeId}`);
    const recipeDocSnap = await getDoc(recipeDocRef);

    if (!recipeDocSnap.exists()) {
      console.error('Recipe not found');
      return false;
    }

    const recipeData = recipeDocSnap.data() as Recipe;
    const existingReviews = recipeData.reviews || [];

    // Add the new review to the existing array
    const updatedReviews = [
      ...existingReviews,
      {
        ...review,
        userId: user.uid,
        createdAt: this.formatDateToString(new Date()),
      },
    ];

    // Update Firestore document
    await updateDoc(recipeDocRef, {
      reviews: updatedReviews,
    });

    return true;
  }

  async getRecipeById(recipeId: string): Promise<Recipe | null> {
    const recipeDocRef = doc(this.firestore, `Recipes/${recipeId}`);
    const recipeDocSnap = await getDoc(recipeDocRef);

    if (!recipeDocSnap.exists()) {
      return null;
    }

    const recipeData = recipeDocSnap.data() as Recipe;

    // Fetch author's name from Users collection
    const authorId = recipeData.author;
    if (authorId) {
      const userDocRef = doc(this.firestore, `Users/${authorId}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        recipeData.author = `${userData.firstName} ${userData.lastName}`;
      } else {
        recipeData.author = 'Unknown Author';
      }

      recipeData.reviews?.forEach(async (review) => {
        review.userId = await this.getUserNameById(review.userId);
      });
    }

    return recipeData;
  }

  async getAllRecipes() {
    const recipes: Recipe[] = [];
    const recipesCollection = collection(this.firestore, 'Recipes');
    const q = query(recipesCollection);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const userDocRef = doc(
        this.firestore,
        `Users/${document.data()['author']}`
      );
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        const tempRecipe = {
          ...document.data(),
          author: `${userData.firstName} ${userData.lastName}`,
        } as Recipe;
        recipes.push(tempRecipe);
      }
    });
    return recipes;
  }

  async createRecipe(data: Recipe) {
    const user = await firstValueFrom(
      this.authService.currentUser.pipe(take(1))
    );

    if (!user) {
      throw new Error('No authenticated user found');
    }

    const recipesCollection = collection(this.firestore, 'Recipes');
    const recipeToSave: Recipe = { ...data, author: user.uid };
    const docRef = await addDoc(recipesCollection, recipeToSave);
    await updateDoc(docRef, { id: docRef.id });
  }

  async getUserNameById(id: string): Promise<string> {
    const userDocRef = doc(this.firestore, `Users/${id}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as {
        firstName?: string;
        lastName?: string;
      };
      const firstName = userData.firstName || '';
      const lastName = userData.lastName || '';
      return `${firstName} ${lastName}`.trim() || 'Unknown User';
    } else {
      return 'Unknown User';
    }
  }

  private formatDateToString(date: Date | string): string {
    if (typeof date === 'string') {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.includes('T') ? date.split('T')[0] : date;
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }
}
