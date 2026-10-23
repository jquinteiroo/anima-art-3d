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

## Narração bilíngue com vozes neurais (versão `animada.html`)

**Arquitetura:** o site não tenta instalar vozes no iPhone. Em vez disso, reproduz dois MP3s locais, garantindo o mesmo timbre no Safari, Chrome e em outros aparelhos. O idioma padrão é **PT-BR**, com botão **PT / EN** na própria HUD; as descrições principais também são traduzidas para inglês.

### Vozes selecionadas

| Idioma | Voz padrão | Arquivo |
|---|---|---|
| Português brasileiro | `pt-BR-FranciscaNeural` | `audio/van-gogh-pt-BR.mp3` |
| Inglês americano | `en-US-JennyNeural` | `audio/van-gogh-en-US.mp3` |

**Os MP3s não estão incluídos inicialmente no repositório.** Após clonar ou puxar as alterações, gere-os uma vez no Windows. O script usa o pacote Python [edge-tts](https://github.com/rany2/edge-tts), que acessa **online** o serviço de voz do Microsoft Edge. Não exige chave de API, mas não é uma API oficial com garantias de disponibilidade para um produto em produção.

Abra um terminal PowerShell:

```powershell
cd "$env:USERPROFILE\Documents\GitHub\anima-art-3d\anima-art-3d-repo"
git pull origin master
cd frontend\poc-mindar
py -m pip install edge-tts
py generate_narrations.py
```

Se `py` não for reconhecido, substitua por `python`.

Após ver `Narrações prontas`, confirme que `audio/van-gogh-pt-BR.mp3` e `audio/van-gogh-en-US.mp3` existem e reinicie/recarregue `animada.html`. Não precisa recriar `targets.mind`. Os arquivos permanecerão disponíveis offline no servidor local depois da geração.

Para **enviar também os áudios ao repositório** (e levá-los ao Netlify ou outra hospedagem), execute a partir da raiz do clone:

```powershell
git add frontend/poc-mindar/audio/van-gogh-pt-BR.mp3 frontend/poc-mindar/audio/van-gogh-en-US.mp3
git commit -m "assets: adiciona narracoes neurais PT-BR e EN"
git push origin master
```

Se o áudio ainda não foi gerado, tocar em **Ouvir áudio** mostra uma mensagem de arquivo ausente em vez de reproduzir automaticamente a voz robótica. Há uma opção explícita **Usar voz do aparelho (alternativa)** para testes sem os MP3s.

Os roteiros, nomes dos arquivos e vozes de geração ficam em [`audio/narrations.json`](audio/narrations.json). Para trocar as vozes, edite as entradas `voice`, execute `py generate_narrations.py` novamente, ou use um TTS profissional pago que entregue os MP3s nos mesmos caminhos. A solução de protótipo via `edge-tts` não deve ser tratada como licença ou garantia de serviço para um produto comercial: nesse caso, use um provedor oficial com direitos de uso documentados. A narração utiliza voz sintética e isso deve estar informado na aplicação.

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

A demo estável (`index.html`) e a versão com pintura animada (`animada.html`) incluem informações sobre a obra. A versão animada também oferece PT-BR/EN e narrações em MP3:

- resumo histórico na tela (obra, artista e técnica);
- seção expansível **Conheça a história da obra**, com descrição do campo, céu, ciprestes, pinceladas e contexto de Saint-Rémy;
- narração em português pela Web Speech API na demo `index.html`; na `animada.html`, o padrão são os arquivos MP3 neurais em português e inglês, com alternativa explícita para a voz do aparelho;
- referência ao registro oficial do [Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/436535).

As informações foram redigidas a partir do registro curatorial público do Met. As narrações são sintéticas e não são áudios oficiais do museu. Os arquivos MP3 de `animada.html` precisam ser gerados conforme as instruções acima antes da reprodução.

## Relevo 3D otimizado da obra de Van Gogh

Na versão [`animada.html`](animada.html), escolha **Van Gogh — obra real** e inicie a câmera. Assim que o MindAR reconhecer o alvo, o Three.js carrega automaticamente:

```text
frontend/poc-mindar/models/van_gogh_relevo_mobile.glb
```

O modelo GLB (aproximadamente 2,8 MB; 73.587 vértices e 145.896 triângulos) contém a geometria em relevo e as cores nos próprios vértices; não precisa de `.mtl` nem de textura externa. Ele tem a frente orientada para o eixo **+Z**. Um `GLTFLoader` importa a malha e a posiciona sobre o mesmo alvo MindAR da pintura, respeitando a largura do alvo e ajustando a altura. Os placeholders geométricos (anel/esfera/cones) **não aparecem** no modo Van Gogh; continuam disponíveis apenas no teste genérico.

Em **Informações → Visualização da pintura**, existem dois modos:

- **Relevo 3D (GLB otimizado)** (padrão): permite inclinar o celular para perceber profundidade e ajustar `Profundidade do relevo` entre 20% e 200%; o relevo permanece ancorado à pintura;
- **Pintura animada (versão anterior)**: aplica o shader de céu, trigo e ciprestes a `painting.jpg`, com controle de intensidade e pausa. Este modo só depende da textura quando solicitado; trocar para ele não apaga o modelo 3D.

O GLB por si só é um **relevo estático (2.5D)**, e não faz as árvores ou nuvens se moverem de forma independente. A animação da textura continua separada para comparação, sem fingir que o relevo já é uma cena 3D completa.

### Teste local

```powershell
cd "$env:USERPROFILE\Documents\GitHub\anima-art-3d\anima-art-3d-repo"
git pull origin master
cd frontend\poc-mindar
python -m http.server 8000
```

Abra `http://localhost:8000/animada.html` para testar a página no computador. Para usar a câmera do iPhone, execute o Cloudflare Quick Tunnel **em outro terminal**, sem fechar o Python, e abra `https://<novo-endereco>.trycloudflare.com/animada.html`. O link antigo de um túnel encerrado deixa de funcionar.

Para conferir que o GLB é servido, abra `http://localhost:8000/models/van_gogh_relevo_mobile.glb`: o navegador deve baixar/abrir um binário, não retornar 404. O navegador deve ter suporte a WebGL. O desempenho e o posicionamento na câmera real ainda precisam ser validados no dispositivo.

## Sobre a demonstração

Na demo **`index.html`** e no **alvo genérico** de `animada.html`, o Three.js ainda desenha elementos de teste (moldura e objeto dourado 3D). Já na obra de **Van Gogh** em `animada.html`, o conteúdo principal passou a ser o **relevo 3D GLB** alinhado ao alvo. O painel compacto e as narrações continuam disponíveis.

**O que ainda não está incluído:** reconhecimento ORB/MobileNetV2, animação realista do cavalo, reconstrução completa de cena 3D com elementos independentes e testes de desempenho validados em smartphone. Esta POC prova apenas rastreamento espacial e renderização AR.

## Fontes

- [MindAR — instalação e import map](https://hiukim.github.io/mind-ar-js-doc/installation/)
- [MindAR — compilação de imagens](https://hiukim.github.io/mind-ar-js-doc/quick-start/compile/)
- [MindAR — Three.js](https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/)
- [Netlify — drag and drop](https://docs.netlify.com/deploy/create-deploys/)
