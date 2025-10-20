const { Builder, By, Key, until } = require('selenium-webdriver');
const expect = require('chai').expect;

// Describe un conjunto de pruebas para una funcionalidad
describe('Pruebas de regresión de búsqueda', function() {
  this.timeout(30000); // Aumenta el tiempo de espera por si el navegador tarda

  let driver;

  // Antes de cada prueba, inicializa el navegador
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  // Después de cada prueba, cierra el navegador
  afterEach(async function() {
    await driver.quit();
  });

  // Caso de prueba específico
  it('Debería buscar "Selenium" y mostrar resultados correctos', async function() {
    try {
      // 1. Navegar a la página web (Google)
      await driver.get('https://www.google.com');

      // 2. Encontrar el campo de búsqueda por su nombre ('q')
      const searchBox = await driver.findElement(By.name('q'));

      // 3. Escribir el término de búsqueda y presionar Enter
      await searchBox.sendKeys('Selenium', Key.RETURN);

      // 4. Esperar hasta que el título de la página cambie
      await driver.wait(until.titleContains('Selenium'), 5000);

      // 5. Verificar que el título de la página contiene el término de búsqueda
      const pageTitle = await driver.getTitle();
      expect(pageTitle).to.include('Selenium');
    } catch (error) {
      console.error('Error durante la ejecución del test:', error);
      throw error; // Propagar el error para que la prueba falle
    }
  });
});
