# Anima Art 3D — Guia WebAR para Obras de Arte

Projeto de estágio obrigatório do curso de **Ciência da Computação — PUC Minas, Campus Poços de Caldas**, desenvolvido no **2º semestre de 2026**.

**Aluno:** João Eduardo Lino Quinteiro  
**Orientador:** Prof. Will Machado  
**Status:** planejamento técnico e desenvolvimento da primeira prova de conceito

---

## Visão geral

O projeto propõe um guia web para dispositivos móveis capaz de reconhecer obras de arte pela câmera do celular e, após a identificação, apresentar informações, áudio e uma experiência de realidade aumentada associada à obra.

A proposta combina **visão computacional**, **desenvolvimento web móvel** e **WebAR**, sem exigir que o visitante instale um aplicativo nativo.

### Experiência pretendida

```text
Visitante abre o site
        ↓
autoriza a câmera
        ↓
aponta para uma obra
        ↓
sistema identifica a obra
        ↓
título + artista + descrição + áudio
        ↓
MindAR rastreia a obra
        ↓
Three.js ancora a experiência
        ↓
elementos 2D / 2.5D / 3D ganham movimento
```

Uma experiência possível é, por exemplo, uma pintura contendo um cavalo: o cenário pode receber movimentos 2.5D enquanto o cavalo é representado por um modelo 3D animado que aparenta sair da pintura e se mover diante dela.

---

## Objetivo

Desenvolver e avaliar um protótipo web para dispositivos móveis capaz de:

1. capturar uma imagem de uma obra de arte pela câmera do celular;
2. identificar a obra utilizando visão computacional;
3. apresentar título, artista, período, descrição e áudio;
4. ativar uma experiência de realidade aumentada associada à obra;
5. rastrear a obra em vídeo;
6. manter elementos 3D/2.5D ancorados sobre ela;
7. avaliar o reconhecimento e o tempo de resposta em diferentes condições de captura.

---

## Questão experimental

O núcleo acadêmico do projeto compara duas abordagens para reconhecimento de obras:

- **OpenCV + ORB**, como abordagem clássica baseada em pontos de interesse e descritores;
- **MobileNetV2 pré-treinada**, utilizada como extratora de características.

A avaliação busca observar qual abordagem apresenta melhor relação entre **taxa de reconhecimento, rejeição de imagens fora do acervo e tempo de resposta** em fotografias capturadas por smartphone.

### Reconhecimento ≠ rastreamento AR

As responsabilidades são separadas:

- **ORB / MobileNetV2:** responder **qual obra foi capturada**;
- **MindAR:** localizar e rastrear **onde a obra está no vídeo**;
- **Three.js:** renderizar e animar o conteúdo aumentado.

Essa separação permite avaliar o reconhecimento independentemente da camada de realidade aumentada.

---

## Stack tecnológica — v1

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | Vue 3 + Vite + JavaScript | Interface web responsiva |
| Câmera | MediaDevices / getUserMedia | Captura da câmera do dispositivo |
| WebAR | MindAR 1.2.5 — Image Tracking | Rastreamento da obra e âncora espacial |
| Renderização 3D | Three.js | Cena, materiais, iluminação e animações |
| Assets | glTF / GLB | Modelos e animações 3D |
| Backend | Python + FastAPI | API de reconhecimento e metadados |
| Visão computacional | OpenCV + ORB | Baseline clássico |
| Deep Learning | Keras + MobileNetV2 | Extração de características |
| Avaliação | NumPy + scikit-learn | Métricas e análise experimental |
| Produção 3D | Blender | Modelagem, rig, animação e otimização |
| Dados | JSON / SQLite | Metadados das obras |
| Áudio | HTML5 Audio | Narração e audiodescrição |
| Versionamento | Git + GitHub | Código, documentação e histórico |

Ferramentas de **IA generativa** poderão auxiliar na criação de modelos, texturas, rigging ou animações, mas não serão dependências obrigatórias da aplicação. Os assets finais deverão ser exportados em formatos padronizados, principalmente **GLB/glTF**.

Detalhes: [docs/stack-tecnologica.md](docs/stack-tecnologica.md)

---

## Arquitetura

