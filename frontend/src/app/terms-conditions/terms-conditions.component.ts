import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent {
    @Input() isOpen: boolean = false; 
    @Input() loading: boolean = false; 
    @Output() accept = new EventEmitter<void>();  
    @Output() reject = new EventEmitter<void>(); 

  handleAccept(): void {
    this.accept.emit();
  }

  handleReject(): void {
    this.reject.emit();
  }
}
