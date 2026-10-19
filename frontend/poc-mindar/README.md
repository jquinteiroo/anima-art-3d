# Demo MindAR — publicação e teste no celular

Esta é uma prova de conceito de **image tracking + conteúdo 3D**. O projeto principal está em [Anima Art 3D](../../README.md).

A demo tem **dois modos**:
- **Alvo oficial MindAR:** já possui um `.mind` hospedado na documentação do projeto e permite testar imediatamente.
- **Van Gogh — Campo de Trigo com Ciprestes:** exige o arquivo `targets.mind` compilado a partir da pintura escolhida.

## Publicação correta no Netlify

Crie uma pasta no computador (por exemplo `mindar-demo`) com **dois arquivos na raiz**:

```text
mindar-demo/
├── index.html
└── targets.mind
```

1. Baixe o [index.html atualizado](index.html) deste repositório pelo botão **Raw → salvar arquivo** (ou clone o repositório e copie `frontend/poc-mindar/index.html`).
2. Coloque o arquivo **`targets.mind` que você compilou** ao lado do `index.html`, mantendo exatamente esse nome.
3. Em [Netlify Drop](https://app.netlify.com/drop), arraste **a pasta inteira** `mindar-demo`, não um arquivo isolado.
4. Se já tiver um site Netlify criado, abra seu projeto em **Deploys** e arraste a pasta atualizada para a área de deploy manual.
5. Abra a URL **https://...netlify.app** em **Chrome no Android ou Safari no iPhone**, preferencialmente fora de WhatsApp/Instagram.
6. Toque primeiro em **Testar câmera (sem AR)**. Autorize a câmera; deve aparecer uma imagem ao vivo.
7. Encerre esse teste e selecione **Van Gogh — obra real**. Toque em **Iniciar realidade aumentada**.
8. Abra [a mesma imagem exata da pintura](https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg) em um monitor ou imprima. Aponte a câmera para ela.

O arquivo `targets.mind` é **binário** e não é gerado automaticamente pela página. Ele deve resultar do [compilador oficial MindAR](https://hiukim.github.io/mind-ar-js-doc/tools/compile/) utilizando a imagem acima.

**Alternativa:** sem publicar o `targets.mind`, escolha-o no seletor de arquivo dentro do modo Van Gogh **no próprio celular**. Para isso, o arquivo deve ter sido copiado para o armazenamento do telefone.

## HUD compacta — animada.html

A versão `animada.html` utiliza uma interface otimizada para observar a pintura:

- **Ao encontrar o alvo:** aparece um painel pequeno com status, título e botões de informações, áudio e ocultar.
- **Após 3 segundos:** o painel recolhe automaticamente para mostrar mais da obra, desde que o usuário não tenha aberto as informações.
- **Seta do painel:** expande ou recolhe manualmente; a interação cancela o recolhimento automático.
- **Informações:** abre a descrição e a história da obra, o controle de intensidade e o botão para pausar/retomar o shader.
- **Ouvir áudio:** inicia ou encerra a narração sintetizada em português.
- **Ocultar:** esconde o painel; o botão discreto **Informações da obra** permite restaurá-lo.
- **Alvo perdido:** os controles referentes à obra são ocultados; reaparecem quando o rastreamento é recuperado.

A demo original `index.html` permanece sem alterações. Esta atualização modifica apenas a apresentação da versão artística: **não exige recompilar `targets.mind` nem alterar `painting.jpg`**.

No clone local, rode `git pull origin master`; com os terminais Python e Cloudflare Tunnel ativos, recarregue `/animada.html` no navegador do celular. Caso o Safari use cache, feche a aba e abra novamente a URL.

## Escolha de voz e velocidade (pintura animada)

Na versão `animada.html`, ao encontrar a pintura, abra a HUD e toque em **Informações**. A seção oferece:

- **Voz da narração:** lista as vozes em português disponibilizadas pelo navegador/dispositivo via `speechSynthesis.getVoices()`;
- **Testar voz:** reproduz uma frase curta com a voz e a velocidade selecionadas;
- **Velocidade:** ajuste entre 0,75× e 1,20×;
- **Ouvir áudio:** reproduz ou interrompe a narração completa conforme os ajustes.

A atualização mantém o reconhecimento de imagem e as animações inalterados. As opções são carregadas quando o navegador as disponibiliza e podem variar entre Safari no iPhone, Chrome e outros dispositivos. A seleção de voz do sistema **não garante locução profissional**: se nenhuma alternativa em português estiver disponível, continua sendo usada a voz padrão. Para produção em museus, avaliar gravações narradas ou áudio TTS de qualidade superior pré-gerado e revisado.

## Se a câmera não abre

### O botão "Testar câmera" não mostra imagem

- Verifique se a URL começa com **https://**.
- Permita a câmera nas permissões do navegador/site (no iPhone, Safari → Configurações do Site → Câmera; no Android, confira as permissões do Chrome).
- Abra em Safari/Chrome, não em um navegador interno de rede social.
- Feche outros apps que estejam usando a câmera.
- Veja a mensagem de erro na própria página.

### A câmera funciona, mas a AR não inicia

- Confirme que `https://SEU-SITE.netlify.app/targets.mind` abre/baixa o arquivo em vez de mostrar **404** ou uma página HTML. Esse URL é apenas um exemplo; substitua pelo domínio real.
- Use o arquivo da mesma imagem da pintura exibida em outro monitor.
- Confirme conexão com a internet: MindAR e Three.js são carregados por CDNs.
- Em caso de erro, copie a mensagem mostrada abaixo dos botões e informe o modelo do celular/navegador.

### A câmera abre, mas não encontra a obra

- Teste o **alvo oficial MindAR** primeiro para separar falha de tracking de problema na pintura.
- Use a imagem exata utilizada no compilador, sem bordas/cortes.
- Evite reflexos, melhore a iluminação e ajuste a distância.
- Confira se o `.mind` foi compilado com **apenas esta imagem** ou se ela é o **primeiro alvo** (índice 0).

## Informações da obra e audiodescrição

Tanto a demonstração estável (`index.html`) quanto a versão com pintura animada (`animada.html`) incluem, no modo **Van Gogh**:

- resumo histórico na tela (obra, artista e técnica);
- seção expansível **Conheça a história da obra**, com descrição do campo, céu, ciprestes, pinceladas e contexto de Saint-Rémy;
- narração em português pela Web Speech API, com botão para iniciar ou parar;
- referência ao registro oficial do [Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/436535).

As informações foram redigidas a partir do registro curatorial público do Met. A narração é produzida pelo navegador (voz sintética, que varia conforme o dispositivo), e não por áudio oficial do museu.

## Sobre a demonstração

Quando a imagem é encontrada, o Three.js desenha uma moldura, elementos visuais animados e um objeto dourado 3D alinhados ao target. Um painel e a narração demonstrativa também são habilitados.

**O que ainda não está incluído:** reconhecimento ORB/MobileNetV2, animação realista do cavalo, cenário 2.5D completo e testes de desempenho validados em smartphone. Esta POC prova apenas rastreamento espacial e renderização AR.

## Fontes

- [MindAR — instalação e import map](https://hiukim.github.io/mind-ar-js-doc/installation/)
- [MindAR — compilação de imagens](https://hiukim.github.io/mind-ar-js-doc/quick-start/compile/)
- [MindAR — Three.js](https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/)
- [Netlify — drag and drop](https://docs.netlify.com/deploy/create-deploys/)
