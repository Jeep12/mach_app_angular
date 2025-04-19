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
import { AuthService } from '../../services/auth.service';
import { finalize, Subscription } from 'rxjs';
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
  private usersSubscription?: Subscription;

  constructor(
    private userManagementService: UserManagementService,
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();

  }
  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }


  loadUsers(): void {
    this.loading = true;
    // Limpia la suscripción anterior si existe
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }

    this.usersSubscription = this.userManagementService.getUsers().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.userFilterSort = new UserFilterSort(this.users);
        this.updateUsers();
      },
      error: (error) => {
        console.error('Error loading users:', error);
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

    if (!this.authService.isAdmin()) {
      this.modalService.showError({
        title: 'Error, acción no permitida',
        message: 'No tienes permisos para cambiar el estado de este usuario.',
      });
      return;

    }
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
    if (!this.authService.isAdmin()) {
      this.modalService.showError({
        title: 'Error, acción no permitida',
        message: 'No tienes permisos para eliminar este usuario.',
      });
      return;

    }
    if (this.authService.hasAdminRole(user)) {
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
    if (!this.authService.isAdmin()) {
      this.modalService.showError({
        title: 'Error, acción no permitida',
        message: 'No tienes permisos para cambiar el rol de este usuario.',
      });
      return;

    }
    if (this.authService.hasAdminRole(user)) {
      this.modalService.showError({
        title: 'Error, acción no permitida',
        message: 'No se puede cambiar los roles de un administrador.',
      });
      return;
    }

    const currentRole = user.roles.some(role => role.name === 'ROLE_EMPLOYEE') ? 'ROLE_EMPLOYEE' : 'ROLE_USER';
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
    this.selectUser(user);
    this.modalService.shoeResendRecoveryEmail({
      user: user,
    });

  }


  resendEmailVerification(User: User) {
    console.log('Resend email verification', User);
    this.modalService.showError({
      title: 'No disponible',
      message: 'Esta funcionalidad no está disponible en este momento.',
    });
  }

}