# MusicPopularity

<p>Recommended to run on google chrome</p>

<h3>To Use Locally</h3>
1) Fork Repo<br>
2) git remote add origin \<your forked repo\><br>
3) git remote add masterRepo https://github.com/Milind905/test.git<br>
4) npm install, bower install<br>
5) npm start<br>
6) Go to localhost:3000 on a browser<br>

<h3>Recommended method to work on features</h3>
1) git pull masterRepo master (to get latest code)<br>
2) Create new branch locally per ticket/feature<br> 
3) Once finished the ticket/feature, create pull request WITH branch to the masterRepo: git push masterProject \<branchName\><br>
4) Code will be reviewed then merged (or declined)<br>
5) Delete branch once code is merged<br>

<h3>Initial Project Layout</h3>
app.js(Node, Express, Mongo setup)<br>
/bin<br>
---> www.exe (Express server setup, port = 3000)<br>
/resources (Where api requests go (CRUD operations))<br>
/routes (Redirect CRUD operation to correct page/endpoint)<br>
---> index.js (Loads angular template)<br>
---> apiRoutes.js (Redirect api requests to resources)<br>
/views (Loads all angular and other front-end resources required)<br>
---> index.ejs (Load and Inject angular templates into view)<br>
---> error.ejs (For dev environment, displays errors and stack trace)<br>
/public (All front-end files go here)<br>
---> /bower_components<br>
---> /fonts<br>
---> /images<br>
---> /styles (Custom CSS)<br>
---> /views (All angular templates)<br>
---> /scripts (All other angular components)<br>
------> angularApp.js (Contains main module with all dependencies)<br>
------> router.js (Angular routing to correct template)<br>
------> /controllers<br>
------> /directives<br>
------> /filters<br>
------> /services<br>



