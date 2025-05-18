import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../../shared/services/recipes.service';
import { Recipe } from '../../../shared/models/Recipe';
import { RecipeCommentComponent } from '../recipe-comment/recipe-comment.component';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipe-details',
  imports: [RecipeCommentComponent, DatePipe, MatButtonModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  async ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id')!;
    this.recipe = await this.recipesService.getRecipeById(recipeId);
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
