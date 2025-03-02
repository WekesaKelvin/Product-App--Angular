
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';  
import { ProductService } from '../../services/product.service';
import { Product } from '../../product.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';  // <-- Import

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  // Inject MatDialog
  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  deleteProduct(productId: number): void {
    // Open the custom confirm dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',    
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this product?'
      }
    });

    // After the dialog is closed, we get the result
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // User clicked "Yes"
        this.productService.deleteProduct(productId);
        this.loadProducts();
      }
      // If "No", nothing
    });
  }
}
