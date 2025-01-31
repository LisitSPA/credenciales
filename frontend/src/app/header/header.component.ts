import { Component, OnInit } from '@angular/core';
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

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
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
    this.authService.logout();  
  }
}
