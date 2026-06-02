import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif;">
      <h3>Novo Cadastro de Aluno</h3>
      
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <input type="text" placeholder="Nome do Aluno" [(ngModel)]="aluno.nome" style="padding: 8px; flex: 1;">
        <input type="text" placeholder="Nome do Responsável" [(ngModel)]="aluno.responsavel" style="padding: 8px; flex: 1;">
        <input type="text" placeholder="WhatsApp (Ex: 11999999999)" [(ngModel)]="aluno.telefone" style="padding: 8px; flex: 1;">
      </div>
      
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <input type="number" placeholder="Valor Mensalidade (Ex: 800)" [(ngModel)]="aluno.valor_mensalidade" style="padding: 8px; flex: 1;">
        <input type="number" placeholder="Dia do Vencimento (Ex: 5)" [(ngModel)]="aluno.dia_vencimento" style="padding: 8px; flex: 1;">
      </div>

      <button (click)="salvarAluno()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
        Salvar e Notificar 🚀
      </button>
    </div>
  `
})
export class AlunoFormComponent {
  aluno = { nome: '', responsavel: '', telefone: '', valor_mensalidade: null, dia_vencimento: null };

  constructor(private alunoService: AlunoService) {}

  salvarAluno() {
    if (!this.aluno.nome || !this.aluno.responsavel || !this.aluno.telefone) {
      alert('Preencha os campos obrigatórios!');
      return;
    }

    this.alunoService.cadastrarAluno(this.aluno).subscribe({
      next: () => {
        // Alerta simples na tela apenas para confirmação visual
        alert('Aluno cadastrado! O WhatsApp está sendo enviado em segundo plano.');

        // Reseta os campos do formulário
        this.aluno = { nome: '', responsavel: '', telefone: '', valor_mensalidade: null, dia_vencimento: null };
        
        // Atualiza a tabela na mesma hora reativamente
        this.alunoService.notificarMudanca();
      },
      error: (erro) => {
        alert('Erro ao salvar aluno.');
        console.error(erro);
      }
    });
  }
}