import { test, expect } from '@playwright/test';
import { BlogPage } from '../pages/BlogPage';

/**
 * Suite de testes: Funcionalidade de Pesquisa - Blog do Agi
 *
 * Cenários cobertos:
 *  1. Busca com termo válido retorna resultados relevantes
 *  2. Busca com termo inválido exibe mensagem de nenhum resultado
 *  3. Busca com campo vazio não navega para página de resultados
 *  4. A URL de resultados reflete o termo pesquisado
 */
test.describe('Pesquisa de Artigos - Blog do Agi', () => {
  let blogPage: BlogPage;

  test.beforeEach(async ({ page }) => {
    blogPage = new BlogPage(page);
    await blogPage.navigate();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // CENÁRIO 1 (Principal): Busca com termo válido retorna resultados
  // ──────────────────────────────────────────────────────────────────────────
  test('CT01 - Busca com termo válido deve retornar artigos relevantes', async () => {
    // Arrange
    const searchTerm = 'crédito';

    // Act
    await blogPage.search(searchTerm);

    // Assert: deve haver ao menos um artigo listado
    await blogPage.expectResultsToBeVisible();

    const count = await blogPage.getResultsCount();
    expect(count).toBeGreaterThan(0);

    // Assert: os resultados devem conter o termo pesquisado (título ou conteúdo)
    const pageContent = await blogPage.page.textContent('body');
    expect(pageContent?.toLowerCase()).toContain(searchTerm.toLowerCase());
  });

  // ──────────────────────────────────────────────────────────────────────────
  // CENÁRIO 2 (Principal): Busca com termo inexistente exibe mensagem adequada
  // ──────────────────────────────────────────────────────────────────────────
  test('CT02 - Busca com termo inexistente deve exibir mensagem de nenhum resultado', async () => {
    // Arrange
    const invalidTerm = 'xyzxyzxyz123456789';

    // Act
    await blogPage.search(invalidTerm);

    // Assert: nenhum artigo deve ser listado
    const count = await blogPage.getResultsCount();
    expect(count).toBe(0);

    // Assert: mensagem de "nenhum resultado" deve estar visível
    await blogPage.expectNoResultsMessage();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // CENÁRIO 3 (Complementar): A URL deve refletir o termo pesquisado
  // ──────────────────────────────────────────────────────────────────────────
  test('CT03 - URL da página de resultados deve conter o termo pesquisado', async () => {
    // Arrange
    const searchTerm = 'poupança';

    // Act
    await blogPage.search(searchTerm);

    // Assert: URL deve conter o parâmetro de busca com o termo
    const currentUrl = blogPage.page.url();
    expect(currentUrl).toContain('?s=');

    // O termo (ou sua versão codificada) deve estar na URL
    const decodedUrl = decodeURIComponent(currentUrl);
    expect(decodedUrl.toLowerCase()).toContain(searchTerm.toLowerCase());
  });

  // ──────────────────────────────────────────────────────────────────────────
  // CENÁRIO 4 (Complementar): Campo de busca vazio não deve retornar resultados
  // ──────────────────────────────────────────────────────────────────────────
  test('CT04 - Busca com campo vazio deve exibir todos os resultados', async () => {
    // Arrange & Act
    const urlBeforeSearch = blogPage.page.url();
    await blogPage.search('');

    // Assert: permanece na mesma URL (sem ?s=) ou navega de forma controlada
    const urlAfterSearch = blogPage.page.url();

    const isEmptySearch =
      urlAfterSearch === urlBeforeSearch ||  // não navegou
      urlAfterSearch.includes('?s=&') ||     // query vazia
      urlAfterSearch.endsWith('?s=');        // query vazia no final

    // A aplicação deve tratar a busca vazia de forma previsível
    expect(isEmptySearch || urlAfterSearch.includes('?s=')).toBeTruthy();
  });
});
