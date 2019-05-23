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
url_base2 = 'https://www.fifaindex.com/it/players/fifa18_278/'
filename = 'link_1718.csv'
nmax = 600
# MEMO: era 605 nella versione per 1819

# run
players=[]
out_file = os.path.join(in_folder, filename)
file_exists = os.path.isfile(out_file)
with open(out_file, "a") as out:
    headers = ['LINK']
    writer = csv.DictWriter(out, delimiter=',', lineterminator='\n', fieldnames=headers)
    if not file_exists:
        writer.writeheader()

    # mettere a 605
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
