'use strict';
// import registerServiceWorker from './registerServiceWorker';

// Crea tabella con tutti i giocatori in searchResults

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search() {
    _classCallCheck(this, Search);

    return _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));
  }

  _createClass(Search, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "table",
        { className: "Results table table-sm table-hover" },
        React.createElement(
          "thead",
          { className: "thead-light" },
          React.createElement(
            "tr",
            { key: "header" },
            React.createElement(
              "th",
              { key: "nome", scope: "col" },
              "Nome"
            ),
            React.createElement(
              "th",
              { key: "forza", scope: "col" },
              "Forza"
            ),
            React.createElement(
              "th",
              { key: "ruoli", scope: "col" },
              "Ruoli"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          this.props.searchResults.map(function (player) {
            return (
              // Render di singola riga per giocatore
              React.createElement(SearchResult, {
                player: player,
                selectPlayer: _this2.props.selectPlayer,
                selectedPlayers: _this2.props.selectedPlayers
                // logoPlaceholder={this.props.logoPlaceholder}
                // portraitPlaceholder={this.props.portraitPlaceholder}
              })
            );
          })
        )
      );
    }
  }]);

  return Search;
}(React.Component);

// Popola riga per il giocatore nella tabella


var SearchResult = function (_React$Component2) {
  _inherits(SearchResult, _React$Component2);

  function SearchResult(props) {
    _classCallCheck(this, SearchResult);

    var _this3 = _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).call(this, props));
    // CHK: questo forse non serve


    _this3.checkedSelection = function () {
      var appo = [];
      for (var player in _this3.props.selectedPlayers) {
        appo.push(_this3.props.selectedPlayers[player].id);
      }
      if (_this3.props.selectedPlayers.length < 11 && !appo.includes(_this3.props.player.id)) {
        _this3.props.selectPlayer(_this3.props.player);

        // evidenzia i giocatori gia selezionati
        // ReactDOM.findDOMNode(this).classList.add("table-active")
      }
    };

    _this3.state = {
      // picture: this.props.portraitPlaceholder,
      // logo: this.props.logoPlaceholder,
      pictureBackup: _this3.props.player.photo,
      logoBackup: _this3.props.player.club.logo
    };
    return _this3;
  }

  _createClass(SearchResult, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      // Lazyload player picture
      var actualPicture = new Image();
      actualPicture.addEventListener("load", function () {
        // Replace placeholder with real photo once it's ready
        _this4.setState({ picture: actualPicture.src });
      });
      actualPicture.src = this.state.pictureBackup;
      // Lazyload club logo
      var actualLogo = new Image();
      actualLogo.addEventListener("load", function () {
        // Replace placeholder with real photo once it's ready
        _this4.setState({ logo: actualLogo.src });
      });
      actualLogo.src = this.state.logoBackup;

      // this.deactivateSearchResult()
    }

    // Verifiche su selezione:
    // - se ci sono 11 titolari
    // - se il giocatore è gia selezionato nel lineup

  }, {
    key: "render",


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

    value: function render() {

      return React.createElement(
        "tr",
        {
          key: this.props.player.id.toString()
          // className={this.deactivateSearchResult}
          , className: "Info-player grabbable",
          onClick: this.checkedSelection // DA QUI DEVE PARTIRE DRAG & DROP
        },
        React.createElement(
          "td",
          null,
          React.createElement(
            "p",
            {
              className: "Name",
              key: this.props.player.id.toString()
            },
            " ",
            this.props.player.name
          )
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "p",
            {
              key: this.props.player.id.toString()
            },
            " ",
            this.props.player.rating
          )
        ),
        React.createElement(
          "td",
          null,
          this.props.player.positions.map(function (role) {
            return React.createElement(
              "p",
              {
                className: "Role",
                key: role.toString()
              },
              " ",
              role
            );
          })
        )
      );
    }
  }]);

  return SearchResult;
}(React.Component);

// Seleziona la tattica


