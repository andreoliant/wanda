# crea DB per wanda
rm(list = ls())

# libs
library("tidyverse")
library("jsonlite")
library("lubridate")
library("DBI")
library("RSQLite")

# paths
DATA <- file.path(dirname(getwd()), "scraping", "_dump")
DB <- file.path(getwd(), "db")
in_path <- file.path(getwd(), "_input")
out_path <- file.path(getwd(), "_output")

# nav
json_list <- list.files(path=DATA)
# json_list <- json_list[1:10]

# def
read_json <- function(json_file) {
  # DEBUG: json_file <- json_list[1]
  
  json_path <- file.path(DATA, json_file)
  json_data <- fromJSON(json_path)
  
  # replace NULL with NA
  json_data[sapply(json_data, is.null)] <- NA
  
  # remove nested fields
  # json_data$pos <- NA
  # json_data$caratteristiche <- NA
  # json_data$specialita <- NA
  
  # convert to df
  df <- data_frame()
  for (vbl in names(json_data)) {
    # DEBUG: vbl <- "caratteristiche"
    temp <- json_data[[vbl]]
    if (length(temp) == 1) {
      df[1, vbl] <- temp
    } else if (length(temp) > 1) {
      # MEMO: collapse nested fields
      df[1, vbl] <- paste(temp, collapse=":::")
    # } else if (is.list(temp)) {
    } else if (length(temp) == 0) {
      # MEMO: rempve empty list
      df[1, vbl] <- NA
    } else {
      df[1, vbl] <- "chk"
    }
  }
  return(df)
}

# loads
players_raw <- bind_rows(lapply(json_list, read_json))

# clean
players <- players_raw %>%
  # 1:N per posizione
  mutate(pos_all = pos) %>%
  mutate(pos = str_split(pos, ":::", simplify = TRUE)[,1]) %>%
  # clean per tipi
  mutate(valtot = as.numeric(valtot),
         valpot = as.numeric(valpot),
         altezza = as.numeric(str_trim(sub("cm", "", altezza))),
         peso = as.numeric(str_trim(sub("kg", "", peso))),
         datanasc = dmy(datanasc),
         eta = floor(interval(datanasc, today()) / years(1)),
         valore_e = as.numeric(str_trim(gsub("\\.", "", valore_e))),
         club_dt_ent = dmy(club_dt_ent),
         club_dur_ctr = as.numeric(club_dur_ctr),
         stipendio_e = as.numeric(str_trim(gsub("\\.", "", stipendio_e))),
         club_team = str_trim(club_team),
         naz_team = str_trim(naz_team),
         # Caratteristiche
         contr_palla = as.numeric(contr_palla),
         dribbling = as.numeric(dribbling),
         marcatura = as.numeric(marcatura),
         scivolata = as.numeric(scivolata),
         contr_piedi = as.numeric(contr_piedi),
         aggressivita = as.numeric(aggressivita),
         reattivita = as.numeric(reattivita),
         pos_attacco = as.numeric(pos_attacco),
         intercetta = as.numeric(intercetta),
         visione = as.numeric(visione),
         freddezza = as.numeric(freddezza),
         cross = as.numeric(cross),
         pass_corto = as.numeric(pass_corto),
         pass_lungo = as.numeric(pass_lungo),
         acceleraz = as.numeric(acceleraz),
         resistenza = as.numeric(resistenza),
         forza = as.numeric(forza),
         equilibrio = as.numeric(equilibrio),
         vel_scatto = as.numeric(vel_scatto),
         agilita = as.numeric(agilita),
         elevazione = as.numeric(elevazione),
         colpo_testa = as.numeric(colpo_testa),
         pot_tiro = as.numeric(pot_tiro),
         finalizzaz = as.numeric(finalizzaz),
         tiri_dist = as.numeric(tiri_dist),
         effetto = as.numeric(effetto),
         prec_puniz = as.numeric(prec_puniz),
         tiri_volo = as.numeric(tiri_volo),
         rigori = as.numeric(rigori),
         piazzamento = as.numeric(piazzamento),
         tuffo = as.numeric(tuffo),
         presa = as.numeric(presa),
         rinvio = as.numeric(rinvio),
         riflessi = as.numeric(riflessi)
         ) %>%
  # ordina variabili (come da scraping)
  select("id", "nome", "naz",
         "valtot", "valpot",
         "altezza", "peso", "piedepref", "datanasc", "eta", 
         "pos", "pos_all", 
         "rend", 
         "piededeb", "mosseab", 
         "valore_e",  
         # Club
         "club_team", "club_pos", "club_maglia", "club_dt_ent", "club_dur_ctr", "stipendio_e",
         # Nazionale
         "naz_team", "naz_pos", "naz_maglia", 
         # Abilità con la palla
         "contr_palla", "dribbling", 
         # Difesa
         "marcatura", "scivolata", "contr_piedi", 
         # Mentale
         "aggressivita", "reattivita", "pos_attacco", "intercetta", "visione", "freddezza", 
         # Passaggi
         "cross", "pass_corto", "pass_lungo", 
         # Fisico
         "acceleraz", "resistenza", "forza", "equilibrio", "vel_scatto", "agilita", "elevazione",
         # Tiro
         "colpo_testa", "pot_tiro", "finalizzaz", "tiri_dist", "effetto", "prec_puniz", "tiri_volo", "rigori", 
         # Portiere
         "piazzamento", "tuffo", "presa", "rinvio", "riflessi",
         # Caratteristiche
         "caratteristiche", 
         # Specialità
         "specialita",
         # Utility
         "photo_folder"  
  )

