import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class AccountComponent implements OnInit {

  private readonly userAuthService =
    inject(UserAuthService);

  loading = true;
  errorMessage = '';

  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
    provider: string;
    lastLoginAt: string | null;
  } | null = null;

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userAuthService
      .getCurrentUser()
      .subscribe({
        next: response => {
          this.user = response.user;
          this.loading = false;
        },

        error: () => {
          this.user = null;
          this.loading = false;
          this.errorMessage =
            'Unable to load your account details.';
        }
      });
  }
}
