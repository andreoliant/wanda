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
git config user.email "YOUR-EMAL"
git remote add origin http://github.com/andreoliant/wanda.git
git pull origin master
```

# Node setup
On Terminal:

```bash
cd PATH-TO-FOLDER/wanda/calcio
npm install
```
# Run
On Terminal:

```bash
cd PATH-TO-FOLDER/wanda/calcio
node server
```
Then browse to http://localhost:5000

# Edit and upload to GitHub
On Terminal:

```bash
cd PATH-TO-FOLDER/wanda
git status
git pull origin master
# do something, then upload to GitHub
git add . # OR: git add "FILE-NAME.FILE-EXTENSION"
git commit -m "SOME-DESCRIPTION"
git push -u origin master
# insert user & pw (only the first time)
```
