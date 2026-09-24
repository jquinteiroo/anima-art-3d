# Arquitetura do Protótipo

## Fluxo de identificação

1. Visitante acessa a aplicação via HTTPS.
2. O navegador solicita acesso à câmera.
3. O visitante enquadra a obra e solicita a identificação.
4. Um frame é enviado para a API FastAPI.
5. O backend executa ORB e/ou MobileNetV2.
6. O backend retorna o ID da obra, score/confiança e metadados.
7. A interface apresenta título, artista, descrição e áudio.
8. Caso exista experiência AR, o usuário pode iniciá-la.

## Fluxo WebAR

1. A aplicação seleciona o target correspondente à obra reconhecida.
2. MindAR inicia o Image Tracking.
3. Ao encontrar o target, cria-se a âncora da cena.
4. Three.js carrega os assets GLB/glTF e elementos 2.5D.
5. Animações são executadas com AnimationMixer/timeline da aplicação.
6. Caso o alvo seja perdido, a experiência é pausada ou ocultada.
7. Ao recuperar o alvo, a cena é reposicionada.

## Por que não usar apenas o MindAR para identificação?

O projeto possui uma pergunta experimental própria sobre reconhecimento de obras. O módulo ORB/MobileNetV2 é avaliado separadamente para medir taxa de acerto, rejeição e tempo de resposta. O MindAR entra posteriormente como tecnologia de rastreamento espacial da experiência de realidade aumentada.

## Estratégia dos assets

Para reduzir custo e processamento, nem todos os elementos da obra serão reconstruídos em 3D.

- cenário: planos 2D/2.5D, mapas de profundidade, shaders ou pequenas animações;
- objetos principais: modelos 3D em GLB;
- personagens/animais: rig e animações quando necessário;
- áudio: reprodução sincronizada com a experiência.

Essa abordagem híbrida permite experiências visualmente ricas com menor custo computacional em smartphones.
