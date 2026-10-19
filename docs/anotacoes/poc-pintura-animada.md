# Experimento: pintura animada com Three.js + MindAR

**Estado:** implementação disponibilizada; ainda requer validação em smartphone.  
**Arquivo da experiência:** [animada.html](../../frontend/poc-mindar/animada.html)  
**Demo original, já validada pelo aluno:** [index.html](../../frontend/poc-mindar/index.html)

## Objetivo

Experimentar um primeiro nível de animação da obra **Campo de Trigo com Ciprestes** (Vincent van Gogh, 1889) mantendo o Image Tracking do MindAR já validado.

A implementação **não separa verdadeiramente camadas de profundidade e não gera um personagem 3D**. Aplica uma deformação suave da textura da própria pintura com um fragment shader GLSL, principalmente no céu, no campo de trigo e na região dos ciprestes. É uma etapa visual anterior à segmentação e à animação 3D.

## Arquivos necessários para publicar no Netlify

Monte uma pasta com:

```text
mindar-demo/
├── index.html      # demo estável, opcional se já existir
├── animada.html    # nova página experimental
├── targets.mind    # já gerado no compilador MindAR
└── painting.jpg    # JPG idêntico ao usado para targets.mind
```

A pintura oficial pode ser baixada em:
https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg

**Atenção:** use a mesma versão do JPG tanto na compilação de `targets.mind` quanto no `painting.jpg`. Se o alvo foi gerado a partir de uma foto cortada, a sobreposição pode ficar deslocada ou esticada.

### Como publicar

1. [Baixe `animada.html`](../../frontend/poc-mindar/animada.html) do repositório (na tela do GitHub, **Raw** e depois salvar).
2. Coloque `animada.html` na **mesma pasta** do `index.html` já testado.
3. Coloque também `targets.mind` e salve a imagem que gerou esse target como `painting.jpg`.
4. Faça **um novo deploy da pasta inteira** na área **Deploys** do seu projeto Netlify.
5. No celular, abra **`https://SEU-SITE.netlify.app/animada.html`**. Não use o endereço da demo antiga sem acrescentar `/animada.html`.
6. Selecione **Van Gogh — obra real**, inicie a AR e aponte para a pintura aberta no computador ou impressa.
7. Ao reconhecer, mova o controle de intensidade e teste **Pausar movimento**. A narração da prova de conceito anterior continua disponível.

A página experimental também permite selecionar a pintura JPG pelo campo de arquivo no próprio celular, caso `painting.jpg` não esteja publicado. O `targets.mind` continua necessário e deve estar no site ou selecionado localmente no modo pintura.

## Como a animação funciona

```text
Imagem física no monitor / papel
       ↓
MindAR detecta targets.mind
       ↓
Three.js cria plano ancorado na pintura
       ↓
painting.jpg é utilizada como textura do plano
       ↓
Shader de fragmento desloca os pixels em regiões delimitadas
       ↓
Nuvens, trigo e cipreste aparentam movimento sutil
```

O shader utiliza coordenadas UV e funções seno para variar o deslocamento dos pixels no tempo. As regiões foram delimitadas aproximadamente para **esta reprodução específica** da pintura. A deformação mantém o restante da imagem praticamente imóvel para preservar o alinhamento do target.

## Limitações

- As máscaras são aproximações geométricas, não segmentação automática: podem deformar regiões próximas e precisam de calibração visual.
- Não existe profundidade real, oclusão rigorosa, modelagem de cavalo ou inpainting.
- Para separar os objetos de forma realista, a próxima etapa deve utilizar máscaras e camadas: céu, campo, árvores, primeiro plano, com preenchimento do fundo oculto.
- O movimento 3D do personagem exigirá um modelo GLB com animação ou animação procedural.
- A qualidade e o desempenho do efeito precisam ser verificados no smartphone.
- Se o JPG não carregar, o site conserva os efeitos anteriores e exibe um aviso no painel, sem apresentar a animação da textura como concluída.

## Referências

- [MindAR / Three.js — Image Tracking](https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/)
- [Three.js — ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [Three.js — TextureLoader](https://threejs.org/docs/#api/en/loaders/TextureLoader)
- [The Met — registro da obra, domínio público](https://www.metmuseum.org/art/collection/search/436535)

## Registro recomendado após teste

Preencher em `docs/anotacoes/`: modelo do celular, navegador, FPS percebido, se o alvo se mantém preso ao quadro, se há distorções, se os controles de animação funcionam e uma captura curta do resultado.
