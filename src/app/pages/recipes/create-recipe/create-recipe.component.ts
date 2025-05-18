import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Tag } from '../../../shared/models/Tag';
import { RecipesService } from '../../../shared/services/recipes.service';
import { TagsService } from '../../../shared/services/tags.service';

@Component({
  selector: 'app-create-recipe',
  imports: [
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.scss',
})
export class CreateRecipeComponent implements OnInit {
  CreateRecipeForm: FormGroup;

  dummyTags: Tag[] = [];

  constructor(
    private fb: FormBuilder,
    private recipesService: RecipesService,
    private tagsService: TagsService
  ) {
    this.CreateRecipeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', Validators.required],
      servings: ['', Validators.required],
      prepTimeMinutes: ['', Validators.required],
      cookTimeMinutes: ['', Validators.required],
      instructions: this.fb.array([this.fb.control('', Validators.required)]),
      ingredients: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          description: [''],
          quantity: [null, [Validators.required, Validators.min(0.01)]],
          unit: [''],
          calories: [null, [Validators.min(0)]],
        }),
      ]),
      tags: [''],
      difficulty: [''],
    });
  }
  async ngOnInit() {
    this.dummyTags = await this.tagsService.getAllTags();
  }

  get name() {
    return this.CreateRecipeForm.get('name');
  }

  get instructions(): FormArray {
    return this.CreateRecipeForm.get('instructions') as FormArray;
  }

  get ingredients(): FormArray {
    return this.CreateRecipeForm.get('ingredients') as FormArray;
  }

  get tags(): FormArray {
    return this.CreateRecipeForm.get('tags') as FormArray;
  }

  addStep() {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeStep(index: number) {
    this.instructions.removeAt(index);
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
      unit: [''],
      calories: [0, [Validators.min(0)]],
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  create() {
    if (this.CreateRecipeForm.invalid) {
      console.log('Invalid form');
    } else {
      this.recipesService.createRecipe(this.CreateRecipeForm.value);
    }
  }
}
