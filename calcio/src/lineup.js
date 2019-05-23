'use strict';
// import registerServiceWorker from './registerServiceWorker';

// Crea tabella con tutti i giocatori in searchResults
class Search extends React.Component {

  render() {
    return (
      <table className="Results table table-sm table-hover">
        <thead className="thead-light">
          <tr key="header">
            <th key="nome" scope="col">Nome</th>
            <th key="forza" scope="col">Forza</th>
            <th key="ruoli" scope="col">Ruoli</th>
          </tr>
        </thead>
        <tbody>
          {
          this.props.searchResults.map(player => (
            // Render di singola riga per giocatore
            <SearchResult
              player={player}
              selectPlayer={this.props.selectPlayer}
              selectedPlayers={this.props.selectedPlayers}
              // logoPlaceholder={this.props.logoPlaceholder}
              // portraitPlaceholder={this.props.portraitPlaceholder}
            />
          ))}
        </tbody>
      </table>
    )
  }
}

// Popola riga per il giocatore nella tabella
class SearchResult extends React.Component {
  constructor(props) {
    // CHK: questo forse non serve
    super(props)
    this.state = {
      // picture: this.props.portraitPlaceholder,
      // logo: this.props.logoPlaceholder,
      pictureBackup: this.props.player.photo,
      // logoBackup: this.props.player.club.logo
      logoBackup: ''
    }
  }

  componentDidMount() {
    // Lazyload player picture
    const actualPicture = new Image()
    actualPicture.addEventListener("load", () => {
      // Replace placeholder with real photo once it's ready
      this.setState({ picture: actualPicture.src })
    })
    actualPicture.src = this.state.pictureBackup
    // Lazyload club logo
    const actualLogo = new Image()
    actualLogo.addEventListener("load", () => {
      // Replace placeholder with real photo once it's ready
      this.setState({ logo: actualLogo.src })
    })
    actualLogo.src = this.state.logoBackup

    // this.deactivateSearchResult()
  }

  // Verifiche su selezione:
  // - se ci sono 11 titolari
  // - se il giocatore è gia selezionato nel lineup
  checkedSelection = () => {
    let appo = []
    for (const player in this.props.selectedPlayers) {
      appo.push(this.props.selectedPlayers[player].id)
    }
    if (this.props.selectedPlayers.length < 11 &&
      !appo.includes(this.props.player.id)) {
      this.props.selectPlayer(this.props.player)

      // evidenzia i giocatori gia selezionati
      // ReactDOM.findDOMNode(this).classList.add("table-active")
    }
  }

  // evidenzia players gia selezionati nel lineup
  // deactivateSearchResult = () => {
  //   let appo = []
  //   for (const player in this.props.selectedPlayers) {
  //     appo.push(this.props.selectedPlayers[player].id)
  //   }
  //   if (appo.includes(this.props.player.id)) {
  //     let prova = "Info-player table-active"
  //     console.log(prova)
  //     return(prova)
  //   } else {
  //     let prova = "Info-player grabbable"
  //     console.log(prova)
  //     return(prova)
  //   }
  // }

  render() {

    return (
      <tr
        key={this.props.player.id.toString()}
        // className={this.deactivateSearchResult}
        className="Info-player grabbable"
        onClick={this.checkedSelection} // DA QUI DEVE PARTIRE DRAG & DROP
      >
        <td>
          <p
            className="Name"
            key={this.props.player.id.toString()}
            > {this.props.player.nome}
          </p>
        </td>
        <td>
          <p
            key={this.props.player.id.toString()}
            > {this.props.player.valtot}
          </p>
        </td>
        <td>
          {
            this.props.player.pos_all.split(":::").map(role => (
              <p
                className="Role"
                key={role.toString()}
                > {role}
              </p>
            ))
          }
        </td>
      </tr>
    )
  }
}


// Seleziona la tattica
class Customize extends React.Component {

