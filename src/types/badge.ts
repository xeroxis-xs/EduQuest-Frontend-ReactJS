import type {Image} from "@/types/image";

export interface Badge {
  image: Image;
  id: number;
  name: string;
  description: string;
  type: string;
  condition: string;
}
