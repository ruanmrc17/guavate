import { Component } from '@angular/core';
import { AlunoFormComponent } from './components/aluno-form/aluno-form.component';
import { AlunoListComponent } from './components/aluno-list/aluno-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Repare que aqui NÃO tem mais o RouterOutlet, apenas os nossos dois componentes:
  imports: [AlunoFormComponent, AlunoListComponent], 
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px;">
      <h1 style="text-align: center; color: #333;">Guardião de Mensalidades 🛡️</h1>
      
      <app-aluno-form></app-aluno-form>

      <app-aluno-list></app-aluno-list>
    </div>
  `
})
export class AppComponent {}