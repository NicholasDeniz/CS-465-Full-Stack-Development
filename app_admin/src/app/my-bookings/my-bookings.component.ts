import { ChangeDetectorRef, Component, OnInit } from '@angular/core' // Manually refresh page, Define angular component, and provides ngOnInit lifecycle method
import { CommonModule } from '@angular/common'; // Provides Angular features like *ngIf, *ngFor, data pipe, and currency pipe
import { Booking } from '../models/booking'; // Describes the structure of booking data from the API
import { TripDataService } from '../services/trip-data.service'; // Sendsbooking HTTP to the Express API

@Component({
    selector: 'app-my-bookings',
    standalone: true, 
    imports: [CommonModule], // Makes CommonModule features available
    templateUrl: './my-bookings.component.html', // Connects to HTML template
    styleUrl: './my-bookings.component.css' // Connects to CSS file
})
export class MyBookingsComponent implements OnInit {
    // Stores bookings returned by GET /api/bookings
    bookings: Booking[] = []

    message = ''; // Stores different messages

    constructor(
        private tripDataService: TripDataService, // Uses it so this component can retrieve and cancel bookings through the backend API
        private cdr: ChangeDetectorRef // So template can be refreshed after a async API response
    ) {}

    // Angular runs ngOnInit after creating component
    ngOnInit(): void {
        // When page first opens get customer bookings already
        this.loadBookings();
    }

    // Retrieve customers bookings. Succesful message is just so that when cancelled it can say 'Booking cancelled'
    private loadBookings(successMessage = ''): void {
        // Call service method for GET /api/bookings
        // subscribe() will wait for a succesful or bad response from the API
        this.tripDataService.getMyBookings().subscribe({
            // next runs when API is succesful
            next: (bookings: Booking[]) => {
                // Save returned bookings so they can be displayed with *ngFor
                this.bookings = bookings;

                // If there is a succesful messgae then display it. Otherwise explain that the customer doesn't have bookings or just leave it empty
                this.message = successMessage || (
                    bookings.length === 0 ? "You don't have any bookings." : ''
                );

                // Tells Angular to refresh after the API response 
                this.cdr.detectChanges();
            },

            // error if backend rejects request or the API can't be gotten
            error: (error: any) => {
                // Using message from Express API if not then a backup
                this.message = error?.error?.message || "Can't retrieve your bookings.";

                // Refresh so error is shown
                this.cdr.detectChanges();
            }
        });
    }

    // Called by cancel booking button. bookingIdis the MongoDB _id of the selected booking
    public cancelBooking(bookingId: string): void {
        // Make sure the customer wants to delete it. confirm() would return false if they confirm cancel
        if (!confirm('Do you still want to cancel this booking?')) {
            return; // Stoop without sending API request
        }

        // Send DELETE /api/bookings/id/:bookingId 
        // Backend uses authenticated customer's ID from the JWT so they can't cancel another customers booking
        this.tripDataService.cancelBooking(bookingId).subscribe({
            // next runs when the booking is succesful in deletion
            next: () => {
                // Retrieve bookings again so the the booking that was cancelled disappears
                this.loadBookings('Booking cancelled.');
            },

            // error if backend rejects request or the API can't be gotten
            error: (error: any) => {
                // Using message from Express API if not then a backup
                this.message = error?.error?.message || "Can't cancel your booking.";

                // Refresh so error is shown
                this.cdr.detectChanges();
            }
        });
    }
}