import { User } from './user.model';

export interface Toy {
  _id: string;
  name: string;
  imgSrc: string;
  rentPrice: number;
  salePrice: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}
