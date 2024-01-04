# Sistema de Adoção de Pets - Projeto da Faculdade

Bem-vindo ao repositório do projeto de Sistema de Adoção de Pets desenvolvido como parte do projeto acadêmico na faculdade.

## Descrição

O projeto consiste em um sistema web de adoção de pets, com as seguintes funcionalidades:

- **Página de Login:** Acesso ao sistema com autenticação por meio de login (vitor) e senha (123).
- **Menu Principal:** Após o login, o usuário é direcionado para um menu que exibe a data e hora do último acesso.
- **Cadastro de Interessados:** O menu possui um botão para cadastrar pessoas interessadas em adotar um pet, com validações de dados realizadas pelo lado do servidor.
- **Lista de Interessados:** Após cadastrar um interessado, o usuário é redirecionado para uma página que exibe uma lista de todas as pessoas interessadas cadastradas, com informações individuais.
- **Cadastro de Pets:** No menu, há um botão para cadastrar um pet, com formulário e validações de dados pelo lado do servidor.
- **Lista de Pets:** Após cadastrar um pet, o usuário é redirecionado para uma página que exibe uma lista de todos os pets cadastrados, com detalhes individuais.
- **Adoção de Pets:** O menu possui um botão para realizar a adoção de um pet, com tabelas mostrando todos os interessados cadastrados e todos os pets disponíveis. Ao selecionar um interessado e um pet, a adoção é registrada e exibida em uma página específica.
- **Registro de Adoções:** Uma página mostra todas as adoções feitas, com informações sobre o pet adotado, o interessado e a data/hora da adoção.

## Tecnologias Utilizadas

- **Node.js:** O backend da aplicação é desenvolvido em Node.js, proporcionando uma execução eficiente no servidor.
- **Express:** Utilizamos o framework Express para facilitar a criação de rotas e a construção do servidor web.
- **Cookie-parser e Express-session:** Foram utilizados para gerenciar cookies e sessões, garantindo a autenticação e o rastreamento do usuário.

## Como Executar o Projeto Localmente

1. Clone o repositório: `git clone https://github.com/seu-usuario/seu-repositorio.git`
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm start`
4. Acesse o sistema no navegador: `http://localhost:3000` (ou a porta que você configurou).

## Autor

- Valentim Silva
