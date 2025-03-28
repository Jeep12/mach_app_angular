export interface Product {
    id?: number; // El ID es opcional porque no lo envías al crear un producto
    name: string;
    price: number;
    description?: string; // Descripción opcional
  }