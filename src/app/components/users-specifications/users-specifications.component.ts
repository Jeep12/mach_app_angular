import { Component, HostListener, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { UserFilterSort } from '../../helpers/user-filter-sort';
import { Role } from '../../models/role.model';
import { ModalService } from '../../services/modal.service';
import { ModalSuccessComponent } from "../modal-success/modal-success.component";
import { ModalChangeRolesComponent } from "../modal-change-roles/modal-change-roles.component";
import { ModalDeleteUserAdminComponent } from "../modal-delete-user-admin/modal-delete-user-admin.component";
import { ModalDeleteUserComponent } from "../modal-delete-user/modal-delete-user.component";
import { ModalErrorComponent } from "../modal-error/modal-error.component";
import { ModalResendEmailRecoveryComponent } from "../modal-resend-email-recovery/modal-resend-email-recovery.component";
declare var bootstrap: any; // Para usar Bootstrap en Angular

@Component({
  selector: 'app-users-specifications',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ModalSuccessComponent, ModalChangeRolesComponent, ModalDeleteUserAdminComponent, ModalDeleteUserComponent, ModalErrorComponent, ModalResendEmailRecoveryComponent],
  templateUrl: './users-specifications.component.html',
  styleUrls: ['./users-specifications.component.css']
})
export class UsersSpecificationsComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  sortField: keyof User = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSizeOptions: number[] = [5, 8, 15, 30];
  pageSize: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  totalUsers: number = 0;

  openedPopoverId: number | null = null;

  modalAction: 'habilitado' | 'deshabilitado' = 'habilitado';

  selectedUser: User = {
    id: 0,
    roles: [],
    name: '',
    lastname: '',
    email: '',
    emailVerified: false,
    enabled: true,
    createdAt: ''
  }

  sortOptions: { field: keyof User, label: string }[] = [
    { field: 'name', label: 'Nombre' },
    { field: 'lastname', label: 'Apellido' },
    { field: 'email', label: 'Email' },
    { field: 'emailVerified', label: 'Verificación' },
    { field: 'enabled', label: 'Estado' },
    { field: 'createdAt', label: 'Fecha Creación' },
    { field: 'roles', label: 'Roles' }
  ];

  selectedRole: any = '';

  private userFilterSort!: UserFilterSort;

  constructor(
    private userManagementService: UserManagementService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadUsers();

  }

  loadUsers(): void {
    console.log("Recargando usuarios...");
    this.loading = true;
    this.userManagementService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.userFilterSort = new UserFilterSort(this.users);
        this.updateUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  updateUsers(): void {
    let users = this.userFilterSort.search(this.searchTerm);
    this.totalUsers = users.length;

    users = this.userFilterSort.sort(users, this.sortField, this.sortDirection);
    const result = this.userFilterSort.paginate(users, this.currentPage, this.pageSize);

    this.filteredUsers = users;
    this.pagedUsers = result.users;
    this.totalPages = result.totalPages;

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
      this.updateUsers();
    }
  }

  filterUsers(): void {
    this.currentPage = 1;
    this.updateUsers();
  }

  changeSort(field: keyof User): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.updateUsers();
  }

  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updateUsers();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateUsers();
    }
  }

  getSortIcon(field: keyof User): string {
    if (this.sortField !== field) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  trackByUserId(index: number, user: User): string {
    return user.id.toString();
  }

  getPageRange(): number[] {
    const rangeSize = 5;
    let start = Math.max(1, this.currentPage - Math.floor(rangeSize / 2));
    let end = Math.min(this.totalPages, start + rangeSize - 1);

    // Ajustar si no estamos mostrando suficientes páginas
    if (end - start + 1 < rangeSize) {
      start = Math.max(1, end - rangeSize + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }


  toggleUserActions(userId: number): void {
    this.openedPopoverId = this.openedPopoverId === userId ? null : userId;
  }

  closePopovers(): void {
    this.openedPopoverId = null;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.user-actions-popover, .user-actions-btn')) {
      this.closePopovers();
    }
  }

  toggleUserStatus(user: User): void {
    this.selectUser(user);
    console.log("clickeo cambiar ")

    this.userManagementService.toggleUserStatus(user.id).subscribe(response => {
      user.enabled = !user.enabled;
      this.modalAction = user.enabled ? 'habilitado' : 'deshabilitado';
      this.modalService.showSuccess({
        title: 'Usuario actualizado',
        message: `El usuario ${this.selectedUser.name} ${this.selectedUser.lastname}  a sido ${this.modalAction} con exito. `,
      });
 
    });
  }
  cleanInputSearch(): void {
    this.searchTerm = '';
    this.filterUsers();  // Volver a filtrar usuarios (si es necesario)

  }

  deleteUser(user: User): void {
    this.selectUser(user);

    if (user.roles.some(role => role.name === 'ROLE_ADMIN')) {
      this.modalService.showDeleteUserAdmin({
        show: true
      });
    } else {
      this.modalService.showDeleteUser({
        user: user,
      });
    }
  }


  selectUser(user: User): void {
    this.selectedUser = user;
  }


  toggleRoleUser(user: User): void {
    this.selectUser(user);
    const currentRole = user.roles.some(role => role.name === 'ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
    this.modalService.showChangeRole({
      user: user,
      currentRole: currentRole
    });
  }


  onRoleChanged(event: { user: User | null, newRole: string }) {
    // Lógica para cambiar rol acá
    this.loadUsers();
  }
  onDeleteChanged(event: { user: User | null }) {
    this.loadUsers();
  }

  resendEmailRecovery(user: User): void {
    console.log("clickeo enviar email")
    this.selectUser(user);
    this.modalService.shoeResendRecoveryEmail({
      user: user,
    });

  }




}