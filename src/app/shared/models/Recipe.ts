import { Ingredient } from './Ingredient';
import { Review } from './Review';
import { Tag } from './Tag';

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  servings?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  imageUrl?: string;
  author?: string;
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  reviews?: Review[];
  tags?: Tag[];
}
