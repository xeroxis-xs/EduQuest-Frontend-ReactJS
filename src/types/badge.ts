import type {Image} from "@/types/image";

export interface Badge {
  id: number;
  name: string;
  description: string;
  type: string;
  condition: string;
  image: Image;
}
