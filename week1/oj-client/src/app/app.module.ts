import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routing } from './app.routes'

import { DataService } from './services/data.service'

import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';

@NgModule({
  // all components 
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent
  ],
  // all module
  imports: [
    BrowserModule,
    Routing
  ],
  // provide service
  providers: [
    {
      provide: 'data',
      useClass: DataService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
