import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterModule, Routes } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule], 
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    userName: string = 'Kelvin Wekesa';
}


bootstrapApplication(HomeComponent, {
    providers: [provideRouter([])], 
}).catch(err => console.error(err));
