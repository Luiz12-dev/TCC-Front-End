import { BarberService } from './barber-service.model';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id?: string;
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  service: BarberService;
  serviceId?: string;
  serviceName?: string;
  dateTime: string;
  status: AppointmentStatus;
  observation?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
