import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // Añade CommonModule aquí
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  products: Product[] = [];

  constructor(  ) { }

  ngOnInit(): void {
  }


 
}