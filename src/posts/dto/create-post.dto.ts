export class CreatePost {
  title: string;
  content: string;
  category?: { name: string };
  location: string;
  imageUrl?: string;
  postType: string;
  priceMin?: number;
  priceMax?: number;
}
