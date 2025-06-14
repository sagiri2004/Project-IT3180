export type TicketType = 'MONTHLY' | 'DAILY';
export type VehicleType = 'CAR' | 'MOTORBIKE';

export interface VehicleFeeConfig {
  id: number;
  vehicleType: VehicleType;
  ticketType: TicketType;
  price: number;
} 