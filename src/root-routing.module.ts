import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/app/customers', pathMatch: 'full' },
    // {
    //     path: 'main',
    //     loadChildren: () => import('main/main.module').then(m => m.MainModule), // Lazy load account module
    //     data: { preload: true }
    // },
    {
        path: 'main',
        loadChildren: () => import('account/account.module').then(m => m.AccountModule), // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'app',
        loadChildren: () => import('app/app.module').then(m => m.AppModule), // Lazy load account module
        data: { preload: true }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
   
    providers: []
})
export class RootRoutingModule { }
