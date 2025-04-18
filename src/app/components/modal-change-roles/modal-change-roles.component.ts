import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-change-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-change-roles.component.html',
  styleUrls: ['./modal-change-roles.component.css']
})
export class ModalChangeRolesComponent implements OnInit {
  show = false;
  user: User | null = null;
  currentRole: string = '';


  @Output() roleChanged = new EventEmitter<{ user: User | null, newRole: string }>();


  constructor(private modalService: ModalService, private userManagementService: UserManagementService) {
    this.modalService.toggleRoleSubject$.subscribe(state => {
      this.show = state.show;
      this.user = state.config.user;
      this.currentRole = state.config.currentRole;
    });
  }
  ngOnInit(): void {

  }

  close() {
    this.modalService.hide();
  }

  saveChanges() {

    const newRole = this.currentRole;
    const roleName = newRole === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'; // Ternario aquí
    const name = this.user?.name;
    const lastname = this.user?.lastname;
    if (!this.currentRole || !this.user) {
      alert('Datos incompletos para actualizar el rol');
      return;
    }

    const roles = [this.currentRole]; // Asegúrate que sea un array

    this.userManagementService.updateUserRoles(this.user!.id, roles).subscribe({
      next: (response) => {
        console.log('Roles actualizados:', response);



        this.modalService.showSuccess({
          title: 'Rol actualizado exitosamente',
          message: `El usuario  ${name} ${lastname}  ha sido actualizado con el rol de ${roleName} `,
        });

        this.roleChanged.emit({ user: this.user, newRole: this.currentRole });
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


    // Luego cierra el modal
    this.close();
  }
  isAdmin() {
    return this.currentRole === 'ROLE_ADMIN';
  }


}