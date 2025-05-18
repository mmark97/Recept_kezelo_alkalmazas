export interface Review {
  id: number;
  recipeId: number;
  userId: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: string;
}
  