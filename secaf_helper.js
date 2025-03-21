// SECAF Helper main script
// Converted from bookmarklet to Chrome extension format

function secaf() {
  // Check if we're on the SECAF system
  if (!document.querySelector("#SideNav")) {
    alert("Esta página não parece ser do sistema SECAF. Execute esta extensão na página do SECAF.");
    return;
  }

  // Get month information
  const elementoMes = document.querySelector("#SideNav > div:nth-child(1) > info-mes > div.d-flex.justify-content-between.align-items-center.mx-3.pb-3.text-center.dropdown.month-select > a");
  if (!elementoMes) {
    alert("Não foi possível encontrar as informações de ano, mês e SIAPE.");
    return;
  }

  const partes = elementoMes.getAttribute("href").split("/").slice(-2);
  const anoMes = partes[0];
  const siape = partes[1];
  const ano = parseInt(anoMes.substring(0, 4));
  const mes = parseInt(anoMes.substring(4, 6));
  const diasSegundaASexta = calcularDiasSegundaASexta(ano, mes);

  // Get work days
  const elementoDiasUteis = document.querySelector("#SideNav > div:nth-child(1) > info-mes > div.mx-3.pb-3.work-days > span.work-days__number");
  if (!elementoDiasUteis) {
    alert("Não foi possível encontrar a informação de dias úteis.");
    return;
  }
  const diasUteis = parseInt(elementoDiasUteis.textContent.trim());

  // Get required hours
  const horasPresencial = prompt("Número de horas presenciais obrigatórias por mês:", "64");
  if (horasPresencial === null) return;

  // Get vacation days
  const diasFerias = prompt("Número de dias de férias no mês:", "0");
  if (diasFerias === null) return;

  // Calculate holidays
  let feriadosEFacultativos = diasSegundaASexta - diasUteis;
  const usarFeriadosCalculados = confirm(
    `Foram detectados ${feriadosEFacultativos} dias de feriados/pontos facultativos.\nDeseja usar este valor calculado automaticamente?\nClique em OK para usar o valor calculado ou em Cancelar para informar manualmente.`
  );

  if (!usarFeriadosCalculados) {
    const feriadosManual = prompt("Número de feriados e pontos facultativos no mês:", feriadosEFacultativos.toString());
    if (feriadosManual === null) return;
    feriadosEFacultativos = parseInt(feriadosManual);
  }

  // Calculate required hours
  const ultimoDiaMes = new Date(ano, mes, 0).getDate();
  const horasDevidasMes0 = parseFloat(horasPresencial) * (1 - parseInt(diasFerias) / ultimoDiaMes) - feriadosEFacultativos * 8;
  const horasDevidasMes = Math.max(horasDevidasMes0, 0);

  // Get worked hours from table
  const tabelaApuracao = document.querySelector("body > app-root > main-page > div > main > painel-apuracao > tabela-apuracao");
  let horasTrabalhadasMes = 0;

  if (tabelaApuracao) {
    console.log("Tabela de apuração encontrada usando o seletor específico");
    const linhas = tabelaApuracao.querySelectorAll("tr");
    console.log(`Encontradas ${linhas.length} linhas na tabela`);

    // Check current date
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDate();
    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear();
    const dataAtualStr = `${diaAtual}/${mesAtual}/${anoAtual}`;
    console.log(`Data atual: ${dataAtualStr}`);

    // Check if first row is current date
    const primeiraLinhaDataElemento = tabelaApuracao.querySelector("div > section > table > tbody > tr:nth-child(1) > th");
    let pularPrimeiraLinha = false;

    if (primeiraLinhaDataElemento) {
      const textoData = primeiraLinhaDataElemento.textContent.trim();
      console.log(`Data da primeira linha: "${textoData}"`);

      const mesesAbrev = {
        1: "JAN", 2: "FEV", 3: "MAR", 4: "ABR", 5: "MAI", 6: "JUN",
        7: "JUL", 8: "AGO", 9: "SET", 10: "OUT", 11: "NOV", 12: "DEZ"
      };
      const mesAbrev = mesesAbrev[mesAtual];
      const formatoPortugues = new RegExp(`\\b${diaAtual}${mesAbrev}`, 'i');

      if (formatoPortugues.test(textoData)) {
        console.log("A data da primeira linha corresponde à data atual. Pulando esta linha.");
        pularPrimeiraLinha = true;
      }
    }

    // Process each row
    linhas.forEach((linha, indice) => {
      // Skip first data row if it matches current date
      if (indice === 1 && pularPrimeiraLinha) {
        console.log("Pulando a primeira linha por corresponder à data atual.");
        return;
      }

      // Find all elements with class movimentacao__horario-tempo
      const elementosHorario = linha.querySelectorAll(".movimentacao__horario-tempo");
      if (elementosHorario.length === 0) {
        console.log(`Linha ${indice}: Nenhum elemento de horário encontrado`);
        return;
      }

      // Get the last element
      const ultimoElemento = elementosHorario[elementosHorario.length - 1];
      const textoOriginal = ultimoElemento.textContent.trim();
      console.log(`Linha ${indice}, último elemento: "${textoOriginal}"`);

      // Extract hours and minutes
      const match = textoOriginal.match(/(\d+)[h:](\d+)/);
      if (match) {
        const horas = parseInt(match[1]) || 0;
        const minutos = parseInt(match[2]) || 0;
        console.log(`Extraído: ${horas}h${minutos}m`);
        horasTrabalhadasMes += horas + (minutos / 60);
      } else {
        console.log(`Não foi possível extrair horas de "${textoOriginal}"`);
      }
    });

    console.log(`Total de horas trabalhadas: ${horasTrabalhadasMes.toFixed(2)}`);
  } else {
    alert("Não foi possível encontrar a tabela de apuração de horas.");
    return;
  }

  // Calculate hour balance
  const saldoHoras = horasDevidasMes - horasTrabalhadasMes;

  // Create results HTML
  const htmlResultado = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">Cálculo de Horas Presenciais SECAF</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">SIAPE</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${siape}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ano/Mês</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${formatarMes(anoMes)}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Dias de segunda a sexta</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${diasSegundaASexta}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Dias úteis (SECAF)</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${diasUteis}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Feriados e pontos facultativos</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${feriadosEFacultativos}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Dias de férias</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${diasFerias}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Horas presenciais devidas</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${formatarHorasMinutos(horasDevidasMes)}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Horas presenciais trabalhadas</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${formatarHorasMinutos(horasTrabalhadasMes)}</td>
      </tr>
      <tr style="background-color: #e6f7ff; font-weight: bold;">
        <td style="padding: 8px; border: 1px solid #ddd;">Saldo de horas</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: ${saldoHoras > 0 ? 'red' : 'green'};">
          ${formatarHorasMinutos(Math.abs(saldoHoras))} ${saldoHoras > 0 ? '(faltam horas)' : '(horas excedentes)'}
        </td>
      </tr>
    </table>
    <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
      Cálculo baseado nas regras do PGD 2.0 do IBGE.<br>
      Desenvolvido pelo pacote ibgeba_utils - Chrome Extension
    </p>
  </div>`;

  // Create modal
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.zIndex = '9999';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.innerHTML = htmlResultado;

  // Add close button
  const botaoFechar = document.createElement('button');
  botaoFechar.innerText = 'Fechar';
  botaoFechar.style.position = 'absolute';
  botaoFechar.style.top = '10px';
  botaoFechar.style.right = '10px';
  botaoFechar.style.padding = '5px 10px';
  botaoFechar.style.backgroundColor = '#f44336';
  botaoFechar.style.color = 'white';
  botaoFechar.style.border = 'none';
  botaoFechar.style.borderRadius = '3px';
  botaoFechar.style.cursor = 'pointer';
  botaoFechar.onclick = function() {
    document.body.removeChild(modal);
  };

  modal.querySelector('div').appendChild(botaoFechar);
  document.body.appendChild(modal);
}

// Helper function to calculate weekdays in month
function calcularDiasSegundaASexta(ano, mes) {
  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia = new Date(ano, mes, 0);
  let contador = 0;

  for (let dia = new Date(primeiroDia); dia <= ultimoDia; dia.setDate(dia.getDate() + 1)) {
    const diaSemana = dia.getDay();
    if (diaSemana >= 1 && diaSemana <= 5) {
      contador++;
    }
  }

  return contador;
}

// Helper function to format year/month
function formatarMes(anoMes) {
  const ano = anoMes.substring(0, 4);
  const mes = anoMes.substring(4, 6);
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return `${meses[parseInt(mes) - 1]} de ${ano}`;
}

// Helper function to format decimal hours as hours and minutes
function formatarHorasMinutos(horasDecimais) {
  const horas = Math.floor(horasDecimais);
  const minutos = Math.round((horasDecimais - horas) * 60);
  return `${horas}h${minutos.toString().padStart(2, '0')}min`;
}

// Execute the main function
secaf();
