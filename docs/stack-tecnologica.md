# Stack Tecnológica

## 1. Frontend — Vue 3 + Vite

Vue será utilizado para a interface responsiva do guia web. Vite será utilizado como ferramenta de desenvolvimento e build.

Responsabilidades:
- interface mobile;
- fluxo de identificação;
- apresentação de informações;
- controles de áudio;
- carregamento da experiência AR.

## 2. Câmera — MediaDevices/getUserMedia

A câmera traseira do dispositivo será acessada pelo navegador utilizando `navigator.mediaDevices.getUserMedia()`.

A API exige contexto seguro (HTTPS) em navegadores compatíveis.

## 3. Realidade aumentada — MindAR 1.2.5

Será utilizado o módulo de Image Tracking do MindAR integrado diretamente ao Three.js.

Responsabilidades:
- detectar a imagem-alvo da obra durante a experiência AR;
- estimar posição/orientação do alvo;
- fornecer a âncora para os elementos aumentados.

A versão utilizada no protótipo será fixada em 1.2.5 para garantir reprodutibilidade.

### Observação de manutenção

A versão 1.2.5 é MIT e permanece disponível no npm, porém não recebe nova publicação há alguns anos. Por isso, compatibilidade com navegadores/dispositivos será validada no protótipo e registrada como risco técnico.

## 4. Renderização e animação — Three.js

Three.js será responsável pela cena tridimensional.

Recursos previstos:
- carregamento de modelos GLB/glTF;
- animações esqueléticas;
- transformações e movimento dos elementos;
- materiais e iluminação;
- composição de elementos 2D, 2.5D e 3D.

Para modelos animados serão utilizados `GLTFLoader` e `AnimationMixer`.

## 5. Backend — Python + FastAPI

FastAPI disponibilizará a API responsável pelo reconhecimento da obra e consulta dos metadados.

Fluxo inicial:

`POST /recognize` → imagem → processamento → ID/score da obra → resposta JSON.

## 6. Visão computacional — OpenCV + ORB

ORB será utilizado como baseline clássico baseado em pontos de interesse e descritores binários.

Etapas previstas:
- detecção de keypoints;
- extração de descritores;
- comparação por distância de Hamming;
- filtragem de correspondências;
- definição de limiar de aceitação/rejeição.

## 7. Deep Learning — Keras + MobileNetV2

MobileNetV2 pré-treinada será utilizada como extratora de características, sem treinamento de uma rede a partir do zero.

Etapas previstas:
- preprocessamento da imagem;
- extração de vetor de características;
- armazenamento dos vetores de referência;
- comparação de similaridade entre consulta e acervo;
- escolha do melhor candidato e aplicação de limiar de rejeição.

## 8. Avaliação — NumPy + scikit-learn

Métricas previstas:
- acurácia geral;
- acurácia por obra;
- precisão, recall e F1-score macro;
- matriz de confusão;
- rejeição correta de imagens fora do acervo;
- tempo de processamento e resposta.

## 9. Produção de assets — Blender

Blender será utilizado para preparar, corrigir, otimizar e exportar assets 3D em GLB/glTF.

IA generativa poderá auxiliar na criação inicial dos modelos ou texturas. Ferramentas específicas de IA, incluindo Astra ou serviços especializados em geração 3D, serão consideradas ferramentas de apoio e não dependências obrigatórias da arquitetura.

## 10. Dados

Na prova de conceito os metadados poderão ser armazenados em JSON. SQLite poderá ser adotado caso o gerenciamento das obras exija persistência estruturada.

## 11. Controle de versão

Git e GitHub serão usados para código, documentação, anotações, referências, resultados e histórico das decisões técnicas.
