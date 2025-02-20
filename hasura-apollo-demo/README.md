# Hasura Apollo Demo
This repository contains a demo project showcasing the integration of Hasura with Apollo Client. The project demonstrates how to set up and use GraphQL APIs with Hasura and Apollo Client in a React application.

# Table of Contents
Introduction
Features
Prerequisites
Installation
Usage
Project Structure
Contributing
License
Introduction
The Hasura Apollo Demo project is designed to help developers understand how to integrate Hasura GraphQL Engine with Apollo Client in a React application. This demo covers the basics of setting up a Hasura backend, configuring Apollo Client, and performing GraphQL queries and mutations.

# Features
GraphQL API: Powered by Hasura GraphQL Engine.
Apollo Client: State management and data fetching.
React: Frontend framework for building user interfaces.
Real-time Updates: Using GraphQL subscriptions.

# Prerequisites
Before you begin, ensure you have the following installed:
Node.js (v14 or later)
npm or yarn
Docker (for running Hasura locally)


Installation
Clone the repository: git clone https://github.com/snanne/my-learnings.git
cd my-learnings/hasura-apollo-demo

Install dependencies:
npm install or yarn install

Start Hasura:
Ensure Docker is running, then start Hasura using Docker Compose:
docker-compose up -d

Apply migrations:
Navigate to the Hasura console and apply any pending migrations.

Usage
Start the development server:
npm start or yarn start

Open your browser:
Visit http://localhost:3000 to see the application in action.

# Project Structure
    src/: Contains the React application source code.
    components/: Reusable React components.
    graphql/: GraphQL queries and mutations.
    App.js: Main application component.
    hasura/: Contains Hasura metadata and migrations.
    docker-compose.yml: Docker Compose configuration for Hasura.

# Contributing
  Contributions are welcome! Please fork the repository and create a pull request with your changes.
