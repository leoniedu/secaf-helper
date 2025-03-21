# SECAF Helper - Extensão para Chrome

Esta extensão para Chrome permite calcular horas presenciais no sistema SECAF do IBGE, com base nas regras do PGD 2.0.

## Instalação

Para instalar a extensão, siga estes passos:

1. Abra o Chrome e navegue para `chrome://extensions/`
2. Ative o "Modo do desenvolvedor" no canto superior direito
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `secaf-helper` que contém os arquivos da extensão
5. A extensão será instalada e aparecerá na barra de ferramentas do Chrome

## Uso

1. Acesse o sistema SECAF do IBGE
2. Clique no ícone da extensão na barra de ferramentas
3. A extensão irá calcular automaticamente as horas presenciais com base nos dados da página
4. Siga as instruções na tela para informar horas presenciais obrigatórias, dias de férias, etc.
5. Um relatório será exibido com o cálculo das horas presenciais

## Personalização dos Ícones

Os ícones incluídos são apenas placeholders. Para personalizar:

1. Substitua os arquivos na pasta `images` por seus próprios ícones
2. Mantenha os mesmos nomes de arquivo e dimensões (16x16, 48x48, 128x128 pixels)

## Recursos

- Cálculo automático de horas presenciais baseado nas regras do PGD 2.0 do IBGE
- Detecção automática de feriados e pontos facultativos
- Exibição de resultados em formato de horas e minutos (ex: 8h30min) para melhor legibilidade
- Compatível com o sistema SECAF do IBGE
- Interface simples e intuitiva

## Detalhes Técnicos

Esta extensão foi desenvolvida usando JavaScript puro e APIs do Chrome. Ela funciona extraindo dados da página do SECAF e realizando cálculos com base nas regras do PGD 2.0.

### Arquivos Principais

- `manifest.json`: Configuração da extensão
- `background.js`: Script de fundo que gerencia a execução da extensão
- `secaf_helper.js`: Script principal que contém a lógica de cálculo
- `error.html`: Página de erro exibida quando a extensão é usada fora do sistema SECAF

## Desenvolvimento

Para contribuir com o desenvolvimento desta extensão:

1. Clone este repositório
2. Faça suas alterações
3. Teste a extensão localmente seguindo as instruções de instalação
4. Envie um pull request com suas melhorias

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Autor

Desenvolvido como parte do pacote ibgeba_utils.

## Observações

Esta extensão foi desenvolvida como parte do pacote ibgeba_utils e funciona apenas no sistema SECAF do IBGE.
