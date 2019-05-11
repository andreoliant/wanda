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

appo <- read_lines("teams.txt") %>%
  str_split("\\|") %>%
  unlist() %>%
  str_split("\\:") 

bind_rows(appo)

# convert to df
get_teams <- function(x) {
  df <- data_frame()
  df[1, "id_team"] <- str_pad(x[1], 4, pad = "0") 
  df[1, "club_team"] <- x[2]
  return(df)
}

teams_list <- bind_rows(lapply(appo, get_teams))

teams %>%
  anti_join(teams_list)

teams_list %>%
  anti_join(teams)

# WARNING: gli "id" presenti in quesot file non corrispondono alle url quindi è inutile prederli...





# --------------------------------------------------------------------------- #
# elenco campionati (e match con team)




# --------------------------------------------------------------------------- #
# db

# crea db
db <- dbConnect(SQLite(), file.path(DB, "wanda.sqlite"))

# write table
dbWriteTable(db, "players", players, overwrite=TRUE, row.names=FALSE)

# DEBUG:
# chk <- dbReadTable(db, "players")

# chiude
dbDisconnect(db)
# MEMO: copiare a mano il db in webapp
