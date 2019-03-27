import React from "react"
import SearchResult from "./SearchResult.jsx"

export default class Search extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  // DEVO METTERE LISTA IN this.props.results
  // getPlayersData = searchValue => {
  //   let searchResults = []
  //   // Only search if user input isn't null
  //   if (searchValue.length > 0) {
  //     // Find matching players from JSON players index
  //     const playerFilesPaths = []
  //     for (const player in this.props.playersIndex) {
  //       const playerName = player.toLocaleLowerCase()
  //       // Store the 5 best matches
  //       if (playerName.includes(searchValue) && playerFilesPaths.length < 8) {
  //         playerFilesPaths.push(this.props.playersIndex[player])
  //         this.setState({ isLoading: false })
  //       }
  //     }
  //     // Display loading message if no results are found
  //     // if (playerFilesPaths.length === 0 && !this.state.isLoading) {
  //     //   this.setState({
  //     //     noMatches: true,
  //     //     isLoading: false
  //     //   })
  //     // }
  //     // Get relevant data from JSON files
  //     for (const playerFilePath of playerFilesPaths) {
  //       let playerFile = this.props.getPlayerFile(playerFilePath)
  //       playerFile.shortName = playerFile.name.split(' ').slice(-1).join(' ')
  //       searchResults.push(playerFile)
  //     }
  //     // Sort results by players ranking
  //     searchResults.sort((a, b) => { return b.rating - a.rating })
  //   }
  //   this.props.setResults(searchResults)
  // }

  // NEW:
  // getPlayersData = () => {
  //   let searchResults = []
  //   const playerFilesPaths = []
  //   for (const player in this.props.playersIndex) {
  //     playerFilesPaths.push(this.props.playersIndex[player])
  //   }
  //   for (const playerFilePath of playerFilesPaths) {
  //     let playerFile = this.props.getPlayerFile(playerFilePath)
  //     playerFile.shortName = playerFile.name.split(' ').slice(-1).join(' ')
  //     searchResults.push(playerFile)
  //   }
  //   // Sort results by players ranking
  //   // searchResults.sort((a, b) => { return b.rating - a.rating })
  //   // TODO: ORDINARE PER positions MA DEVO PRENDERE PRIMO ITEM
  //   this.props.setResults(searchResults)
  // }

  // getPlayersData = () => {
  //   let searchResults = []
  //   let playerFilePath = "./data/players/LionelMessi0.json"
  //   let playerFile = this.props.getPlayerFile(playerFilePath)
  //   playerFile.shortName = playerFile.name.split(' ').slice(-1).join(' ')
  //   searchResults.push(playerFile)
  //   this.props.setResults(searchResults)
  // }

  componentDidMount() {
    let searchResults = []
    // let appo = {
    //   club: {
    //     logo: "./data/players/LionelMessi0.json",
    //     name: "Barcelona FC"
    //   },
    //   id: 1,
    //   name: "Lionel Messi",
    //   positions: ["MC"],
    //   rating: "100",
    //   shortName: "Messi"
    // }
    // searchResults.push(appo)
    // let playerFilePath = "./data/players/LionelMessi0.json"

    // let playerFilesPaths = []
    for (const player in this.props.playersIndex) {
      // playerFilesPaths.push(this.props.playersIndex[player])
      let playerFilePath = this.props.playersIndex[player]
      let playerFile = this.props.getPlayerFile(playerFilePath)
      playerFile.shortName = playerFile.name.split(' ').slice(-1).join(' ')
      searchResults.push(playerFile)
    }
    this.props.setResults(searchResults)
  }







  // updateSearch = () => {
  //   // Display loading message
  //   // this.setState({
  //   //   value: e.target.value,
  //   //   noMatches: false,
  //   //   isLoading: true
  //   // })
  //   // Prevent adding more than 11 players
  //   if (true) {
  //     // Trigger search
  //     this.getPlayersData()
  //   } else {
  //     this.setState({ isLoading: false })
  //   }
  // }

  // updateValue = newValue => {
  //   this.setState({ value: newValue })
  // }

  render() {
    console.log(this.props)
    // let customPlayer = {
    //   club: {
    //     logo: "./data/images/placeholders/logo.svg",
    //     name: "Unknown FC"
    //   },
    //   id: this.state.value,
    //   name: this.state.value,
    //   positions: ["MC"],
    //   rating: "0",
    //   shortName: this.state.value
    // }
    return (
      <div>
        <div className="Results" style={{
          // height: this.state.value.length > 0 ? "auto" : "0"
          height: "auto"
        }}>
          {
          //   this.props.selectedPlayers.length < 11 &&
          // this.state.value !== "" &&
          this.props.results.map(player => (
            // Create result list from search results
            <SearchResult
              player={player}
              selectPlayer={this.props.selectPlayer}
              // updateValue={this.updateValue}
              // key={`Result${player.id}`}
              // lastPlayerToAdd={this.props.selectedPlayers.length === 10}
              logoPlaceholder={this.props.logoPlaceholder}
              portraitPlaceholder={this.props.portraitPlaceholder}
            />
          ))}
        </div>
      </div>
    )
  }
}
