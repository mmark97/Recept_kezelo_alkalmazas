export interface Review {
    id: number;
    recipeId: number;
    userId: number;
    rating: number; // 1 to 5
    comment?: string;
    createdAt: Date;
  }
  