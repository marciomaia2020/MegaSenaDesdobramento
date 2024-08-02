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
    
    if (isNaN(fixar) || fixar < 1 || fixar > 60) {
        erroFixar.textContent = "A dezena fixa deve estar entre 1 e 60.";
    } else {
        erroFixar.textContent = '';
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
}


document.getElementById('excluir-pares').addEventListener('input', () => validarCampo('excluir-pares', 'pares'));
document.getElementById('excluir-impares').addEventListener('input', () => validarCampo('excluir-impares', 'impares'));
document.getElementById('fixar').addEventListener('input', validarFixar);
document.getElementById('jogos').addEventListener('input', validarJogos);

function gerarJogos() {
    // Função para validar e obter valores dos campos
    function obterValor(id) {
        const valor = document.getElementById(id).value.trim();
        const numero = Number(valor);
        if (isNaN(numero) || numero <= 0 || numero > 1000) {
            alert(`O valor em ${id} deve ser um número entre 1 e 1000.`);
            throw new Error(`Valor inválido em ${id}`);
        }
        return numero;
    }

    // Obtém os valores dos campos e faz a validação
    try {
        const fixar = obterValor('fixar');
        const quantidadeJogos = obterValor('jogos');
        const dezenasAdicionais = Number(document.getElementById('dezenas-adicionais').value.trim());

        if (quantidadeJogos <= 0 || quantidadeJogos > 1000) {
            alert("Quantidade de jogos inválida. Deve ser entre 1 e 1000.");
            return;
        }
        
        
        if (dezenasAdicionais < 0 || dezenasAdicionais > 5) {
            alert("Número de dezenas adicionais deve ser entre 0 e 5.");
            return;
        }

        const excluirPares = (document.getElementById('excluir-pares').value.trim().split(',').map(Number) || []);
        const excluirImpares = (document.getElementById('excluir-impares').value.trim().split(',').map(Number) || []);
        
        // Verifica se os números fixos e adicionais estão dentro do intervalo
        if (fixar < 1 || fixar > 60) {
            alert("Número fixado inválido. Deve ser entre 1 e 60.");
            return;
        }

        // Cria uma lista de números disponíveis para o jogo
        const numerosDisponiveis = Array.from({ length: 60 }, (_, i) => i + 1)
            .filter(num => !excluirPares.includes(num) && !excluirImpares.includes(num) && num !== fixar);

        if (numerosDisponiveis.length < 6) {
            alert("Não há números suficientes para gerar jogos.");
            return;
        }

        const jogos = [];
        
        for (let j = 0; j < quantidadeJogos; j++) {
            let numerosAleatorios = [...numerosDisponiveis];
            
            let adicionais = [];
            if (dezenasAdicionais > 0) {
                adicionais = Array.from({ length: dezenasAdicionais }, () => {
                    const index = Math.floor(Math.random() * numerosAleatorios.length);
                    return numerosAleatorios.splice(index, 1)[0];
                });
            }
            
            const jogo = [fixar];
            
            while (jogo.length < 6) {
                const index = Math.floor(Math.random() * numerosAleatorios.length);
                const numero = numerosAleatorios.splice(index, 1)[0];
                jogo.push(numero);
            }
            
            jogo.sort((a, b) => a - b);

            // Evita jogos duplicados
            if (!jogos.some(existingJogo => existingJogo.jogo.join() === jogo.join())) {
                jogos.push({ jogo, adicionais });
            }
        }
        
        const jogosGeradosDiv = document.getElementById('jogosGerados');
        jogosGeradosDiv.innerHTML = '<h2>Jogos Gerados:</h2>';
        
        jogos.forEach((item, index) => {
            const jogo = item.jogo;
            const adicionais = item.adicionais;
            
            const jogoElement = document.createElement('p');
            jogoElement.innerHTML = `Jogo ${index + 1}: ${jogo.map(num => {
                if (num === fixar) {
                    // Destaca a dezena fixada com uma cor diferente
                    return `<span style="color: red; font-weight: bold; font-family: Arial, sans-serif;">${num.toString().padStart(2, '0')}</span>`;
                } else if (adicionais.includes(num)) {
                    // Destaca as dezenas adicionais com uma cor diferente
                    return `<span style="color: blue; font-weight: bold; font-family: Arial, sans-serif;">${num.toString().padStart(2, '0')}</span>`;
                } else {
                    return `<span style="font-family: Courier New, monospace;">${num.toString().padStart(2, '0')}</span>`;
                }
            }).join(', ')}`;
            jogosGeradosDiv.appendChild(jogoElement);
        });
        // Exibe a mensagem de sucesso
        const mensagemSucesso = document.getElementById('mensagemSucesso');
        mensagemSucesso.textContent = "Jogos gerados com sucesso!";
        mensagemSucesso.style.display = 'block';

        // Centralizar a mensagem de sucesso
        mensagemSucesso.style.position = 'fixed';
        mensagemSucesso.style.top = '50%';
        mensagemSucesso.style.left = '50%';
        mensagemSucesso.style.transform = 'translate(-50%, -50%)';
        mensagemSucesso.style.backgroundColor = '#4CAF50'; // Cor de fundo para destaque
        mensagemSucesso.style.color = '#fff'; // Cor do texto
        mensagemSucesso.style.padding = '20px';
        mensagemSucesso.style.borderRadius = '10px';
        mensagemSucesso.style.textAlign = 'center';
        mensagemSucesso.style.zIndex = '500'; // Garante que a mensagem esteja acima de outros elementos
        
    } catch (error) {
        // Captura erros de validação
        console.error("Erro na validação dos campos:", error);
    }
}