# fix nations
# MEMO: nasce da summary sotto
players <- players %>%
  mutate(naz_team = case_when(naz_team == club_team ~ "",
                              TRUE ~ naz_team))

# temp <- nations %>%
#   anti_join(countries %>%
#               rename(naz_team = naz),
#             by = "naz_team") %>%
#   filter(naz_team != "Stati Uniti" & naz_team != "")
# CHK: e per "Svincolati"?

# appo <- players %>%
#   select(id, naz, naz_team, club_team) %>%
#   semi_join(temp, by = "naz_team") %>%
#   mutate(chk = naz_team == club_team)
# MEMO: club_team è duplicato in naz_team

# export
write.csv2(players, file.path(out_path, "players.csv"), row.names = FALSE)


# --------------------------------------------------------------------------- #
# summary

teams <- players %>%
  count(club_team)

nations <- players %>%
  count(naz_team)

countries <- players %>%
  count(naz)

teams_players <- players %>%
  distinct(club_team, id, nome) %>%
  arrange(club_team, nome)

roles  <- players %>%
  count(pos, pos_all) %>%
  arrange(desc(n))


# ranks
chk <- players %>%
  select(id, nome, club_team, valtot, pos, eta, naz) %>%
  arrange(desc(valtot)) %>%
  filter(valtot > 80)


# single team
chk <- players %>%
  filter(club_team == "Milan")
chk <- players %>%
  filter(naz_team == "Italia")


# --------------------------------------------------------------------------- #
# team list

# appo <- read_lines("teams.txt") %>%
#   str_split("\\|") %>%
#   unlist() %>%
#   str_split("\\:") 
# 
# bind_rows(appo)
# 
# # convert to df
# get_teams <- function(x) {
#   df <- data_frame()
#   df[1, "id_team"] <- str_pad(x[1], 4, pad = "0") 
#   df[1, "club_team"] <- x[2]
#   return(df)
# }
# 
# teams_list <- bind_rows(lapply(appo, get_teams))
# 
# teams %>%
#   anti_join(teams_list)
# 
# teams_list %>%
#   anti_join(teams)

# WARNING: gli "id" presenti in quesot file non corrispondono alle url quindi è inutile prederli...

# reload
players <- read_csv2(file.path(out_path, "players.csv"))

# load
teams_raw <- read_csv(file.path(in_path, "teams_temp.csv"))

chk <- players %>% anti_join(teams_raw, by = "club_team")
chk %>% count(club_team)
# club_team           n
# 1 Changchun Yatai     2
# 2 San Luis            1
# 3 Svincolati         93

chk <- teams_raw %>% anti_join(players, by = "club_team")
chk %>% count(nome_lega)
# nome_lega              n
# 1 3. Liga               15
# 2 Allsvenskan            2
# 3 Camp. Scotiabank       2
# 4 Domino's Ligue 2       2
# 5 EFL League One        20
# 6 EFL League Two        19
# 7 Ekstraklasa            2
# 8 Eliteserien           10
# 9 Eredivisie             2
# 10 K-League 1             1
# 11 Liga Dimayor           4
# 12 Meiji Yasuda J1        2
# 13 Ö. Bundesliga          6
# 14 Scottish Prem          5
# 15 SSE Airtricity Lge     2
# 16 Superliga              7

