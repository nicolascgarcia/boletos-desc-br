const boletofunc = require('./src/index') // Importando o módulo e atribuindo numa constante

// Número do boleto para teste
// O número pode conter pontos e espaços pois serão tratados
let boletocodigo = "836800000025147400220108001010202057307178387006"

// Retorna true ou false se o codigo do boleto é válido ou não
let validacao = boletofunc.validarBoleto(boletocodigo)

// Retorna os dados do boleto em um objeto
let dados = boletofunc.dadosBoleto(boletocodigo)

// Retornando no terminal todos os dados
console.log(validacao)
console.log("\n")
console.log(dados)