import { Component, OnInit, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  dropdownOpen: boolean = false; 
  role: string | null = null;   
  isSidebarActive: boolean = false;
  userName: string | null = null; 
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.role = localStorage.getItem('role');
      this.userName = localStorage.getItem('userName');
    } else {
      console.warn('localStorage no está disponible.');
    }
  }

  @HostListener('window:userNameUpdated', ['$event'])
  onUserNameUpdated(): void {
    this.userName = localStorage.getItem('userName');
  }
  

  loadUserNameFromLocalStorage(): void {
    this.role = localStorage.getItem('role');
    this.userName = localStorage.getItem('userName');
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive; 
  }

  openModal(): void {
    const modal = document.getElementById('supportModal');
    if (modal) {
      modal.style.display = 'block'; 
    }
  }

  closeModal(): void {
    const modal = document.getElementById('supportModal');
    if (modal) {
      modal.style.display = 'none'; 
    }
  }

  goToProfile() {
    this.router.navigate(['/perfil']); 
  }

  logout() {
    this.loading = true;
    this.authService.logout();  
    localStorage.removeItem('collaboratorId');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('print');
    localStorage.removeItem('tokenChangePassword');
    localStorage.removeItem('termsAccepted');
  }
}
