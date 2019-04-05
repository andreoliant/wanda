'use strict';

// Crea tabella con tutti i giocatori in searchResults
class Search extends React.Component {

  render() {
    return (
      <table className="Results table table-sm table-hover">
        <thead className="thead-light">
          <tr>
            {
              // <th scope="col">Foto</th>
            }
            <th scope="col">Nome</th>
            <th scope="col">Forza</th>
            <th scope="col">Ruoli</th>
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
      logoBackup: this.props.player.club.logo
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
    }
  }

  render() {
    return (
      <tr
        key={this.props.player.id}
        className="Info-player grabbable"
        onClick={this.checkedSelection} // DA QUI DEVE PARTIRE DRAG & DROP
      >
        {
          // <img alt={this.props.player.name} src={this.state.picture} className="Photo" />
        }
        <td>
          <p className="Name">{this.props.player.name}</p>
        </td>

        <td>
          <p>{this.props.player.rating}</p>
        </td>
        <td>
          {
          this.props.player.positions.map(role => (
            <p className="Role">{role} </p>
          ))}
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
    // Count loops
    let i = -1
    // Auto position the player
    mainLoop: for (let preferredPosition of this.props.player.positions) {
      i++
      preferredPosition = this.matchRoleToPosition(preferredPosition)
      // Prima andava in crash se non trovava position
      // Ora le position sono fisse perché numeri da 1 a 11
      // VERIFICA SE I RUOLI SONO DISPONIBILI
      for (const position in this.props.tactic) {
        // Check if the position is part of the selected tactic
        if (preferredPosition === position) {
          // Check if position is available
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
          } else if (i === this.props.player.positions.length - 1) {
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
    })
    // // Start drag (versione touch)
    // ReactDOM.findDOMNode(this).addEventListener("touchstart", e => {
    //   this.dragStart(e.touches[0].clientX, e.touches[0].clientY)
    //   // Save position to prepare touchend
    //   this.setState({
    //     lastTouch: { x: e.touches[0].clientX, y: e.touches[0].clientY }
    //   })
    //   // Add hover style
    //   ReactDOM.findDOMNode(this).classList.add("Selected")
    // })
    // Calculate drag distance
    ReactDOM.findDOMNode(this).addEventListener("mousemove", e => {
      // Only drag if mouse is being pressed
      if (this.state.isDragging) {
        this.dragMove(e.clientX, e.clientY)
      }
    })
    // ReactDOM.findDOMNode(this).addEventListener("touchmove", e => {
    //   // Only drag if mouse is being pressed
    //   if (this.state.isDragging) {
    //     // Prevent scroll
    //     e.preventDefault()
    //     // Close keyboard
    //     document.querySelector('.Search-player').blur()
    //     // Move card around
    //     this.dragMove(e.touches[0].clientX, e.touches[0].clientY)
    //     // Save position to prepare touchend
    //     this.setState({
    //       lastTouch: { x: e.touches[0].clientX, y: e.touches[0].clientY }
    //     })
    //   }
    // })
    // End drag
    ReactDOM.findDOMNode(this).addEventListener("mouseup", e => {
      if (this.state.isDragging) {
        this.dragEnd(e.clientX, e.clientY)
      }
    })
    // ReactDOM.findDOMNode(this).addEventListener("touchend", e => {
    //   if (this.state.isDragging) {
    //     this.dragEnd(this.state.lastTouch.x, this.state.lastTouch.y)
    //     // Remove the hover style
    //     ReactDOM.findDOMNode(this).classList.remove("Selected")
    //   }
    // })
  }
  // Qui finisce componentDidMount()

  // ALTRE FUNZIONI
  // Trasforma role/preferredPosition (es. "DC") in position (es. "05")
  matchRoleToPosition = role => {
    let position = ""
    if (role === "G") {
      position = "P01"
    } else if (role === "DC") {
      position = "P05"
    } else if (role === "DG") {
      position = "P03"
    } else if (role === "DLG") {
      position = "P03"
    } else if (role === "DD") {
      position = "P02"
    } else if (role === "DLD") {
      position = "P02"
    } else if (role === "MDC") {
      position = "P08"
    } else if (role === "MC") {
      position = "P08"
    } else if (role === "MG") {
      position = "P11"
    } else if (role === "MD") {
      position = "P07"
    } else if (role === "MOC") {
      position = "P10"
    } else if (role === "AD") {
      position = "P07"
      // position.push("10")
    } else if (role === "AG") {
      position = "P11"
    } else if (role === "ATT") {
      position = "P10"
    } else if (role === "BU") {
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
    // Show bin
    // document.querySelector(".Pitch .Trash").classList.add("visible")
  }

  dragMove = (x, y) => {
    const currentPos = ReactDOM.findDOMNode(this).getBoundingClientRect()
    // Prevent dragging outside of Pitch
    // verifica se lo spostamento fa restare il giocatore dentro il campo
    if (
      currentPos.left >= this.props.parentFrame.left &&
      currentPos.right <= this.props.parentFrame.right &&
      currentPos.top >= this.props.parentFrame.top &&
      currentPos.bottom <= this.props.parentFrame.bottom
    )
      // IF TRUE
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
      const cardCenterPos = {}
      cardCenterPos.x = 100 * (currentPos.left + (currentPos.width / 2) - this.props.parentFrame.left) / this.props.parentFrame.width
      cardCenterPos.y = 100 * (currentPos.top + (currentPos.height / 2) - this.props.parentFrame.top) / this.props.parentFrame.height

      // Snap to position if dragged next to position indicator
      for (const indicator of Object.keys(this.props.tactic)) {
        if (
          indicator !== ReactDOM.findDOMNode(this).dataset.activePosition &&
          this.getDistance(
            this.props.tactic[indicator].x,
            this.props.tactic[indicator].y,
            cardCenterPos.x,
            cardCenterPos.y
          ) < 5
        ) {
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
          // MANCA FALSE E QUINDI CONSENTE DI LASCIAR IL GIOCATORE IN MEZZO A DUE POSITION
        }

      }
    // IF FALSE
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
    }
  }

  dragEnd = () => {
    this.setState({
      isDragging: false,
      previousMoveX: this.state.differenceX,
      previousMoveY: this.state.differenceY
    })
    ReactDOM.findDOMNode(this).style.zIndex = "300"
    // Hide bin
    // document.querySelector(".Pitch .Trash").classList.remove("visible")
    // Disable direct download
    // if (this.props.playersList.length === 11) {
    //   this.props.markDownloadAsObsolete()
    // }
    // if (window.innerWidth <= 910) {
    //   const card = document.querySelector(".PlayerCard.Selected")
    //   card.classList.remove("Selected")
    // }

    // FORSE QUESTO SERVE...?
    // const card = document.querySelector(".PlayerCard.Selected")
    // card.classList.remove("Selected")
  }

  // Calculate distance between 2 points
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
      >
        <img
          className="Portrait"
          src={ this.state.picture }
          alt={ this.props.player.name }
          onDragStart={ e => { e.preventDefault() } }
        />
        <p>{this.props.player.shortName}</p>
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
      occupiedPositions: []
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
    // cosa fa card.style.transform ????
    // Update data
    this.occupyPosition(position)
    card.dataset.activePosition = position
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
      selectedPlayers: []
    }
  }

