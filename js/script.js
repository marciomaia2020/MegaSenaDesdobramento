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
document.getElementById('gerar').addEventListener('click', gerarJogos);




function gerarJogos() {
    try {
        const fixar = validarFixar();
        if (fixar === null) return; // Interrompe a execução se a validação da dezena fixa falhar

        const dezenasAdicionais = validarDezenasAdicionais(); // Quantidade de dezenas adicionais escolhidas pelo usuário

        if (dezenasAdicionais === null || dezenasAdicionais < 1 || dezenasAdicionais > 14) {
            alert("Número de dezenas adicionais inválido. Deve ser entre 1 e 14.");
            return;
        }

        const quantidadeJogos = dezenasAdicionais; // A quantidade total de jogos será igual ao número de dezenas adicionais

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

        const jogosGeradosDiv = document.getElementById('jogosGerados');
        jogosGeradosDiv.innerHTML = '<h2>Jogos Gerados:</h2>';

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
        mensagemSucesso.style.fontFamily = 'Arial, sans-serif';
        mensagemSucesso.style.fontSize = '18px';
        mensagemSucesso.style.textAlign = 'center';
        
        document.body.appendChild(mensagemSucesso);

        setTimeout(() => {
            document.body.removeChild(mensagemSucesso);
        }, 3000);

    } catch (error) {
        console.error('Erro ao gerar os jogos:', error.message);
    }
}




//ESTE
function resetarJogo() {
    // Limpa os campos de entrada
    document.getElementById('excluir-pares').value = '';
    document.getElementById('excluir-impares').value = '';
    document.getElementById('fixar').value = '';
    document.getElementById('jogos').value = '';
    document.getElementById('dezenas-adicionais').value = '';

    // Limpa a área de mensagens de erro
    document.getElementById('erro-pares').textContent = '';
    document.getElementById('erro-impares').textContent = '';
    document.getElementById('erro-fixar').textContent = '';
    document.getElementById('erro-jogos').textContent = '';
    document.getElementById('erro-dezenas-adicionais').textContent = '';

    // Limpa a área de jogos gerados
    document.getElementById('jogosGerados').innerHTML = '';

    // Limpa a mensagem de sucesso
    document.getElementById('mensagemSucesso').innerHTML = '';
}

function validarDezenas() {
    var input = document.getElementById("dezenas-adicionais");
    var erroDiv = document.getElementById("erro-dezenas-adicionais");
    var valor = input.value;
    
    if (valor < 7 || valor > 14 || isNaN(valor)) {
        // Exibir mensagem de erro
        erroDiv.style.display = "block";
    } else {
        // Ocultar mensagem de erro
        erroDiv.style.display = "none";
    }
}


//ESTE
function salvarJogo() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = Array.from(jogosGeradosDiv.querySelectorAll('p')).map(p => {
        const texto = p.textContent || p.innerText;
        // Extrai apenas os números do texto do jogo
        return texto.match(/\d{2}/g).join(' ');
    });

    if (jogos.length === 0) {
        alert("Nenhum jogo gerado para salvar.");
        return;
    }

    // Cria o conteúdo do arquivo
    const conteudo = jogos.join('\n');
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    
    // Cria um link de download e aciona o download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jogos_megasena.txt';
    a.click();
    URL.revokeObjectURL(url);
}


//ESTE
function exportarParaExcel() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = Array.from(jogosGeradosDiv.querySelectorAll('p')).map(p => {
        const texto = p.textContent || p.innerText;
        // Extrai apenas os números do texto do jogo
        return texto.match(/\d{2}/g).join(', ');
    });

    if (jogos.length === 0) {
        alert("Nenhum jogo gerado para exportar.");
        return;
    }

    // Cria uma planilha de dados
    const wb = XLSX.utils.book_new();
    const wsData = jogos.map(jogo => jogo.split(', '));
    
    // Adiciona uma aba com os dados
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Jogos Mega-Sena");

    // Gera o arquivo Excel
    XLSX.writeFile(wb, 'jogos_megasena.xlsx');
}
