<p align="center">
  <img src="https://static.blog.vhsys.com.br/wp-content/uploads/2013/05/boleto.png" width="200">
</p>

<h1 align=center>boletos-desc-br<h1>
<p align="center">
  <a href="https://www.npmjs.com/package/boletos-desc-br">
    <img src="https://img.shields.io/npm/v/boletos-desc-br.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/boletos-desc-br">
    <img src="https://img.shields.io/npm/dm/boletos-desc-br.svg" alt="npm downloads">
  </a>
  <a href="https://www.npmjs.com/package/boletos-desc-br">
    <img src="https://img.shields.io/bundlephobia/min/boletos-desc-br.svg" alt="minified size">
  </a>
  <a href="https://github.com/nicolascgarcia/boletos-desc-br/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/boletos-desc-br.svg" alt="license">
  </a>
  <a href="https://github.com/nicolascgarcia/boletos-desc-br/issues">
    <img src="https://img.shields.io/github/issues/nicolascgarcia/boletos-desc-br.svg" alt="issues">
  </a>
  </p>


Este módulo tem como objetivo obter dados informativos e validação de boletos de qualquer tipo, seja a partir do código de barras ou linha digitável, não havendo a necessidade de tratar o código antes de utilizar uma das funções.

# Instalação

Baixe o módulo via npm com o comando:

```sh
npm install boleto-desc-br --save
```
  
  Após o download, importe o módulo no arquivo onde desejar utilizar com o código:
  
```sh
const boletofunc = require('boletos-desc-br')  // (ES5)
```

ou 

```sh
import { dadosBoleto, validarBoleto } from 'boletos-desc-br'  // (ES6)
```

# Como Usar

## Validando o Boleto (Qualquer tipo de boleto)

Nesta função é verificado se houve qualquer alteração no código ou linha digitável do boleto, evitando erros futúros e fraudes (verificando se foi alterado os últimos dígitos do boleto que representam o valor).

```sh
const boletofunc = require('boletos-desc-br')

boletofunc.validarBoleto('836200000005 667800481000 180975657313 001589636081') // retorna true
boletofunc.validarBoleto('536200000005 667800481000 180975657313 001589636081') // retorna false
```

## Obtendo os Dados do Boleto (Qualquer tipo de boleto)

Nesta função é retornado diversos dados do boleto a partir do código de barras ou linha digitável. 
PS: Os boleto de arrecadações (como água, luz, prefeitura etc) não são possíveis detectar o vencimento, portanto é retornado o tipo do boleto.

```sh
const boletofunc = require('boletos-desc-br')

boletofunc.dadosBoleto('836200000005 667800481000 180975657313 001589636081') // boleto válido
boletofunc.dadosBoleto('536200000005 667800481000 180975657313 001589636081') // boleto inválido
```
Retorno:

```sh
{ sucesso: true,
  codigoInput: '836200000005667800481000180975657313001589636081',
  mensagem: 'Boleto válido',
  tipoCodigoInput: 'LINHA_DIGITAVEL',
  tipoBoleto: 'CONVENIO_ENERGIA_ELETRICA_E_GAS',
  codigoBarras: '83620000000667800481001809756573100158963608',
  linhaDigitavel: '836200000005667800481000180975657313001589636081',
  vencimento: 'CONVENIO_ENERGIA_ELETRICA_E_GAS',
  valor: 66.78 }
{ sucesso: false,
  codigoInput: '536200000005667800481000180975657313001589636081',
  mensagem:
   'A validação do dígito verificador falhou. Tem certeza que inseriu a numeração correta?' }
```

# Licença

Este projeto está licenciado sobre a Licença MIT - veja o arquivo LICENSE.md para mais detalhes.
