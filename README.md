## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Mars Colony WebApp Notes

Project based on Create-react-app React template. «Inject» command not needed. All required properties for webpack can be written in `config-overrides.js` file.

All required environment variables located in .env file. All of them is important for current functionality of the app.

Features control and some important about contracts located in settings folder (`index.ts` file).

All state-related code located in `redux` folder. We are using `redux-toolkit` to avoid boilerplate.

We have some amount of legacy code, which should be removed or reworked for our actual approach.

The application uses a hook-based approach. All main features are decomposed into hooks, all logic is encapsulated in them.

The main hooks to look out for are `usePersonalInfo` and `useBalance`. The first contains all hits of the contract and selectors associated with the user and his resources, the second - with the balance of the address.

The features' folder is the most important folder in the application. There is all the information and code for each of the features. everything related to this or that logical block will be in one folder.

`Contracts` folder includes actual contracts ABIs. Contracts are initialized in HOC called `dataProvider`.

The game component is made on `phaser3` JS game-engine. all code related to this area is located in the `classes` and `scenes` folders. Each scene is a separate screen of the game space.

`api` folder -- location for API-handling classes. There are those calls that do not depend on contracts, but refer directly to our backend.

For routing, we use the most popular library for this - `react-router V5`. The organization of routes inside the application is done in `router/index.tsx`.
