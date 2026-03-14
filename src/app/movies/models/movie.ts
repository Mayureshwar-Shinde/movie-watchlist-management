
export interface Movie {
  id: number;
  title: string;
  description: string;
  rating: number;
  watched: boolean;
  thumbnail: string;
  releaseDate: Date;
  duration: number;
}

export interface CreateMovie {
  title: string;
  description: string;
  rating: number;
  watched: boolean;
  thumbnail: string;
  releaseDate: Date;
  duration: number;
}



