# Riscos Técnicos e Mitigações

## 1. Compatibilidade do MindAR

Risco: a versão publicada do MindAR é antiga e pode apresentar incompatibilidades com navegadores/dispositivos futuros.

Mitigação:
- fixar versão 1.2.5;
- testar cedo em Android e, se disponível, iOS;
- registrar navegador e versão dos testes;
- manter a camada AR desacoplada do módulo de reconhecimento.

## 2. Desempenho de modelos 3D em smartphones

Risco: modelos com muitos polígonos/texturas podem reduzir FPS.

Mitigação:
- usar GLB/glTF;
- reduzir polígonos;
- comprimir texturas;
- limitar quantidade de objetos simultâneos;
- priorizar composição híbrida 2.5D + 3D.

## 3. Qualidade do rastreamento

Risco: algumas pinturas podem ter baixa distribuição de features, reflexos ou iluminação difícil.

Mitigação:
- validar previamente os targets no compilador do MindAR;
- testar em ângulos e distâncias diferentes;
- selecionar obras apropriadas para a prova de conceito.

## 4. Escopo de produção artística

Risco: produzir experiências 3D para 20–30 obras é incompatível com o prazo do estágio.

Mitigação:
- manter 20–30 obras no reconhecimento;
- produzir uma obra hero como prova de conceito;
- expandir para 3–5 experiências AR conforme o tempo disponível.

## 5. IA generativa

Risco: ferramentas de IA podem mudar de disponibilidade, custo ou qualidade.

Mitigação:
- IA será usada apenas como ferramenta auxiliar na produção de assets;
- os assets finais serão exportados em formatos abertos como GLB/glTF;
- a aplicação não dependerá de uma API generativa para funcionar.
