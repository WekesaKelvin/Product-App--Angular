import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  handleError(error: any): void {
    // Log the error to the console 
    console.error('Global error handler caught an error:', error);

    // Run inside Angular zone to ensure UI updates 
    this.zone.run(() => {
      this.snackBar.open('An unexpected error occurred.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });

    throw error;
  }
}
