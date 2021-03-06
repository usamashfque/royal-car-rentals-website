export class Payment {
    id: number = 0;
    bookingId: number;
    totalAmount: number = 0;
    paidAmount: number = 0;
    discountAmount: number = 0;
    dateAdded: string = new Date().toISOString();
    dateUpdated: string = new Date().toISOString();
}
