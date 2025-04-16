import { User } from "../models/user.model";

export class UserFilterSort {
  constructor(private users: User[]) {}

  search(term: string): User[] {
    if (!term.trim()) return [...this.users];
    
    const lowerTerm = term.toLowerCase();
    const terms = lowerTerm.split(' ').filter(t => t.length > 0);
    
    return this.users.filter(user => {
      return terms.every(t => 
        this.userMatchesTerm(user, t)
      );
    });
  }

  private userMatchesTerm(user: User, term: string): boolean {
    // Búsqueda en campos básicos
    if (user.name?.toLowerCase().includes(term)) return true;
    if (user.lastname?.toLowerCase().includes(term)) return true;
    if (user.email?.toLowerCase().includes(term)) return true;
    
    // Búsqueda en roles
    if (user.roles?.some(role => role.name?.toLowerCase().includes(term))) return true;
    
    // Búsqueda por estado
    if (this.checkStatusMatch(user.enabled, term, ['si', 'sí', 'yes', 'activo', 'active', 'habilitado', 'true'])) return true;
    if (this.checkStatusMatch(!user.enabled, term, ['no', 'not', 'inactivo', 'inactive', 'deshabilitado', 'false'])) return true;
    
    // Búsqueda por verificación de email
    if (this.checkStatusMatch(user.emailVerified, term, ['si', 'sí', 'yes', 'verificado', 'verified', 'true'])) return true;
    if (this.checkStatusMatch(!user.emailVerified, term, ['no', 'not', 'no verificado', 'unverified', 'false'])) return true;
    
    // Búsqueda en fecha de creación
    if (user.createdAt?.toString().toLowerCase().includes(term)) return true;
    
    return false;
  }

  private checkStatusMatch(condition: boolean, term: string, matches: string[]): boolean {
    return condition && matches.includes(term);
  }

  sort(users: User[], field: keyof User, direction: 'asc' | 'desc'): User[] {
    return [...users].sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);

      if (valueA === null || valueA === undefined) return direction === 'asc' ? 1 : -1;
      if (valueB === null || valueB === undefined) return direction === 'asc' ? -1 : 1;
      if (valueA === valueB) return 0;
      
      // Para ordenación de booleanos
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return direction === 'asc' ? (valueA === valueB ? 0 : valueA ? 1 : -1) 
                                  : (valueA === valueB ? 0 : valueA ? -1 : 1);
      }
      
      // Para ordenación de fechas
      if (valueA instanceof Date && valueB instanceof Date) {
        return direction === 'asc' ? valueA.getTime() - valueB.getTime() 
                                  : valueB.getTime() - valueA.getTime();
      }
      
      // Para ordenación de strings
      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();
      
      const comparison = stringA.localeCompare(stringB);
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  private getSortValue(user: User, field: keyof User): any {
    switch (field) {
      case 'emailVerified':
      case 'enabled':
        return user[field];
      case 'roles':
        return user.roles?.map(role => role.name).join(', ') || '';
      case 'createdAt':
        return user.createdAt ? new Date(user.createdAt) : null;
      default:
        return user[field] ?? '';
    }
  }

  paginate(users: User[], currentPage: number, pageSize: number): { users: User[], totalPages: number } {
    const totalPages = Math.ceil(users.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return { 
      users: users.slice(start, end), 
      totalPages 
    };
  }
}