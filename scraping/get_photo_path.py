# recupera path per photo

# libs
import os
import json

# setup
in_folder = '/Users/aa/coding/wanda/calcio/data/players'
out_folder = os.path.join(os.getcwd(), '_input')

# init
players = {}

# loop su tutti i file nel folder
for json_file in os.listdir(in_folder):

    # DEBUG:
    # json_file = 'AaronCresswell0.json'

    # apre json as dictionary
    json_path = os.path.join(in_folder, json_file)
    with open(json_path, 'r', encoding='utf8') as reader:
        appo = json.loads(reader.read())

    # get id
    temp = appo['id']
    id = "{:06d}".format(int(temp))

    # get photo folder
    photo = appo['photoFolderIndex']

    # memo
    players[id] = photo

# export
out_file = os.path.join(out_folder, 'photo_path.json')
with open(out_file, 'w', encoding='utf8') as outfile:
    json.dump(players, outfile, ensure_ascii=False)

