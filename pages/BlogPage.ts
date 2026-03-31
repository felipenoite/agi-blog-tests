import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model (POM) para o Blog do Agi.
 * Encapsula os seletores e ações relacionados à funcionalidade de pesquisa.
 */
export class BlogPage {
  readonly page: Page;

  // Elementos da página principal
  readonly searchIcon: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // Elementos da página de resultados
  readonly searchResults: Locator;
  readonly noResultsMessage: Locator;
  readonly articleCards: Locator;

  constructor(page: Page) {
  this.page = page;

  // Ícone de lupa que ABRE o campo de busca (toggle)
  this.searchIcon = page.locator('a.astra-search-icon');

  // Input de pesquisa
  this.searchInput = page.locator('#search-field');

  // Botão de submit da busca
  this.searchButton = page.locator('button[type="submit"], input[type="submit"], .search-submit').first();

  // Resultados de busca
  this.searchResults = page.locator('.search-results, #main, .site-main, article');

  // Mensagem de nenhum resultado
  this.noResultsMessage = page.locator('section.no-results.not-found');

  // Cards/artigos listados
  this.articleCards = page.locator('article, .post, .entry');
}

  /**
   * Navega para a página inicial do blog.
   */
  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Abre o campo de busca clicando no ícone de lupa.
   */
  async openSearchBar(): Promise<void> {
  await this.searchIcon.click();
  await expect(this.searchInput).toBeVisible();
}

  /**
   * Realiza uma busca com o termo fornecido.
   * @param term - Termo a ser pesquisado
   */
 async search(term: string): Promise<void> {
  await this.searchIcon.click();
  await this.page.waitForTimeout(600);
  await this.page.evaluate((value) => {
    const input = document.querySelector('#search-field') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = input.closest('form') as HTMLFormElement;
    form.submit();
  }, term);
  await this.page.waitForLoadState('networkidle');
}

  /**
   * Retorna o número de artigos encontrados nos resultados.
   */
  async getResultsCount(): Promise<number> {
    return await this.articleCards.count();
  }

  /**
   * Verifica se a URL contém o termo de busca esperado.
   * @param term - Termo que deve estar na URL
   */
  async expectSearchTermInUrl(term: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`[?&]s=${encodeURIComponent(term)}`, 'i'));
  }

  /**
   * Verifica se a página de resultados contém artigos.
   */
  async expectResultsToBeVisible(): Promise<void> {
    await expect(this.articleCards.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verifica se a mensagem de "nenhum resultado" está visível.
   */
  async expectNoResultsMessage(): Promise<void> {
    await expect(this.noResultsMessage).toBeVisible({ timeout: 10000 });
  }
}
