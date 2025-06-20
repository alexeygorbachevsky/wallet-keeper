# Wallet Keeper

Multichain EVM wallet management application with support for multiple networks and secure operations.

## Features

- Multi-network support for EVM-compatible chains (Mainnet & Testnet)
- Secure wallet creation and management
- Manual balance tracking across different networks
- Bulk balance updates for all networks

## Tech Stack

- **Framework:** Next.js 15, React 19
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Form Management:** React Hook Form
- **Styling:** SCSS Modules
- **Blockchain:** Ethers.js
- **Testing:** Vitest
- **Linting:** ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/wallet-keeper.git
cd wallet-keeper
```

2. Install dependencies

```bash
yarn install
```

3. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn test` - Run tests with Vitest
- `yarn type-check` - Run TypeScript type checking
- `yarn lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── components/      # Main page specific components
│   └── ...
├── components/         # Common components
├── store/              # Redux store, slices, thunks
├── hooks/              # Common React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
