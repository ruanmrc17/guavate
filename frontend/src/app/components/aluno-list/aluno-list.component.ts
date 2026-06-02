import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../../services/aluno.service';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: sans-serif;">
      <h3>Alunos Cadastrados</h3>
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #f4f4f4; border-bottom: 2px solid #ddd;">
            <th style="padding: 8px;">ID</th>
            <th style="padding: 8px;">Aluno</th>
            <th style="padding: 8px;">Responsável</th>
            <th style="padding: 8px;">WhatsApp</th>
            <th style="padding: 8px;">Mensalidade</th>
            <th style="padding: 8px;">Vencimento</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let aluno of alunos" style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">{{ aluno.id }}</td>
            <td style="padding: 8px;">{{ aluno.nome }}</td>
            <td style="padding: 8px;">{{ aluno.responsavel }}</td>
            <td style="padding: 8px;">{{ aluno.telefone }}</td>
            <td style="padding: 8px;">R$ {{ aluno.valor_mensalidade }}</td>
            <td style="padding: 8px;">Dia {{ aluno.dia_vencimento }}</td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="alunos.length === 0" style="color: #666; margin-top: 10px;">Nenhum aluno cadastrado ainda.</p>
    </div>
  `
})
export class AlunoListComponent implements OnInit {
  alunos: any[] = [];

  constructor(private alunoService: AlunoService) {}

  ngOnInit() {
    this.carregarAlunos();

    // Fica ouvindo o canal. Se o formulário cadastrar alguém, atualiza a lista!
    this.alunoService.atualizarLista$.subscribe(() => {
      this.carregarAlunos();
    });
  }

  carregarAlunos() {
    this.alunoService.getAlunos().subscribe({
      next: (dados) => {
        // Proteção: Garante que estamos jogando um Array na tabela
        if (Array.isArray(dados)) {
          this.alunos = dados;
        } else if (dados && Array.isArray(dados.data)) {
          this.alunos = dados.data;
        } else {
          this.alunos = [];
        }
      },
      error: (erro) => console.error('Erro ao buscar alunos:', erro)
    });
  }
}