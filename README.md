# NeverpileWebAdmin

## Installation
1. Clone the repository to your local computer using git.
2. Make sure that you have Node 10.9 or later installed.
3. Install angular CLI using: `npm install -g @angular/cli`.
4. Get all Project dependencies by navigating to the project root directory, where the `package.json` is located and simply run: `npm install`.

## Development server

Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name --module=app.module` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use `npm run build` or `ng build --prod --build-optimizer` for a production build.

## Docker

`ng build`
`docker build -t neverpile-client  .`
`docker run -p 80:80 --name neverpile-client neverpile-client:latest`
`localhost:80`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
