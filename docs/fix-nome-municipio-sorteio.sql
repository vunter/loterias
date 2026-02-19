-- Script para corrigir dados incorretos na coluna nome_municipio_uf_sorteio
-- A coluna "Cidade / UF" nos excels da Caixa contém a cidade dos GANHADORES,
-- não o local do sorteio. Este script limpa os dados incorretos para que
-- sejam preenchidos corretamente pela sincronização via API JSON.

-- Limpar a coluna nome_municipio_uf_sorteio para todos os concursos
-- que possam ter dados incorretos (importados do Excel)
UPDATE concurso
SET nome_municipio_uf_sorteio = NULL
WHERE nome_municipio_uf_sorteio IS NOT NULL
  AND nome_municipio_uf_sorteio NOT LIKE 'SÃO PAULO%'
  AND nome_municipio_uf_sorteio NOT LIKE '%ESPAÇO%';

-- Para verificar quais registros serão afetados antes de executar:
-- SELECT id, tipo_loteria, numero, nome_municipio_uf_sorteio 
-- FROM concurso 
-- WHERE nome_municipio_uf_sorteio IS NOT NULL
--   AND nome_municipio_uf_sorteio NOT LIKE 'SÃO PAULO%'
--   AND nome_municipio_uf_sorteio NOT LIKE '%ESPAÇO%'
-- LIMIT 100;

-- Após executar este script, execute a sincronização via API para
-- preencher os dados corretos do local do sorteio.
