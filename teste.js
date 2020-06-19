const boletofunc = require('./src/index') // Importando o módulo e atribuindo numa constante

// Número do boleto para teste
// O número pode conter pontos e espaços pois serão tratados
let boletocodigo = "74891 12024 03943.907380 23105.411054 2 82820000051180"

// Retorna true ou false se o codigo do boleto é válido ou não
let validacao = boletofunc.validarBoleto(boletocodigo)

// Retorna os dados do boleto em um objeto
let dados = boletofunc.dadosBoleto(boletocodigo)

// Retornando no terminal todos os dados
console.log(validacao)
console.log("\n")
console.log(dados)