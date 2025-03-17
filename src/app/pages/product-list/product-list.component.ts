import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, take } from 'rxjs';
import { Product } from '../../product.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ProductService } from '../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;
  
  storeService = inject(ProductService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  router: any;
  

  ngOnInit(): void {
    this.products$ = this.storeService.getProducts$();
  }
  editProduct(productId: number): void {
    // For example, navigate to edit page
    this.router.navigate(['form/:id', productId]);
  }
  

  deleteProduct(productId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this product?'
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.storeService.deleteProduct(productId).subscribe({
          next: () => {
            this.products$ = this.storeService.getProducts$(); // Refresh list
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error: (err) => {
            this.snackBar.open(`Failed to delete product: ${err.message}`, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}