  // Apre menu tattiche
  toggleTacticMenu = () => {
    const tacticButton = document.querySelector('.Tactic')
    if (tacticButton.classList.contains('expanded')) {
      // Collapse menu
      tacticButton.classList.remove('expanded')
    } else {
      // Expand menu
      tacticButton.classList.add('expanded')
      this.outsideClickHandler(tacticButton)
    }
  }

  // Gestisce il cambio di tattica
  outsideClickHandler = button => {
    document.addEventListener('click', e => {
      const isClickInside = button.contains(e.target);
      if (!isClickInside) {
        // User clicked outside
        if (button.classList.contains('Tactic') && button.classList.contains('expanded')) {
          // Collapse tactic menu
          e.preventDefault()
          this.toggleTacticMenu()
        }
      }
    });
  }

  render() {
    return(
      <div className="Customize">
        <div
          className="Tactic Menu"
          onClick={ () => {this.toggleTacticMenu()} }
        >
          <div className="Options">
            <div data-tactic="433" onClick={() => { this.props.setActiveTactic('433') }}>4-3-3</div>
            <div data-tactic="442" onClick={() => { this.props.setActiveTactic('442') }}>4-4-2</div>
            <div data-tactic="352" onClick={() => { this.props.setActiveTactic('352') }}>3-5-2</div>
            <div data-tactic="343" onClick={() => { this.props.setActiveTactic('343') }}>3-4-3</div>
            <div data-tactic="4231" onClick={() => { this.props.setActiveTactic('4231') }}>4-2-3-1</div>
          </div>
          <p className="Selected">{`Tactic: ${this.props.activeTacticName}`}</p>
        </div>
      </div>
    )
  }
}

// Mostra indicatori di posizione sul campo (se liberi)
class PositionIndicator extends React.Component {
  // MEMO: NON FUNZIONA SE CI SONO DUE POSITION CON LO STESSO NOME

  render() {
    return (
      <div
        className="PositionIndicator"
        data-position={this.props.position}
        style={{
          left: this.props.leftValue,
          top: this.props.topValue,
          opacity: this.props.occupied ? "0" : "1"
        }}
      ></div>
    )
  }
}