var Customize = function (_React$Component3) {
  _inherits(Customize, _React$Component3);

  function Customize() {
    var _ref;

    var _temp, _this5, _ret;

    _classCallCheck(this, Customize);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this5 = _possibleConstructorReturn(this, (_ref = Customize.__proto__ || Object.getPrototypeOf(Customize)).call.apply(_ref, [this].concat(args))), _this5), _this5.toggleTacticMenu = function () {
      var tacticButton = document.querySelector('.Tactic');
      if (tacticButton.classList.contains('expanded')) {
        // Collapse menu
        tacticButton.classList.remove('expanded');
      } else {
        // Expand menu
        tacticButton.classList.add('expanded');
        _this5.outsideClickHandler(tacticButton);
      }
    }, _this5.outsideClickHandler = function (button) {
      document.addEventListener('click', function (e) {
        var isClickInside = button.contains(e.target);
        if (!isClickInside) {
          // User clicked outside
          if (button.classList.contains('Tactic') && button.classList.contains('expanded')) {
            // Collapse tactic menu
            e.preventDefault();
            _this5.toggleTacticMenu();
          }
        }
      });
    }, _temp), _possibleConstructorReturn(_this5, _ret);
  }

  // Apre menu tattiche


  // Gestisce il cambio di tattica


  _createClass(Customize, [{
    key: "render",
    value: function render() {
      var _this6 = this;

      return React.createElement(
        "div",
        { className: "Customize" },
        React.createElement(
          "div",
          {
            className: "Tactic Menu",
            onClick: function onClick() {
              _this6.toggleTacticMenu();
            }
          },
          React.createElement(
            "div",
            { className: "Options" },
            React.createElement(
              "div",
              { "data-tactic": "433", onClick: function onClick() {
                  _this6.props.setActiveTactic('433');
                } },
              "4-3-3"
            ),
            React.createElement(
              "div",
              { "data-tactic": "442", onClick: function onClick() {
                  _this6.props.setActiveTactic('442');
                } },
              "4-4-2"
            ),
            React.createElement(
              "div",
              { "data-tactic": "352", onClick: function onClick() {
                  _this6.props.setActiveTactic('352');
                } },
              "3-5-2"
            ),
            React.createElement(
              "div",
              { "data-tactic": "343", onClick: function onClick() {
                  _this6.props.setActiveTactic('343');
                } },
              "3-4-3"
            ),
            React.createElement(
              "div",
              { "data-tactic": "4231", onClick: function onClick() {
                  _this6.props.setActiveTactic('4231');
                } },
              "4-2-3-1"
            )
          ),
          React.createElement(
            "p",
            { className: "Selected" },
            "Tactic: " + this.props.activeTacticName
          )
        )
      );
    }
  }]);

  return Customize;
}(React.Component);

// Mostra indicatori di posizione sul campo (se liberi)


var PositionIndicator = function (_React$Component4) {
  _inherits(PositionIndicator, _React$Component4);

  function PositionIndicator() {
    _classCallCheck(this, PositionIndicator);

    return _possibleConstructorReturn(this, (PositionIndicator.__proto__ || Object.getPrototypeOf(PositionIndicator)).apply(this, arguments));
  }

  _createClass(PositionIndicator, [{
    key: "render",

    // MEMO: NON FUNZIONA SE CI SONO DUE POSITION CON LO STESSO NOME

    value: function render() {
      return React.createElement("div", {
        className: "PositionIndicator",
        "data-position": this.props.position,
        style: {
          left: this.props.leftValue,
          top: this.props.topValue,
          opacity: this.props.occupied ? "0" : "1"
        }
      });
    }
  }]);

  return PositionIndicator;
}(React.Component);

// Mostra card per ogni giocatore selezionato nella tabella


