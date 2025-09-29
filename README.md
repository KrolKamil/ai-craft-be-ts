# AI Craftsmanship Workshop Project

## System Requirements

- Node.js (v23.6 or newer)
- npm
- PostgreSQL
- API key for external services see .env.example

## Installation

To install Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Application Setup

1. Clone the repository:

```bash
git clone https://github.com/michal-michaluk/ai-craft-be-ts
cd ai-craft-be-ts
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on [.env.example](.env.example):

```bash
cp .env.example .env
```

4. Configure environment variables in [.env](.env) for local dev environment - ask team members for proper values.

## Architecture

The application follows Domain-Driven Design and Ports and Adapters (Hexagonal) architecture described in detail in [docs/architecture-and-patterns.md](docs/architecture-and-patterns.md)

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Local PostgreSQL Container

Start a local PostgreSQL container for development:

```bash
docker run -d \
  --name -postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=devices \
  -p 5432:5432 \
  postgres:17.5-alpine
```

The connection URI for this container would be:

```
postgresql://postgres:postgres@localhost:5432/devices
```

You can construct the connection URI using this format:

```
postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

To stop and remove the container:

```bash
docker stop postgres
docker rm postgres
```

The container configuration can be used to set up your `.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devices
```

### Development Server

Start the development server:

```bash
npm run start:dev
```

backend will be exposed locally under `localhost:3001` to check it call:

```bash
curl -f http://localhost:3001/health
```

```Powershell
Invoke-RestMethod -Uri http://localhost:3001/health
```