// Mostra card per ogni giocatore selezionato nella tabella
class PlayerCard extends React.Component {
  // MEMO: contiene due blocchi:
  // - il primo gestisce il posizonamento in campo sulla posizione preferita disponbile
  // - il secondo regola spostamenti di posizione, cancellazioni e scambi
  // Manca un controllo su posizioni intermedie "distanti" da quelle della tattica (dovrebbe tornare indietro)
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      differenceX: 0,
      differenceY: 0,
      originX: 0,
      originY: 0,
      lastTouch: {x: 0, y: 0},
      // picture: this.props.portraitPlaceholder,
      pictureBackup: this.props.player.photo
      // TODO: invertire picture e pictureBackup?
    }
  }

  componentDidMount() {
    let i = -1
    // Auto position the player
    // Viene da Pitch: per ogni player in playersList...
    // Per ogni posizione preferita del giocatore...
    mainLoop: for (let preferredPosition of this.props.player.pos_all.split(":::")) {
      i++
      // Rinconcilia posizione preferita con ruoli:
      preferredPosition = this.matchRoleToPosition(preferredPosition)
      // MEMO: va in crash se non trovava position nei ruoli (ma ora ruoli fissi da P01 a P11)
      // Verifica se il ruolo è libero:
      for (const position in this.props.tactic) {
        // Ciclo da P01 a P11, nell'ordine contenuto nel json (che non è quello alfanumerico visualizzato in console)
        // Se la posizione preferita è nella tattica:
        if (preferredPosition === position) {
          // Se la posizione preferita è nella tattica ed è disponibile:
          let isAvailable = true
          for (const occupiedPosition of this.props.occupiedPositions) {
            if (occupiedPosition === position) {
              isAvailable = false
            }
          }
          if (isAvailable) {
            // Position player where he belongs
            this.props.positionPlayer(position, `Player${ this.props.player.id }`)
            break mainLoop
          } else if (i === this.props.player.pos_all.split(":::").length - 1) {
            // Last loop, add player anyway
            this.findClosestPosition(preferredPosition)
            break mainLoop
          }
        }
      }
    }
    // Qui finisce il main loop

    // Lazyload player picture
    const actualPicture = new Image()
    actualPicture.addEventListener("load", () => {
      // Replace placeholder with real photo once it's ready
      this.setState({ picture: actualPicture.src })
    })
    actualPicture.src = this.state.pictureBackup

    // Interazioni GUI
    // Set hover style on desktop
    ReactDOM.findDOMNode(this).addEventListener("mouseenter", () => {
      ReactDOM.findDOMNode(this).classList.add("Selected")
    })
    // Remove hover style on desktop
    ReactDOM.findDOMNode(this).addEventListener("mouseleave", () => {
      ReactDOM.findDOMNode(this).classList.remove("Selected")
    })
    // Start drag (versione mouse)
    ReactDOM.findDOMNode(this).addEventListener("mousedown", e => {
      this.dragStart(e.clientX, e.clientY)
      // clientX e clientY sono le coordinate registrate dal browser
      // console.log(e.clientX, e.clientY)
    })
    // Calculate drag distance
    ReactDOM.findDOMNode(this).addEventListener("mousemove", e => {
      // Only drag if mouse is being pressed
      if (this.state.isDragging) {
        this.dragMove(e.clientX, e.clientY)
        // console.log(e.clientX, e.clientY)
      }
    })
    // End drag
    ReactDOM.findDOMNode(this).addEventListener("mouseup", e => {
      if (this.state.isDragging) {
        this.dragEnd(e.clientX, e.clientY)
        // console.log(e.clientX, e.clientY)
      }
    })
  }
  // Qui finisce componentDidMount()

  // ALTRE FUNZIONI
  // Trasforma role/preferredPosition (es. "DC") in position (es. "05")
  matchRoleToPosition = role => {
    let position = ""
    if (role === "POR") {
      position = "P01"
    } else if (role === "DC") {
      position = "P04"
    } else if (role === "TS") {
      position = "P03"
    } else if (role === "ASA") { // CHK
      position = "P03"
    } else if (role === "TD") {
      position = "P02"
    } else if (role === "ADA") { // CHK
      position = "P02"
    } else if (role === "CDC") {
      position = "P06"
    } else if (role === "CC") {
      position = "P06"
    } else if (role === "ES") { // CHK
      position = "P11"
    } else if (role === "ED") { // CHK
      position = "P07"
    } else if (role === "COC") {
      position = "P10"
    } else if (role === "AD") {
      position = "P07"
      // position.push("10")
    } else if (role === "AS") {
      position = "P11"
    } else if (role === "AT") {
      position = "P10"
    } else if (role === "ATT") {
      position = "P09"
    }
    // console.log(role, position)
    return position
  }

  // cerca la posizione libera sul campo più simile al ruolo del giocatore
  // TODO: introdurre fascia/piede come discrimine
  // per ora scorre da attaccanti a portiere sulla base dell'indice di tactic
  findClosestPosition = preferredPosition => {
    let positionIndex = -1
    const keys = Object.keys(this.props.tactic)
    // regola ordine di ricerca da attaccanti a difensori
    keys.sort(function(a, b){return b-a})
    // console.log(keys)
    // Find index of preferred position
    for (let i=0; i<keys.length; i++) {
      if (preferredPosition === keys[i]) {
        positionIndex = i
      }
    }
    // Find closest match
    let closestPosition = -1
    for (const position of keys) {
      if (
        closestPosition === -1 ||
        Math.abs(keys.indexOf(position) - positionIndex) < Math.abs(keys.indexOf(position) - closestPosition)
      ) {
        let isAvailable = true
        for (const occupied of this.props.occupiedPositions) {
          if (occupied === position) {
            isAvailable = false
          }
        }
        if (isAvailable) {
          closestPosition = keys.indexOf(position)
        }
      }
    }
    // Add player to pitch
    this.props.positionPlayer(keys[closestPosition], `Player${this.props.player.id}`)
  }

  dragStart = (x, y) => {
    this.setState({
      isDragging: true,
      originX: x,
      originY: y,
      previousMoveX: this.state.previousMoveX,
      previousMoveY: this.state.previousMoveY
    })
    if (this.state.previousMoveX === undefined ) {
      this.setState({ previousMoveX: 0 })
    }
    if (this.state.previousMoveY === undefined ) {
      this.setState({ previousMoveY: 0 })
    }
    ReactDOM.findDOMNode(this).style.zIndex = "400"
  }

  dragMove = (x, y) => {
    const currentPos = ReactDOM.findDOMNode(this).getBoundingClientRect()
    // console.log(currentPos)
    // console.log(this.props.parentFrame)
    // Prevent dragging outside of Pitch
    // verifica se lo spostamento fa restare il giocatore dentro il campo
    if (
      currentPos.left >= this.props.parentFrame.left &&
      currentPos.right <= this.props.parentFrame.right &&
      // Si conta da upper-left corner
      currentPos.top >= this.props.parentFrame.top &&
      currentPos.bottom <= this.props.parentFrame.bottom

    )
      // IF TRUE: PalyerCard è dentro Pitch
      {
      // Update data
      this.setState({
        differenceX: this.state.previousMoveX + x - this.state.originX,
        differenceY: this.state.previousMoveY + y - this.state.originY
      })
      // Move player card visually
      ReactDOM.findDOMNode(this).style.transform = `
        translateX(${this.state.differenceX}px)
        translateY(${this.state.differenceY}px)
      `
      // Get card center relatively to Pitch
      // Trova la posizione del centro della Card
      const cardCenterPos = {}
      cardCenterPos.x = 100 * (currentPos.left + (currentPos.width / 2) - this.props.parentFrame.left) / this.props.parentFrame.width
      cardCenterPos.y = 100 * (currentPos.top + (currentPos.height / 2) - this.props.parentFrame.top) / this.props.parentFrame.height

      // Snap to position if dragged next to position indicator
      // Confronta centro della card con ogni centoroide "indicator" nella tattica
      for (const indicator of Object.keys(this.props.tactic)) {
        if (
          indicator !== ReactDOM.findDOMNode(this).dataset.activePosition &&
          this.getDistance(
            this.props.tactic[indicator].x,
            this.props.tactic[indicator].y,
            cardCenterPos.x,
            cardCenterPos.y
          ) < 8 // sono pixel?
        ) {
          // IF TRUE: se la distanza è minore di 8 pixel
          let isAvailable = true
          for (const occupied of this.props.occupiedPositions) {
            if (occupied === indicator) {
              isAvailable = false
            }
          }
          if (this.props.playersList.length === 11) {
            isAvailable = false
          }
          const activePosition = ReactDOM.findDOMNode(this).dataset.activePosition

          // Swap players if position is occupied
          if (!isAvailable) {
            // Do the reverse travel with the other player
            this.props.unoccupyPosition(indicator)
            const cardToMove = document.querySelector(`[data-active-position='${indicator}']`)
            this.props.positionPlayer(activePosition, cardToMove.classList[1])
          } else {
            // Prepare next drag
            this.props.unoccupyPosition(activePosition)
            this.props.unoccupyPosition(indicator)
          }
          this.setState({
            differenceX: 0,
            differenceY: 0,
          })
          this.dragEnd()
          this.props.positionPlayer(indicator, `Player${this.props.player.id}`)
        }
        // else {
        //   // FIX: MANCA FALSE E QUINDI CONSENTE DI LASCIAR IL GIOCATORE IN MEZZO A DUE POSITION
        //   // Update data
        //   this.setState({
        //     // differenceX: this.state.previousMoveX + x - this.state.originX,
        //     // differenceY: this.state.previousMoveY + y - this.state.originY
        //     differenceX: - this.state.previousMoveX - x + this.state.originX,
        //     differenceY: - this.state.previousMoveY - y + this.state.originY
        //   })
        //   // Move player card visually
        //   ReactDOM.findDOMNode(this).style.transform = `
        //     translateX(${this.state.differenceX}px)
        //     translateY(${this.state.differenceY}px)
        //   `
        // }

      }
    // IF FALSE: giocatore fuori dal Pitch
    // elimina il giocatore quando viene trascinato fuori dal campo
    } else {
      // Prevent further dragging
      this.dragEnd()
      ReactDOM.findDOMNode(this).style.opacity = "0"
      const activePosition = ReactDOM.findDOMNode(this).dataset.activePosition
      // Delete player after animation end
      window.setTimeout(() => {
        this.props.unselectPlayer(this.props.player)
      }, 30)
      // Reset position indicator
      this.props.unoccupyPosition(activePosition)
      // Prevent direct downloads
      // this.props.markDownloadAsObsolete()

      // Post player and position to server when removed
      // make JSON
      let appo = JSON.stringify({
        id: this.props.player.id,
        position: activePosition,
      })

      // send data to APIs
      fetch('/team/lineup/api/rm-player', {
        method: 'POST',
        mode: "same-origin", // no-cors, cors, *same-origin
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: appo,
        })
    }
  }

  dragEnd = () => {
    this.setState({
      isDragging: false,
      previousMoveX: this.state.differenceX,
      previousMoveY: this.state.differenceY
    })
    ReactDOM.findDOMNode(this).style.zIndex = "300"
    // FORSE QUESTO SERVE...?
    // const card = document.querySelector(".PlayerCard.Selected")
    // card.classList.remove("Selected")
  }

  // Calculate distance between 2 points
  // Invocata per vierificare distanza da centoroidi di tactics
  getDistance = (x0, y0, x1, y1) => {
    // Using Pythagore
    const differenceX = x0 - x1
    const differenceY = y0 - y1
    return Math.sqrt(Math.pow(differenceX, 2) + Math.pow(differenceY, 2))
  }

  render() {
    return(
      <div
        className={`PlayerCard Player${this.props.player.id}`}
        key={this.props.player.id}
        onDragStart={ e => { e.preventDefault() } }
      >
        <img
          className="Portrait"
          src={"../../data/images/photos/" + this.props.player.photo_folder + "/" + this.props.player.id + ".png"}
          alt={ this.props.player.nome }
          // onDragStart={ e => { e.preventDefault() } }
        />
        <p>{this.props.player.nome}</p>
      </div>
    )
  }
}

