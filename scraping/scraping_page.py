# codice che fa scraping della singola pagina

# libs
import os
import requests
from bs4 import BeautifulSoup
import re
import csv
import json
import time
#import scrape_fifa
out_folder = os.path.join(os.getcwd(), '_output')
in_folder = os.path.join(os.getcwd(), '_input')
in_file = os.path.join(in_folder, 'link.csv')
url_base = 'http://www.fifaindex.com'
with open(in_file, mode='r') as csv_file:
    reader = csv.DictReader(csv_file)
    navigator = [r for r in reader]
url_list = [item['LINK'] for item in navigator]
for url_add in url_list:
    # settings

        # url_base serve per il ciclo sulle pagine dei singoli giocatori
        #url_base2 = 'http://www.fifaindex.com/it/players/'
        # url_base serve per il ciclo sulle pagine degli elenchi dei giocatori
    players={}
    print(url_add)
    #url='https://www.fifaindex.com/it/player/227064/ilaria-mauro/'
    #url='https://www.fifaindex.com/it/player/227125/samantha-kerr/'
    #url='https://www.fifaindex.com/it/player/201179/antonio-donnarumma/'
    #url='https://www.fifaindex.com/it/player/158023/lionel-messi/'
    #url='https://www.fifaindex.com/it/player/193080/de-gea/'
    url = url_base + url_add
    id=url.split('/')[5]
    players['id'] = url.split('/')[5]
    page = requests.get(url)
    #parsing html page in una lista di oggetti "usabile da python"
    soup = BeautifulSoup(page.text, 'html.parser')
    #soup_lg8 parte con info utili
    soup_lg8 = soup.find('div',{'class':'col-lg-8'})
    #soup1 primo blocco
    soup1 = soup_lg8.find('div',{'class':'row pt-3'})
    # blocco 1 -> nome + nazionalità
    nome = soup1.find('div',{'class':'align-self-center pl-3'}).find('h1').text
    players['nome'] = nome
    nazionalita = soup1.find('div',{'class':'align-self-center pl-3'}).find('h2').text
    players['naz'] = nazionalita
    # blocco 2
    soup2 = soup1.find('div',{'class':'card mb-5'})
    #blocco 2a -> valore tot + valore pot
    appo = soup2.find('h5',{'class':'card-header'})

    valtot = appo.find_all('span')[1].text
    players['valtot'] = valtot
    valpot = appo.find_all('span')[2].text
    players['valpot'] = valpot
    #blocco 2b -> valore tot + valore pot
    appo = soup2.find('div',{'class':'card-body'})
    altezza = appo.find(string=re.compile("Altezza ")).parent.find('span',{'class':'data-units data-units-metric'}).text
    players['altezza'] = altezza
    peso = appo.find(string=re.compile("Peso ")).parent.find('span',{'class':'data-units data-units-metric'}).text
    players['peso'] = peso
    piedepref = appo.find(string=re.compile("Piede preferito ")).parent.find('span',{'class':'float-right'}).text
    players['piedepref'] = piedepref
    datanasc = appo.find(string=re.compile("Data di nascita ")).parent.find('span',{'class':'float-right'}).text
    players['datanasc'] = datanasc
    eta = appo.find(string=re.compile("Età ")).parent.find('span',{'class':'float-right'}).text
    players['eta']=eta
    ruoli = appo.find(string=re.compile("Ruoli preferiti ")).parent
    titoli = ruoli.find_all(title=True)
    players['pos']=[titolo.text for titolo in titoli]
    rend = appo.find(string=re.compile("Rendimento giocatore ")).parent.find('span',{'class':'float-right'}).text
    players['rend'] = rend
    piede_deb = appo.find(string=re.compile("Piede debole ")).parent
    piede_deb1 = piede_deb.find_all('i',{'class':'fas fa-star fa-lg'})
    players['piededeb'] = len(piede_deb1)
    mosseab = appo.find(string=re.compile("Mosse abilità ")).parent
    mosseab1 = mosseab.find_all('i',{'class':'fas fa-star fa-lg'})
    players['mosseab'] = len(mosseab1)
    try:
        valore_e = appo.find(string=re.compile("Valore ")).parent.find('span',{'class':'float-right'}).text
        players['valore_e'] = valore_e
    except:
        players['valore_e'] = ''
    try:
        stipendio_e = appo.find(string=re.compile("Stipendio ")).parent.find('span',{'class':'float-right'}).text
        players['stipendio_e'] = stipendio_e
    except:
        players['stipendio_e'] = ''
    #blocco 3 -> to do blocco squadra nazionale/club
    try:
        squadra_team = soup_lg8.find(string=re.compile("Entrato nel club ")).findParent().findParent().findParent().findParent()
        squadre = squadra_team.findParent()
        if(str(squadre)==str('<div class="row">\n') + str(squadra_team) + str('\n</div>')):
            players['naz_team']=''
            players['naz_pos']=''
            players['naz_maglia']=''
            players['club_team']=squadra_team.find('h5',{'class':'card-header'}).text
            players['club_pos']= squadra_team.find(string=re.compile("Posizione ")).parent.find('span',{'class':'float-right'}).text
            players['club_maglia']= squadra_team.find(string=re.compile("Numero di maglia ")).parent.find('span',{'class':'float-right'}).text
            players['club_dt_ent']= squadra_team.find(string=re.compile("Entrato nel club ")).parent.find('span',{'class':'float-right'}).text
            players['club_dur_ctr']= squadra_team.find(string=re.compile("Durata Contratto ")).parent.find('span',{'class':'float-right'}).text
        else:
            players['naz_team']=squadre.find('h5',{'class':'card-header'}).text
            players['naz_pos']=squadre.find(string=re.compile("Posizione ")).parent.find('span',{'class':'float-right'}).text
            players['naz_maglia']=squadre.find(string=re.compile("Numero di maglia ")).parent.find('span',{'class':'float-right'}).text
            players['club_team']=squadra_team.find('h5',{'class':'card-header'}).text
            players['club_pos']= squadra_team.find(string=re.compile("Posizione ")).parent.find('span',{'class':'float-right'}).text
            players['club_maglia']= squadra_team.find(string=re.compile("Numero di maglia ")).parent.find('span',{'class':'float-right'}).text
            players['club_dt_ent']= squadra_team.find(string=re.compile("Entrato nel club ")).parent.find('span',{'class':'float-right'}).text
            players['club_dur_ctr']= squadra_team.find(string=re.compile("Durata Contratto ")).parent.find('span',{'class':'float-right'}).text
    except:
        squadre=soup_lg8.find(string=re.compile("Numero di maglia ")).findParent().findParent().findParent()
        players['naz_team']=squadre.find('h5',{'class':'card-header'}).text
        players['naz_pos']=squadre.find(string=re.compile("Posizione ")).parent.find('span',{'class':'float-right'}).text
        players['naz_maglia']=squadre.find(string=re.compile("Numero di maglia ")).parent.find('span',{'class':'float-right'}).text
        players['club_team']=''
        players['club_pos']= ''
        players['club_maglia']= ''
        players['club_dt_ent']= ''
        players['club_dur_ctr']= ''
    abilita= soup_lg8.find(string=re.compile("Abilità Con La Palla")).findParent().findParent()
    players['contr_palla']= abilita.find(string=re.compile("Contr. palla ")).parent.find('span',{'class':'float-right'}).text
    players['dribbling']= abilita.find(string=re.compile("Dribbling ")).parent.find('span',{'class':'float-right'}).text

    difesa= soup_lg8.find(string=re.compile("Difesa")).findParent().findParent()
    players['marcatura']= difesa.find(string=re.compile("Marcatura ")).parent.find('span',{'class':'float-right'}).text
    players['scivolata']= difesa.find(string=re.compile("Scivolata ")).parent.find('span',{'class':'float-right'}).text
    players['contr_piedi']= difesa.find(string=re.compile("Contr. piedi ")).parent.find('span',{'class':'float-right'}).text

    mentale= soup_lg8.find(string=re.compile("Mentale")).findParent().findParent()
    players['aggressivita']= mentale.find(string=re.compile("Aggressività ")).parent.find('span',{'class':'float-right'}).text
    players['reattivita']= mentale.find(string=re.compile("Reattività ")).parent.find('span',{'class':'float-right'}).text
    players['pos_attacco']= mentale.find(string=re.compile("Pos. attacco ")).parent.find('span',{'class':'float-right'}).text
    players['intercetta']= mentale.find(string=re.compile("Intercettaz. ")).parent.find('span',{'class':'float-right'}).text
    players['visione']= mentale.find(string=re.compile("Visione ")).parent.find('span',{'class':'float-right'}).text
    players['freddezza']= mentale.find(string=re.compile("Freddezza ")).parent.find('span',{'class':'float-right'}).text

    passag= soup_lg8.find(string=re.compile("Passag.")).findParent().findParent()
    players['cross']= passag.find(string=re.compile("Cross ")).parent.find('span',{'class':'float-right'}).text
    players['pass_corto']= passag.find(string=re.compile("Pass. corto ")).parent.find('span',{'class':'float-right'}).text
    players['pass_lungo']= passag.find(string=re.compile("Pass. lungo ")).parent.find('span',{'class':'float-right'}).text

    fisico= soup_lg8.find(string=re.compile("Fisico")).findParent().findParent()
    players['acceleraz']= fisico.find(string=re.compile("Acceleraz. ")).parent.find('span',{'class':'float-right'}).text
    players['resistenza']= fisico.find(string=re.compile("Resistenza ")).parent.find('span',{'class':'float-right'}).text
    players['forza']= fisico.find(string=re.compile("Forza ")).parent.find('span',{'class':'float-right'}).text
    players['equilibrio']= fisico.find(string=re.compile("Equilibrio ")).parent.find('span',{'class':'float-right'}).text
    players['vel_scatto']= fisico.find(string=re.compile("Vel. scatto ")).parent.find('span',{'class':'float-right'}).text
    players['agilita']= fisico.find(string=re.compile("Agilità ")).parent.find('span',{'class':'float-right'}).text
    players['elevazione']= fisico.find(string=re.compile("Elevazione ")).parent.find('span',{'class':'float-right'}).text

    tiri= soup_lg8.find(string=re.compile("Tiri")).findParent().findParent()
    players['colpo_testa']= tiri.find(string=re.compile("Colpo di testa")).parent.find('span',{'class':'float-right'}).text
    players['pot_tiro']= tiri.find(string=re.compile("Pot. tiro ")).parent.find('span',{'class':'float-right'}).text
    players['finalizzaz']= tiri.find(string=re.compile("Finalizzaz. ")).parent.find('span',{'class':'float-right'}).text
    players['tiri_dist']= tiri.find(string=re.compile("Tiri dist. ")).parent.find('span',{'class':'float-right'}).text
    players['effetto']= tiri.find(string=re.compile("Effetto ")).parent.find('span',{'class':'float-right'}).text
    players['prec_puniz']= tiri.find(string=re.compile("Prec. puniz. ")).parent.find('span',{'class':'float-right'}).text
    players['rigori']= tiri.find(string=re.compile("Rigori ")).parent.find('span',{'class':'float-right'}).text
    players['tiri_volo']= tiri.find(string=re.compile("Tiri al volo ")).parent.find('span',{'class':'float-right'}).text

    portiere= soup_lg8.find(string=re.compile("Portiere")).findParent().findParent()
    players['piazzamento']= portiere.find(string=re.compile("Piazzamento ")).parent.find('span',{'class':'float-right'}).text
    players['tuffo']= portiere.find(string=re.compile("Tuffo ")).parent.find('span',{'class':'float-right'}).text
    players['presa']= portiere.find(string=re.compile("Presa ")).parent.find('span',{'class':'float-right'}).text
    players['rinvio']= portiere.find(string=re.compile("Rinvio ")).parent.find('span',{'class':'float-right'}).text
    players['riflessi']= portiere.find(string=re.compile("Riflessi ")).parent.find('span',{'class':'float-right'}).text

    try:
        caratteristiche= soup_lg8.find(string=re.compile("Caratteristiche")).findParent().findParent()
        cars = caratteristiche.find_all('p')
        players['caratteristiche']=[car.text for car in cars]
    except :
        players['caratteristiche']=[]
    try:
        specialita= soup_lg8.find(string=re.compile("Specialità")).findParent().findParent()
        specs = specialita.find_all('p')
        players['specialita']=[spec.text for spec in specs]
    except:
        players['specialita']=[]
    nome_file=id+'.json'
    out_file = os.path.join(out_folder,nome_file)
    with open(out_file, 'w') as outfile:
        json.dump(players, outfile)

    time.sleep(5)



#links=soup3.findAll('tr')
#for link in links:
#    pippo=link.find('a',{'class':'link-player'})
