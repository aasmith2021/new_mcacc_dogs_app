# Agent Instructions

This document provides instructions for AI agents working with this codebase.

## Project Overview

This is a Next.js application built with TypeScript. It uses Material-UI for the user interface and includes web scraping functionalities. The primary purpose of this application is to display data that has been scraped from an external source.

## Getting Started

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm ci
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
3.  **Build the project for production:**
    ```bash
    npm run build
    ```
4.  **Run the production server:**
    ```bash
    npm run start
    ```

## Code Style and Conventions

*   **TypeScript:** All new code should be written in TypeScript to maintain consistency and type safety.
*   **ESLint:** This project uses ESLint for code linting. Before committing any changes, please run the linter to catch any potential issues:
    ```bash
    npm run lint
    ```
*   **Formatting:** Please maintain the existing code formatting.

## Project Structure

Here are some of the key files and directories in this project:

*   `src/app/`: This directory contains the main application pages.
*   `src/services/`: This directory holds the web scraping logic.
    *   `scrapeAnimalData.ts`: Scrapes detailed data for a specific animal.
    *   `scrapeAnimalIds.ts`: Scrapes a list of animal IDs.
    *   `scrapeNumberOfAnimals.ts`: Scrapes the total number of animals.
*   `src/types/`: This directory contains TypeScript type definitions.
*   `package.json`: This file lists the project's dependencies and scripts.

## Scraping

The application's scraping functionality is located in the `src/services` directory. When working with these files, please be mindful of the following:

*   **Error Handling:** Ensure that any new scraping logic includes robust error handling to prevent the application from crashing.
*   **Efficiency:** Write efficient scraping code to minimize the load on the target server.
*   **Data Models:** If you add new scraping functions, be sure to update the TypeScript types in `src/types/` to reflect the new data models.
