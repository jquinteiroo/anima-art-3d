# Demo MindAR — publicação e teste no celular

Esta é uma prova de conceito de **image tracking + conteúdo 3D**. O projeto principal está em [Anima Art 3D](../../README.md).

A demo tem **dois modos**:
- **Alvo oficial MindAR:** já possui um `.mind` hospedado na documentação do projeto e permite testar imediatamente.
- **Van Gogh — Campo de Trigo com Ciprestes:** exige o arquivo `targets.mind` compilado a partir da pintura escolhida.

## Galeria Virtual AR (nova página inicial)

**Status em 23/10/2026:** três alvos novos foram compilados e entregues pelo usuário, validados como arquivo MindAR v2 e incluídos no repositório em `galeria-targets-novas.mind`. São **Grande Onda, Aula de Dança e Íris**, nessa ordem, confirmadas visualmente a partir dos dados de rastreamento do arquivo. O quarto quadro, **Campo de Trigo com Ciprestes**, continua usando o antigo `targets.mind` no computador do usuário.

A galeria agora oferece um seletor de câmera: **três obras novas** (funcionam juntas com o arquivo já incluído no GitHub) ou **Van Gogh 3D** (requer o antigo `targets.mind` local). Também existe um script para **unir os dois arquivos em um único `galeria-targets.mind` de quatro alvos**. Se o arquivo completo existir, a câmera passa a reconhecer os quatro na mesma sessão.

A interface com cartões animados, câmera MindAR e HUD diferente para cada obra foi implementada, mas ainda falta **validar o rastreamento no iPhone**.

### Jornada do visitante

1. Abrir `index.html` (redireciona para `galeria.html`).
2. Ver a abertura **“Galeria virtual de realidade aumentada”** com botão **Iniciar experiência**.
3. Ao tocar **Iniciar**, as quatro obras aparecem em cards com animação de entrada.
4. O visitante pode conhecer o contexto de cada quadro ou tocar **Abrir câmera AR**.
5. Com os alvos novos já incluídos no GitHub, o MindAR detecta **Grande Onda, Aula de Dança ou Íris** e mostra a HUD correta, com artista, ano, história e idioma PT/EN. Para reconhecer as quatro obras sem trocar o modo da câmera, gere o arquivo combinado.
6. O primeiro Van Gogh usa o relevo real `models/van_gogh_relevo_mobile.glb`; as outras três têm efeitos de rastreamento/partículas e moldura AR iniciais, **não são modelos 3D completos ainda**. A HUD se recolhe automaticamente, e o visitante pode reabrir.

### Acervo (ordem dos índices MindAR)

| Índice | Obra | Artista / data | Registro The Met |
|---|---|---|---|
| 0 | Campo de Trigo com Ciprestes | Vincent van Gogh, 1889 | [436535](https://www.metmuseum.org/art/collection/search/436535) |
| 1 | A Grande Onda de Kanagawa | Katsushika Hokusai, c. 1830–32 | [39799](https://www.metmuseum.org/art/collection/search/39799) |
| 2 | Íris | Vincent van Gogh, 1890 | [436528](https://www.metmuseum.org/art/collection/search/436528) |
| 3 | A Aula de Dança | Edgar Degas, 1874 | [438817](https://www.metmuseum.org/art/collection/search/438817) |

Os quatro registros foram verificados pela API de coleção aberta do The Met com `isPublicDomain=true` e URL para imagem pública. Os cards atuais usam essas imagens hospedadas pelo museu. Em produção, prefira armazenar as imagens no próprio projeto para reduzir dependências externas.

### Utilizar os alvos já enviados (sem recompilar)

O GitHub contém [`galeria-targets-novas.mind`](galeria-targets-novas.mind), com **três imagens compiladas** no seguinte mapeamento:

| Índice dentro de `galeria-targets-novas.mind` | Obra | Índice do catálogo |
|---|---|---|
| 0 | A Grande Onda de Kanagawa | 1 |
| 1 | A Aula de Dança | 3 |
| 2 | Íris | 2 |

O JavaScript da galeria faz a conversão de índices automaticamente, evitando que a HUD de uma obra apareça na outra. Ao entrar na galeria, o seletor **“Câmera: três obras novas”** utiliza esse arquivo já versionado, sem necessidade de compilação manual.

Para testar o **Van Gogh original**, selecione **“Câmera: Van Gogh 3D”**. Esse modo utiliza o `targets.mind` original, **que ainda não foi incluído no GitHub**. Ele deve estar salvo na pasta `frontend/poc-mindar/` do seu computador. Não substitua esse arquivo pelo `targets.mind` das outras obras; o arquivo novo já está no repositório com outro nome.

### Unir o Van Gogh às três obras novas: os quatro numa câmera só

Não é necessário recompilar no site do MindAR. Basta combinar os arquivos binários existentes:

```powershell
cd "$env:USERPROFILE\Documents\GitHub\anima-art-3d\anima-art-3d-repo"
git pull origin master

cd frontend\poc-mindar
python -m pip install msgpack
python combinar_alvos_galeria.py
```

O script espera dois arquivos na mesma pasta:
- `targets.mind` = apenas Van Gogh;
- `galeria-targets-novas.mind` = Grande Onda, Aula de Dança, Íris (já vem no GitHub).

A saída `galeria-targets.mind` terá a ordem correta para o catálogo: **0 Van Gogh, 1 Grande Onda, 2 Íris, 3 Aula de Dança**.

Se tudo funcionar no celular, versionar o arquivo final a partir da **raiz do repositório**:

```powershell
git add frontend/poc-mindar/galeria-targets.mind
git commit -m "assets: inclui os quatro alvos da galeria"
git push origin master
```

Como alternativa, é possível selecionar as quatro imagens no [compilador oficial MindAR](https://hiukim.github.io/mind-ar-js-doc/tools/compile/) na ordem da tabela do acervo. O [`preparar_alvos_galeria.py`](preparar_alvos_galeria.py) baixa os quatro JPEGs. **Se existir o arquivo antigo `05-sargent-madame-x.jpg`, deixe-o de fora.**

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
