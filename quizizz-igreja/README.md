# ⛪ Quizizz Igreja - Backend API

> Sistema SaaS Multi-tenant de gamificação litúrgica para treinamento de acólitos e coroinhas.

Este projeto é uma API robusta desenvolvida em **Laravel 11**, focada em gerenciar o aprendizado de jovens em paróquias através de quizzes, ranking e certificação automatizada.

---

## 🚀 Funcionalidades Principais

### 🔐 Gestão de Acesso & Segurança
* **Multi-tenancy**: Isolamento total de dados por Igreja (Paróquia).
* **Roles & Permissions**: Distinção entre Administrador (Coordenador) e Usuário (Acólito).
* **Troca de Senha Obrigatória**: Jovens são forçados a trocar a senha no primeiro acesso.
* **Reset de Senha**: Administradores podem resetar senhas de acólitos da sua própria paróquia.

### 🎮 Gamificação & Quiz
* **Sistema de Níveis**: O acólito só libera o Nível 2 após atingir a pontuação mínima no Nível 1.
* **Anti-Farm**: Proteção contra múltiplas respostas na mesma pergunta.
* **Dicas (Hints)**: Sistema de apoio ao aprendizado.
* **Ranking em Tempo Real**: Ranking global e interno da paróquia.

### 📄 Gestão de Conteúdo
* **Upload de Manuais**: Cada igreja pode subir seu próprio manual em PDF.
* **Certificação Automatizada**: Geração de certificado após 20 questões concluídas.
* **Dashboard Administrativo**: Acompanhamento completo dos acólitos.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** Laravel 11  
* **Banco de Dados:** MySQL  
* **Autenticação:** Laravel Sanctum (Bearer Token)  
* **PDF:** Barryvdh/Laravel-DomPDF  
* **Arquitetura:** RESTful API com Middleware  

---

## 🏗️ Estrutura do Banco de Dados

* `churches` → Paróquias  
* `users` → Usuários + roles + church_id  
* `questions` → Perguntas por nível e igreja  
* `user_answers` → Histórico de respostas  

---

## 📡 Rotas da API

### 🔓 Públicas

POST /api/register-church
POST /api/login


---

### 👤 Usuário (Acólito)

POST /api/user/change-password
POST /api/questions/answer
GET /api/user/certificate
GET /api/ranking


---

### 🛡️ Administrador

POST /api/admin/manual/upload
POST /api/admin/questions
POST /api/admin/acolytes
POST /api/admin/reset-password
GET /api/admin/dashboard
GET /api/admin/ranking


---

## 📡 Fluxo Completo (E2E)

1. Registrar igreja + admin  
2. Admin faz upload do manual  
3. Admin cadastra perguntas  
4. Admin cadastra acólitos  
5. Usuário faz login  
6. Usuário troca senha  
7. Usuário responde perguntas  
8. Sistema calcula ranking  
9. Usuário gera certificado  
10. Admin acompanha dashboard  

---

## 📥 Como Rodar o Projeto

### 1. Clonar repositório
```bash
git clone https://github.com/SEU_USUARIO/quizizz-igreja.git
cd quizizz-igreja
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

👨‍💻 Desenvolvedor
Talysson De Moura Da Silva
Desenvolvedor Backend Júnior 🚀

Stakeholder
Gustavo Marcelino 

