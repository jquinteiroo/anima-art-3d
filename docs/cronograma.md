# Cronograma — 2º semestre de 2026

Planejamento revisado em 25/09/2026.

O cronograma adota **05/12/2026 como prazo interno para conclusão técnica do projeto**, deixando uma margem de aproximadamente 10 dias antes do término das aulas dos cursos de 18 semanas (15/12/2026) e de 18 dias antes do término do período escolar (23/12/2026).

A folga final será utilizada apenas para correções, ajustes solicitados pelo orientador, organização do repositório e preparação da entrega/apresentação.

| Período | Atividade | Entrega esperada |
|---|---|---|
| 25/09 a 30/09 | Organização inicial do projeto, revisão da proposta, definição da stack, arquitetura e levantamento das referências técnicas | Repositório organizado, stack, arquitetura, referências e cronograma |
| 01/10 a 10/10 | Estudo e prova de conceito com MindAR + Three.js | Uma imagem-alvo rastreada no celular com objeto/asset 3D ancorado |
| 11/10 a 21/10 | Desenvolvimento da interface web em Vue, acesso à câmera, exibição de informações e recurso de áudio | Frontend funcional em dispositivo móvel |
| 22/10 a 31/10 | Preparação do acervo experimental e das imagens de teste | Base organizada com obras de referência, validação, teste e imagens fora do acervo |
| 01/11 a 09/11 | Implementação do reconhecimento baseado em OpenCV + ORB | Baseline ORB funcional e primeiros testes registrados |
| 10/11 a 17/11 | Implementação do reconhecimento com MobileNetV2 pré-treinada | Extração de características, comparação por similaridade e identificação das obras |
| 18/11 a 24/11 | Comparação ORB × MobileNetV2 e ajuste dos limiares de reconhecimento/rejeição | Resultados preliminares, métricas e registro dos principais casos de falha |
| 25/11 a 30/11 | Integração completa: reconhecimento → metadados → áudio → experiência WebAR | Fluxo ponta a ponta funcionando no smartphone |
| 01/12 a 05/12 | Testes finais, otimização da experiência AR, coleta de métricas e consolidação da documentação | Versão demonstrável, resultados finais e documentação técnica atualizada |
| 06/12 a 15/12 | **Margem de segurança** para correções, ajustes solicitados pelo orientador e preparação da entrega | Projeto estabilizado e pronto para apresentação/entrega |
| 16/12 a 23/12 | Reserva adicional, sem atividades principais planejadas | Utilizada apenas em caso de necessidade excepcional |

## Marcos principais

### Marco 1 — Estrutura e documentação
**Até 30/09**

- repositório organizado;
- stack tecnológica definida;
- arquitetura documentada;
- referências e documentações registradas;
- cronograma publicado.

### Marco 2 — Prova de conceito WebAR
**Até 10/10**

Uma obra ou imagem-alvo deverá ser rastreada pelo MindAR em smartphone, com um elemento 3D renderizado e ancorado por Three.js.

O objetivo deste marco é validar cedo a viabilidade técnica da camada de realidade aumentada.

### Marco 3 — Interface móvel
**Até 21/10**

Aplicação Vue executando no celular com:

- acesso à câmera;
- fluxo de identificação;
- exibição dos dados da obra;
- reprodução de áudio;
- acesso à experiência AR.

### Marco 4 — Acervo experimental
**Até 31/10**

Conjunto de obras e imagens organizado para os experimentos, incluindo variações de ângulo, iluminação, distância e enquadramento, além de imagens não pertencentes ao acervo.

### Marco 5 — Reconhecimento por ORB
**Até 09/11**

Implementação do método clássico utilizando OpenCV/ORB, com resultados iniciais registrados.

### Marco 6 — Reconhecimento por MobileNetV2
**Até 17/11**

Implementação da abordagem utilizando MobileNetV2 pré-treinada como extratora de características.

### Marco 7 — Comparação experimental
**Até 24/11**

Comparação das duas abordagens utilizando o mesmo conjunto de teste.

Métricas previstas:

- acurácia geral e por obra;
- precisão, recall e F1-score macro;
- matriz de confusão;
- taxa de rejeição correta;
- tempo médio de processamento/resposta;
- análise qualitativa dos casos de falha.

### Marco 8 — Integração completa
**Até 30/11**

Fluxo completo:

`câmera → reconhecimento → ID da obra → informações/áudio → MindAR → Three.js → animação AR`

### Marco 9 — Conclusão técnica
**Até 05/12**

- testes finais em smartphone;
- otimização dos assets e da experiência;
- resultados experimentais consolidados;
- documentação atualizada;
- versão demonstrável do projeto.

## Margem de segurança

O período de **06/12 a 15/12** não será considerado parte do desenvolvimento principal. Ele ficará reservado para:

- correções encontradas após os testes finais;
- ajustes solicitados pelo professor orientador;
- melhorias pontuais de documentação;
- preparação de demonstração/apresentação;
- organização final do repositório.

Dessa forma, o projeto possui como meta estar tecnicamente concluído antes do encerramento das aulas, reduzindo o risco de depender dos últimos dias do semestre.
