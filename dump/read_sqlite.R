

# https://stackoverflow.com/questions/9802680/importing-files-with-extension-sqlite-into-r

library("RSQLite")
# db <- dbConnect(drv = SQLite(), dbname = file.path(getwd(), "instance", "engine.sqlite"))
db <- dbConnect(SQLite(), file.path(DB, "wanda.sqlite"))


# list all tables
tables <- dbListTables(db)

## exclude sqlite_sequence (contains table information)
tables <- tables[tables != "sqlite_sequence"]

tab <- "players"
schema <- dbGetQuery(db, "select * from sqlite_master where tbl_name = :x", params = list(x = tab))[["sql"]]
cat(schema)

players <- dbGetQuery(conn=db, statement=paste("SELECT * FROM '", tables[[2]], "'", sep=""))


dbDisconnect() 

dbGetQuery(db, "select data_nasc format dmmyy10.,* from players")


