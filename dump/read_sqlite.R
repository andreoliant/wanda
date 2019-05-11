

# https://stackoverflow.com/questions/9802680/importing-files-with-extension-sqlite-into-r

library("RSQLite")
db <- dbConnect(drv = SQLite(), dbname = file.path(getwd(), "instance", "engine.sqlite"))

# list all tables
tables <- dbListTables(db)

## exclude sqlite_sequence (contains table information)
tables <- tables[tables != "sqlite_sequence"]


players <- dbGetQuery(conn=db, statement=paste("SELECT * FROM '", tables[[1]], "'", sep=""))


dbDisconnect() 
