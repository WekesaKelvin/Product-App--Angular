import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Confirm Deletion</h2>
    <mat-dialog-content>
      Are you sure you want to delete this product?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-raised-button color="warn" (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule]
})
export class ConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false); // Pass back "false" to indicate cancellation
  }

  onYesClick(): void {
    this.dialogRef.close(true);  // Pass back "true" to indicate confirmation
  }
}