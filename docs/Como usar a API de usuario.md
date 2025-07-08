**Documentação da API de Usuários com Postman**

Esta documentação é pra você, iniciante total, aprender a testar e usar nossa API de Usuários usando o Postman. Bora lá, mano!

---

## 1. Pré-requisitos

* **Node.js** e seu backend Next.js rodando (por padrão em `http://localhost:3000`).
* **Postman** instalado na sua máquina.
* Conhecimento básico de JSON.

---

## 2. Configurando o Postman

1. Abra o Postman.
2. Crie um novo **Environment** (ícone de engrenagem → *Manage Environments* → *Add*):

   * Nome: `Localhost`
   * Variáveis:

     | **Key**    | **Initial Value**           | **Description** |
     | ---------- | --------------------------- | --------------- |
     | `base_url` | `http://localhost:3000/api` | URL base da API |
3. Selecione o environment `Localhost` no canto superior direito.
4. Agora você pode usar `{{base_url}}` em todas as suas requisições.

---

## 3. Visão geral dos endpoints

| Ação                        | Método | URL                      |
| --------------------------- | ------ | ------------------------ |
| Listar todos os usuários    | GET    | `{{base_url}}/users`     |
| Buscar usuário por ID       | GET    | `{{base_url}}/users/:id` |
| Criar novo usuário          | POST   | `{{base_url}}/users`     |
| Atualizar usuário existente | PATCH  | `{{base_url}}/users/:id` |
| Deletar usuário             | DELETE | `{{base_url}}/users/:id` |

---

## 4. Testando cada endpoint

### 4.1 Listar todos os usuários

* **Método:** GET
* **URL:** `{{base_url}}/users`
* **Headers:**

  * `Accept: application/json`

#### Como testar no Postman:

1. Crie uma nova **Request**.
2. Escolha método **GET** e cole `{{base_url}}/users`.
3. Clique em **Send**.

#### Exemplo de resposta (200 OK):

```json
[
  {
    "id": 1,
    "name": "Vitor",
    "email": "vitor@example.com",
    "cpf": "12345678901",
    "role": "USER",
    "createdAt": "2025-07-06T00:00:00.000Z",
    "shoppingLists": []
  },
  { /* ...outros usuários... */ }
]
```

---

### 4.2 Buscar usuário por ID

* **Método:** GET
* **URL:** `{{base_url}}/users/:id`
* **Path Parameter:**

  * `id` (inteiro) — ID do usuário.
* **Headers:**

  * `Accept: application/json`

#### Como testar no Postman:

1. Nova Request → método **GET** → URL `{{base_url}}/users/1` (troque `1` pelo ID desejado).
2. Send.

#### Possíveis respostas:

* **200 OK**: usuário encontrado.
* **400 Bad Request**: ID inválido.

  ```json
  { "error": "ID inválido" }
  ```
* **404 Not Found**: usuário não existe.

  ```json
  { "error": "Usuário não encontrado" }
  ```

---

### 4.3 Criar novo usuário

* **Método:** POST
* **URL:** `{{base_url}}/users`
* **Headers:**

  * `Content-Type: application/json`
* **Body (raw JSON):**

  ```json
  {
    "name": "Seu Nome",
    "email": "seuemail@exemplo.com",
    "cpf": "11122233344",
    "role": "ADMIN"       // opcional, padrão é "USER"
  }
  ```

#### Como testar no Postman:

1. Nova Request → método **POST** → URL `{{base_url}}/users`.
2. Aba **Body** → selecione **raw** e **JSON** → cole o JSON acima.
3. Send.

#### Possíveis respostas:

* **201 Created**: usuário criado.

  ```json
  {
    "id": 5,
    "name": "Seu Nome",
    "email": "seuemail@exemplo.com",
    "cpf": "11122233344",
    "role": "ADMIN",
    "createdAt": "2025-07-06T20:00:00.000Z"
  }
  ```
* **400 Bad Request**: faltam campos obrigatórios.

  ```json
  { "error": "Nome, email e CPF são obrigatórios" }
  ```
* **409 Conflict**: email ou CPF já em uso.

  ```json
  { "error": "Email ou CPF já está em uso" }
  ```

---

### 4.4 Atualizar usuário existente

* **Método:** PATCH
* **URL:** `{{base_url}}/users/:id`
* **Path Parameter:** `id` — ID do usuário.
* **Headers:**

  * `Content-Type: application/json`
* **Body (raw JSON):** (envie só os campos que quer atualizar)

  ```json
  {
    "name": "Novo Nome",
    "email": "novoemail@exemplo.com"
  }
  ```

#### Como testar no Postman:

1. Nova Request → método **PATCH** → URL `{{base_url}}/users/3`.
2. Body → raw JSON → cole o objeto com as mudanças.
3. Send.

#### Possíveis respostas:

* **200 OK**: user atualizado.
* **400 Bad Request**: nenhum campo para atualizar ou ID inválido.
* **404 Not Found**: usuário não existe.
* **409 Conflict**: tentativa de usar email/CPF já existente.

---

### 4.5 Deletar usuário

* **Método:** DELETE
* **URL:** `{{base_url}}/users/:id`
* **Path Parameter:** `id` — ID do usuário.
* **Headers:**

  * `Accept: application/json`

#### Como testar no Postman:

1. Nova Request → método **DELETE** → URL `{{base_url}}/users/2`.
2. Send.

#### Possíveis respostas:

* **200 OK**:

  ```json
  { "message": "Usuário deletado com sucesso" }
  ```
* **400 Bad Request**: ID inválido.
* **404 Not Found**: usuário não existe.

---

## 5. Dicas de iniciante

* Sempre verifique o **status code** na resposta.
* Se der erro `400`, cheque o JSON: tem vírgula a mais? campos faltando?
* Para `409`, geralmente é duplicação de email/CPF.
* Use o console do Postman (*View → Show Postman Console*) pra ver o request/response raw.
* Salve suas requisições em uma **Collection** pra não perder nada.

---

## 6. Próximos passos

* Integre essas chamadas no seu frontend (React, Next.js, Rails, etc).
* Crie testes automatizados (com Jest ou RSpec).
* Adicione autenticação/Bearer token.

---
