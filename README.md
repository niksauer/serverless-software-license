# Serverless Software License

### Prerequisites

- Docker
- Truffle (`npm install -g truffle`)
- Yarn (`npm install -g yarn`)

### Development

1. `yarn install --frozen-lockfile`
2. `yarn install-peers -f`

Peer have to be reinstalled after each `yarn install` or `yarn add` etc.

3. `yarn watch`

### Develop Smart-Contracts

1. `cd ethereum`
2. `docker-compose up`
3. `truffle build`
4. `truffle migrate`

### Other

- Project [template](https://github.com/niksauer/typescript-library-starter)
- TypeDoc's new [library mode](https://github.com/TypeStrong/typedoc/pull/1184#issuecomment-630552403)
