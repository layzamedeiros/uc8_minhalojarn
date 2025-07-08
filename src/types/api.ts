export interface CredentialsLogin {
  user: string;
  password: string;
}

export interface ResponseLoginApi {
  token: string;
}

export interface ProductApi {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
  rate: number;
  count: number;
  };
}