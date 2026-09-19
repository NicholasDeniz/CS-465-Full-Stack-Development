import { Routes } from '@angular/router';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { LoginComponent } from './login/login';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

export const routes: Routes = [
  { path: 'add-trip', component: AddTripComponent },
  { path: 'edit-trip', component: EditTripComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: TripListingComponent, pathMatch: 'full' },
  { path: 'my-bookings', component: MyBookingsComponent } // Maps /my-bookings to MyBookingsComponent
];
