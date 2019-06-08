# codice che fa scraping della singola pagina

# libs
import os
import requests
from bs4 import BeautifulSoup
import re
import csv
import json
import time
# import scrape_fifa

# params
season = '0405'
nav_csv = 'link_' + season + '.csv'
last = 1343

# setup
out_folder = os.path.join(os.getcwd(), '_output', season)
in_folder = os.path.join(os.getcwd(), '_input')
in_file = os.path.join(in_folder, nav_csv)
url_base = 'http://www.fifaindex.com'

# navigator
with open(in_file, mode='r') as csv_file:
    reader = csv.DictReader(csv_file)
    navigator = [r for r in reader]

url_list = [item['LINK'] for item in navigator]
url_list = url_list[last:]

# loop
for i, url_add in enumerate(url_list):
    # debug
    # url_list = url_list[0:10]
    # MEMO: url_base serve per il ciclo sulle pagine dei singoli giocatori
    # url='https://www.fifaindex.com/it/player/227064/ilaria-mauro/'
    # url='https://www.fifaindex.com/it/player/227125/samantha-kerr/'
    # url='https://www.fifaindex.com/it/player/201179/antonio-donnarumma/'
    # url='https://www.fifaindex.com/it/player/158023/lionel-messi/'
    # url='https://www.fifaindex.com/it/player/193080/de-gea/'
    print(str(i + last) + ': ' + url_add)


    # init
    players = {}
    url = url_base + url_add
    temp = url.split('/')[5]
    id = "{:06d}".format(int(temp))
    # players['id'] = url.split('/')[5]
    players['id'] = id

    # scraping
    page = requests.get(url)
    # parsing html page in una lista di oggetti "usabile da python"
    # soup = BeautifulSoup(page.text, 'html.parser')
    encoding = page.encoding if 'charset' in page.headers.get('content-type', '').lower() else None
    soup = BeautifulSoup(page.content, 'html.parser', from_encoding=encoding)
    # MEMO: importo com utf-8

    # soup_lg8 parte con info utili
    soup_lg8 = soup.find('div', {'class': 'col-lg-8'})
    # soup1 primo blocco
    soup1 = soup_lg8.find('div', {'class': 'row pt-3'})

    # blocco 1 -> nome + nazionalità
    nome = soup1.find('div', {'class': 'align-self-center pl-3'}).find('h1').text
    # nome.decode("utf-8").replace(u"\u20ac", "")
    # nome.decode("utf-8")
    players['nome'] = nome

    nazionalita = soup1.find('div',{'class':'align-self-center pl-3'}).find('h2').text
    players['naz'] = nazionalita

    # blocco 2
    soup2 = soup1.find('div',{'class':'card mb-5'})
    # blocco 2a -> valore tot + valore pot
    appo = soup2.find('h5',{'class':'card-header'})

    valtot = appo.find_all('span')[1].text
    players['valtot'] = valtot
    valpot = appo.find_all('span')[2].text
    players['valpot'] = valpot
    # blocco 2b -> valore tot + valore pot
    appo = soup2.find('div',{'class':'card-body'})
    try:
        altezza = appo.find(string=re.compile("Altezza")).parent.find('span',{'class':'data-units data-units-metric'}).text
    except:
        altezza = ''
    players['altezza'] = altezza
    try:
        peso = appo.find(string=re.compile("Peso")).parent.find('span',{'class':'data-units data-units-metric'}).text
    except:
         peso = ''
    players['peso'] = peso
    try:
        piedepref = appo.find(string=re.compile("Piede preferito")).parent.find('span',{'class':'float-right'}).text
    except:
        piedepref = ''
    players['piedepref'] = piedepref
    try:
        datanasc = appo.find(string=re.compile("Data di nascita")).parent.find('span',{'class':'float-right'}).text
    except:
        datanasc = ''
    players['datanasc'] = datanasc
    try:
        eta = appo.find(string=re.compile("Età")).parent.find('span',{'class':'float-right'}).text
    except:
        eta = ''
    players['eta']=eta
    try:
        ruoli = appo.find(string=re.compile("Ruoli preferiti")).parent
        titoli = ruoli.find_all(title=True)
        players['pos']=[titolo.text for titolo in titoli]
    except:
        players['pos'] = ''
    try:
        rend = appo.find(string=re.compile("Rendimento giocatore")).parent.find('span',{'class':'float-right'}).text
    except:
        rend = ''
    players['rend'] = rend
    try:
        piede_deb = appo.find(string=re.compile("Piede debole")).parent
        piede_deb1 = piede_deb.find_all('i',{'class':'fas fa-star fa-lg'})
        players['piededeb'] = len(piede_deb1)
    except:
        players['piededeb'] = ''
    try:
        mosseab = appo.find(string=re.compile("Mosse abilità")).parent
        mosseab1 = mosseab.find_all('i',{'class':'fas fa-star fa-lg'})
        players['mosseab'] = len(mosseab1)
    except:
        players['mosseab'] = ''
    try:
        valore_e = appo.find(string=re.compile("Valore")).parent.find('span',{'class':'float-right'}).text
        players['valore_e'] = valore_e.replace("€", "")
    except:
        players['valore_e'] = ''
    try:
        stipendio_e = appo.find(string=re.compile("Stipendio")).parent.find('span',{'class':'float-right'}).text
        players['stipendio_e'] = stipendio_e.replace("€", "")
    except:
        players['stipendio_e'] = ''

    #blocco 3 -> to do blocco squadra nazionale/club
    try:
        # squadra_team = soup_lg8.find(string=re.compile("Entrato nel club ")).findParent().findParent().findParent().findParent()
        squadra_team = soup_lg8.find(string=re.compile("Durata Contratto ")).findParent().findParent().findParent().findParent()
        # squadre = squadra_team.findParent()
        squadre = squadra_team.parent.find_all('div',{'class':'card'})
        #if (str(squadre) == str('<div class="row">\n') + str(squadra_team) + str('\n</div>')):
        if (len(squadre) == 2):
            players['naz_team'] = squadre[1].find('h5',{'class':'card-header'}).text
            players['naz_pos'] = squadre[1].find(string=re.compile("Posizione")).parent.find('span',{'class':'float-right'}).text
            players['naz_maglia'] = squadre[1].find(string=re.compile("Numero di maglia")).parent.find('span',{'class':'float-right'}).text
            players['club_team'] = squadra_team.find('h5',{'class':'card-header'}).text
            players['club_pos'] = squadra_team.find(string=re.compile("Posizione")).parent.find('span',{'class':'float-right'}).text
            players['club_maglia'] = squadra_team.find(string=re.compile("Numero di maglia")).parent.find('span', {'class':'float-right'}).text
            #players['club_dt_ent'] = squadra_team.find(string=re.compile("Entrato nel club")).parent.find('span', {'class':'float-right'}).text
            players['club_dur_ctr'] = squadra_team.find(string=re.compile("Durata Contratto")).parent.find('span', {'class':'float-right'}).text
        else:
            players['naz_team'] = ''
            players['naz_pos'] = ''
            players['naz_maglia'] = ''
            players['club_team'] = squadra_team.find('h5', {'class': 'card-header'}).text
            players['club_pos'] = squadra_team.find(string=re.compile("Posizione")).parent.find('span', {
                'class': 'float-right'}).text
            players['club_maglia'] = squadra_team.find(string=re.compile("Numero di maglia")).parent.find('span', {
                'class': 'float-right'}).text
            # players['club_dt_ent'] = squadra_team.find(string=re.compile("Entrato nel club")).parent.find('span', {'class':'float-right'}).text
            players['club_dur_ctr'] = squadra_team.find(string=re.compile("Durata Contratto")).parent.find('span', {
                'class': 'float-right'}).text
    except:
        ## squadre=soup_lg8.find(string=re.compile("Numero di maglia")).findParent().findParent().findParent()
        players['naz_team'] = '' #squadre.find('h5',{'class':'card-header'}).text
        players['naz_pos'] = '' #squadre.find(string=re.compile("Posizione")).parent.find('span',{'class':'float-right'}).text
        players['naz_maglia'] = ''#squadre.find(string=re.compile("Numero di maglia")).parent.find('span',{'class':'float-right'}).text
        players['club_team'] = ''
        players['club_pos'] = ''
        players['club_maglia'] = ''
        players['club_dt_ent'] = ''
        players['club_dur_ctr'] = ''
    abilita= soup_lg8.find(string=re.compile("Abilità Con La Palla")).findParent().findParent()
    try:
        players['contr_palla']= abilita.find(string=re.compile("Contr. palla")).parent.find('span',{'class':'float-right'}).text
    except:
        players['contr_palla']= ''
    try:
        players['dribbling']= abilita.find(string=re.compile("Dribbling")).parent.find('span',{'class':'float-right'}).text
    except:
        players['dribbling']= ''

    difesa= soup_lg8.find(string=re.compile("Difesa")).findParent().findParent()
    try:
        players['marcatura']= difesa.find(string=re.compile("Marcatura")).parent.find('span',{'class':'float-right'}).text
    except:
        players['marcatura'] = ''
    try:
        players['scivolata']= difesa.find(string=re.compile("Scivolata")).parent.find('span',{'class':'float-right'}).text
    except:
        players['scivolata'] = ''
    try:
        # players['contr_piedi']= difesa.find(string=re.compile("Contr. piedi")).parent.find('span',{'class':'float-right'}).text
        players['contr_piedi']= difesa.find(string=re.compile("Contrasti")).parent.find('span',{'class':'float-right'}).text
    except:
        players['contr_piedi'] = ''

    mentale= soup_lg8.find(string=re.compile("Mentale")).findParent().findParent()
    try:
        players['aggressivita']= mentale.find(string=re.compile("Aggressività")).parent.find('span',{'class':'float-right'}).text
    except:
        players['aggressivita'] = ''
    try:
        players['reattivita']= mentale.find(string=re.compile("Reattività")).parent.find('span',{'class':'float-right'}).text
    except:
        players['reattivita']= ''
    try:
        players['pos_attacco']= mentale.find(string=re.compile("Pos. attacco")).parent.find('span',{'class':'float-right'}).text
    except:
        players['pos_attacco']= ''
    try:
        players['intercetta']= mentale.find(string=re.compile("Intercettaz.")).parent.find('span',{'class':'float-right'}).text
    except:
        players['intercetta']= ''
    try:
        players['visione']= mentale.find(string=re.compile("Visione")).parent.find('span',{'class':'float-right'}).text
    except:
        players['visione']= ''
    try:
        players['freddezza']= mentale.find(string=re.compile("Freddezza")).parent.find('span',{'class':'float-right'}).text
    except:
        players['freddezza']= ''

    passag= soup_lg8.find(string=re.compile("Passag.")).findParent().findParent()
    try:
        players['cross']= passag.find(string=re.compile("Cross")).parent.find('span',{'class':'float-right'}).text
    except:
        players['cross'] = ''
    try:
        players['pass_corto']= passag.find(string=re.compile("Pass. corto")).parent.find('span',{'class':'float-right'}).text
    except:
        players['pass_corto'] = ''
    try:
        players['pass_lungo']= passag.find(string=re.compile("Pass. lungo")).parent.find('span',{'class':'float-right'}).text
    except:
        players['pass_lungo'] = ''

    fisico= soup_lg8.find(string=re.compile("Fisico")).findParent().findParent()
    try:
        players['acceleraz']= fisico.find(string=re.compile("Acceleraz.")).parent.find('span',{'class':'float-right'}).text
    except:
        players['acceleraz'] = ''
    try:
        players['resistenza']= fisico.find(string=re.compile("Resistenza")).parent.find('span',{'class':'float-right'}).text
    except:
        players['resistenza']= ''
    try:
        players['forza']= fisico.find(string=re.compile("Forza")).parent.find('span',{'class':'float-right'}).text
    except:
        players['forza'] = ''
    try:
        players['equilibrio']= fisico.find(string=re.compile("Equilibrio")).parent.find('span',{'class':'float-right'}).text
    except:
        players['equilibrio'] = ''
    try:
        players['vel_scatto']= fisico.find(string=re.compile("Vel. scatto")).parent.find('span',{'class':'float-right'}).text
    except:
        players['vel_scatto'] = ''
    try:
        players['agilita']= fisico.find(string=re.compile("Agilità")).parent.find('span',{'class':'float-right'}).text
    except:
        players['agilita'] = ''
    try:
        players['elevazione']= fisico.find(string=re.compile("Elevazione")).parent.find('span',{'class':'float-right'}).text
    except:
        players['elevazione'] = ''

    tiri= soup_lg8.find(string=re.compile("Tiri")).findParent().findParent()
    try:
        players['colpo_testa']= tiri.find(string=re.compile("Colpo di testa")).parent.find('span',{'class':'float-right'}).text
    except:
        players['colpo_testa'] = ''
    try:
        players['pot_tiro']= tiri.find(string=re.compile("Pot. tiro")).parent.find('span',{'class':'float-right'}).text
    except:
        players['pot_tiro'] = ''
    try:
        players['finalizzaz']= tiri.find(string=re.compile("Finalizzaz.")).parent.find('span',{'class':'float-right'}).text
    except:
        players['finalizzaz'] = ''
    try:
        players['tiri_dist']= tiri.find(string=re.compile("Tiri dist.")).parent.find('span',{'class':'float-right'}).text
    except:
        players['tiri_dist'] = ''
    try:
        players['effetto']= tiri.find(string=re.compile("Effetto")).parent.find('span',{'class':'float-right'}).text
    except:
        players['effetto'] = ''
    try:
        players['prec_puniz']= tiri.find(string=re.compile("Prec. puniz.")).parent.find('span',{'class':'float-right'}).text
    except:
        players['prec_puniz'] = ''
    try:
        players['rigori']= tiri.find(string=re.compile("Rigori")).parent.find('span',{'class':'float-right'}).text
    except:
        players['rigori'] = ''
    try:
        players['tiri_volo']= tiri.find(string=re.compile("Tiri al volo")).parent.find('span',{'class':'float-right'}).text
    except:
        players['tiri_volo'] = ''

    portiere= soup_lg8.find(string=re.compile("Portiere")).findParent().findParent()
    try:
        players['piazzamento']= portiere.find(string=re.compile("Piazzamento ")).parent.find('span',{'class':'float-right'}).text
    except:
        players['piazzamento'] = ''
    try:
        players['tuffo']= portiere.find(string=re.compile("Tuffo")).parent.find('span',{'class':'float-right'}).text
    except:
        players['tuffo'] = ''
    try:
        players['presa']= portiere.find(string=re.compile("Presa")).parent.find('span',{'class':'float-right'}).text
    except:
        players['presa'] = ''
    try:
        players['rinvio']= portiere.find(string=re.compile("Rinvio")).parent.find('span',{'class':'float-right'}).text
    except:
        players['rinvio'] = ''
    try:
        players['riflessi']= portiere.find(string=re.compile("Riflessi")).parent.find('span',{'class':'float-right'}).text
    except:
        players['riflessi'] = ''

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

    # export
    # MEMO: salva un json per ogni player
    # nome_file=id+'.json'
    nome_file = "{}_{}.json".format(season, id)
    out_file = os.path.join(out_folder, nome_file)
    # with open(out_file, 'w') as outfile:
    #     json.dump(players, outfile)
    with open(out_file, 'w', encoding='utf8') as outfile:
        json.dump(players, outfile, ensure_ascii=False)
    # MEMO: esporto come utf-8

    time.sleep(2)
