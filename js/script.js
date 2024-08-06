document.addEventListener("DOMContentLoaded", () => {
    const numerosTable = document.getElementById('numeros').getElementsByTagName('tr')[0];
    
    // Preenche a tabela com números de 01 a 60
    for (let i = 1; i <= 60; i++) {
        const td = document.createElement('td');
        td.textContent = i.toString().padStart(2, '0');
        td.style.fontFamily = 'Arial, sans-serif';
        td.style.fontSize = '19px';
        td.style.padding = '5px';
        td.style.border = '1px solid #ccc';
        td.style.textAlign = 'center';
        td.style.color = '#333';
        numerosTable.appendChild(td);
    }
});

function validarNumeros(numArray, tipo) {
    const numCount = numArray.length;
    const tipoCorreto = tipo === 'pares' ? numArray.every(num => num % 2 === 0) : numArray.every(num => num % 2 !== 0);
    
    if (numCount !== 10) {
        return `Você deve inserir exatamente 10 números ${tipo}.`;
    } else if (!tipoCorreto) {
        return `Todos os números no campo ${tipo} devem ser ${tipo}.`;
    } else {
        return null;
    }
}

function validarCampo(inputId, tipo) {
    const input = document.getElementById(inputId);
    const erroElemento = document.getElementById(`erro-${tipo}`);
    
    const numeros = input.value.split(',').map(num => Number(num.trim())).filter(num => !isNaN(num));
    const mensagemErro = validarNumeros(numeros, tipo);
    
    if (mensagemErro) {
        erroElemento.textContent = mensagemErro;
    } else {
        erroElemento.textContent = '';
    }
    
    return numeros;
}

function validarFixar() {
    const fixarInput = document.getElementById('fixar');
    const erroFixar = document.getElementById('erro-fixar');
    const fixar = Number(fixarInput.value.trim());

    // Obtém os números pares e ímpares a serem excluídos
    const excluirPares = validarCampo('excluir-pares', 'pares');
    const excluirImpares = validarCampo('excluir-impares', 'impares');

    // Verifica se a dezena fixa é válida
    if (isNaN(fixar) || fixar < 1 || fixar > 60) {
        erroFixar.textContent = "A dezena fixa deve estar entre 1 e 60.";
        return null;
    } else if (excluirPares.includes(fixar)) {
        erroFixar.textContent = "A dezena fixa não pode ser um número par excluído.";
        return null;
    } else if (excluirImpares.includes(fixar)) {
        erroFixar.textContent = "A dezena fixa não pode ser um número ímpar excluído.";
        return null;
    } else {
        erroFixar.textContent = '';
        return fixar;
    }
}

function validarJogos() {
    const jogosInput = document.getElementById('jogos');
    const erroJogos = document.getElementById('erro-jogos');
    const jogos = Number(jogosInput.value.trim());
    
    if (jogos <= 0 || jogos > 1000) {
        erroJogos.textContent = "A quantidade de jogos deve ser entre 1 e 1000.";
    } else {
        erroJogos.textContent = '';
    }
    return jogos;
}

function validarDezenasAdicionais() {
    const dezenasAdicionaisInput = document.getElementById('dezenas-adicionais');
    const erroDezenasAdicionais = document.getElementById('erro-dezenas-adicionais');
    const dezenasAdicionais = Number(dezenasAdicionaisInput.value.trim());

    if (dezenasAdicionais < 1 || dezenasAdicionais > 14) {
        erroDezenasAdicionais.textContent = "O número de dezenas adicionais deve estar entre 1 e 14.";
        return null;
    } else {
        erroDezenasAdicionais.textContent = '';
        return dezenasAdicionais;
    }
}

document.getElementById('excluir-pares').addEventListener('input', () => validarCampo('excluir-pares', 'pares'));
document.getElementById('excluir-impares').addEventListener('input', () => validarCampo('excluir-impares', 'impares'));
document.getElementById('fixar').addEventListener('input', validarFixar);
document.getElementById('jogos').addEventListener('input', validarJogos);
document.getElementById('dezenas-adicionais').addEventListener('input', validarDezenasAdicionais);

