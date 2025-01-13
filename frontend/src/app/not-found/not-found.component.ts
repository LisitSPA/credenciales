import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  isVisible: boolean = false;
  constructor(private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true; 
    }, 1000); 
  }
  goHome(): void{
    this.router.navigate(['/home']);
  }
}
    