```text
                       CELULAR
                          │
                          ▼
                 Vue + getUserMedia
                          │
                    capturar imagem
                          │
                          ▼
                       FastAPI
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      OpenCV + ORB              MobileNetV2
             │                         │
             └────────────┬────────────┘
                          │
                      ID da obra
                          │
             ┌────────────┴─────────────┐
             │                          │
             ▼                          ▼
      Texto / metadados             WebAR
          + áudio              MindAR Image Tracking
                                          │
                                          ▼
                                      Three.js
                                          │
                                   GLB / 2.5D
                                          │
                                      animações
```

Fluxo detalhado: [docs/arquitetura.md](docs/arquitetura.md)

---

## Estratégia das experiências AR

Para manter o projeto viável em smartphones e dentro do período do estágio, nem todos os elementos de uma obra serão reconstruídos integralmente em 3D.

A estratégia prevista é híbrida:

- **cenário:** planos 2D/2.5D, profundidade, shaders e pequenas animações;
- **objetos principais:** modelos 3D em GLB;
- **personagens e animais:** rig e animações quando necessário;
- **áudio:** reprodução sincronizada com a experiência.

Isso permite produzir cenas visualmente mais ricas sem exigir modelos 3D pesados para toda a pintura.

---

## Escopo

### Reconhecimento

- aproximadamente **20 a 30 obras** cadastradas;
- imagens de referência, validação e teste;
- variações de ângulo, iluminação, distância e enquadramento;
- inclusão de imagens que não pertencem ao acervo para avaliar rejeição.

### Realidade aumentada

- **1 obra** como primeira prova de conceito WebAR;
- evolução para aproximadamente **3 a 5 experiências AR completas**, caso o cronograma permita;
- prioridade para uma experiência principal mais elaborada em vez de tentar produzir animações complexas para todas as obras.

---

## Métricas previstas

Os dois métodos de reconhecimento serão comparados utilizando o mesmo conjunto de teste.

Serão registrados:

- acurácia geral;
- acurácia por obra;
- precisão;
- recall;
- F1-score macro;
- matriz de confusão;
- taxa de rejeição correta de imagens fora do acervo;
- tempo médio de processamento e resposta;
- análise qualitativa dos principais casos de falha.

---

## Cronograma

A meta interna é concluir o desenvolvimento técnico principal até **05/12/2026**, mantendo folga antes do encerramento das aulas.

| Período | Atividade | Entrega |
|---|---|---|
| 25/09 a 30/09 | Organização, stack, arquitetura e referências | Base documental do projeto |
| 01/10 a 10/10 | POC MindAR + Three.js | Target rastreado com asset 3D |
| 11/10 a 21/10 | Vue, câmera, informações e áudio | Frontend móvel funcional |
| 22/10 a 31/10 | Preparação do acervo | Base experimental organizada |
| 01/11 a 09/11 | OpenCV + ORB | Baseline clássico funcional |
| 10/11 a 17/11 | MobileNetV2 | Reconhecimento por embeddings |
| 18/11 a 24/11 | Comparação experimental | Métricas preliminares |
| 25/11 a 30/11 | Integração completa | Fluxo ponta a ponta no smartphone |
| 01/12 a 05/12 | Testes e consolidação | Versão demonstrável |
| 06/12 a 15/12 | Margem de segurança | Correções e ajustes |
| 16/12 a 23/12 | Reserva adicional | Uso somente se necessário |

Cronograma completo e marcos: [docs/cronograma.md](docs/cronograma.md)

---

## Organização do repositório

```text
anima-art-3d/
│
├── README.md
├── docs/
│   ├── Proposta_Estagio_Guia_Web_Obras_Arte.pdf
│   ├── stack-tecnologica.md
│   ├── arquitetura.md
│   ├── referencias.md
│   ├── cronograma.md
│   ├── riscos-tecnicos.md
│   ├── artigos/
│   └── anotacoes/
│
├── frontend/
├── backend/
├── experiments/
│
└── assets/
    ├── targets/
    ├── models/
    └── audio/
```

### Pastas

- `docs/` — proposta, decisões técnicas, referências, cronograma e documentação;
- `docs/anotacoes/` — registros dos testes e decisões realizadas durante o estágio;
- `docs/artigos/` — materiais e anotações da revisão bibliográfica;
- `frontend/` — aplicação Vue + MindAR + Three.js;
- `backend/` — FastAPI e métodos de reconhecimento;
- `experiments/` — scripts, notebooks, métricas e resultados;
- `assets/targets/` — imagens e arquivos `.mind` para image tracking;
- `assets/models/` — modelos `.glb/.gltf`;
- `assets/audio/` — narrações e audiodescrições.

