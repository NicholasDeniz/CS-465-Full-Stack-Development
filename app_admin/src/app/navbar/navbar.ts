import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterModule } from '@angular/router';


@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router // Returns the user to the trips page when logged out
    ) { }

    ngOnInit() { }

    public isCustomer(): boolean {
        return this.authenticationService.isCustomer();
    }

    public isLoggedIn(): boolean {
        return this.authenticationService.isLoggedIn();
    }

    public onLogout(): void {
        this.authenticationService.logout(); // Removed saved JWT

        // Leaves customer pages
        this.router.navigate(['']);
    }
}