import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { JsonEditorComponent } from './features/json-editor/json-editor.component';

const routes: Routes = [  {
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
},
{ path: 'home', component: HomeComponent }, 
{ path: 'tool', component: JsonEditorComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
