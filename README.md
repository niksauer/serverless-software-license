# Serverless Software License

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/niksauer/serverless-software-license/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/serverless-software-license.svg?style=flat)](https://www.npmjs.com/package/serverless-software-license)

Read the [seminar paper](https://github.com/niksauer/serverless-software-license-paper/blob/master/paper.pdf) covering the motivation and design rationale for this project.

### Prerequisites

- Docker
- Truffle (`npm install -g truffle`)
- Yarn (`npm install -g yarn`)

### Develop Client Library

1. `yarn install --frozen-lockfile`
2. `yarn watch`

### Develop Smart-Contracts

1. `cd ethereum`
2. `docker-compose up`
3. `truffle build`
4. `truffle migrate`
