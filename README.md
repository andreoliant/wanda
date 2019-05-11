# wanda

# Local setup
Install git

Install node.js

# Download
On Terminal:

```bash
cd PATH-TO-FOLDER/wanda
git init 
git config user.name "YOUR-NAME"
git config user
git remote add origin http://github.com/andreoliant/wanda.git
git pull origin master
# do something, then upload to GitHub
git status
git add . # OR: git add "FILE-NAME.FILE-EXTENSION"
git commit -m "SOME-DESCRIPTION"
git push -u origin master
```

# Node setup
On Terminal:

```bash
cd PATH-TO-FOLDER/wanda/calcio
npm install express
npm install pug
npm install react react-dom
npm install babel-cli@6 babel-preset-react-app@3
npm install sqlite3
```
# Run
On Terminal:

```bash
cd PATH-TO-FOLDER/wanda/calcio
node server
```
Then browse to http://localhost:5000
