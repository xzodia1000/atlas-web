# atlas-web

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### **Setting up backend server**

- Install and setup MySQL from [here](https://dev.mysql.com/downloads/installer/).
- Create a database named `atlas`. (Query: `CREATE DATABASE atlas;`).
- Clone the `atlas-backend` repo.
- Run `npm i` inside the cloned repo.
- Make a file named `.env` and fill out the below variables with your MySQL setup:

```
DATABASE_HOST=localhost
DATABASE_USERNAME=your_sql_username
DATABASE_PASSWORD=your_sql_password
DATABASE_NAME=atlas
SECRET=any_random_value
```

- Run `npm run typeorm:run-migrations` to sync the database and tables to your local MySQL sevrver.
- To start the server, run `npm start`.

_IMPORTANT NOTES:_

- Do not forget your MySQL password.
- Setup Postman to manage the backend API and data for testing.
- Run `git pull` regularly to be updated with the backend end.
- Do not make any changes to the backend code without the backend team's permission.

### **Setting up the web frontend for development**

- Install nodejs version [18.12.1 LTS](https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi) from [here](https://nodejs.org/en/).
- Install `yarn` by following the below steps:
  - Run `corepack enable` in a terminal with admin powers.
  - Try running `yarn --version` in a terminal. If met with an error similar to
  ```
  yarn : File C:\Users\User\AppData\Roaming\npm\yarn.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at  https:/go.microsoft.com/fwlink/?LinkID=135170.
  ```
  Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted` in powershell with admin powers.
- Follow the steps [here](https://yarnpkg.com/getting-started/editor-sdks#editor-setup) to set up `yarn` for your editor.
- Clone this repo and run `yarn` inside the cloned directory.
- Run the development server using `yarn dev` and open [http://localhost:3001](http://localhost:3001).

_IMPORTANT NOTES:_

- Create a branch for every feature you are working on.
- Name the branch based on the feature.
- Open a pull request before merging to `master` branch.
- Run `git pull` regularly to be updated with the `master` branch.
- Create a `feature_name-styles.ts` file under the styles directory to write styles for your pages. Check `styles/login-styles.ts` for an example.

## Tools

Documentaion of the tools that are being used in the project. (They have been already added to the project)

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Axios Documentation](https://axios-http.com/docs/intro) - to communicate with the backend.
- [tanstack/react-query Documentaion](https://tanstack.com/query/v4/docs) - to handle the response from the backend.
- [Context API](https://reactjs.org/docs/context.html) - to replicate state management.
- [Chakra UI](https://chakra-ui.com/getting-started) - for replacing CSS to design the website.
