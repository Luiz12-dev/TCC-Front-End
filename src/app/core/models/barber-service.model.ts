export interface BarberService {
  id?: string;
  serviceName: string;
  description: string;
  price: number;
  durationMin: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
