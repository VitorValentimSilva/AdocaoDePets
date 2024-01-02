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
        <link rel="stylesheet" href="style1.css">
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
      <link rel="stylesheet" href="style1.css">
    </head>
    <body>
      <header>
        <h1>MENU</h1>
      </header>
      
      <main>
        <div>
          <ul>
            <li><a href="CadastroDeInteressados.html">Cadastro de Interessados</a></li>
            <li><a href="">Cadastro de pets</a></li>
            <li><a href="">Adotar um Pet</a></li>
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
        <link rel="stylesheet" href="style1.css">
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
        <link rel="stylesheet" href="style3.css">
      </head>
      <body>
        <header>
          <h1>Lista de Usuários</h1>
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

app.use(express.static('./paginas'))

app.listen(porta, host, () => {
  console.log(`Servidor executado na url http://${host}:${porta}`)
})