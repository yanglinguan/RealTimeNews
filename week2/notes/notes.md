# Note 2017/07/07 lec1
## package.json
*   package.json recode all the dependences including version number
*   devDependencied does not go into production
* typescript cannot run in brower, so not in production
* scripts: can be defined by ourselives
* e2e is for test
* lint is for syntax check
## .angular-cli.json
* angular configration
* outDir: the directory to store the files after build
* styles: globle styles, such as bootstrap
* scripts: third-party scripts 
* environments: developement mode or production mode
* e2e: test config
* lint: syntax config
## node_modules
* does not push to git
* gitignore includes all the files in the node_modules
* to get node_modules, use npm install. it will download all the dependenices specified in the package.json ( will it install the devDependencies?)

## Scripts
* ng server: build the project, start the server

## When start server...
* in the .angular-cli.json, it specifies the "index". When the app starts, it will load the index.html file
* In the index.html, it has a "app-root" type, called "selector" which defines on app.component.ts
* In the main.tx, it bootstrap AppModule which is app.module.ts
* In the app.module.ts, it tells us what module we need to load the app. It includes BrowerModule since we run the app on a brower. it needs AppComponent as well
* In app.Component.ts (view + model), it defines selector, template url(view), styleurls(css file)
* create component: ng g c
* g: generate c: component 

* bootstrap dependency: juery
* To input bootstrap, add to .angular-cli.json
* add css to "styles", and .js files to "scripts"
* juery.js must be imported before bootstrap.js
* everytime angular-cli.json is modified, need re-build, run ng server again or npm start
* In index.html \<head\>, we cannot use the file in node\_modules files, we can use CDN, since in production, we don't have node\_modules directory
* We don't use the CDN since we dont want our prodcution dependes on the CDN

