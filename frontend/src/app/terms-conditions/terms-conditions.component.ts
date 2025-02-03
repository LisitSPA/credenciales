import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
  imports: [CommonModule],
})
export class TermsConditionsComponent {
    @Input() isOpen: boolean = false; 
    @Input() loading: boolean = false; 
    @Output() accept = new EventEmitter<void>();  
    @Output() reject = new EventEmitter<void>(); 
    

  handleAccept(): void {
    this.loading = true; 
    setTimeout(() => {
      this.accept.emit(); 
    }, 3000);
  }
  
  
  handleReject(): void {
    this.loading = true; 
    setTimeout(() => {
      this.reject.emit(); 
      this.loading = false; 
    }, 3000);
  }
    
}
