import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
   <h2 mat-dialog-title>🗑️ Confirm Deletion</h2>

<mat-dialog-content>
  Are you sure you want to delete this product?
</mat-dialog-content>

<mat-dialog-actions>
  <div class="button-group">
    <button mat-button (click)="onNoClick()">No</button>
    <button mat-raised-button color="warn" (click)="onYesClick()">Yes</button>
  </div>
</mat-dialog-actions>

  `,
  imports: [MatDialogModule],
  styleUrls: ['./confirm-dialog.compoent.css']
})
export class ConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false); 
  }

  onYesClick(): void {
    this.dialogRef.close(true); 
  }
}
