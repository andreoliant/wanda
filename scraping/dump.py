# prepara dati per db finale


# libs
import os
import json

# setup
out_folder = os.path.join(os.getcwd(), '_dump')
in_folder = os.path.join(os.getcwd(), '_output')
season = '2018'

# load photo path
json_path = os.path.join(os.getcwd(), '_input', 'photo_path.json')
with open(json_path, 'r', encoding='utf8') as reader:
    photo_path = json.loads(reader.read())

# init memo
memo = {}

# looper
# ignored = ['.DS_Store']
looper = [x for x in os.listdir(in_folder) if not x.startswith('.')]

# loop su tutti i file nel folder _output
for json_file in looper:

    print(json_file)

    # apre json as dictionary
    # json_file = '2018_204614.json'
    json_path = os.path.join(in_folder, json_file)
    with open(json_path, 'r', encoding='utf8') as reader:
        player = json.loads(reader.read())

    # modifica id antepondendo 000 (se non è stato fatto)
    temp = player['id']
    id = "{:06d}".format(int(temp))
    player['id'] = id
    memo[id] = 'ok'

    # aggiunge path a photo
    try:
        temp = photo_path[id]
    except:
        temp = None
        memo[id] = 'no photo'
    player['photo_folder'] = temp
    # MEMO: le foto sono nominate per id tipo "204614.json" ma sono raggruppate in folders da 1 a 4
    # CHK: ci sono anche alcuni Null fuori dal folder

    # export
    nome_file = "{}_{}.json".format(season, id)
    out_file = os.path.join(out_folder, nome_file)

    try:
        with open(out_file, 'w', encoding='utf8') as outfile:
            json.dump(player, outfile, ensure_ascii=False)
    except:
        memo[id] = 'no export'


# export memo
out_file = os.path.join(os.getcwd(), 'dump_chk.json')
with open(out_file, 'w', encoding='utf8') as outfile:
    json.dump(memo, outfile, ensure_ascii=False)



