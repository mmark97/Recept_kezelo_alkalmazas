import { Component, inject, Input } from '@angular/core';
import { Recipe } from '../../shared/models/Recipe';
import { MatCardModule } from '@angular/material/card';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { User } from 'firebase/auth';
import { RecipesService } from '../../shared/services/recipes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes',
  imports: [MatCardModule, RecipeItemComponent, MatButtonModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent {
  isLoggedIn = false;
  recipes: Recipe[] = [];
  private authSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private recipesService: RecipesService
  ) {}

  async ngOnInit() {
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
    this.recipes = await this.recipesService.getAllRecipes();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CreateRecipeComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openRecipe(id: string) {
    this.router.navigate([`/recipes/${id}`]);
  }
}
