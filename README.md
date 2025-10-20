# Guía completa: Proyecto Selenium + Mocha + GitHub Actions

Esta guía describe el proceso completo para crear, configurar, versionar y automatizar pruebas con Selenium WebDriver usando Mocha, Chai y GitHub Actions.

---

## 0) Requisitos iniciales

Instala las herramientas base (solo una vez por equipo):

```bash
git --version        # Verifica Git
gh --version         # Verifica GitHub CLI
node -v              # Verifica Node.js
npm -v               # Verifica npm
```

Si Git o Node no están instalados:

```bash
xcode-select --install       # Instala Git en macOS
brew install node            # Instala Node.js y npm
brew install gh              # Instala GitHub CLI
```

---

## 1) Configurar Git

```bash
git config --global user.name "Sebas Saballos"
git config --global user.email "sebastiansaballosfernandez@gmail.com"
git config --global init.defaultBranch main
```

Verificar configuración:

```bash
git config --global user.name
git config --global user.email
```

---

## 2) Autenticación con GitHub CLI

```bash
gh auth login
```

Responde:

* GitHub.com
* Protocol: HTTPS
* Authenticate Git with your GitHub credentials? Yes
* Login with a web browser

En el navegador: pega el código que te muestra la terminal y presiona **Authorize GitHub**.

Verifica:

```bash
gh auth status
```

---

## 3) Crear el proyecto base Selenium + Mocha + Chai

```bash
mkdir selenium-example2 && cd selenium-example2
npm init -y
npm install --save-dev mocha chai
npm install selenium-webdriver
mkdir tests
```

### Script de prueba en `package.json`

```json
"scripts": {
  "test": "mocha tests/ --timeout 30000"
}
```

### Ignorar `node_modules`

Crea `.gitignore`:

```
node_modules/
.DS_Store
```

### Test de ejemplo `tests/search.test.js`

```js
const { Builder, By, Key, until } = require('selenium-webdriver');
const expect = require('chai').expect;

describe('Pruebas de regresión de búsqueda', function() {
  this.timeout(30000);
  let driver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function() {
    await driver.quit();
  });

  it('Debería buscar "Selenium" y mostrar resultados correctos', async function() {
    await driver.get('https://www.google.com');
    const searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Selenium', Key.RETURN);
    await driver.wait(until.titleContains('Selenium'), 5000);
    const title = await driver.getTitle();
    expect(title).to.include('Selenium');
  });
});
```

Ejecuta:

```bash
npm test
```

---

## 4) Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Configuración inicial"
git branch -M main
git remote add origin https://github.com/SebaSaballos/selenium-example2.git
git push -u origin main
```

Verifica en GitHub que aparezcan tus archivos.

---

## 5) Automatizar pruebas con GitHub Actions

### Estructura:

```
.github/
└── workflows/
    └── selenium-test.yml
```

### Archivo `.github/workflows/selenium-test.yml`

```yaml
name: Selenium Tests

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Google Chrome
        uses: browser-actions/setup-chrome@v1
        with:
          chrome-version: stable

      - name: Install dependencies
        run: npm ci

      - name: Run Mocha tests (headless)
        env:
          CHROME_PATH: ${{ env.CHROME_PATH }}
          CI: true
        run: npm test
```

### Headless en `search.test.js`

```js
const chrome = require('selenium-webdriver/chrome');
// ...
const options = new chrome.Options()
  .addArguments('--headless=new')
  .addArguments('--no-sandbox')
  .addArguments('--disable-dev-shm-usage');

driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
```

### Subir cambios

```bash
git add .github/workflows/selenium-test.yml
git commit -m "Agrega CI con GitHub Actions"
git push
```

---

## 6) Múltiples workflows

Podés tener todos los `.yml` que necesites:

```
.github/workflows/
├─ selenium-test.yml
├─ lint.yml
├─ deploy.yml
└─ notify.yml
```

Cada uno representa un flujo independiente (testing, linting, deploy, etc.).

---

## 7) Agregar badge de estado al README

```md
![Selenium Tests](https://github.com/SebaSaballos/selenium-example2/actions/workflows/selenium-test.yml/badge.svg)
```

---

## 8) Checklist final

* [x] Git configurado globalmente
* [x] Autenticado con GitHub CLI
* [x] Proyecto Node con Mocha, Chai y Selenium
* [x] `.gitignore` configurado
* [x] Primer commit y push a `main`
* [x] Workflow CI funcional en GitHub Actions
* [x] Badge agregado en README

---

**Proyecto listo para ejecutar pruebas automáticas en GitHub Actions 🚀**
