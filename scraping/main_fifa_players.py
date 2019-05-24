# codice che crea il "navigator"
# input: NONE
# output: link.csv
# libs

import os
import requests
from bs4 import BeautifulSoup
import csv
import time

out_folder = os.path.join(os.getcwd(), '_output')
in_folder = os.path.join(os.getcwd(), '_input')

# settings
#MEMO: cambiare a mano url_base2 e filename
url_base2 = 'https://www.fifaindex.com/it/players/fifa10_6/'
filename = 'link_0910.csv'
nmax = 505
# MEMO: era 605 nella versione per 1819, 600 per 1718, 587 per 1617, 569 per 1516, 550 per 1415, 556 per 1314
# 502 per 1213, 484 per 1112, 507 per il 1011

# run
players=[]
out_file = os.path.join(in_folder, filename)
file_exists = os.path.isfile(out_file)
with open(out_file, "a") as out:
    headers = ['LINK']
    writer = csv.DictWriter(out, delimiter=',', lineterminator='\n', fieldnames=headers)
    if not file_exists:
        writer.writeheader()

        for i in range(1, nmax):
            url = url_base2 + str(i) + '/'
            print(i)
            try:
                page = requests.get(url)
                soup = BeautifulSoup(page.text, 'html.parser')
                soup2 = soup.find('table',{'class':'table table-striped table-players'})
                soup3 = soup2.find('tbody')
                links=soup3.findAll('tr')
                for link in links:
                    pippo=link.find('a',{'class':'link-player'})
                    writer.writerow({'LINK': pippo.get('href')})
                    # players.append(pippo.get('href'))
            except AttributeError:
                page = None
            # sleep
            time.sleep(5)




# MACRO-BLOCCO per pagina "facet"
