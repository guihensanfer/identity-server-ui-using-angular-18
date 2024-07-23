import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() imageUrl: string | undefined = undefined;

  initials: string = '';

  ngOnInit(): void {
    this.initials = this.getInitials(this.firstName, this.lastName);
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`;
  }
}
