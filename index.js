import express from "express"
import cookieParser from "cookie-parser"
import session from "express-session"

const porta = 3000
const host = "0.0.0.0"
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret: "Vi543Vale634Sil1234",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}))

app.post('/login', (requisicao, resposta) => {
  const usuario = requisicao.body.usuario
  const senha = requisicao.body.senha

  if(usuario && senha && (usuario == "vitor") && (senha == "123")){
    requisicao.session.usuarioAutenticado = true
    resposta.redirect('/')
  }
  else{
    resposta.end(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-wid th, initial-scale=1.0">
        <title>Invalido</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <header>
          <h1>Usuario ou senha invalido!</h1>
        </header>
        <main>
          <a href="/login.html">Voltar ao login.</a>
        </main>
      </body>
      </html>
    `)
  }
})

function autenticar(requisicao, resposta, next){
  if(requisicao.session.usuarioAutenticado){
    next()
  }
  else{
    resposta.redirect("/login.html")
  }
}

app.get('/', autenticar, (requisicao, resposta) => {
  const ultimoAcesso = requisicao.cookies.DataUltimoAcesso
  const data = new Date()

  resposta.cookie("DataUltimoAcesso", data.toLocaleString(), {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
  })

  resposta.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Menu do Sistema</title> 
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header>
        <h1>MENU</h1>
      </header>
      
      <main>
        <div>
          <ul>
            <li><a href="CadastroDeInteressados.html">Cadastro de Interessados</a></li>
            <li><a href="CadastroDePets.html">Cadastro de pets</a></li>
            <li><a href="/AdotarUmPet">Adotar um Pet</a></li>
          </ul>

          <p>O último acesso foi ${ultimoAcesso}.</p>
        </div>
      </main>
    </body>
    </html> `
  )
})

var listaDeInteressados = []

function listaInteressados(requisicao, resposta){
  const dados = requisicao.body
  let conteudoResposta = ''

  if(!(dados.nome && dados.email && dados.tel)){
    conteudoResposta = 
    ` <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de interessados</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <header>
          <h1>Cadastro de Interessados</h1>
        </header>
      
        <main>
          <form action="/listaInteressados" method="post">
            <label for="inome">Nome: </label>
            <input type="text" name="nome" id="inome" placeholder="Digite o seu nome." value="${dados.nome}"><br> `
    
    if(!dados.nome){
      conteudoResposta += ` <p>Informe o nome!</p> `
    }

    conteudoResposta += 
          ` <label for="iemail">Email: </label>
            <input type="email" name="email" id="iemail" placeholder="Digite o seu email." value="${dados.email}"><br> `

    if(!dados.email){
      conteudoResposta += ` <p>Informe o email!</p> `
    }

    conteudoResposta += 
          ` <label for="itel">Telefone: </label>
            <input type="tel" name="tel" id="itel" placeholder="Digite o seu telefone" value="${dados.tel}"><br> `

    if(!dados.tel){
      conteudoResposta += ` <p>Informe o telefone!</p> `
    }

    conteudoResposta += 
          ` <button type="submit">Cadastrar</button>
          </form>
        </main>
      </body>
      </html>`

    resposta.end(conteudoResposta)
  }
  else{
    const interessados = {
      nome: dados.nome,
      email: dados.email,
      tel: dados.tel
    }

    listaDeInteressados.push(interessados)

    conteudoResposta = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Interessados</title>  
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <header>
          <h1>Lista de Interessados</h1>
        </header>

        <main>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>

            <tbody> `

    for(let i = 0; i < listaDeInteressados.length; i++){
      conteudoResposta += `
              <tr>
                <th>${listaDeInteressados[i].nome}</th>
                <th>${listaDeInteressados[i].email}</th>
                <th>${listaDeInteressados[i].tel}</th>
              </th> `
    }

    conteudoResposta += `
            </tbody>
          </table>

          <a href="/">Voltar a tela de menu.</a>
          <a href="/CadastroDeInteressados.html">Voltar para tela de cadastro.</a>
        </body>
        </html> `

    resposta.end(conteudoResposta)
  }
}

app.post('/listaInteressados', autenticar, listaInteressados)

var listaDePets = []

function listaPets(requisicao, resposta){
  const dados = requisicao.body
  let conteudoResposta = ''

  if(!(dados.nome && dados.raca && dados.idade)){
    conteudoResposta = 
    ` <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cadastro de Pets</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header>
        <h1>Cadastro de Pets</h1>
      </header>
    
      <main>
        <form action="/listaPets" method="post">
          <label for="inome">Nome: </label>
          <input type="text" name="nome" id="inome" placeholder="Digite o nome do pet." value="${dados.nome}"><br> `
    
    if(!dados.nome){
      conteudoResposta += ` <p>Informe o nome!</p> `
    }

    conteudoResposta += 
          ` <label for="iraca">Raça: </label>
            <input type="text" name="raca" id="iraca" placeholder="Digite a raça do pet." value="${dados.raca}"><br> `

    if(!dados.raca){
      conteudoResposta += ` <p>Informe a raça!</p> `
    }

    conteudoResposta += 
          ` <label for="iidade">Idade em anos: </label>
            <input type="number" name="idade" id="iidade" placeholder="Digite a idade em anos do pet" value="${dados.idade}"><br> `

    if(!dados.idade){
      conteudoResposta += ` <p>Informe a idade!</p> `
    }

    conteudoResposta += 
          ` <button type="submit">Cadastrar</button>
          </form>
        </main>
      </body>
      </html>`

    resposta.end(conteudoResposta)
  }
  else{
    const pets = {
      nome: dados.nome,
      raca: dados.raca,
      idade: dados.idade
    }

    listaDePets.push(pets)

    conteudoResposta = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Pets</title>  
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <header>
          <h1>Lista de Pets</h1>
        </header>

        <main>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Raça</th>
                <th>Idade</th>
              </tr>
            </thead>

            <tbody> `

    for(let i = 0; i < listaDePets.length; i++){
      conteudoResposta += `
              <tr>
                <th>${listaDePets[i].nome}</th>
                <th>${listaDePets[i].raca}</th>
                <th>${listaDePets[i].idade}</th>
              </th> `
    }

    conteudoResposta += `
            </tbody>
          </table>

          <a href="/">Voltar a tela de menu.</a>
          <a href="/CadastroDePets.html">Voltar para tela de cadastro.</a>
        </body>
        </html> `

    resposta.end(conteudoResposta)
  }
}

app.post('/listaPets', autenticar, listaPets)

app.get('/AdotarUmPet', autenticar, (requisicao, resposta) => {
  let conteudo = ''

  conteudo = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Adotar um Pet</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header>
        <h1>Adotar Pet</h1>
      </header>
    
      <main>
        <table>
          <thead>
            <tr>
              <th>Interessados em Adotar</th>
            </tr>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody> `

  for(let i = 0; i < listaDeInteressados.length; i++){
    conteudo += `
            <tr>
              <th>${listaDeInteressados[i].nome}</th>
              <th>${listaDeInteressados[i].email}</th>
              <th>${listaDeInteressados[i].tel}</th>
            </th> `
  }

  conteudo += `
          </tbody>
          </table>

          <table>
            <thead>
              <tr>
                <th>Pets Cadastrados</th>
              </tr>
              <tr>
                <th>Nome</th>
                <th>Raça</th>
                <th>Idade</th>
              </tr>
            </thead>
            <tbody> `

  for(let i = 0; i < listaDePets.length; i++){
    conteudo += `
              <tr>
                <th>${listaDePets[i].nome}</th>
                <th>${listaDePets[i].raca}</th>
                <th>${listaDePets[i].idade}</th>
              </th> `
  }

  conteudo += `
            </tbody>
            </table>

            <form action="/adotarPet" method="get">
              <label for="iinteressados">Qual dos interessados: </label>
              <select name="interessado" id="iinteressados"> `

  for(let i = 0; i < listaDeInteressados.length; i++){
    conteudo += `
                <option value="${listaDeInteressados[i].nome}">${listaDeInteressados[i].nome}</option> `
  }

  conteudo += `
              </select><br>

              <label for="ipets">Qual dos pets: </label>
              <select name="pet" id="ipets">
  `

  for(let i = 0; i < listaDePets.length; i++){
    conteudo += `
                <option value="${listaDePets[i].nome}">${listaDePets[i].nome}</option> `
  }

  conteudo += `
              </select><br>

              <button type="submit">Adotar pet</button>
            </form>
          </main>  
        </body>
        </html> `

  resposta.end(conteudo)
})

var dadosDasDoacoes = []

app.get('/adotarPet', autenticar, (requisicao, resposta) => {
  let conteudo = ''
  const data = new Date()

  resposta.cookie("horarioDeEnvio", data.toLocaleString(), {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
  })

  const horaDaAdocao = requisicao.cookies.horarioDeEnvio

  const dados = requisicao.query
  
  const doacoes = { 
    int: dados.interessado, 
    pets: dados.pet
  }

  dadosDasDoacoes.push(doacoes)

  conteudo = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Adoção</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <header>
        <h1>Lista de Adoção</h1>
      </header>
    
      <main> 
        <table>
            <thead>
              <tr>
                <th>Nome do interessado</th>
                <th>Nome do pet</th>
                <th>Data da doação</th>
              </tr>
            </thead>
            <tbody>`

  for(let i = 0; i < dadosDasDoacoes.length; i++){
    conteudo += `
              <tr>
                <th>${dadosDasDoacoes[i].int}</th>
                <th>${dadosDasDoacoes[i].pets}</th>
                <th>${horaDaAdocao}</th>
              </th> `
  } 

  conteudo += `
            </tbody>
          </table>

          <a href="/">Voltar para o menu</a>
        </main>
      </body>
      </html> `

  resposta.end(conteudo)
})

app.use(express.static('./paginas'))

app.listen(porta, host, () => {
  console.log(`Servidor executado na url http://${host}:${porta}`)
})