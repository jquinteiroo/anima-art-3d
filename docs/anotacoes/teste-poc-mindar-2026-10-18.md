# Registro de teste — POC MindAR + Three.js

**Data do registro:** 18/10/2026  
**Ambiente publicado:** https://velvety-tartufo-c73884.netlify.app/  
**Origem das observações:** relato do aluno após executar a demo em celular.  
**Estado:** evidência funcional preliminar; sem aferição de desempenho.

## Objetivo

Verificar que uma imagem-alvo compilada em `.mind` possa ser reconhecida e rastreada pelo MindAR, exibindo elementos aumentados por Three.js alinhados à imagem enquanto o aparelho se movimenta.

## Resultados relatados

| Verificação | Resultado |
|---|---|
| Abrir a demo publicada no Netlify pelo celular | Funcionou |
| Utilizar câmera para visualizar a imagem-alvo | Funcionou |
| Renderizar conteúdo aumentado | Funcionou |
| Reproduzir narração | Funcionou |
| Manter elemento 3D ancorado na imagem ao movimentar/inclinar o celular | **Funcionou, confirmado pelo aluno** |

O aluno informou: **“Continuou preso a imagem”** em resposta à pergunta sobre o objeto permanecer alinhado à obra durante a movimentação do celular.

## Dados ainda não registrados

- modelo e sistema operacional do celular;
- navegador/versão;
- iluminação, distância e ângulo;
- vídeo ou captura de tela do teste;
- taxa de quadros (FPS), latência e tempo de reacquisição do alvo;
- comportamento quando a imagem sai de cena e retorna.

## Interpretação

O relato demonstra **viabilidade funcional preliminar do rastreamento de imagem e da ancoragem de um elemento 3D em navegador móvel**. Ainda **não valida** o reconhecimento de obras por ORB/MobileNetV2 nem constitui ensaio quantitativo de desempenho.

## Próximas atividades

1. Salvar uma gravação curta mostrando alinhamento, movimentação e perda/retorno do alvo.
2. Anotar modelo do smartphone e navegador utilizados.
3. Evoluir os efeitos para animação sutil 2D/2.5D do próprio cenário da pintura.
4. Posteriormente, testar um asset animado GLB produzido para uma obra selecionada.

## Referências relacionadas

- [Código da POC](../../frontend/poc-mindar/index.html)
- [Instruções da POC](../../frontend/poc-mindar/README.md)
- [Documentação do MindAR](https://hiukim.github.io/mind-ar-js-doc/)
