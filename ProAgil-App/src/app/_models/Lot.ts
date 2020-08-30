export interface Lot {
    id: number;
    name: string;
    price: number;
    starteDate?: Date;
    endDate?: Date;
    quantity: number;
    eventId: number;
}
