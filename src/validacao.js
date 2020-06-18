function clearMask(codigo) {
    return codigo.replace(/( |\.|-)/g, '');
}

function modulo10(bloco) {
    const codigo = bloco.split('').reverse();
    const somatorio = codigo.reduce((acc, current, index) => {
        let soma = Number(current) * (((index + 1) % 2) + 1);
        soma = (soma > 9 ? Math.trunc(soma / 10) + (soma % 10) : soma);
        return acc + soma;
    }, 0);
    return (Math.ceil(somatorio / 10) * 10) - somatorio;
}

function modulo11Bancario(bloco) {
    const codigo = bloco.split('').reverse();
    let multiplicador = 2;
    const somatorio = codigo.reduce((acc, current) => {
        const soma = Number(current) * multiplicador;
        multiplicador = multiplicador === 9 ? 2 : multiplicador + 1;
        return acc + soma;
    }, 0);
    const restoDivisao = somatorio % 11;
    const DV = 11 - restoDivisao;
    if (DV === 0 || DV === 10 || DV === 11) return 1;
    return DV;
}

function modulo11Arrecadacao(bloco) {
    const codigo = bloco.split('').reverse();
    let multiplicador = 2;
    const somatorio = codigo.reduce((acc, current) => {
        const soma = Number(current) * multiplicador;
        multiplicador = multiplicador === 9 ? 2 : multiplicador + 1;
        return acc + soma;
    }, 0);
    const restoDivisao = somatorio % 11;

    if (restoDivisao === 0 || restoDivisao === 1) {
        return 0;
    }
    if (restoDivisao === 10) {
        return 1;
    }
    const DV = 11 - restoDivisao;
    return DV;
}

export function convertToBoletoArrecadacaoCodigoBarras(codigo) {
    const cod = clearMask(codigo);
    let codigoBarras = '';
    for (let index = 0; index < 4; index++) {
        const start = (11 * (index)) + index;
        const end = (11 * (index + 1)) + index;
        codigoBarras += cod.substring(start, end);
    }
    return codigoBarras;
}

export function convertToBoletoBancarioCodigoBarras(codigo) {
    const cod = clearMask(codigo);
    let codigoBarras = '';
    codigoBarras += cod.substring(0, 3); // Identificação do banco
    codigoBarras += cod.substring(3, 4); // Código da moeda
    codigoBarras += cod.substring(32, 33); // DV
    codigoBarras += cod.substring(33, 37); // Fator Vencimento
    codigoBarras += cod.substring(37, 47); // Valor nominal
    codigoBarras += cod.substring(4, 9); // Campo Livre Bloco 1
    codigoBarras += cod.substring(10, 20); // Campo Livre Bloco 2
    codigoBarras += cod.substring(21, 31); // Campo Livre Bloco 3
    return codigoBarras;
}

export function boletoBancarioCodigoBarras(codigo) {
    const cod = clearMask(codigo);
    if (!/^[0-9]{44}$/.test(cod)) return false;
    const DV = cod[4];
    const bloco = cod.substring(0, 4) + cod.substring(5);
    return modulo11Bancario(bloco) === Number(DV);
}

export function boletoBancarioLinhaDigitavel(codigo, validarBlocos = false) {
    const cod = clearMask(codigo);
    if (!/^[0-9]{47}$/.test(cod)) return false;
    const blocos = [{
            num: cod.substring(0, 9),
            DV: cod.substring(9, 10),
        },
        {
            num: cod.substring(10, 20),
            DV: cod.substring(20, 21),
        },
        {
            num: cod.substring(21, 31),
            DV: cod.substring(31, 32),
        },
    ];
    const validBlocos = validarBlocos ? blocos.every(e => modulo10(e.num) === Number(e.DV)) : true;
    const validDV = boletoBancarioCodigoBarras(convertToBoletoBancarioCodigoBarras(cod));
    return validBlocos && validDV;
}

export function boletoBancario(codigo, validarBlocos = false) {
    const cod = clearMask(codigo);
    if (cod.length === 44) return boletoBancarioCodigoBarras(cod);
    if (cod.length === 47) return boletoBancarioLinhaDigitavel(codigo, validarBlocos);
    return false;
}

export function boletoArrecadacaoCodigoBarras(codigo) {
    const cod = clearMask(codigo);
    if (!/^[0-9]{44}$/.test(cod) || Number(cod[0]) !== 8) return false;
    const codigoMoeda = Number(cod[2]);
    const DV = Number(cod[3]);
    const bloco = cod.substring(0, 3) + cod.substring(4);
    let modulo;
    if (codigoMoeda === 6 || codigoMoeda === 7) modulo = modulo10;
    else if (codigoMoeda === 8 || codigoMoeda === 9) modulo = modulo11Arrecadacao;
    else return false;
    return modulo(bloco) === DV;
}

export function boletoArrecadacaoLinhaDigitavel(codigo, validarBlocos = false) {
    const cod = clearMask(codigo);
    if (!/^[0-9]{48}$/.test(cod) || Number(cod[0]) !== 8) return false;
    const validDV = boletoArrecadacaoCodigoBarras(convertToBoletoArrecadacaoCodigoBarras(cod));
    if (!validarBlocos) return validDV;
    const codigoMoeda = Number(cod[2]);
    let modulo;
    if (codigoMoeda === 6 || codigoMoeda === 7) modulo = modulo10;
    else if (codigoMoeda === 8 || codigoMoeda === 9) modulo = modulo11Arrecadacao;
    else return false;
    const blocos = Array.from({
        length: 4
    }, (v, index) => {
        const start = (11 * (index)) + index;
        const end = (11 * (index + 1)) + index;
        return {
            num: cod.substring(start, end),
            DV: cod.substring(end, end + 1),
        };
    });
    const validBlocos = blocos.every(e => modulo(e.num) === Number(e.DV));
    return validBlocos && validDV;
}

export function boletoArrecadacao(codigo, validarBlocos = false) {
    const cod = clearMask(codigo);
    if (cod.length === 44) return boletoArrecadacaoCodigoBarras(cod);
    if (cod.length === 48) return boletoArrecadacaoLinhaDigitavel(codigo, validarBlocos);
    return false;
}

export function boleto(codigo, validarBlocos = false) {
    const cod = clearMask(codigo);
    if (Number(cod[0]) === 8) return boletoArrecadacao(cod, validarBlocos);
    return boletoBancario(cod, validarBlocos);
}