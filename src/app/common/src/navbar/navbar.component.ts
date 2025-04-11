import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private matSnackBar = inject(MatSnackBar);
  private router = inject(Router);

  private authSubscription!: Subscription;

  private userDetailSignal: WritableSignal<any> = signal(null);

  ngOnInit() {
    this.loadUserDetail();
    this.authSubscription = this.authService.authStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadUserDetail();
      } else {
        this.userDetailSignal.set(null);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadUserDetail() {
    const user = this.authService.getUserDetail();
    console.log('User Detail:', user);
    this.userDetailSignal.set(user);
  }

  userDetail = computed(() => this.userDetailSignal());

  logout(): void {
    console.log('Logout clicked');

    this.authService.logout().subscribe({
      next: () => {
        this.completeLogout();
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.completeLogout();
      }
    });
  }

  private completeLogout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userDetail');

    this.userDetailSignal.set(null);
    this.authService.updateAuthStatus(false);

    setTimeout(() => {
      window.location.href = 'http://localhost:4200/';
    }, 500);
    this.matSnackBar.open('Logout successful', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
    });

    window.location.href = 'http://localhost:4200/';

  }
}  