# clean
teams <- teams_raw %>%
  mutate(id_team = str_pad(gsub('/it/team/([0-9]*)/.*', '\\1', link_team), 6, pad = "0"),
         id_league = str_pad(gsub('/it/teams/\\?league=([0-9]*)', '\\1', link_lega), 4, pad = "0")) %>%
  select(id_team, club_team, id_league, nome_lega)

players <- players %>%
  left_join(teams %>%
              select(id_team, club_team), 
            by = "club_team")

# export
write.csv2(players, file.path(out_path, "players.csv"), row.names = FALSE)


# --------------------------------------------------------------------------- #
# elenco campionati (e match con team)

leagues <- teams %>%
  distinct(id_league, nome_lega)


# --------------------------------------------------------------------------- #
# posizioni

positions <- players %>%
  select(pos_all) %>%
  mutate(pos_all = str_split(pos_all, ":::", simplify = TRUE)) 

# matrice delle combinazioni distinct di ruoli
appo <- unique(str_split(players$pos_all, ":::", simplify = TRUE))

# accoda ogni colonna in appo in unico vettore
memo <- c()
temp <- sapply(appo, function(x) {memo <- c(memo, x)})

# arrange
positions <- unique(temp)
positions <- positions[which(positions != "")]
pos_levels <- c("POR", "DC", "TD", "TS", "ADA", "ASA", "CDC", "CC", 
                "ED", "ES", "COC", "AD",  "AS",  "AT",  "ATT")
# HAND: da integrare a mano se compaiono altri ruoli
postions <- factor(positions, levels = pos_levels)
postions <- postions[order(postions)]                                             

# TODO: da inserire nel DB


# --------------------------------------------------------------------------- #
# db

# crea db
db <- dbConnect(SQLite(), file.path(DB, "wanda.sqlite"))

# write table
dbWriteTable(db, "players", players, overwrite=TRUE, row.names=FALSE)
dbWriteTable(db, "teams", teams, overwrite=TRUE, row.names=FALSE)
dbWriteTable(db, "leagues", leagues, overwrite=TRUE, row.names=FALSE)

# DEBUG:
# chk <- dbReadTable(db, "players")

# chiude
dbDisconnect(db)
# MEMO: copiare a mano il db in webapp

# CREATE TABLE `players` (
#   `id` TEXT,
#   `nome` TEXT,
#   `naz` TEXT,
#   `valtot` INTEGER,
#   `valpot` INTEGER,
#   `altezza` INTEGER,
#   `peso` INTEGER,
#   `piedepref` TEXT,
#   `datanasc` REAL,
#   `eta` INTEGER,
#   `pos` TEXT,
#   `pos_all` TEXT,
#   `rend` TEXT,
#   `piededeb` INTEGER,
#   `mosseab` INTEGER,
#   `valore_e` REAL,
#   `club_team` TEXT,
#   `club_pos` TEXT,
#   `club_maglia` INTEGER,
#   `club_dt_ent` REAL,
#   `club_dur_ctr` INTEGER,
#   `stipendio_e` REAL,
#   `naz_team` TEXT,
#   `naz_pos` TEXT,
#   `naz_maglia` INTEGER,
#   `contr_palla` INTEGER,
#   `dribbling` INTEGER,
#   `marcatura` INTEGER,
#   `scivolata` INTEGER,
#   `contr_piedi` INTEGER,
#   `aggressivita` INTEGER,
#   `reattivita` INTEGER,
#   `pos_attacco` INTEGER,
#   `intercetta` INTEGER,
#   `visione` INTEGER,
#   `freddezza` INTEGER,
#   `cross` INTEGER,
#   `pass_corto` INTEGER,
#   `pass_lungo` INTEGER,
#   `acceleraz` INTEGER,
#   `resistenza` INTEGER,
#   `forza` INTEGER,
#   `equilibrio` INTEGER,
#   `vel_scatto` INTEGER,
#   `agilita` INTEGER,
#   `elevazione` INTEGER,
#   `colpo_testa` INTEGER,
#   `pot_tiro` INTEGER,
#   `finalizzaz` INTEGER,
#   `tiri_dist` INTEGER,
#   `effetto` INTEGER,
#   `prec_puniz` INTEGER,
#   `tiri_volo` INTEGER,
#   `rigori` INTEGER,
#   `piazzamento` INTEGER,
#   `tuffo` INTEGER,
#   `presa` INTEGER,
#   `rinvio` INTEGER,
#   `riflessi` INTEGER,
#   `caratteristiche` TEXT,
#   `specialita` TEXT,
#   `photo_folder` INTEGER,
#   `id_team` TEXT
# )