// Visualizza il campo
class Pitch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // value: "",
      occupiedPositions: [],
      frame: ""
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.getPitchCoords)
    this.getPitchCoords()
    // console.log(props)
  }

  // AGGIORNAMENTO TATTICA
  // CHK: fa casino se non c'è ruolo
  componentDidUpdate(prevProps, prevState) {
    // Only trigger if tactic is changed
    if (this.props.tactic !== prevProps.tactic) {
      // Save occupied positions before rearranging positions
      // Dove nasce .state.occupiedPositions?
      const lockedOccupiedPositions = Array.from(this.state.occupiedPositions)
      for (const position of lockedOccupiedPositions) {
        const cardToMove = document.querySelector(`[data-active-position='${position}']`)
        let selector = cardToMove.classList[1]
        this.unoccupyPosition(position)
        this.positionPlayer(position, selector)
        // .classList[1] prende la classe dell'elemento player per fare selector per positionPlayer
        // selector è classe dell'elemento player (Es. class="PlayerCard Player190871")

      }
    }
  }

  getPitchCoords = () => {
    const frame = ReactDOM.findDOMNode(this).getBoundingClientRect()
    this.setState({ frame })
    // console.log(frame)
    // console.log(this.state)
  }

  occupyPosition = position => {
    if (typeof (this.state.occupiedPositions.find(e => e === position)) === "undefined") {
      let newPositions = this.state.occupiedPositions
      newPositions.push(position)
      this.setState({
        occupiedPositions: newPositions
      })
    }
  }

  unoccupyPosition = position => {
    let newPositions = this.state.occupiedPositions
    // Delete selected position from array
    for (let i=0; i<this.state.occupiedPositions.length; i++) {
      if (this.state.occupiedPositions[i] === position) {
        newPositions.splice(i, 1)
      }
    }
    this.setState({ occupiedPositions: newPositions })
  }

  // position è ruolo nella tattica (tipo "DD")
  // selector viene da classe dell'elemento player (Es. class="PlayerCard Player190871")
  // quando cambio tattica fa casino se ruolo assegnato non c'è piu
  positionPlayer = (position, selector) => {
    const card = document.querySelector(`.${selector}`)
    // Position card
    // x e y sono quelli dentro 4-4-2.json
    // toglie 8.5 e 7.5 per centrare card che è larga 17 e alta 15
    card.style.left = `${this.props.tactic[position].x - 8.5}%`
    card.style.top = `${this.props.tactic[position].y - 7.5}%`
    card.style.transform = 'unset'
    // console.log(card.style.left)
    // console.log(card.style.top)
    // cosa fa card.style.transform ????
    // Update data
    this.occupyPosition(position)
    card.dataset.activePosition = position

    // Post player and position to server when positioned
    // make JSON
    let appo = JSON.stringify({
      id: selector.replace('Player',''),
      position: position,
    })
    // send data to APIs
    fetch('/team/lineup/api/add-player', {
      method: 'POST',
      mode: "same-origin", // no-cors, cors, *same-origin
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: appo,
      })
  }

  // ELIMINA TUTTI I GIOCATORI (TODO)
  // toggleDeleteLinuep = () => {
  //   this.props.playersList = []
  // }

  render() {
    // Create skeleton
    // IL MAP SOVRASCRIVE POSITION CON LO STESSO NOME
    // QUINDI TENGO NOMI DIVERSI IN CARD E TACTICS.JSON
    // COMUNQUE RESTANO SOTTO LE CARD
    return (
      <div className="Pitch">
        <img className="Outlines" src="../data/pitch.svg" alt="Pitch outlines"/>
        <div>
          { Object.keys(this.props.tactic).map(positionKey => {
            return (
              <PositionIndicator
                key={positionKey}
                position={positionKey}
                leftValue={`${this.props.tactic[positionKey].x}%`}
                topValue={`${this.props.tactic[positionKey].y}%`}
                occupied={
                  typeof(this.state.occupiedPositions.find(e => e===positionKey)) !== "undefined"
                }
              />
            )
          }) }
          { this.props.playersList.map(player => {
            return(
              <PlayerCard
                player={player}
                key={player.id}
                tactic={this.props.tactic}
                parentFrame={this.state.frame}
                unselectPlayer={this.props.unselectPlayer}
                occupiedPositions={this.state.occupiedPositions}
                playersList={this.props.playersList}
                occupyPosition={this.occupyPosition}
                unoccupyPosition={this.unoccupyPosition}
                positionPlayer={this.positionPlayer}
                // markDownloadAsObsolete={this.props.markDownloadAsObsolete}
                // portraitPlaceholder={this.props.portraitPlaceholder}
              />
            )
          }) }
        </div>
      </div>
      // TODO: bottone per eliminare tutto
      // <div
      //   // className="Tactic Menu"
      //   onClick={ () => {this.toggleDeleteLinuep()} }
      // >Refresh</div>
    )
  }
}

