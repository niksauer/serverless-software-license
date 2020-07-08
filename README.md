# Serverless Software License

This project was bootstraped through https://github.com/niksauer/typescript-library-starter.

### Prerequisites

- Docker (Compose)
- Truffle (`npm install -g truffle`)
- Yarn (`npm install -g yarn`)

### Setup

1. `yarn install --ignore-optional --frozen-lockfile`
2. `yarn install-peers -f`

Peer have to be reinstalled after each `yarn install`. Further, to prevent optional dependencies from being installed in the future, don't forget to include `--ignore-optional` in `yarn add --ignore-optional <package>`.

### Develop Library

1. `yarn watch`

### Develop Smart-Contracts

1. `cd ethereum`
2. `docker-compose up`
3. `truffle build`
4. `truffle migrate`

### Other

For TypeDoc library mode see: https://github.com/TypeStrong/typedoc/pull/1184#issuecomment-630552403
