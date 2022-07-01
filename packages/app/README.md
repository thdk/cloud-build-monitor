# CICCD app - Your cicd dashboard

## Setup for local development

This is a [Next.js](https://nextjs.org/) app. 
If you haven't used Nextjs yet, checkout [their docs](https://nextjs.org/docs).

### Setup your environment

Add a `.env` file

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxxx
NEXT_PUBLIC_REPO_REGEX=xxxxxx
JIRA_USER=xxxxxx
JIRA_PASSWORD=xxxxxx
JIRA_HOST=xxxxxx
GITHUB_TOKEN=xxxxxx
```

Note: you can get the firebase values in your firebase console or using **firebase-tools**.

```sh
npm i -g firebase-tools # only if you haven't installed firebase-tools yet
firebase login
firebase use YOUR-FIREBASE-PROJECT
firebase apps:sdkconfig # this one will print the values you need
```

### Install dependencies

```sh
yarn install
```

### Run the development server

```sh
yarn dev
```

### Open the app

[http://localhost:3000](http://localhost:3000)

