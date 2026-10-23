# Museu Aurora — guia de visita com realidade aumentada

A entrada em `galeria.html` apresenta o **Museu Aurora**, um museu fictício para demonstração acadêmica, e a exposição **Pinturas em movimento**. Antes de começar, o visitante encontra o contexto do espaço, as quatro obras, o tempo sugerido e as instruções de uso. **Começar visita em RA** abre diretamente a experiência de câmera; **Explorar as 4 obras** leva ao catálogo. As opções técnicas ficam recolhidas em **Opções de demonstração**. A identidade visual e as adaptações para celular estão em `museu.css`.

O modo padrão **Câmera: quatro obras animadas** reconhece as quatro imagens fornecidas para o estudo e mostra a mesma projeção 2.5D aprovada na prévia, ancorada à pintura. Não é necessário gerar alvos ou inserir uma chave de API.

## Testar no celular

1. Publique a pasta `frontend/poc-mindar` inteira em HTTPS ou utilize seu servidor local com túnel HTTPS.
2. Abra `galeria.html` e toque **Começar visita em RA**. Também é possível explorar o catálogo e escolher **Explorar em realidade aumentada**.
3. Permita a câmera e aponte para uma das [imagens de referência](estudos/alvos.html), exibida em outra tela ou impressa.
4. Ao reconhecer a obra, a animação correspondente aparece automaticamente, com a HUD e a narração já existentes.
5. **Pausar / Retomar** controla a animação. Ao perder o alvo, a projeção fica oculta e seu tempo para; ao reencontrá-lo, continua. O painel se recolhe como antes.
6. **Encerrar** interrompe a câmera e libera malhas, texturas e o renderizador das projeções.

A preferência de movimento reduzido do aparelho inicia as animações pausadas. Use **Retomar** na HUD para ativá-las.

## Imagens e mapeamento

O arquivo `estudos/assets/obras.mind` foi compilado com os quatro JPEGs incluídos, com ordem e dimensões verificadas. Os cartões usam esses mesmos arquivos. A ordem de reconhecimento é independente da ordem do catálogo:

| Índice MindAR | Arquivo | Índice do catálogo | Projeção |
| --- | --- | --- | --- |
| 0 | onda.jpg (730×520) | 1 | Onda e embarcação |
| 1 | danca.jpg (500×500) | 3 | Movimento sutil do tule |
| 2 | iris.jpg (1084×860) | 2 | Flores e hastes, vaso imóvel |
| 3 | campo.jpg (471×369) | 0 | Céu, trigo e ciprestes |

Use o enquadramento completo da imagem de referência. Outra reprodução ou recorte pode não alinhar com a projeção. Os metadados e as narrações preexistentes foram mantidos; confirme os créditos da reprodução específica na documentação acadêmica.

## Execução e arquivos

A prévia e a AR compartilham `estudos/art-scene.mjs` e `estudos/fields.mjs`. A geometria tem largura 1, altura obtida de cada imagem, frente em +Z e movimentos na GPU. O relevo é uma aproximação artística sobre uma superfície contínua; não há reconstrução completa nem personagens com esqueleto.

`estudos/projection-session.mjs` gerencia carregamento, reconhecimento, pausa, perda/recuperação do alvo e cancelamento durante a abertura da câmera. Só a obra rastreada avança sua animação.

A cópia do módulo usa os mesmos valores aprovados na prévia: movimento 80%, profundidade 100%. Os alvos, imagens e código devem ser publicados juntos. As bibliotecas Three.js 0.160.0 e MindAR 1.2.5 ainda dependem de acesso às CDNs.

## Compatibilidade com testes anteriores

Os modos **Teste anterior: três obras** e **Teste anterior: Van Gogh GLB** continuam disponíveis e conservam seus arquivos e efeitos anteriores. Eles são separados do novo modo padrão para não aplicar as projeções a recortes incompatíveis.

No carregamento manual de um `.mind`, a contagem de alvos não revela a identidade nem sua ordem. Um arquivo com quatro alvos selecionado no modo animado deve seguir **onda, dança, íris, campo**. No modo anterior, a ordem de quatro alvos continua **campo, onda, íris, dança**. Mudar o seletor descarta o arquivo manual e volta aos arquivos incluídos.