// Main
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
      activeTactic: [],
      activeTacticName: "",
      selectedPlayers: [],
      savedLineup: []
    }
  }

  // Prende elenco e info giocatori da API e aggiunge dati a state
  getSearchResults = () => {
    fetch('/team/lineup/api/players/myteam')
    .then(res => res.json())
    .then(searchResults => this.setState({ searchResults : searchResults }))
    // .then(console.log("team ok"))
  }

  // Prende elenco di giocatori selezionati
  getSavedLineup = () => {
    fetch('/team/lineup/api/selected/myteam')
    .then(res => res.json())
    .then(savedLineup => this.setState({ savedLineup : savedLineup }))
    // .then(console.log("lineup ok"))
  }

  // Prende tattica da API e aggiunge tattica + nome tattica a state
  setActiveTactic = tacticNameBase => {
    if (tacticNameBase === undefined) {
      var tacticName = 'default'
      fetch(`/team/lineup/api/tactic/${tacticName}`)
      .then(res => res.json())
      // .then(activeTactic => this.setState({ activeTactic : activeTactic }))
      // .then(console.log("tactic ok"));
      // this.setState({ activeTacticName : tacticName });
      .then(jsonData => {
        this.setState({ activeTactic : jsonData['tacticData'] })
        this.setState({ activeTacticName : jsonData['tacticName'] })
      })
      // console.log(tacticName);
    } else {
      var tacticName = tacticNameBase
      fetch(`/team/lineup/api/tactic/${tacticName}`)
      .then(res => res.json())
      // .then(activeTactic => this.setState({ activeTactic : activeTactic }))
      // .then(console.log("tactic ok"));
      // this.setState({ activeTacticName : tacticName });
      // console.log(tacticName);
      .then(jsonData => {
        this.setState({ activeTactic : jsonData['tacticData'] })
        this.setState({ activeTacticName : jsonData['tacticName'] })
      })
    }

  }

  // Posiziona i giocatori nel lineup salvato
  showSavedLineup = () => {
    let players = this.state.searchResults
    // per ogni giocatore nel lineup salvato
    for (const i in this.state.savedLineup) {
      let playerId = this.state.savedLineup[i].id
      let playerPos = this.state.savedLineup[i].position
      // cerca il giocatore nella squadra
      for (const i in players) {
        // appena trova il giocatore lo posizona e poi esce dal loop sulla suadra
        if (players[i].id === playerId) {
          let playerObj = players[i]
          this.selectPlayer(playerObj)
          break
        }
      }
    }
  }

  // initLineup = (callback) => {
  //   this.getSearchResults()
  //   this.setActiveTactic("433")
  //   this.getSavedLineup()
  //   console.log(callback)
  //   callback()
  // }

  initLineup = () => {
    this.getSearchResults()
    this.setActiveTactic()
    this.getSavedLineup()
  }

  // Funzioni comuni a più components (per selezione giocatori)
  selectPlayer = playerObject => {
    let newSelection = this.state.selectedPlayers
    newSelection.push(playerObject)
    this.setState({ selectedPlayers: newSelection })
  }

  unselectPlayer = playerObject => {
    let newSelection = this.state.selectedPlayers
    for (let i = 0; i < this.state.selectedPlayers.length; i++) {
      if (this.state.selectedPlayers[i] === playerObject) {
        newSelection.splice(i, 1)
      }
    }
    this.setState({
      selectedPlayers: newSelection,
    })
  }

  // Invoca API all'avvio e posiziona giocatori
  componentDidMount() {
    // https://flaviocopes.com/javascript-async-await/
    this.initLineup()
    // TODO: qui andrebbe usato "await" o qualcosa del genere
    setTimeout(() => this.showSavedLineup(), 30)
  }

  render() {
    return(
      <div className="App container">
        <div className="row">
          <div className="col">
            <div className="Settings">
              <Search
                searchResults={this.state.searchResults}
                selectedPlayers={this.state.selectedPlayers}
                selectPlayer={this.selectPlayer}
              />
            </div>
          </div>
          <div className="col">
            <Pitch
              playersList={this.state.selectedPlayers}
              unselectPlayer={this.unselectPlayer}
              tactic={this.state.activeTactic}
            />
            <div className="Settings">
              <Customize
                activeTacticName={this.state.activeTacticName}
                setActiveTactic={this.setActiveTactic}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
// registerServiceWorker();