var PlayerCard = function (_React$Component5) {
  _inherits(PlayerCard, _React$Component5);

  // MEMO: contiene due blocchi:
  // - il primo gestisce il posizonamento in campo sulla posizione preferita disponbile
  // - il secondo regola spostamenti di posizione, cancellazioni e scambi
  // Manca un controllo su posizioni intermedie "distanti" da quelle della tattica (dovrebbe tornare indietro)
  function PlayerCard(props) {
    _classCallCheck(this, PlayerCard);

    var _this8 = _possibleConstructorReturn(this, (PlayerCard.__proto__ || Object.getPrototypeOf(PlayerCard)).call(this, props));

    _this8.matchRoleToPosition = function (role) {
      var position = "";
      if (role === "G") {
        position = "P01";
      } else if (role === "DC") {
        position = "P04";
      } else if (role === "DG") {
        position = "P03";
      } else if (role === "DLG") {
        position = "P03";
      } else if (role === "DD") {
        position = "P02";
      } else if (role === "DLD") {
        position = "P02";
      } else if (role === "MDC") {
        position = "P06";
      } else if (role === "MC") {
        position = "P06";
      } else if (role === "MG") {
        position = "P11";
      } else if (role === "MD") {
        position = "P07";
      } else if (role === "MOC") {
        position = "P10";
      } else if (role === "AD") {
        position = "P07";
        // position.push("10")
      } else if (role === "AG") {
        position = "P11";
      } else if (role === "ATT") {
        position = "P10";
      } else if (role === "BU") {
        position = "P09";
      }
      // console.log(role, position)
      return position;
    };

    _this8.findClosestPosition = function (preferredPosition) {
      var positionIndex = -1;
      var keys = Object.keys(_this8.props.tactic);
      // regola ordine di ricerca da attaccanti a difensori
      keys.sort(function (a, b) {
        return b - a;
      });
      // console.log(keys)
      // Find index of preferred position
      for (var i = 0; i < keys.length; i++) {
        if (preferredPosition === keys[i]) {
          positionIndex = i;
        }
      }
      // Find closest match
      var closestPosition = -1;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var position = _step.value;

          if (closestPosition === -1 || Math.abs(keys.indexOf(position) - positionIndex) < Math.abs(keys.indexOf(position) - closestPosition)) {
            var isAvailable = true;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = _this8.props.occupiedPositions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var occupied = _step2.value;

                if (occupied === position) {
                  isAvailable = false;
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            if (isAvailable) {
              closestPosition = keys.indexOf(position);
            }
          }
        }
        // Add player to pitch
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      _this8.props.positionPlayer(keys[closestPosition], "Player" + _this8.props.player.id);
    };

    _this8.dragStart = function (x, y) {
      _this8.setState({
        isDragging: true,
        originX: x,
        originY: y,
        previousMoveX: _this8.state.previousMoveX,
        previousMoveY: _this8.state.previousMoveY
      });
      if (_this8.state.previousMoveX === undefined) {
        _this8.setState({ previousMoveX: 0 });
      }
      if (_this8.state.previousMoveY === undefined) {
        _this8.setState({ previousMoveY: 0 });
      }
      ReactDOM.findDOMNode(_this8).style.zIndex = "400";
    };

    _this8.dragMove = function (x, y) {
      var currentPos = ReactDOM.findDOMNode(_this8).getBoundingClientRect();
      // console.log(currentPos)
      // console.log(this.props.parentFrame)
      // Prevent dragging outside of Pitch
      // verifica se lo spostamento fa restare il giocatore dentro il campo
      if (currentPos.left >= _this8.props.parentFrame.left && currentPos.right <= _this8.props.parentFrame.right &&
      // Si conta da upper-left corner
      currentPos.top >= _this8.props.parentFrame.top && currentPos.bottom <= _this8.props.parentFrame.bottom)
        // IF TRUE: PalyerCard è dentro Pitch
        {
          // Update data
          _this8.setState({
            differenceX: _this8.state.previousMoveX + x - _this8.state.originX,
            differenceY: _this8.state.previousMoveY + y - _this8.state.originY
          });
          // Move player card visually
          ReactDOM.findDOMNode(_this8).style.transform = "\n        translateX(" + _this8.state.differenceX + "px)\n        translateY(" + _this8.state.differenceY + "px)\n      ";
          // Get card center relatively to Pitch
          // Trova la posizione del centro della Card
          var cardCenterPos = {};
          cardCenterPos.x = 100 * (currentPos.left + currentPos.width / 2 - _this8.props.parentFrame.left) / _this8.props.parentFrame.width;
          cardCenterPos.y = 100 * (currentPos.top + currentPos.height / 2 - _this8.props.parentFrame.top) / _this8.props.parentFrame.height;

          // Snap to position if dragged next to position indicator
          // Confronta centro della card con ogni centoroide "indicator" nella tattica
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = Object.keys(_this8.props.tactic)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var indicator = _step3.value;

              if (indicator !== ReactDOM.findDOMNode(_this8).dataset.activePosition && _this8.getDistance(_this8.props.tactic[indicator].x, _this8.props.tactic[indicator].y, cardCenterPos.x, cardCenterPos.y) < 8 // sono pixel?
              ) {
                  // IF TRUE: se la distanza è minore di 8 pixel
                  var isAvailable = true;
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    for (var _iterator4 = _this8.props.occupiedPositions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var occupied = _step4.value;

                      if (occupied === indicator) {
                        isAvailable = false;
                      }
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }

                  if (_this8.props.playersList.length === 11) {
                    isAvailable = false;
                  }
                  var activePosition = ReactDOM.findDOMNode(_this8).dataset.activePosition;

                  // Swap players if position is occupied
                  if (!isAvailable) {
                    // Do the reverse travel with the other player
                    _this8.props.unoccupyPosition(indicator);
                    var cardToMove = document.querySelector("[data-active-position='" + indicator + "']");
                    _this8.props.positionPlayer(activePosition, cardToMove.classList[1]);
                  } else {
                    // Prepare next drag
                    _this8.props.unoccupyPosition(activePosition);
                    _this8.props.unoccupyPosition(indicator);
                  }
                  _this8.setState({
                    differenceX: 0,
                    differenceY: 0
                  });
                  _this8.dragEnd();
                  _this8.props.positionPlayer(indicator, "Player" + _this8.props.player.id);
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
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        } else {
        // Prevent further dragging
        _this8.dragEnd();
        ReactDOM.findDOMNode(_this8).style.opacity = "0";
        var _activePosition = ReactDOM.findDOMNode(_this8).dataset.activePosition;
        // Delete player after animation end
        window.setTimeout(function () {
          _this8.props.unselectPlayer(_this8.props.player);
        }, 30);
        // Reset position indicator
        _this8.props.unoccupyPosition(_activePosition);
        // Prevent direct downloads
        // this.props.markDownloadAsObsolete()

        // Post player and position to server when removed
        // make JSON
        var appo = JSON.stringify({
          id: _this8.props.player.id,
          position: _activePosition
        });

        // send data to APIs
        fetch('/teams/lineup/api/rm-player', {
          method: 'POST',
          mode: "same-origin", // no-cors, cors, *same-origin
          headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: appo
        });
      }
    };

    _this8.dragEnd = function () {
      _this8.setState({
        isDragging: false,
        previousMoveX: _this8.state.differenceX,
        previousMoveY: _this8.state.differenceY
      });
      ReactDOM.findDOMNode(_this8).style.zIndex = "300";
      // FORSE QUESTO SERVE...?
      // const card = document.querySelector(".PlayerCard.Selected")
      // card.classList.remove("Selected")
    };

    _this8.getDistance = function (x0, y0, x1, y1) {
      // Using Pythagore
      var differenceX = x0 - x1;
      var differenceY = y0 - y1;
      return Math.sqrt(Math.pow(differenceX, 2) + Math.pow(differenceY, 2));
    };

    _this8.state = {
      isDragging: false,
      differenceX: 0,
      differenceY: 0,
      originX: 0,
      originY: 0,
      lastTouch: { x: 0, y: 0 },
      // picture: this.props.portraitPlaceholder,
      pictureBackup: _this8.props.player.photo
      // TODO: invertire picture e pictureBackup?
    };
    return _this8;
  }

  _createClass(PlayerCard, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this9 = this;

      var i = -1;
      // Auto position the player
      // Viene da Pitch: per ogni player in playersList...
      // Per ogni posizione preferita del giocatore...
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        mainLoop: for (var _iterator5 = this.props.player.positions[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var preferredPosition = _step5.value;

          i++;
          // Rinconcilia posizione preferita con ruoli:
          preferredPosition = this.matchRoleToPosition(preferredPosition);
          // MEMO: va in crash se non trovava position nei ruoli (ma ora ruoli fissi da P01 a P11)
          // Verifica se il ruolo è libero:
          for (var position in this.props.tactic) {
            // Ciclo da P01 a P11, nell'ordine contenuto nel json (che non è quello alfanumerico visualizzato in console)
            // Se la posizione preferita è nella tattica:
            if (preferredPosition === position) {
              // Se la posizione preferita è nella tattica ed è disponibile:
              var isAvailable = true;
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = this.props.occupiedPositions[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var occupiedPosition = _step6.value;

                  if (occupiedPosition === position) {
                    isAvailable = false;
                  }
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }

              if (isAvailable) {
                // Position player where he belongs
                this.props.positionPlayer(position, "Player" + this.props.player.id);
                break mainLoop;
              } else if (i === this.props.player.positions.length - 1) {
                // Last loop, add player anyway
                this.findClosestPosition(preferredPosition);
                break mainLoop;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
      // Qui finisce il main loop

      // Lazyload player picture


      var actualPicture = new Image();
      actualPicture.addEventListener("load", function () {
        // Replace placeholder with real photo once it's ready
        _this9.setState({ picture: actualPicture.src });
      });
      actualPicture.src = this.state.pictureBackup;

      // Interazioni GUI
      // Set hover style on desktop
      ReactDOM.findDOMNode(this).addEventListener("mouseenter", function () {
        ReactDOM.findDOMNode(_this9).classList.add("Selected");
      });
      // Remove hover style on desktop
      ReactDOM.findDOMNode(this).addEventListener("mouseleave", function () {
        ReactDOM.findDOMNode(_this9).classList.remove("Selected");
      });
      // Start drag (versione mouse)
      ReactDOM.findDOMNode(this).addEventListener("mousedown", function (e) {
        _this9.dragStart(e.clientX, e.clientY);
        // clientX e clientY sono le coordinate registrate dal browser
        // console.log(e.clientX, e.clientY)
      });
      // Calculate drag distance
      ReactDOM.findDOMNode(this).addEventListener("mousemove", function (e) {
        // Only drag if mouse is being pressed
        if (_this9.state.isDragging) {
          _this9.dragMove(e.clientX, e.clientY);
          // console.log(e.clientX, e.clientY)
        }
      });
      // End drag
      ReactDOM.findDOMNode(this).addEventListener("mouseup", function (e) {
        if (_this9.state.isDragging) {
          _this9.dragEnd(e.clientX, e.clientY);
          // console.log(e.clientX, e.clientY)
        }
      });
    }
    // Qui finisce componentDidMount()

    // ALTRE FUNZIONI
    // Trasforma role/preferredPosition (es. "DC") in position (es. "05")


    // cerca la posizione libera sul campo più simile al ruolo del giocatore
    // TODO: introdurre fascia/piede come discrimine
    // per ora scorre da attaccanti a portiere sulla base dell'indice di tactic


    // Calculate distance between 2 points
    // Invocata per vierificare distanza da centoroidi di tactics

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        {
          className: "PlayerCard Player" + this.props.player.id,
          key: this.props.player.id,
          onDragStart: function onDragStart(e) {
            e.preventDefault();
          }
        },
        React.createElement("img", {
          className: "Portrait",
          src: this.state.picture,
          alt: this.props.player.name
          // onDragStart={ e => { e.preventDefault() } }
        }),
        React.createElement(
          "p",
          null,
          this.props.player.shortName
        )
      );
    }
  }]);

  return PlayerCard;
}(React.Component);

// Visualizza il campo


var Pitch = function (_React$Component6) {
  _inherits(Pitch, _React$Component6);

  function Pitch(props) {
    _classCallCheck(this, Pitch);

    var _this10 = _possibleConstructorReturn(this, (Pitch.__proto__ || Object.getPrototypeOf(Pitch)).call(this, props));

    _this10.getPitchCoords = function () {
      var frame = ReactDOM.findDOMNode(_this10).getBoundingClientRect();
      _this10.setState({ frame: frame });
      // console.log(frame)
      // console.log(this.state)
    };

    _this10.occupyPosition = function (position) {
      if (typeof _this10.state.occupiedPositions.find(function (e) {
        return e === position;
      }) === "undefined") {
        var newPositions = _this10.state.occupiedPositions;
        newPositions.push(position);
        _this10.setState({
          occupiedPositions: newPositions
        });
      }
    };

    _this10.unoccupyPosition = function (position) {
      var newPositions = _this10.state.occupiedPositions;
      // Delete selected position from array
      for (var i = 0; i < _this10.state.occupiedPositions.length; i++) {
        if (_this10.state.occupiedPositions[i] === position) {
          newPositions.splice(i, 1);
        }
      }
      _this10.setState({ occupiedPositions: newPositions });
    };

    _this10.positionPlayer = function (position, selector) {
      var card = document.querySelector("." + selector);
      // Position card
      // x e y sono quelli dentro 4-4-2.json
      // toglie 8.5 e 7.5 per centrare card che è larga 17 e alta 15
      card.style.left = _this10.props.tactic[position].x - 8.5 + "%";
      card.style.top = _this10.props.tactic[position].y - 7.5 + "%";
      card.style.transform = 'unset';
      // console.log(card.style.left)
      // console.log(card.style.top)
      // cosa fa card.style.transform ????
      // Update data
      _this10.occupyPosition(position);
      card.dataset.activePosition = position;

      // Post player and position to server when positioned
      // make JSON
      var appo = JSON.stringify({
        id: selector.replace('Player', ''),
        position: position
      });
      // send data to APIs
      fetch('/teams/lineup/api/add-player', {
        method: 'POST',
        mode: "same-origin", // no-cors, cors, *same-origin
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: appo
      });
    };

    _this10.state = {
      // value: "",
      occupiedPositions: [],
      frame: ""
    };
    return _this10;
  }

  _createClass(Pitch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("resize", this.getPitchCoords);
      this.getPitchCoords();
      // console.log(props)
    }

    // AGGIORNAMENTO TATTICA
    // CHK: fa casino se non c'è ruolo

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // Only trigger if tactic is changed
      if (this.props.tactic !== prevProps.tactic) {
        // Save occupied positions before rearranging positions
        // Dove nasce .state.occupiedPositions?
        var lockedOccupiedPositions = Array.from(this.state.occupiedPositions);
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = lockedOccupiedPositions[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var position = _step7.value;

            var cardToMove = document.querySelector("[data-active-position='" + position + "']");
            var selector = cardToMove.classList[1];
            this.unoccupyPosition(position);
            this.positionPlayer(position, selector);
            // .classList[1] prende la classe dell'elemento player per fare selector per positionPlayer
            // selector è classe dell'elemento player (Es. class="PlayerCard Player190871")
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    }

    // position è ruolo nella tattica (tipo "DD")
    // selector viene da classe dell'elemento player (Es. class="PlayerCard Player190871")
    // quando cambio tattica fa casino se ruolo assegnato non c'è piu

  }, {
    key: "render",


    // ELIMINA TUTTI I GIOCATORI (TODO)
    // toggleDeleteLinuep = () => {
    //   this.props.playersList = []
    // }

    value: function render() {
      var _this11 = this;

      // Create skeleton
      // IL MAP SOVRASCRIVE POSITION CON LO STESSO NOME
      // QUINDI TENGO NOMI DIVERSI IN CARD E TACTICS.JSON
      // COMUNQUE RESTANO SOTTO LE CARD
      return React.createElement(
        "div",
        { className: "Pitch" },
        React.createElement("img", { className: "Outlines", src: "../data/pitch.svg", alt: "Pitch outlines" }),
        React.createElement(
          "div",
          null,
          Object.keys(this.props.tactic).map(function (positionKey) {
            return React.createElement(PositionIndicator, {
              key: positionKey,
              position: positionKey,
              leftValue: _this11.props.tactic[positionKey].x + "%",
              topValue: _this11.props.tactic[positionKey].y + "%",
              occupied: typeof _this11.state.occupiedPositions.find(function (e) {
                return e === positionKey;
              }) !== "undefined"
            });
          }),
          this.props.playersList.map(function (player) {
            return React.createElement(PlayerCard, {
              player: player,
              key: player.id,
              tactic: _this11.props.tactic,
              parentFrame: _this11.state.frame,
              unselectPlayer: _this11.props.unselectPlayer,
              occupiedPositions: _this11.state.occupiedPositions,
              playersList: _this11.props.playersList,
              occupyPosition: _this11.occupyPosition,
              unoccupyPosition: _this11.unoccupyPosition,
              positionPlayer: _this11.positionPlayer
              // markDownloadAsObsolete={this.props.markDownloadAsObsolete}
              // portraitPlaceholder={this.props.portraitPlaceholder}
            });
          })
        )
      )
      // TODO: bottone per eliminare tutto
      // <div
      //   // className="Tactic Menu"
      //   onClick={ () => {this.toggleDeleteLinuep()} }
      // >Refresh</div>
      ;
    }
  }]);

  return Pitch;
}(React.Component);