---

## Documentação do projeto

| Documento | Conteúdo |
|---|---|
| [Proposta de estágio](docs/Proposta_Estagio_Guia_Web_Obras_Arte.pdf) | Proposta acadêmica original |
| [Stack tecnológica](docs/stack-tecnologica.md) | Tecnologias e responsabilidades |
| [Arquitetura](docs/arquitetura.md) | Fluxos de identificação e WebAR |
| [Cronograma](docs/cronograma.md) | Atividades, prazos e marcos |
| [Referências](docs/referencias.md) | Documentações e literatura consultada |
| [Riscos técnicos](docs/riscos-tecnicos.md) | Riscos identificados e mitigações |

---

## Principais documentações técnicas

- [MindAR — documentação](https://hiukim.github.io/mind-ar-js-doc/)
- [MindAR — Three.js Image Tracking](https://hiukim.github.io/mind-ar-js-doc/more-examples/threejs-image/)
- [MindAR — compilação de targets](https://hiukim.github.io/mind-ar-js-doc/quick-start/compile/)
- [Three.js](https://threejs.org/docs/)
- [Three.js — GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html)
- [Three.js — AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html)
- [Vue](https://vuejs.org/guide/quick-start)
- [MediaDevices / getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [FastAPI](https://fastapi.tiangolo.com/)
- [OpenCV — ORB](https://docs.opencv.org/4.x/d1/d89/tutorial_py_orb.html)
- [Keras — MobileNetV2](https://keras.io/api/applications/mobilenet/)
- [Blender — glTF 2.0](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)

A relação completa de referências científicas e técnicas está em [docs/referencias.md](docs/referencias.md).

---

## Referências científicas principais

- RUBLEE, E.; RABAUD, V.; KONOLIGE, K.; BRADSKI, G. **ORB: an efficient alternative to SIFT or SURF.** ICCV, 2011.
- SANDLER, M. et al. **MobileNetV2: inverted residuals and linear bottlenecks.** CVPR, 2018.
- CASTELLANO, G.; VESSIO, G. **Deep learning approaches to pattern extraction and recognition in paintings and drawings: an overview.** Neural Computing and Applications, 2021.
- THEODOSIOU, Z. et al. **A systematic approach for developing a robust artwork recognition framework using smartphone cameras.** Algorithms, 2022.
- YPSILANTIS, N.-A. et al. **The Met Dataset: instance-level recognition for artworks.** arXiv, 2022.
- **The Metropolitan Museum of Art — Open Access.**

---

## Riscos técnicos principais

1. **Compatibilidade do MindAR:** a versão adotada será fixada e testada cedo em dispositivos reais.
2. **Desempenho dos modelos 3D:** assets serão otimizados para execução em smartphones.
3. **Qualidade do rastreamento:** targets serão validados antes de serem utilizados nas experiências.
4. **Escopo artístico:** 20–30 obras poderão ser reconhecidas, mas apenas algumas receberão experiências AR completas.
5. **Dependência de IA generativa:** IA será apenas ferramenta auxiliar; a aplicação não dependerá de APIs generativas para funcionar.

Detalhes e mitigações: [docs/riscos-tecnicos.md](docs/riscos-tecnicos.md)

---

## Próximo marco

**Até 10/10/2026:** validar a primeira prova de conceito com **MindAR + Three.js**, executada em um smartphone real, contendo:

- uma imagem-alvo;
- rastreamento pelo MindAR;
- um elemento 3D ancorado;
- animação básica;
- registro do dispositivo, navegador, resultado e limitações encontradas.

---

## Possíveis evoluções

Após a validação acadêmica do protótipo, possíveis evoluções incluem:

- experiências mais elaboradas com personagens e objetos saindo visualmente das obras;
- animações sincronizadas com narração;
- internacionalização;
- painel para cadastro e gerenciamento de acervos;
- ferramentas de autoria de experiências AR;
- uso em museus, galerias e exposições;
- implantação comercial do sistema como plataforma WebAR para acervos culturais.
