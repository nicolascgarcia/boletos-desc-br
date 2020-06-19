const funcoes = require('./funcoes')
const validacao = require('./validacao')

// ============= Fazer validação do boleto =============

exports.validarBoleto = (codigo) => {
  let retorno = {};
  codigo = codigo.replace(/[^0-9]/g, '');

  let tipoCodigo = funcoes.identificarTipoCodigo(codigo);

  /** 
   * Boletos de cartão de crédito geralmente possuem 46 dígitos. É necessário adicionar mais um zero no final, para formar 47 caracteres 
   * Alguns boletos de cartão de crédito do Itaú possuem 36 dígitos. É necessário acrescentar 11 zeros no final.
   */
  if (codigo.length == 36) {
    codigo = codigo + '00000000000';
  } else if (codigo.length == 46) {
    codigo = codigo + '0';
  }

  if (codigo.length != 44 && codigo.length != 46 && codigo.length != 47 && codigo.length != 48) {
    retorno.sucesso = false;
    retorno.codigoInput = codigo;
    retorno.mensagem = 'O código inserido possui ' + codigo.length + ' dígitos. Por favor insira uma numeração válida. Códigos de barras SEMPRE devem ter 44 caracteres numéricos. Linhas digitáveis podem possuir 46 (boletos de cartão de crédito), 47 (boletos bancários/cobrança) ou 48 (contas convênio/arrecadação) caracteres numéricos. Qualquer caractere não numérico será desconsiderado.';
  } else if (codigo.substr(0, 1) == '8' && codigo.length == 46 && codigo.length == 47) {
    retorno.sucesso = false;
    retorno.codigoInput = codigo;
    retorno.mensagem = 'Este tipo de boleto deve possuir um código de barras 44 caracteres numéricos. Ou linha digitável de 48 caracteres numéricos.';
  } else if (!funcoes.validarCodigoComDV(codigo, tipoCodigo)) {
    retorno.sucesso = false;
    retorno.codigoInput = codigo;
    retorno.mensagem = 'A validação do dígito verificador falhou. Tem certeza que inseriu a numeração correta?';
  } else {
    retorno.sucesso = true;
    retorno.codigoInput = codigo;
    retorno.mensagem = 'Boleto válido';

    switch (tipoCodigo) {
      case 'LINHA_DIGITAVEL':
        retorno.tipoCodigoInput = 'LINHA_DIGITAVEL';
        retorno.tipoBoleto = funcoes.identificarTipoBoleto(codigo, 'LINHA_DIGITAVEL');
        retorno.codigoBarras = funcoes.linhaDigitavel2CodBarras(codigo);
        retorno.linhaDigitavel = codigo;
        retorno.vencimento = funcoes.identificarData(codigo, 'LINHA_DIGITAVEL');
        retorno.valor = funcoes.identificarValor(codigo, 'LINHA_DIGITAVEL');
        break;
      case 'CODIGO_DE_BARRAS':
        retorno.tipoCodigoInput = 'CODIGO_DE_BARRAS';
        retorno.tipoBoleto = funcoes.identificarTipoBoleto(codigo, 'CODIGO_DE_BARRAS');
        retorno.codigoBarras = codigo;
        retorno.linhaDigitavel = funcoes.codBarras2LinhaDigitavel(codigo, false);
        retorno.vencimento = funcoes.identificarData(codigo, 'CODIGO_DE_BARRAS');
        retorno.valor = funcoes.identificarValor(codigo, 'CODIGO_DE_BARRAS');
        break;
      default:
        break;
    }
  }

  return retorno;
}

exports.boleto = (codigo, validarBlocos = false) => {
  const cod = validacao.clearMask(codigo);
  if (Number(cod[0]) === 8) return validacao.boletoArrecadacao(cod, validarBlocos);
  return validacao.boletoBancario(cod, validarBlocos);
}