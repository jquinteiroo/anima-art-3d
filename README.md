# Guia WebAR para Reconhecimento e Experiências em Obras de Arte

Projeto de estágio obrigatório do curso de Ciência da Computação — PUC Minas, Campus Poços de Caldas — 2º semestre de 2026.

## Objetivo

Desenvolver e avaliar um protótipo web para dispositivos móveis capaz de:

1. capturar uma imagem de uma obra de arte pela câmera do celular;
2. identificar a obra por visão computacional;
3. apresentar título, artista, período, descrição e áudio;
4. ativar uma experiência de realidade aumentada associada à obra;
5. rastrear a obra na câmera e manter elementos 3D/2.5D ancorados sobre ela.

O núcleo experimental compara uma abordagem clássica baseada em ORB/OpenCV com uma abordagem baseada em representações extraídas por MobileNetV2 pré-treinada.

## Stack definida — v1

### Aplicação web
- Vue 3
- Vite
- JavaScript
- MediaDevices / getUserMedia

### Realidade aumentada e 3D
- MindAR 1.2.5 — Image Tracking
- Three.js
- glTF / GLB
- GLTFLoader
- AnimationMixer

### Backend e visão computacional
- Python
- FastAPI
- OpenCV
- ORB
- Keras / MobileNetV2
- NumPy
- scikit-learn

### Assets e animação
- Blender
- IA generativa 3D opcional durante a produção dos assets (não é dependência obrigatória da aplicação)

### Dados
- JSON na prova de conceito
- SQLite caso seja necessário persistir metadados e configurações

## Arquitetura resumida

```text
Usuário abre a aplicação web
        |
        v
Vue + getUserMedia
        |
        | captura sob demanda
        v
FastAPI
        |
        +--> ORB / OpenCV --------+
        |                          |
        +--> MobileNetV2 ----------+--> ID da obra
                                       |
                          +------------+------------+
                          |                         |
                          v                         v
                 Texto / metadados           Experiência AR
                 Áudio                       MindAR + Three.js
                                                   |
                                                   v
                                             GLB / animações
```

### Separação entre reconhecimento e AR

ORB/MobileNetV2 são utilizados e avaliados para responder **qual obra foi capturada**. O MindAR é utilizado após a identificação para **detectar/rastrear a imagem-alvo em vídeo e fornecer a âncora espacial** para a cena Three.js.

Isso permite avaliar o reconhecimento independentemente da camada de realidade aumentada.

## Escopo inicial

- 20 a 30 obras cadastradas para reconhecimento.
- 1 obra para a primeira prova de conceito WebAR.
- Evolução para aproximadamente 3 a 5 experiências AR completas, caso o cronograma permita.

## Organização

- `docs/` — proposta, stack, arquitetura, cronograma, referências e anotações.
- `frontend/` — aplicação Vue/MindAR/Three.js.
- `backend/` — API FastAPI e reconhecimento.
- `experiments/` — notebooks/scripts e resultados experimentais.
- `assets/targets/` — imagens e arquivos `.mind` usados no image tracking.
- `assets/models/` — modelos `.glb/.gltf`.
- `assets/audio/` — narrações/audiodescrições.

## Status

Planejamento técnico e prova de conceito inicial.
