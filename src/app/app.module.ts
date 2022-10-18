import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { JsonEditorComponent } from './features/json-editor/json-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from 'src/material.module';
import { ToolMenuComponent } from './shared/tool-menu/tool-menu.component';
import { JsonCanvasComponent } from './features/json-canvas/json-canvas.component';
import { InputJsonDialog } from './shared/dialogs/input-json-dialog';
import { HomeComponent } from './features/home/home.component';
import { PreviewJsonDialog } from './shared/dialogs/json-preview-dialog';
import { IconHomeButtonComponent } from './shared/common/icon-home-button/icon-home-button.component';
import { CardComponentComponent } from './shared/common/card-component/card-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    JsonEditorComponent,
    ToolMenuComponent,
    JsonCanvasComponent,
    InputJsonDialog,
    PreviewJsonDialog,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    IconHomeButtonComponent,
    CardComponentComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
