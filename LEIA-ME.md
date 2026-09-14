# DicaPro — App Freemium (Aula 05: Publicação, Web Mobile e Monetização)

App de exemplo com o modelo **Freemium**: dicas diárias limitadas no plano grátis,
"anúncio recompensado" e "assinatura Pro" simulados, banner simulado, e uma aba
com **WebView** carregando um portal real (conteúdo legal/institucional).

Tudo já pronto neste zip: `App.js`, `app.json`, `eas.json`, `package.json`,
`babel.config.js` e os ícones em `assets/`.

---

## 0. Pré-requisitos

- Ter o **Node.js** instalado (versão 18 ou 20 LTS).
- Ter uma conta gratuita em https://expo.dev (é a conta usada pelo EAS).
- Celular Android (para instalar o APK final) ou um emulador.

---

## 1. Criar o projeto base e copiar os arquivos

Abra o terminal na pasta onde quer criar o projeto e rode:

```bash
npx create-expo-app dica-pro --template blank
cd dica-pro
```

Agora **substitua** os arquivos gerados pelos deste zip:

- Copie `App.js`, `app.json`, `eas.json`, `babel.config.js` para dentro da pasta `dica-pro`, substituindo os que já existem.
- Copie a pasta `assets/` inteira, substituindo a pasta `assets/` do projeto.
- Não precisa copiar o `package.json` deste zip — deixe o que o `create-expo-app` gerou (ele já vem com a versão certa do Expo). Só vamos instalar mais uma dependência no próximo passo.

## 2. Instalar as dependências

```bash
npx expo install react-native-webview
```

## 3. Rodar localmente para testar (opcional, mas recomendado)

```bash
npx expo start
```

Escaneie o QR Code com o app **Expo Go** no celular para ver o app funcionando
antes de gerar o APK (mais rápido para testar).

## 4. Instalar o EAS CLI e logar

```bash
npm install -g eas-cli
npx eas login
```

Vai pedir e-mail e senha da sua conta https://expo.dev (crie uma se ainda não tiver).

## 5. Configurar o build (o `eas.json` já vem pronto, mas rode para vincular o projeto à sua conta)

```bash
npx eas build:configure
```

Ele vai perguntar o "slug"/projeto — pode aceitar o que já está em `app.json`
(`dica-pro-milena`) ou deixar sugerir um novo. Se sugerir um novo ID de projeto,
tudo bem, ele mesmo ajusta o `app.json`.

> Dica: se quiser, troque o `android.package` no `app.json` de
> `com.milena.dicapro` para algo com o seu próprio nome/domínio
> (ex: `com.seunome.dicapro`) **antes** de gerar o build. Depois de publicado
> na loja, esse ID não pode mais ser alterado.

## 6. Gerar o APK na nuvem (perfil "preview")

```bash
npx eas build -p android --profile preview
```

Isso vai:
1. Autenticar com sua conta Expo
2. Enviar o código para os servidores do EAS
3. Compilar o Gradle/assinar com Keystore automaticamente na nuvem
4. Gerar um link + QR Code para baixar o `.apk`

Acompanhe o progresso pelo link que aparece no terminal
(algo como `https://expo.dev/accounts/SEU_USUARIO/projects/dica-pro-milena/builds/...`).

## 7. Instalar no celular

Quando o build terminar, escaneie o QR Code do terminal (ou abra o link do build
no navegador do celular) e baixe o `.apk`. Instale normalmente — pode ser que o
Android peça para liberar "instalar de fontes desconhecidas" na primeira vez.

O app funciona **sem precisar do Expo Go**, de forma autônoma.

---

## 8. (Opcional) Publicar de verdade na Google Play

Se quiser ir além do exercício e publicar oficialmente:

```bash
npx eas build -p android --profile production
```

Isso gera um `.aab` (Android App Bundle), formato exigido pela Play Store —
igual explicado no slide "Comparativo": a Play Store recebe o `.aab` e gera os
APKs otimizados para cada aparelho. Depois é só criar uma conta de desenvolvedor
na Play Console (taxa única) e subir o arquivo.

---

## O que o app demonstra (ligado aos slides da aula)

| Conceito do slide | Onde está no código |
|---|---|
| Estratégia Freemium / Paywall | `HomeScreen`, bloqueio de dicas após o limite grátis |
| Rewarded Ads | botão "Assistir anúncio (+1 dica)" |
| Compra In-App (não-consumível) | botão "Virar DicaPro" |
| Banner Ad | bloco tracejado "Espaço reservado para Banner Ad" |
| WebView (conteúdo legal/institucional) | aba "Ajuda / Portal", carrega `ifms.edu.br` |
| `app.json` (identidade do app) | `name`, `slug`, `android.package`, `adaptiveIcon` |
| `eas.json` (regra de build) | perfil `preview` com `"buildType": "apk"` |

Todos os SDKs reais (AdMob, In-App Purchases) foram **simulados** de propósito,
já que exigiriam contas e credenciais externas — mas a estrutura de estados
(`isPro`, `rewardedUnlocks`, paywall) é exatamente como seria numa implementação
real, só trocando os `setTimeout` pelas chamadas de SDK verdadeiras.
