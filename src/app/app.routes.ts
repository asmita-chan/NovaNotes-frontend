import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Notes } from './pages/notes/notes';
export const routes: Routes = [
    { path: '', component: Landing, data: { title: 'Home'}},
    { path: 'dashboard', component: Notes, data: { title: 'Notes'}},
    { path: '**', redirectTo: '', pathMatch: 'full'}

];
