# 🛰️ BrightSpot — Sistema de Inteligência Ambiental

> **FIAP Global Solution 2026 — Indústria Espacial**  
> Matéria: Desenvolvimento Mobile | React Native + Expo + TypeScript

---

## 👥 Integrantes

| Nome | RM |
|------|-----|
| Augusto Barcelos Barros | RM565065 |
| Caio Felipe de Lima Bezerra | RM556197 |
| Juan Francisco Alves Muradas | RM555541 |
| Lucas Derenze Simidu | RM555931 |
| Sofia Fernandes | RM554873 |

---

## 📱 Sobre o Projeto

**BrightSpot** é um sistema de inteligência ambiental composto por um aplicativo mobile que monitora ambientes remotos, extremos ou de difícil acesso humano — como cavernas, minas e túneis subterrâneos.

A solução conecta tecnologia espacial (sensoriamento remoto, operação em ambientes hostis, caixa-preta de dados) a problemas reais da Terra: **a tomada de decisão segura antes de expor pessoas a ambientes desconhecidos**.

> **Proposta de valor:** *Explorar antes de expor* — Inteligência ambiental para decisões mais seguras.

---

## 🌍 Conexão com a Indústria Espacial

A lógica do BrightSpot é inspirada diretamente na exploração espacial:

- **Ambientes hostis** → assim como em Marte, o gadget opera onde humanos não conseguem
- **Caixa-preta ambiental** → registra logs mesmo sem conexão, como sistemas de bordo
- **Autonomia** → decisão baseada em dados antes da exposição ao risco
- **Dados satelitais/climáticos** → integração com OpenWeatherMap e NASA API

---

## 🌱 ODS Alinhados

- **ODS 9** — Indústria, inovação e infraestrutura
- **ODS 11** — Cidades e comunidades sustentáveis  
- **ODS 13** — Ação contra a mudança global do clima

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go instalado no celular (iOS/Android)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/brightspot.git
cd brightspot

# Instale as dependências
npm install

# Inicie o projeto (mesma rede Wi-Fi)
npx expo start

# Se o celular estiver em rede diferente da máquina (ex: dados móveis)
npx expo start --tunnel
```

> **Nota:** use o `--tunnel` se o QR code não conectar normalmente. Na primeira execução, será pedida a instalação do `@expo/ngrok`.

### Executar em cada plataforma

```bash
# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

### ⚠️ Configuração de APIs (opcional)

O app funciona com dados de exemplo sem configurar nenhuma API key.  
Para dados reais, edite os arquivos:

**`src/services/nasaService.ts`**
```ts
const NASA_API_KEY = 'SUA_CHAVE_AQUI'; // nasa.gov/open/apis (gratuito)
```

**`src/services/weatherService.ts`**
```ts
const API_KEY = 'SUA_CHAVE_AQUI'; // openweathermap.org (gratuito)
```

---

## 📱 Funcionalidades

### 🏠 Home (Dashboard)
- Estatísticas em tempo real (ambientes críticos, atenção, seguros)
- Leituras recentes com classificação de risco
- Dados climáticos externos via OpenWeatherMap
- Imagem Astronômica do Dia (NASA APOD)
- Pull-to-refresh

### 📡 Ambientes
- Lista completa de leituras com FlatList
- Busca por nome e localização
- Filtros por nível de risco (Crítico / Atenção / Seguro)
- Ordenação (mais recente, mais antigo, risco, bateria)
- Swipe para remover

### 📋 Detalhe do Ambiente
- Análise completa com todos os sensores
- Classificação de risco por IA (regras contextuais)
- Recomendação de ação automática
- Status de bateria e conexão
- Clima local via coordenadas GPS
- Favoritar/desfavoritar

### ⭐ Favoritos
- Ambientes salvos com AsyncStorage
- Persistência entre sessões

### ⚙️ Configurações
- Dark mode / Light mode / Sistema
- Estatísticas do app
- Limpeza de dados local
- Informações sobre as APIs integradas

### 🔴 Galeria NASA
- Fotos reais do rover Curiosity em Marte
- Grid com visualização em modal
- Integração com NASA Mars Photos API

---

## 🧱 Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   ├── EnvironmentCard.tsx
│   ├── RiskBadge.tsx
│   ├── SensorCard.tsx
│   └── Skeleton.tsx
├── screens/             # Telas da aplicação
│   ├── HomeScreen.tsx
│   ├── EnvironmentsListScreen.tsx
│   ├── EnvironmentDetailScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── SettingsScreen.tsx
│   └── NasaGalleryScreen.tsx
├── navigation/          # React Navigation
│   └── AppNavigator.tsx
├── services/            # Camada de API (Axios)
│   ├── nasaService.ts
│   └── weatherService.ts
├── hooks/               # Custom hooks
│   ├── useNasa.ts
│   └── useWeather.ts
├── contexts/            # Context API (estado global)
│   ├── ThemeContext.tsx
│   └── EnvironmentsContext.tsx
├── storage/             # AsyncStorage wrapper
│   └── index.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── theme/               # Design tokens
│   └── index.ts
└── utils/               # Helpers
    └── index.ts
```

---

## 🧠 Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React Native + Expo SDK 55 | Framework mobile |
| TypeScript | Tipagem estática |
| React Navigation (Tabs + Stack) | Navegação |
| Context API + Custom Hooks | Estado global |
| AsyncStorage | Persistência local |
| Axios | Consumo de APIs |
| NASA APOD API | Imagem astronômica do dia |
| NASA Mars Photos API | Fotos do rover Curiosity |
| OpenWeatherMap API | Dados climáticos |

---

## 🏆 Critérios Atendidos

| Critério | Status |
|---|---|
| Estrutura do Projeto | ✅ Arquitetura em camadas, componentização completa |
| React Native + TypeScript | ✅ Tipagem forte em todos os arquivos |
| Navegação | ✅ Bottom Tabs + Native Stack |
| Consumo de API | ✅ NASA API + OpenWeatherMap via Axios |
| Persistência Local | ✅ AsyncStorage para logs, favoritos e tema |
| Interface (UI/UX) | ✅ Dark/Light mode, skeletons, cards modernos |
| Funcionalidades | ✅ Dashboard, listagem, filtros, busca, favoritos |
| Código e Boas Práticas | ✅ Service layer, hooks, separação de responsabilidades |
| Criatividade e Inovação | ✅ Tema espacial aplicado a problema real da Terra |
