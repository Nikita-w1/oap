import { ratings } from "../store/ratings.store.js";
import { Rating } from "../types/models.js";

export const ratingsRepository = {
  getAll(): Rating[] {
    return ratings;
  },
  findById(id: string): Rating | undefined {
    return ratings.find((item) => item.id === id);
  },
  create(rating: Rating): Rating {
    ratings.push(rating);
    return rating;
  },
  delete(id: string): boolean {
    const index = ratings.findIndex((item) => item.id === id);
    if (index === -1) return false;
    ratings.splice(index, 1);
    return true;
  },
};