  // Invoca API all'avvio
  componentDidMount() {
    this.getSearchResults();
    this.setActiveTactic("433");
  }

  // Prende elenco e info giocatori da API e aggiunge dati a state
  getSearchResults = () => {
    fetch('/teams/lineup/api/players/myteam')
    .then(res => res.json())
    .then(searchResults => this.setState({ searchResults }))
    // .then(console.log(this.state.searchResults))
  }

  // Prende tattica da API e aggiunge tattica + nome tattica a state
  setActiveTactic = tacticName => {
    fetch(`/teams/lineup/api/tactic/${tacticName}`)
    .then(res => res.json())
    .then(activeTactic => this.setState({ activeTactic : activeTactic }));
    this.setState({ activeTacticName : tacticName });
    // console.log(tacticName);
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

  render() {
    return(
      <div className="App">
        <div className="row">
          <div className="col-8">
            <div className="Settings">
              <Search
                searchResults={this.state.searchResults}
                selectedPlayers={this.state.selectedPlayers}
                selectPlayer={this.selectPlayer}
              />
            </div>
          </div>
          <div className="col-4">
            <div className="Pitch">
              <Pitch
                playersList={this.state.selectedPlayers}
                unselectPlayer={this.unselectPlayer}
                tactic={this.state.activeTactic}
              />
            </div>
            <div className="Settings">
              <Customize
                activeTacticName={this.state.activeTacticName}
                setActiveTactic={this.setActiveTactic}
              />
            </div>
          </div>
        </div>
      </div>
      // Eliminato Pith dal div sopra
    )
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);
