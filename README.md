
## Dev Practices for Facticity

Create 'temp' branches while working on new features/bugs and merge into the primary branch

Wherever possible, create new components in order to prevent App.js from becoming bloated.

Add short comment lines to explain code flow and code blocks, so that it's easier for other devs who might work on the same code block in the future.

For using backend or API URLs, displaying long hardcoded texts -> create an entry in the config file, and import the key of the entry in code and use. This would facilitate easier reusability.

Eg: if a text that we are displaying, say 'Enter a Fact about someone or something and I will fact check it' needs to be updated, it can be easily changed just in the config file, instead of having to go through the code and find the div and make changes.

Usage of Feature Flags: It is recommended to have modular features, certain app behaviors (both frontend and backend) that can be toggled, under a Feature Flag. If the feature flag for a particular feature is set to True in the config file, then this feature would be displayed/used in the UI.  

Eg: Let's say that one feature/behavior of the application is referring to Knowledge Base. If the 'USE_KNOWLEDGE_BASE' flag is set to true in the config file, then in the code flow, knowledge base will be used. If set to false, then those code blocks should be skipped (which will be enforced by the boolean variable USE_KNOWLEDGE_BASE). 
If we want to turn off knowledge base, then instead of having to comment out all of the code blocks related to knowledge base, just changing the flag from true to false in the config file would be enough. This will automatically reflect in the entire code flow.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.