// Main


var App = function (_React$Component7) {
  _inherits(App, _React$Component7);

  function App(props) {
    _classCallCheck(this, App);

    var _this12 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this12.getSearchResults = function () {
      fetch('/teams/lineup/api/players/myteam').then(function (res) {
        return res.json();
      }).then(function (searchResults) {
        return _this12.setState({ searchResults: searchResults });
      });
      // .then(console.log("team ok"))
    };

    _this12.getSavedLineup = function () {
      fetch('/teams/lineup/api/selected/myteam').then(function (res) {
        return res.json();
      }).then(function (savedLineup) {
        return _this12.setState({ savedLineup: savedLineup });
      });
      // .then(console.log("lineup ok"))
    };

    _this12.setActiveTactic = function (tacticNameBase) {
      if (tacticNameBase === undefined) {
        var tacticName = 'default';
        fetch("/teams/lineup/api/tactic/" + tacticName).then(function (res) {
          return res.json();
        })
        // .then(activeTactic => this.setState({ activeTactic : activeTactic }))
        // .then(console.log("tactic ok"));
        // this.setState({ activeTacticName : tacticName });
        .then(function (jsonData) {
          _this12.setState({ activeTactic: jsonData['tacticData'] });
          _this12.setState({ activeTacticName: jsonData['tacticName'] });
        });
        // console.log(tacticName);
      } else {
        var tacticName = tacticNameBase;
        fetch("/teams/lineup/api/tactic/" + tacticName).then(function (res) {
          return res.json();
        })
        // .then(activeTactic => this.setState({ activeTactic : activeTactic }))
        // .then(console.log("tactic ok"));
        // this.setState({ activeTacticName : tacticName });
        // console.log(tacticName);
        .then(function (jsonData) {
          _this12.setState({ activeTactic: jsonData['tacticData'] });
          _this12.setState({ activeTacticName: jsonData['tacticName'] });
        });
      }
    };

    _this12.showSavedLineup = function () {
      var players = _this12.state.searchResults;
      // per ogni giocatore nel lineup salvato
      for (var i in _this12.state.savedLineup) {
        var playerId = _this12.state.savedLineup[i].id;
        var playerPos = _this12.state.savedLineup[i].position;
        // cerca il giocatore nella squadra
        for (var _i in players) {
          // appena trova il giocatore lo posizona e poi esce dal loop sulla suadra
          if (players[_i].id === playerId) {
            var playerObj = players[_i];
            _this12.selectPlayer(playerObj);
            break;
          }
        }
      }
    };

    _this12.initLineup = function () {
      _this12.getSearchResults();
      _this12.setActiveTactic();
      _this12.getSavedLineup();
    };

    _this12.selectPlayer = function (playerObject) {
      var newSelection = _this12.state.selectedPlayers;
      newSelection.push(playerObject);
      _this12.setState({ selectedPlayers: newSelection });
    };

    _this12.unselectPlayer = function (playerObject) {
      var newSelection = _this12.state.selectedPlayers;
      for (var i = 0; i < _this12.state.selectedPlayers.length; i++) {
        if (_this12.state.selectedPlayers[i] === playerObject) {
          newSelection.splice(i, 1);
        }
      }
      _this12.setState({
        selectedPlayers: newSelection
      });
    };

    _this12.state = {
      searchResults: [],
      activeTactic: [],
      activeTacticName: "",
      selectedPlayers: [],
      savedLineup: []
    };
    return _this12;
  }

  // Prende elenco e info giocatori da API e aggiunge dati a state


  // Prende elenco di giocatori selezionati


  // Prende tattica da API e aggiunge tattica + nome tattica a state


  // Posiziona i giocatori nel lineup salvato


  // initLineup = (callback) => {
  //   this.getSearchResults()
  //   this.setActiveTactic("433")
  //   this.getSavedLineup()
  //   console.log(callback)
  //   callback()
  // }

  // Funzioni comuni a più components (per selezione giocatori)


  _createClass(App, [{
    key: "componentDidMount",


    // Invoca API all'avvio e posiziona giocatori
    value: function componentDidMount() {
      var _this13 = this;

      // https://flaviocopes.com/javascript-async-await/
      this.initLineup();
      // TODO: qui andrebbe usato "await" o qualcosa del genere
      setTimeout(function () {
        return _this13.showSavedLineup();
      }, 30);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "App container" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col" },
            React.createElement(
              "div",
              { className: "Settings" },
              React.createElement(Search, {
                searchResults: this.state.searchResults,
                selectedPlayers: this.state.selectedPlayers,
                selectPlayer: this.selectPlayer
              })
            )
          ),
          React.createElement(
            "div",
            { className: "col" },
            React.createElement(Pitch, {
              playersList: this.state.selectedPlayers,
              unselectPlayer: this.unselectPlayer,
              tactic: this.state.activeTactic
            }),
            React.createElement(
              "div",
              { className: "Settings" },
              React.createElement(Customize, {
                activeTacticName: this.state.activeTacticName,
                setActiveTactic: this.setActiveTactic
              })
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
// registerServiceWorker();