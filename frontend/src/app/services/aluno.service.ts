import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = 'http://localhost:3000/api/alunos';

  // Canal de comunicação para atualizar a lista em tempo real
  private atualizarListaSource = new Subject<void>();
  atualizarLista$ = this.atualizarListaSource.asObservable();

  constructor(private http: HttpClient) {}

  getAlunos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  cadastrarAluno(aluno: any): Observable<any> {
    return this.http.post(this.apiUrl, aluno);
  }

  // Função para disparar o aviso de atualização
  notificarMudanca() {
    this.atualizarListaSource.next();
  }
}