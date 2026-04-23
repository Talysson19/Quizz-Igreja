# ⛪ Quizizz Igreja - Gamificação Litúrgica SaaS

Uma plataforma **fullstack de treinamento e engajamento para acólitos e coroinhas**, focada em transformar o aprendizado litúrgico em uma jornada de conquistas.

O **Quizizz Igreja** é uma solução **SaaS (Software as a Service)** com arquitetura **Multi-tenant**, permitindo que cada paróquia gerencie sua própria biblioteca de manuais, banco de perguntas e certificações de forma totalmente isolada e segura.

---

## 🎯 Visão Estratégica do Projeto

Diferente de quizzes comuns, este sistema foi projetado para **garantir retenção de conhecimento**.

O projeto utiliza **gatilhos de gamificação** para incentivar:
- 📖 Leitura dos manuais paroquiais  
- ✅ Conclusão completa das etapas de formação  

---

## 💎 Diferenciais Técnicos

### 🏗️ Arquitetura Multi-tenant
Isolamento lógico de dados. Administradores de uma paróquia não possuem acesso aos dados de outra.

### 🔒 Progressão Linear Obrigatória
O nível **N+1** só é desbloqueado após a conclusão de **100% das questões do nível N**, garantindo uma curva de aprendizado sólida.

### 📜 Certificação Dinâmica
O certificado é liberado com base na **conclusão total das perguntas cadastradas**, adaptando-se automaticamente ao conteúdo de cada paróquia.

---

## 🚀 Funcionalidades Core

### 👤 Área do Acólito (User Experience)

- 🎮 **Jornada de Formação**  
  Sistema de quiz com feedback imediato e explicações litúrgicas  

- 📚 **Biblioteca Digital**  
  Download seguro de manuais em PDF  

- 🏆 **Ranking Paroquial**  
  Sistema de pontuação com penalidade para uso de dicas  

- 🔐 **Primeiro Acesso Seguro**  
  Troca de senha obrigatória  

---

### 🛡️ Painel do Coordenador (Admin Experience)

- 👥 **Gestão de Acólitos**  
  CRUD completo + reset de senha  

- 🧠 **Curadoria de Conteúdo**  
  Limite de 15 questões por nível para manter qualidade  

- 📁 **Gestão de Manuais**  
  Upload e exclusão de PDFs  

- 📊 **Monitoramento de Progresso**  
  Dashboard de acompanhamento dos níveis  

---

## 🛠️ Stack Tecnológica

- ⚙️ **Backend:** Laravel 11 (PHP 8.2+)  
- 🎨 **Frontend:** React.js + Tailwind CSS  
- 🔐 **Autenticação:** Laravel Sanctum  
- 📄 **PDF:** DomPDF (certificados em tempo real)  
- 🗄️ **Banco de Dados:** MySQL + Eloquent ORM  

---

## 📡 Arquitetura de Rotas (Resumo)

### 🔓 Público

```http
POST /api/register-church
POST /api/login

GET /api/questions/level/{n}
POST /api/questions/answer
GET /api/user/certificate

POST /api/admin/questions
POST /api/manuals
PUT /api/admin/acolytes/{id}


## 🏗️ Modelo de Dados (ER) & Equipe

**Modelo de Dados:**
- **Church** → Entidade principal (Multi-tenancy)  
- **User** → Controle de roles (admin/acolyte) + progresso  
- **Question** → Perguntas por nível e igreja  
- **UserAnswer** → Histórico de respostas (controle de pontuação e integridade)  

---

**👨‍💻 Desenvolvedor**  
Talysson De Moura Da Silva  

---

**📍 Stakeholder**  
Gustavo Marcelino  
