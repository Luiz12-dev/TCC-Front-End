import { Component, inject, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.css'
})
export class ClientLayout implements OnInit {
  private authService = inject(AuthService);
  
  userName = '';
  userInitials = '';
  mobileMenuOpen = false;
  userMenuOpen = false;

  ngOnInit() {
    this.extractUserInfo();
  }

  private extractUserInfo() {
    const token = this.authService.getToken();
    if (!token) return;
    
    try {
      let payload = token.split('.')[1];
      payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(payload));
      const name = decoded.username || decoded.name || decoded.sub || 'Cliente';
      this.userName = name;
      
      const parts = name.split(' ');
      if (parts.length >= 2) {
        this.userInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else {
        this.userInitials = name.substring(0, 2).toUpperCase();
      }
    } catch (e) {
      this.userName = 'Cliente';
      this.userInitials = 'CL';
    }
  }

  toggleMobileMenu(event: Event) {
    event.stopPropagation();
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.userMenuOpen = false;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  
  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    this.mobileMenuOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.userMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.mobileMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
  }
}
