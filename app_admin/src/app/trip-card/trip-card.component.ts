import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service'; 
import { TripDataService } from '../services/trip-data.service'; // Sends booking and delete requests to backend

@Component({
    selector: 'app-trip-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trip-card.component.html',
    styleUrl:'./trip-card.component.css'
})

export class TripCardComponent implements OnInit {
    @Input() trip!: Trip; // The parent trip-listing component gives one trip to this card

    @Output() tripChanged = new EventEmitter<void>(); // Tells parent to reload trip list after deleting

    message = '';

    constructor(private router: Router, private authenticationService: AuthenticationService, private tripDataService: TripDataService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
    }

    public editTrip(trip: Trip) {
        localStorage.removeItem('tripCode');
        localStorage.setItem('tripCode', trip.code);
        this.router.navigate(['edit-trip']);
    }

    // Returns true when a user that is logged in is an admin
    public isAdmin(): boolean { 
        return this.authenticationService.isAdmin();
    }

    // Return true whan a user that is logged in is a customer
    public isCustomer(): boolean {
        return this.authenticationService.isCustomer();
    }

    // Create booking for the trip selected
    public bookTrip(trip: Trip): void {
        this.message = '';

        // Send trip code. Backend gets customer ID from valid JWT
        this.tripDataService.bookTrip(trip.code).subscribe({
            next: () => {
                this.message = 'Trip has been booked. It will be located under My Bookings.';

                // refresh
                this.cdr.detectChanges();
            },

            // Runs when API rejects booking
            error: (error: any) => {
                // Display backend message
                this.message = error?.error?.message || "Can't book this trip.";

                this.cdr.detectChanges();
            }
        });
    }

    // Delete the trip selected
    public deleteTrip(trip: Trip): void {
        // Give admin a chance to cancel
        if (!confirm(`Delete ${trip.name}?`)) {
            return;
        }

        // Send trip code. API will verify admin role
        this.tripDataService.deleteTrip(trip.code).subscribe({
            next: () => {
                // Lets TripListingComponent know to refresh trip list
                this.tripChanged.emit();
            },

            // Runs when API rejects delete
            error: (error: any) => {
                // Display backend message
                this.message = error?.error?.message || "Can't delete this trip.";

                this.cdr.detectChanges();
            }
        });
    }
}
