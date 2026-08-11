# 🎬 CineVault

Aplicativo mobile para descobrir filmes, montar suas listas de **Assistidos** e **Quero Assistir**, e avaliar suas próprias experiências no cinema — com um tema escuro cinematográfico, inspirado em apps como Letterboxd e IMDb.

Desenvolvido com **React Native + Expo Router**, integrado à API pública do **TMDB (The Movie Database)**.

---

## 📱 Funcionalidades

- Cadastro e login com múltiplas contas por dispositivo
- Busca de filmes em tempo real (via TMDB)
- Lista de filmes populares na tela inicial
- Marcar filme como **Assistido**, com nota pessoal (0 a 10)
- Marcar filme como **Quero Assistir**, e movê-lo para Assistidos depois, avaliando na hora
- Tela de detalhes de cada filme, com sinopse e nota
- Dados de cada conta ficam isolados — listas não se misturam entre usuários do mesmo aparelho
- Menu lateral (drawer) para navegação entre as seções

---

## 🛠️ Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navegação | Expo Router (rotas em arquivo, grupos `(auth)` e `(drawer)`) |
| Linguagem | TypeScript |
| Estado global | Context API (autenticação e listas de filmes) |
| Persistência local | AsyncStorage |
| API externa | [TMDB API](https://www.themoviedb.org/documentation/api) |
| HTTP client | Axios |

---

## 📂 Estrutura do projeto

```
app/
├── (auth)/              # Telas de login e cadastro
│   ├── login.tsx
│   ├── register.tsx
│   └── _layout.tsx
├── (drawer)/             # Telas principais, dentro do menu lateral
│   ├── home.tsx          # Filmes populares + busca/adição
│   ├── assistidos.tsx
│   ├── quero-assistir.tsx
│   ├── about.tsx
│   └── _layout.tsx
├── movie/[id].tsx         # Detalhes de um filme
└── _layout.tsx            # Layout raiz (tema, autenticação)

src/
├── api/imdbApi.ts             # Cliente da API do TMDB
├── components/
│   ├── MovieCard.tsx
│   └── RatingPromptModal.tsx  # Modal reutilizável de avaliação
├── contexts/
│   ├── AuthContext.tsx        # Autenticação (multi-conta local)
│   └── MoviesContext.tsx      # Listas de filmes, isoladas por usuário
├── theme/colors.ts             # Paleta de cores centralizada
└── types/movie.ts
```

---

## 🚀 Rodando o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- App **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Uma chave de API gratuita do TMDB (veja abaixo)

### 1. Clone o repositório

```bash
git clone <url-deste-repositorio>
cd CineVault
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure sua chave da API do TMDB

O projeto usa a API do TMDB para buscar filmes. A chave **não** vem no repositório por segurança — cada pessoa que rodar o projeto usa a própria (é gratuito):

1. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/)
2. Vá em **Configurações → API** e gere uma chave (**API Key v3 auth**)
3. Na raiz do projeto, crie um arquivo chamado `.env` com:

```
EXPO_PUBLIC_TMDB_API_KEY=sua_chave_aqui
```

(Veja `.env.example` para referência.)

### 4. Inicie o servidor de desenvolvimento

```bash
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular (Android) ou pela câmera (iOS).

---

## 📦 Build para produção (Play Store)

O projeto usa **EAS Build** para gerar o instalável (`.apk`/`.aab`):

```bash
npx eas-cli build --platform android --profile production
```

A chave da API é embutida automaticamente no build a partir do `.env` local. Para builds a partir de outra máquina ou CI, configure a variável diretamente nos servidores da Expo:

```bash
eas env:create --name EXPO_PUBLIC_TMDB_API_KEY --value sua_chave --environment production --visibility plaintext
```

---

## 🎨 Design

O app usa uma paleta escura centralizada em `src/theme/colors.ts` — para ajustar cores, tipografia ou espaçamento do app inteiro, esse é o único arquivo que precisa ser editado.

---

## 📝 Licença

Projeto desenvolvido para fins de portfólio e aprendizado.
