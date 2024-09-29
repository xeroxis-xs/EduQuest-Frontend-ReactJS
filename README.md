# EduQuest Frontend

EduQuest Frontend is a React-based web application that interacts with Microsoft Graph API and other microservices. This project is containerized using Docker and deployed to Azure Web App.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with Azure AD
- Fetch user data from Microsoft Graph API
- Responsive design
- Integration with backend microservices

## Technologies

- **Languages**: TypeScript, JavaScript
- **Frameworks**: React, Next.js
- **Tools**: Docker, GitHub Actions, Azure Web App

## Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/eduquest-frontend.git
    cd eduquest-frontend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
    ```env
    NEXT_PUBLIC_SITE_URL=your_site_url
    NEXT_PUBLIC_AZURE_CLIENT_ID=your_azure_client_id
    NEXT_PUBLIC_AZURE_REDIRECT_URI=your_redirect_uri
    NEXT_PUBLIC_BACKEND_URL=your_backend_url
    NEXT_PUBLIC_MICROSERVICE_URL=your_microservice_url
    NEXT_PUBLIC_LOGIN_REQUEST_SCOPE=your_login_request_scope
    ```

## Usage

1. **Run the development server:**
    ```sh
    npm run dev
    ```

2. **Build the project:**
    ```sh
    npm run build
    ```

3. **Start the production server:**
    ```sh
    npm start
    ```

## Deployment

This project uses Docker for containerization and GitHub Actions for CI/CD.

1. **Build and push Docker image:**
    ```sh
    docker build -t your_dockerhub_username/eduquest-frontend .
    docker push your_dockerhub_username/eduquest-frontend
    ```

2. **Deploy to Azure Web App:**
   The deployment is automated using GitHub Actions. On every push to the `main` branch, the workflow defined in `.github/workflows/main_eduquest-frontend.yml` will build and deploy the Docker image to Azure Web App.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License.
