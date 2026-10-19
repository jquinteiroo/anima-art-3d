# Prova de conceito: MindAR + Three.js com pintura

Esta pasta contém um experimento **executável em navegador**, independente do backend e do frontend Vue, para demonstrar **rastreamento de imagem e conteúdo AR ancorado**. É um marco técnico do projeto Anima Art 3D, e não a aplicação integrada final.

**Código:** [index.html](index.html)

## Teste imediato (sem compilar imagens)

1. Publique **esta pasta** em uma hospedagem HTTPS (por exemplo, [Netlify Drop](https://app.netlify.com/drop)). No computador, também é possível servir com `python -m http.server 8080` dentro desta pasta e acessar `http://localhost:8080`.
2. Abra a página no **celular** via URL HTTPS.
3. Deixe selecionado **Alvo oficial do MindAR**.
4. Abra a [imagem-alvo oficial](https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png) em um **segundo monitor/tablet** ou imprima.
5. Toque em **Iniciar câmera**, permita o acesso à câmera e aponte para a imagem.
6. Confira se uma moldura, um objeto dourado tridimensional e partículas/traços animados aparecem sobre a imagem e **acompanham o alvo**. O painel de identificação e a narração também ficam disponíveis.

O teste oficial serve para verificar câmera e tracking **antes** de introduzir uma pintura personalizada.

## Teste com uma obra de arte real

Obra selecionada: **Campo de Trigo com Ciprestes (Wheat Field with Cypresses)** — Vincent van Gogh, 1889. [Registro oficial no Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/436535); obra em domínio público conforme a API do Met (`isPublicDomain: true`).

1. Baixe **esta versão exata** da pintura, sem recorte:  
   https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg
2. Abra o **[compilador de imagens do MindAR](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)**.
3. Envie a imagem JPG. Clique em **Start** e em **Download** para obter `targets.mind`. Observe se os pontos de interesse são numerosos e bem distribuídos.
4. Na demo, escolha **Van Gogh — obra real** e selecione esse `targets.mind` no campo de arquivo.
5. Abra **a mesma imagem utilizada na compilação**, em outro monitor/tablet, ou imprima. Não use outras versões da pintura, já que apresentam diferenças visuais.
6. Inicie a câmera, aponte para a reprodução e movimente suavemente o celular.

Opcional: salve o arquivo compilado em **`frontend/poc-mindar/targets/van-gogh.mind`**; a página tentará detectá-lo automaticamente, dispensando a escolha manual do arquivo. Como o arquivo binário depende da compilação da imagem, ele ainda **não foi incluído no repositório**.

## Como demonstrar ao professor

- O usuário inicia o rastreamento voluntariamente e concede a permissão da câmera.
- O MindAR localiza **a imagem-alvo previamente compilada** e estima sua pose na câmera.
- O Three.js mostra uma moldura, efeitos visuais e um objeto animado **presos ao alvo**.
- Os efeitos acompanham a inclinação e os movimentos do celular.
- Ao perder a obra de vista, o painel de reconhecimento desaparece; quando o alvo volta, reaparece.
- Existe botão de narração com voz sintetizada (Web Speech API do navegador).

## O que esta POC não faz

- **Não** compara ORB e MobileNetV2 (será implementado em outra etapa).
- **Não** identifica pinturas arbitrárias. Ela rastreia somente o alvo visual do arquivo `.mind`.
- **Não** produz modelos 3D realistas de personagens ou cavalos. O objeto atual é geometria procedural do Three.js.
- **Não** constitui holograma ou projeção no ambiente físico: a sobreposição aparece **na tela do celular**.
- **Não** representa uma validação física concluída: ainda é necessário testar em smartphone(s) reais, registrar dispositivo, navegador, condições de luz e eventuais falhas.

## Requisitos e solução de problemas

- **Celular:** use uma URL **HTTPS**. Uma URL HTTP para IP local (ex.: `http://192.168.0.10`) normalmente **não** disponibiliza `getUserMedia`. `localhost` é exceção segura para o próprio dispositivo.
- **Internet:** o código importa as versões fixadas MindAR 1.2.5 e Three.js 0.160.0 por CDN.
- **Arquivo-alvo:** um `.mind` é obrigatório para **cada imagem ou conjunto de imagens que será rastreado**; o exemplo oficial já fornece um arquivo pronto.
- **Falha de reconhecimento:** confirme que a mesma versão da imagem foi compilada e exibida, aumente a luminosidade e evite reflexos.
- **Som:** a narração é sintetizada pelo navegador e pode variar conforme aparelho/idioma instalado.
- **Teste em tela única:** a câmera do celular precisa apontar para outra tela, projeção impressa ou obra física; não pode apontar para a pintura exibida na própria tela do mesmo celular.

## Referências técnicas

- [MindAR — Three.js Image Tracking](https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/)
- [MindAR — Compilação de targets](https://hiukim.github.io/mind-ar-js-doc/quick-start/compile/)
- [Three.js — documentação](https://threejs.org/docs/)
- [MDN — getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [The Met — Open Access](https://www.metmuseum.org/hubs/open-access)

## Próximo passo

Concluir o primeiro teste **no celular** e registrar um vídeo curto do alvo encontrado, de um movimento lateral com tracking estável, da perda do alvo e de sua recuperação. Depois, inserir o reconhecimento ORB/MobileNetV2 e substituir o objeto procedural por um asset GLB da obra escolhida.
