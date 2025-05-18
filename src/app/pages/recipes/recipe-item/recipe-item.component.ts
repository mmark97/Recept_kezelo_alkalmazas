import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Recipe } from '../../../shared/models/Recipe';

@Component({
  selector: 'app-recipe-item',
  imports: [CommonModule, MatCardModule],
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.scss',
})
export class RecipeItemComponent {
  @Input() recipe!: Recipe;
  @Output() openRecipe = new EventEmitter<void>();

  navigateToRecipe() {
    this.openRecipe.emit();
  }
}
