import { Component, HostListener, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { UserFilterSort } from '../../helpers/user-filter-sort';
import { Role } from '../../models/role.model';
import { ModalService } from '../../services/modal-service.service';
import { ModalSuccessComponent } from "../modal-success/modal-success.component";
declare var bootstrap: any; // Para usar Bootstrap en Angular

@Component({
  selector: 'app-users-specifications',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ModalSuccessComponent],
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
    private modalService:ModalService
  ) { }

  ngOnInit(): void {
    this.loadUsers();

  }

  loadUsers(): void {
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
  // En el componente
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.user-actions-popover, .user-actions-btn')) {
      this.closePopovers();
    }
  }


  toggleUserStatus(user: User): void {
    this.selectUser(user);
    this.userManagementService.toggleUserStatus(user.id).subscribe(response => {
      user.enabled = !user.enabled;
      this.modalAction = user.enabled ? 'habilitado' : 'deshabilitado';

      const modal = new bootstrap.Modal(document.getElementById('successModal'));
      modal.show();
    });
  }
  cleanInputSearch(): void {
    this.searchTerm = '';
    this.filterUsers();  // Volver a filtrar usuarios (si es necesario)

  }

  deleteUser(user: User): void {
    this.selectUser(user);

    if (user.roles.some(role => role.name === 'ROLE_ADMIN')) {
      const modal = new bootstrap.Modal(document.getElementById('deleteUserAdminModal'));
      modal.show();
    } else {
      const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
      modal.show();
    }
  }

  confirmDelete(): void {
    if (this.selectedUser) {
      this.userManagementService.deleteUser(this.selectedUser.id).subscribe({
        next: (response) => {
          this.loadUsers();
          const modal = new bootstrap.Modal(document.getElementById('deleteSuccess'));
          modal.show();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  selectUser(user: User): void {
    this.selectedUser = user;
  }
  cancelDelete(): void {
    const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    modal.hide(); // Ocultamos el modal si el usuario cancela la acción
  }

  isAdmin(): boolean {
    return this.selectedUser?.roles.some(role => role.name === 'ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.selectedUser?.roles.some(role => role.name === 'ROLE_USER');
  }
  toggleRoleUser(user: User): void {
    this.selectUser(user);
    this.selectedRole = user.roles.some(role => role.name === 'ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
    const button = document.getElementById('changeRoleBtn') as HTMLElement;
    button.blur();
    const modal = new bootstrap.Modal(document.getElementById('roleModal'));
    modal.show();
    
    // Optionally focus the first focusable element when modal opens
    setTimeout(() => {
      const firstFocusable = document.querySelector('#roleModal [autofocus], #roleModal button:not([disabled])');
      if (firstFocusable) (firstFocusable as HTMLElement).focus();
    });
  }
  changeRoles(user: User): void {
    console.log('Rol seleccionado:', this.selectedRole);
    console.log('Usuario:', user);
  
    if (!this.selectedRole) {
      console.error('No se ha seleccionado ningún rol');
      return;
    }
  
    const roles = [this.selectedRole]; // Asegúrate que sea un array
  
    this.userManagementService.updateUserRoles(user.id, roles).subscribe({
      next: (response) => {
        console.log('Roles actualizados:', response);
        this.loadUsers();
        
        // Mostrar modal de éxito con el servicio
        this.modalService.showSuccess({
          title: 'Rol actualizado',
          message: `El rol del usuario ${this.selectedUser.name} ha sido cambiado a ${this.selectedRole === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}.`
        });
        
        // Eliminamos la línea que usa bootstrap.Modal
      },
      error: (error) => {
        console.error('Error al actualizar roles:', error.message);
        // Opcional: Mostrar modal de error (lo implementaremos después)
        // this.modalService.showError({
        //   title: 'Error al actualizar rol',
        //   message: 'No se pudo cambiar el rol del usuario'
        // });
      }
    });
  }


}