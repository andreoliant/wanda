# codice che crea il "navigator"
# input: NONE
# output: link.csv
# libs

import os
import requests
from bs4 import BeautifulSoup
# import re
import csv
import time
#import scrape_fifa

out_folder = os.path.join(os.getcwd(), '_output')
in_folder = os.path.join(os.getcwd(), '_input')

# settings

# url_base serve per il ciclo sulle pagine dei singoli giocatori
url_base2 = 'http://www.fifaindex.com/it/teams/'
# url_base serve per il ciclo sulle pagine degli elenchi dei giocatori
#teams=[]
out_file = os.path.join(out_folder, 'elenco_squadre.csv')
file_exists = os.path.isfile(out_file)
#with open(out_file, "a") as out:
with open(out_file, "a", encoding='utf8') as out:
    #headers = ['link_team','club_team','link_lega','nome_lega']
    headers = ['link_team:::club_team:::link_lega:::nome_lega']
    #writer = csv.writer(out, delimiter=',', lineterminator='\n')
    writer = csv.DictWriter(out, delimiter=',', lineterminator='\n', fieldnames=headers)
    if not file_exists:
        writer.writeheader()
        #writer.writerow(headers)
    # mettere a 22
    for i in range(1,22):
        # i=1
        url = url_base2 + str(i) + '/'
        print(url)
        try:
            page = requests.get(url)
            encoding = page.encoding if 'charset' in page.headers.get('content-type', '').lower() else None
            soup = BeautifulSoup(page.content, 'html.parser', from_encoding=encoding)
            #soup = BeautifulSoup(page.text, 'html.parser')
            soup2 = soup.find('table',{'class':'table table-striped table-teams'})
            soup3 = soup2.find('tbody')
            links=soup3.findAll('tr')
            for link in links:
                team=link.find('a',{'class':'link-team'})
                link_team=team.get('href')
                club_team=team.get('title')
                lega=link.find('a',{'class':'link-league'})
                link_lega=lega.get('href')
                nome_lega=lega.get('title')
                text = link_team + ':::' + club_team + ':::' + link_lega + ':::' + nome_lega
                print(text)
                writer.writerow({'link_team:::club_team:::link_lega:::nome_lega': text})
                #teams.append(text)
        except AttributeError:
            page = None
        # sleep
        time.sleep(5)

#    with open(out_file, 'w', encoding='utf8') as outfile:
        #json.dump(players, outfile, ensure_ascii=False)


# MACRO-BLOCCO per pagina "facet"