function gerarJogos() {
    try {
        const fixar = validarFixar();
        if (fixar === null) return; // Interrompe a execução se a validação da dezena fixa falhar

        const dezenasAdicionais = validarDezenasAdicionais(); // Quantidade de dezenas adicionais escolhidas pelo usuário

        if (dezenasAdicionais === null || dezenasAdicionais < 1 || dezenasAdicionais > 14) {
            alert("Número de dezenas adicionais inválido. Deve ser entre 1 e 14.");
            return;
        }

        const quantidadeJogos = validarJogos(); // Obtém a quantidade total de jogos

        if (quantidadeJogos === 0) return; // Interrompe a execução se a validação da quantidade de jogos falhar

        const excluirPares = (document.getElementById('excluir-pares').value.trim().split(',').map(Number) || []);
        const excluirImpares = (document.getElementById('excluir-impares').value.trim().split(',').map(Number) || []);

        if (fixar < 1 || fixar > 60) {
            alert("Número fixado inválido. Deve ser entre 1 e 60.");
            return;
        }

        // Números disponíveis excluindo pares, ímpares e o número fixo
        let numerosDisponiveis = Array.from({ length: 60 }, (_, i) => i + 1)
            .filter(num => !excluirPares.includes(num) && !excluirImpares.includes(num) && num !== fixar);

        if (numerosDisponiveis.length < 6) {
            alert("Não há números suficientes para gerar jogos.");
            return;
        }

        const jogos = [];

        for (let j = 0; j < quantidadeJogos; j++) {
            let numerosAleatorios = [...numerosDisponiveis];
            const jogo = [fixar];

            // Preenche o restante do jogo com números aleatórios, totalizando o número de dezenas adicionais
            while (jogo.length < 6 + dezenasAdicionais) {
                if (numerosAleatorios.length === 0) break;
                const index = Math.floor(Math.random() * numerosAleatorios.length);
                const numero = numerosAleatorios.splice(index, 1)[0];
                jogo.push(numero);
            }

            // Ordena os números
            jogo.sort((a, b) => a - b);

            // Evita duplicatas
            if (!jogos.some(existingJogo => existingJogo.jogo.join() === jogo.join())) {
                jogos.push({ jogo });
            }
        }

       /* const jogosGeradosDiv = document.getElementById('jogosGerados');
        jogosGeradosDiv.innerHTML = '<h2>Jogos Gerados:</h2>';*/

        /*const jogosGeradosDiv = document.getElementById('jogosGerados');
        jogosGeradosDiv.innerHTML = `<h2>Jogos Gerados: <span style="color: red; font-weight: bold;">${quantidadeJogos}</span></h2>`;
        */

        /*
        const jogosGeradosDiv = document.getElementById('jogosGerados');
        jogosGeradosDiv.innerHTML = `<h2>Jogos Gerados: <span style="color: red; font-weight: bold;">${quantidadeJogos}</span> com <span style="color: red; font-weight: bold;">${6 + dezenasAdicionais}</span> dezenas</h2>`;
        */

        //Mostra a quantidade de jogos e as quantidade de dezenas
        const jogosGeradosDiv = document.getElementById('jogosGerados');
        const quantidadeDezenas = 6 + dezenasAdicionais;
        
        const textoJogos = quantidadeJogos === 1 ? 'Jogo Gerado' : 'Jogos Gerados';
        const textoDezenas = quantidadeDezenas === 1 ? 'dezenas' : 'dezenas';
        
        jogosGeradosDiv.innerHTML = `<h2>${textoJogos}: <span style="color: red; font-weight: bold;">${quantidadeJogos}</span> com <span style="color: red; font-weight: bold;">${quantidadeDezenas}</span> ${textoDezenas}</h2>`;
        






        jogos.forEach((item, index) => {
            const jogo = item.jogo;

            const jogoElement = document.createElement('p');
            jogoElement.innerHTML = `Jogo ${index + 1}: ${jogo.map(num => {
                if (num === fixar) {
                    return `<span style="color: red; font-weight: bold; font-family: Arial, sans-serif;">${num.toString().padStart(2, '0')}</span>`;
                } else {
                    return `<span style="font-family: Courier New, monospace;">${num.toString().padStart(2, '0')}</span>`;
                }
            }).join(', ')}`;
            jogosGeradosDiv.appendChild(jogoElement);
        });

        const mensagemSucesso = document.createElement('div');
        mensagemSucesso.innerHTML = `<span style="color: red; font-weight: bold;">${quantidadeJogos}</span> Jogo${quantidadeJogos > 1 ? 's' : ''} gerado${quantidadeJogos > 1 ? 's' : ''} com sucesso!`;
        mensagemSucesso.style.position = 'fixed';
        mensagemSucesso.style.top = '50%';
        mensagemSucesso.style.left = '50%';
        mensagemSucesso.style.transform = 'translate(-50%, -50%)';
        mensagemSucesso.style.backgroundColor = '#dff0d8';
        mensagemSucesso.style.padding = '20px';
        mensagemSucesso.style.border = '1px solid #d0e9c6';
        mensagemSucesso.style.borderRadius = '5px';
        mensagemSucesso.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        mensagemSucesso.style.zIndex = '1000';
        document.body.appendChild(mensagemSucesso);

        setTimeout(() => {
            mensagemSucesso.remove();
        }, 3000); // Remove a mensagem após 3 segundos

    } catch (error) {
        alert("Erro ao gerar jogos: " + error.message);
    }
}
