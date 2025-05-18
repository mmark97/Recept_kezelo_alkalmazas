import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RecipesService } from '../../../shared/services/recipes.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-recipe-comment',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './recipe-comment.component.html',
  styleUrl: './recipe-comment.component.scss',
})
export class RecipeCommentComponent {
  @Input() recipeId: string = '';
  constructor(private recipesService: RecipesService) {}

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
    rating: new FormControl('', [Validators.required]),
  });

  signupError = '';

  async submitComment() {
    if (this.commentForm.invalid) {
      console.log('comment form is invalid');
    } else {
      const { comment, rating } = this.commentForm.value;

      await this.recipesService.commentRecipe(this.recipeId, {
        comment: comment ?? '',
        rating: Number(rating),
      });

      this.commentForm.reset();
      window.location.reload();
    }
  }
}
