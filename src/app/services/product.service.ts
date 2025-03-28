import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

const PRODUCTS_KEY = makeStateKey<Product[]>('products');

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`; // URL base de la API de productos

  constructor(
    private http: HttpClient,
    @Inject(TransferState) private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    // Verifica si los datos ya están en el TransferState
    if (this.transferState.hasKey(PRODUCTS_KEY)) {
      const products = this.transferState.get(PRODUCTS_KEY, []);
      this.transferState.remove(PRODUCTS_KEY); // Limpia el estado después de usarlo
      return of(products);
    }

    // Si no, hace la solicitud HTTP
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        // Guarda los datos en el TransferState si estamos en el servidor
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(PRODUCTS_KEY, products);
        }
      })
    );
  }

  // Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Crear un producto
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Actualizar un producto
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}