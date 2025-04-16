import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dropdownStates:any = {
    users: false,
    products: false
  };
  isSidebarClosed: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  toggleDropdown(dropdown: string): void {
    // Toggle solo el estado del dropdown específico
    this.dropdownStates[dropdown] = !this.dropdownStates[dropdown];
  }
}
