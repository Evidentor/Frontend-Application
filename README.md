# Frontend-Application

## About
The Frontend App provides a user interface for managing and visualizing 
system data. It includes master data screens for managing users, assets, 
and permissions, interactive building visualizations, and displays of user 
presence across rooms and floors.

## System Requirements

- NodeJS (used version: 20.17.0)
- npm (used version: 11.3.0)
- Docker (if running the service within the Docker container)

## Configuration

### API Gateway
Configure API Gateway connection in `config.js` file:
```js
export const API_GATEWAY_URL = 'http://localhost:8080';
```

## How to Install?

### 1. Clone the repository
```shell
git clone https://github.com/Evidentor/Frontend-Application.git
cd Frontend-Application
```

### 2. Install dependencies
```shell
npm install
```

## How to Run?
### Run with npm
```shell
npm run dev
```

### Run with docker
#### 1. Build the docker image
```shell
docker build -t frontend-application .
```

#### 2. Create the docker container
```shell
docker run -d --network host --name frontend-application frontend-application:latest
```

#### 3. Stop the docker container
```shell
docker stop frontend-application
```

#### 4. Start the docker container
```shell
docker start frontend-application
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
