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
    // Valida a quantidade e o tipo dos números
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
    
    // Atualiza a lista de números de pares ou ímpares
    return numeros;
}

document.getElementById('excluir-pares').addEventListener('input', () => validarCampo('excluir-pares', 'pares'));
document.getElementById('excluir-impares').addEventListener('input', () => validarCampo('excluir-impares', 'impares'));

function gerarJogos() {
    const excluirPares = validarCampo('excluir-pares', 'pares');
    const excluirImpares = validarCampo('excluir-impares', 'impares');
    
    const fixar = Number(document.getElementById('fixar').value.trim());
    const quantidadeJogos = Number(document.getElementById('jogos').value.trim());
    const dezenasAdicionais = Number(document.getElementById('dezenas-adicionais').value.trim());
    
    // Valida a quantidade de jogos e o número fixo
    if (quantidadeJogos <= 0 || quantidadeJogos > 100) {
        alert("A quantidade de jogos deve ser entre 1 e 100.");
        return;
    }
    
    if (isNaN(fixar) || fixar < 1 || fixar > 60) {
        alert("A dezena fixa deve estar entre 1 e 60.");
        return;
    }
    
    const numerosDisponiveis = Array.from({ length: 60 }, (_, i) => i + 1)
        .filter(num => !excluirPares.includes(num) && !excluirImpares.includes(num));
    
    if (numerosDisponiveis.length < 6) {
        alert("Não há números suficientes para gerar jogos.");
        return;
    }
    
    const jogos = [];
    
    for (let j = 0; j < quantidadeJogos; j++) {
        let numerosAleatorios = [...numerosDisponiveis];
        
        if (dezenasAdicionais > 0) {
            // Adiciona dezenas adicionais, garantindo que sejam únicas
            const adicionais = Array.from({ length: dezenasAdicionais }, () => {
                let numero;
                do {
                    numero = Math.floor(Math.random() * 60) + 1;
                } while (numerosDisponiveis.includes(numero) || numerosAleatorios.includes(numero));
                return numero;
            });
            numerosAleatorios = numerosAleatorios.concat(adicionais);
        }
        
        // Garante que o total de dezenas para o jogo seja o especificado pelo usuário
        let totalDezenas = [...new Set(numerosAleatorios)].sort(() => 0.5 - Math.random()).slice(0, 6);
        
        // Adiciona a dezena fixa se não estiver presente
        if (!totalDezenas.includes(fixar)) {
            totalDezenas[Math.floor(Math.random() * totalDezenas.length)] = fixar;
        }
        
        // Ordena os números e ajusta para incluir a dezena fixa e as dezenas adicionais
        totalDezenas = totalDezenas.sort((a, b) => a - b); 
        
        // Formatação dos jogos
        const jogoElement = document.createElement('p');
        jogoElement.innerHTML = `J${j + 1}- ${totalDezenas.map(num => {
            if (num === fixar) {
                // Destaca a dezena fixada com uma cor diferente
                return `<span style="color: red; font-weight: bold; font-family: Arial, sans-serif;">${num.toString().padStart(2, '0')}</span>`;
            } else {
                return `<span style="font-family: Courier New, monospace;">${num.toString().padStart(2, '0')}</span>`;
            }
        }).join(', ')}`;
        jogoElement.style.border = '1px solid #dcdcdc'; // Tom de cinza claro para a borda
        jogoElement.style.padding = '10px';
        jogoElement.style.margin = '5px 0';
        jogoElement.style.textAlign = 'center'; // Centraliza o texto
        jogoElement.style.backgroundColor = '#f5f5f5'; // Tom de cinza claro para o fundo
        jogoElement.style.color = '#333'; // Tom de cinza escuro para o texto
        jogoElement.style.fontSize = '16px'; // Ajusta o tamanho da fonte
        jogoElement.style.borderRadius = '4px'; // Bordas arredondadas
        
        jogos.push(jogoElement);
    }
    
    const jogosGerados = document.getElementById('jogosGerados');
    jogosGerados.innerHTML = '';
    jogos.forEach(jogoElement => jogosGerados.appendChild(jogoElement));
}

function salvarJogo() {
    let jogos = document.getElementById('jogosGerados').innerText.trim();
    
    if (jogos === '') {
        alert("Nenhum jogo foi gerado.");
        return;
    }
    
    // Remove a letra 'J', os hífens e as vírgulas
    jogos = jogos.replace(/J\d+-\s*/g, ''); // Remove a letra 'J' e o número seguido de hífen
    jogos = jogos.replace(/,/g, ''); // Remove apenas as vírgulas, mantendo os espaços

    const blob = new Blob([jogos], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jogos_megasena.txt';
    a.click();
    
    URL.revokeObjectURL(url);
}



function exportarParaExcel() {
    const jogos = document.getElementById('jogosGerados').innerText.trim();
    
    if (jogos === '') {
        alert("Nenhum jogo foi gerado.");
        return;
    }
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(jogos.split('\n').map(jogo => [jogo]));
    XLSX.utils.book_append_sheet(wb, ws, 'Jogos');
    
    XLSX.writeFile(wb, 'jogos_megasena.xlsx');
}

function resetarJogo() {
    document.getElementById('excluir-pares').value = '';
    document.getElementById('excluir-impares').value = '';
    document.getElementById('fixar').value = '';
    document.getElementById('jogos').value = '';
    document.getElementById('dezenas-adicionais').value = '';
    document.getElementById('jogosGerados').innerHTML = '';
    document.getElementById('erro-pares').textContent = '';
    document.getElementById('erro-impares').textContent = '';
}