## Validação

A renderização das quatro projeções foi verificada no navegador desktop na prévia. Os testes de integração verificam o mapeamento dos alvos à HUD e à animação, pausa, perda/recuperação, liberação de recursos e cancelamento de carregamento. O arquivo MindAR foi decodificado para conferir suas quatro entradas e dimensões.

**Pendente no aparelho real:** permissão de câmera, alinhamento, estabilidade do rastreamento, desempenho e transição entre obras no iPhone/Android. Nenhum teste simulado substitui essa validação.

## Áudio e modos legados

### Gerar as narrações naturais em português e inglês

Para criar as seis narrações dos três novos quadros, e manter as duas do Van Gogh:

```powershell
python -m pip install edge-tts
python generate_narrations.py
python gerar_audios_galeria.py
```

Os MP3s são reproduzidos pelo navegador quando disponíveis. Sem esses arquivos, a HUD mostra uma mensagem e oferece a voz do aparelho **apenas como alternativa explícita**. O `edge-tts` utiliza serviço online não oficial; para uso comercial, adotar provedor com suporte e direitos de uso documentados.

### Teste local

```powershell
cd "$env:USERPROFILE\Documents\GitHub\anima-art-3d\anima-art-3d-repo\frontend\poc-mindar"
python -m http.server 8000
```

Abra `http://localhost:8000/` no computador. Para usar a câmera no iPhone, mantenha o servidor aberto, abra **outro terminal** com o Cloudflare Tunnel apontando para `localhost:8000` e acesse o novo endereço HTTPS. Depois clique em **Iniciar experiência** e **Abrir câmera AR**.

**Limitações atuais:** os três alvos novos foram compilados e enviados, mas ainda não foram testados na câmera física; o `targets.mind` original do Van Gogh não está no GitHub, então não foi possível gerar aqui o arquivo combinado de quatro alvos. As três obras adicionais têm apenas efeitos AR iniciais, sem relevos GLB próprios.

---

## Rotas disponíveis

- [`index.html`](index.html) → redireciona para a **nova Galeria Virtual AR** (`galeria.html`).
- [`galeria.html`](galeria.html) → experiência principal, cards animados e câmera para quatro alvos.
- [`animada.html`](animada.html) → POC isolada com o relevo 3D do Van Gogh e a HUD compacta, mantida para comparação.
- [`index-tecnico.html`](index-tecnico.html) → teste antigo com esfera dourada e moldura, usado apenas como diagnóstico.

## HUD compacta — animada.html

A versão `animada.html` utiliza uma interface otimizada para observar a pintura:

- **Ao encontrar o alvo:** aparece um painel pequeno com status, título e botões de informações, áudio e ocultar.
- **Após 3 segundos:** o painel recolhe automaticamente para mostrar mais da obra, desde que o usuário não tenha aberto as informações.
- **Seta do painel:** expande ou recolhe manualmente; a interação cancela o recolhimento automático.
- **Informações:** abre a descrição e a história da obra, o controle de intensidade e o botão para pausar/retomar o shader.
- **Ouvir áudio:** reproduz a narração MP3 neural no idioma PT/EN selecionado (desde que os arquivos tenham sido gerados).
- **Ocultar:** esconde o painel; o botão discreto **Informações da obra** permite restaurá-lo.
- **Alvo perdido:** os controles referentes à obra são ocultados; reaparecem quando o rastreamento é recuperado.

A prova técnica antiga foi preservada em `index-tecnico.html`; a rota `index.html` agora abre a nova demo. Não é necessário recompilar `targets.mind` apenas para usar a interface nova, desde que a imagem-alvo não tenha mudado.

No clone local, rode `git pull origin master`; com os terminais Python e Cloudflare Tunnel ativos, recarregue `/animada.html` no navegador do celular. Caso o Safari use cache, feche a aba e abra novamente a URL.

## Idioma e narração

Na versão atual da pintura, o visitante escolhe **PT / EN** na HUD e ouve MP3s previamente gerados, para evitar mudanças de timbre conforme o navegador. As vozes disponíveis no celular não são o padrão. Se os MP3s estiverem ausentes, a interface mostra o aviso e permite usar a voz do aparelho apenas como alternativa explícita.

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

