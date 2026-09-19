import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';
import { Booking } from '../models/booking';

@Injectable({
    providedIn: 'root'
})
export class TripDataService {
    constructor(
        private http: HttpClient,
        @Inject(BROWSER_STORAGE) private storage: Storage
    ) {}

    url = 'http://localhost:3000/api/trips';
    bookingUrl = 'http://localhost:3000/api/bookings';
    baseUrl = 'http://localhost:3000/api';

    // Delete one travel package only for an admin
    deleteTrip(tripCode: string): Observable<void> {
        return this.http.delete<void>(this.url + '/' + tripCode);
    }

    // Retrieve bookings owned by the customer that is logged in
    getMyBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.bookingUrl);
    }

    // Create a booking for the trip. Customer ID is from the valid JWT
    bookTrip(tripCode: string): Observable<Booking> {
        return this.http.post<Booking>(this.bookingUrl + '/' + tripCode, {});
    }

    // Cancel booking ownded by a customer that is logged in. API matches both the booking ID and JWT ID
    cancelBooking(bookingId: string): Observable<void> {
        return this.http.delete<void>(this.bookingUrl + '/id/' + bookingId);
    }

    getTrip(tripCode: string): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.url + '/' + tripCode);
    }

    addTrip(formData: Trip): Observable<Trip> {
        return this.http.post<Trip>(this.url, formData);
    }

    updateTrip(formData: Trip): Observable<Trip> {
        return this.http.put<Trip>(this.url + '/' + formData.code, formData);
    }

    getTrips(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.url);
    }

    // Call to our /login endpoint, returns JWT
    login(user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripDataService::login');
        return this.handleAuthAPICall('login', user, passwd);
    }

    // Call to our /register endpoint, creates user and returns JWT
    register(user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripDataService::register');
        return this.handleAuthAPICall('register', user, passwd);
    }

    // Helper method to process both login and register methods
    handleAuthAPICall(
        endpoint: string,
        user: User,
        passwd: string
    ): Observable<AuthResponse> {
        // console.log('Inside TripDataService::handleAuthAPICall');

        const formData = {
            name: user.name,
            email: user.email,
            password: passwd
        };

        return this.http.post<AuthResponse>(
            this.baseUrl + '/' + endpoint,
            formData
        );
    }
}