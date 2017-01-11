var App = React.createClass({
  getInitialState: function() {
    console.log("getInitialState");
    return { stateGameArray: [] };
  },
  getDefaultProps: function(){
    console.log("getDefaultProps");
    return { timerIdArray: [],
             gameDiffArray: []
           };
  },
  getGames: function() {
    var requestUrl = 'json/games.json';
    $.ajax({
      url: requestUrl,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log("getGames");
        var gameArray = data.games.slice();
        this.setState({stateGameArray: gameArray});
        this.appInit(gameArray);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  appInit: function(gameArray) {
    console.log("appInit");
    // Set initial cheers-booos component
    for (var i=0; i<gameArray.length; i++) {
      var cheers_boos_total = parseInt(gameArray[i].cheers_count) + parseInt(gameArray[i].boos_count);

      if (cheers_boos_total > 0) {
        gameArray[i].cheers_width = Math.round(gameArray[i].cheers_count / cheers_boos_total * 100) + '%';
        gameArray[i].boos_width = Math.round(gameArray[i].boos_count / cheers_boos_total * 100) + '%';
      } else {
        gameArray[i].cheers_width = '10%';
        gameArray[i].boos_width = '10%';
      }

      gameArray[i].time_percentage = 0;
      this.gameStats(i, gameArray);
    }
  },
  getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
  },
  gameStats: function(game_num, gameArray) {
    console.log("gameStats");
    console.log("1:game_num: " + game_num);
    var that = this;

    if (game_num < gameArray.length) {
      gameArray[game_num].home_team_score = parseInt(gameArray[game_num].home_team_score) + this.getRandomInt(0,3);
      gameArray[game_num].away_team_score = parseInt(gameArray[game_num].away_team_score) + this.getRandomInt(0,3);
      gameArray[game_num].time_divider = ':';

      if (parseInt(gameArray[game_num].time_left_min) === 0 && parseInt(gameArray[game_num].time_left_sec) === 30) {

        if (gameArray[game_num].half_value === '1H') {
          gameArray[game_num].time_left_min = '20';
          gameArray[game_num].time_divider = ':';
          gameArray[game_num].time_left_sec = '00';
          gameArray[game_num].half_value = '2H';
        } else {
          gameArray[game_num].time_left_min = 'FINAL';
          gameArray[game_num].time_divider = '';
          gameArray[game_num].time_left_sec = '';
          gameArray[game_num].game_state = "final"
          gameArray[game_num].half_value = '';
        }
      } else {
        if (parseInt(gameArray[game_num].time_left_sec) === 30) {
          gameArray[game_num].time_left_sec = '00';

        } else {
          gameArray[game_num].time_left_min = (parseInt(gameArray[game_num].time_left_min) - 1);
          gameArray[game_num].time_left_sec = 30;
        }
      }

      var minutes_left = parseInt(gameArray[game_num].time_left_min) * 60 + parseInt(gameArray[game_num].time_left_sec);
      
      if (gameArray[game_num].half_value === '2H') {
        var time_percentage = (2400 - minutes_left) / 2400;
        gameArray[game_num].time_percentage = time_percentage * 100 + '%';
      } else {
        var time_percentage = (1200 - minutes_left) / 1200;
        gameArray[game_num].time_percentage = time_percentage * 50 + '%';
      }

      var _score_home = document.querySelectorAll('.score_' + game_num + '.home-digits');
      var _score_away = document.querySelectorAll('.score_' + game_num + '.away-digits');

      // LED Score display
      if (gameArray[game_num].home_team_score < 10) {
        this.setNumber(_score_home[0], 0, 1);
        this.setNumber(_score_home[1], gameArray[game_num].home_team_score, 1); 
      }
      if (gameArray[game_num].home_team_score > 10 && gameArray[game_num].home_team_score < 100) {
        this.setNumber(_score_home[0], parseInt(gameArray[game_num].home_team_score.toString().charAt(0)), 1);
        this.setNumber(_score_home[1], parseInt(gameArray[game_num].home_team_score.toString().charAt(1)), 1); 
      }

      if (gameArray[game_num].away_team_score < 10) {
        this.setNumber(_score_away[0], 0, 1);
        this.setNumber(_score_away[1], gameArray[game_num].away_team_score, 1); 
      }
      if (gameArray[game_num].away_team_score > 10 && gameArray[game_num].away_team_score < 100) {
        this.setNumber(_score_away[0], parseInt(gameArray[game_num].away_team_score.toString().charAt(0)), 1);
        this.setNumber(_score_away[1], parseInt(gameArray[game_num].away_team_score.toString().charAt(1)), 1); 
      }

      var game_diff = Math.abs(parseInt(gameArray[game_num].home_team_score) - parseInt(gameArray[game_num].away_team_score));

      if (game_diff > 10) {
        game_diff = 10;
      }

      game_diff = 10 - game_diff;

      $('.game-widget-bkg[data-game='+game_num+']').append('<div class="time-score-rating" style="height:'+(game_diff*10)+'%"></div>');

      if (gameArray[game_num].game_state === "in progress") {
        this.props.timerIdArray[game_num] = setTimeout(function(){that.gameStats((game_num), gameArray)}, 1000);
      } else {
        $('.game-widget-bkg[data-game='+game_num+']').find('.half-value').css('display','none');
        //$('.game-widget-bkg[data-game='+game_num+']').append('<div class="time-score-rating" style="height:'+(game_diff*10)+'%"></div>');
      }
      this.setState({stateGameArray: gameArray});
    } else {
      return;
    }
  },
  stopGameTimers: function(e) {
    console.log("in stoptime");
    e.preventDefault();
    for (var i = 0; i<this.props.timerIdArray.length;i++) {
      clearTimeout(this.props.timerIdArray[i]);
    }
  },
  startGameTimers: function(e) {
    console.log("in starttime");
    e.preventDefault();
    this.getGames();
  },
  handleBoosClick: function (game_index) {

    var localGameArray = this.state.stateGameArray.slice();
    localGameArray[game_index].boos_count = parseInt(localGameArray[game_index].boos_count) + 1;
    
    var boos_cheers_total = parseInt(localGameArray[game_index].boos_count) + parseInt(localGameArray[game_index].cheers_count);
    localGameArray[game_index].boos_width = Math.ceil(localGameArray[game_index].boos_count / boos_cheers_total * 100) + '%';
    localGameArray[game_index].cheers_width = Math.ceil(localGameArray[game_index].cheers_count / boos_cheers_total * 100) + '%';
    
    this.setState({
      stateGameArray: localGameArray
    });
  },
  handleCheersClick: function (game_index) {
    var localGameArray = this.state.stateGameArray.slice();
    localGameArray[game_index].cheers_count = parseInt(localGameArray[game_index].cheers_count) + 1;

    var boos_cheers_total = parseInt(localGameArray[game_index].boos_count) + parseInt(localGameArray[game_index].cheers_count);
    localGameArray[game_index].cheers_width = Math.ceil(localGameArray[game_index].cheers_count / boos_cheers_total * 100) + '%';
    localGameArray[game_index].boos_width = Math.ceil(localGameArray[game_index].boos_count / boos_cheers_total * 100) + '%';

    this.setState({
      stateGameArray: localGameArray
    });
  },

  setNumber: function(digit, number, on) {
    var digitSegments = [
      [1,2,3,4,5,6],
      [2,3],
      [1,2,7,5,4],
      [1,2,7,3,4],
      [6,7,2,3],
      [1,6,7,3,4],
      [1,6,5,4,3,7],
      [1,2,3], 
      [1,2,3,4,5,6,7],
      [1,2,7,3,6]
    ];
    var segments = digit.querySelectorAll('.segment');
    var current = parseInt(digit.getAttribute('data-value'));

    // only switch if number has changed or wasn't set
    if (!isNaN(current) && current != number) {
      // unset previous number
      digitSegments[current].forEach(function(digitSegment, index) {
        setTimeout(function() {
          segments[digitSegment-1].classList.remove('on');
        }, index*45)
      });
    }
    
    if (isNaN(current) || current != number) {
      // set new number after
      setTimeout(function() {
        digitSegments[number].forEach(function(digitSegment, index) {
          setTimeout(function() {
            segments[digitSegment-1].classList.add('on');
          }, index*45)
        });
      }, 250);
      digit.setAttribute('data-value', number);
    }
  },
  componentWillMount: function() {
    console.log("componentWillMount");
  },
  componentDidMount: function() {
    console.log("componentDidMount");
    this.getGames();
  },
  render: function() {
    var that = this;

    return (
      <div>
        <button className='stop-timers' onClick={this.stopGameTimers}>Stop</button>
        <button className='start-timers' onClick={this.startGameTimers}>Start</button>
        <div className="inner-game-bkg main-container-bkg"></div>
        
        <div className="game-wrapper">
        {this.state.stateGameArray.map(function(game_info, index) {
            return <div key={index} className="game-window">
                  <div className="game-widget">
                      <div className="game-widget-header">
                          <GameTimer game_info={game_info} index={index} />
                      </div>
                      <div className="game-widget-content">
                        <HomeTeamInfo game_info={game_info} index={index} />
                        <AwayTeamInfo game_info={game_info} index={index} />
                      </div>
                      <div className="game-widget-footer">
                          <CheersBoosTracker handleBoosClick={that.handleBoosClick} handleCheersClick={that.handleCheersClick} game_info={game_info} index={index} />
                      </div>
                  </div>
              </div>
          })}
        </div>
        <div className="swap-content">
          <SwapTools />
        </div>
      </div>
    );
  }
});

//function HomeTeamInfo (props) {
var HomeTeamInfo = React.createClass({

 render: function() {
  
  return (<div className={"home-team score-widget-bkg"}>
    <div className="home-team-logo">
        <img src={"images/team_logos/"+this.props.game_info.home_team.toLowerCase().replace(' ', '').replace('.', '')+"_sm_big.png"} />
    </div>
    <div className="home-team-name">{this.props.game_info.home_team}</div>
    <div className="clock">
      <div className={"digit home-digits score_"+this.props.index}>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
      </div>

      <div className={"digit home-digits score_"+this.props.index}>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
        <div className="segment"></div>
      </div>
    </div>
  </div>);
 }
});

//function AwayTeamInfo (props) {
var AwayTeamInfo = React.createClass({
 render: function() {

  return (<div className="away-team score-widget-bkg">
      <div className="away-team-logo">
          <img src={"images/team_logos/"+this.props.game_info.away_team.toLowerCase().replace(' ', '').replace('.', '')+"_sm_big.png"} />
      </div>
      <div className="away-team-name">{this.props.game_info.away_team}</div>
      <div className="clock">
        <div className={"digit away-digits score_"+this.props.index}>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>

        <div className={"digit away-digits score_"+this.props.index}>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>
      </div>
  </div>);
 }
});

//function GameTimer (props) {
var GameTimer = React.createClass({
  render: function() {
    //console.log("this.props.game_diff: " + JSON.stringify(this.props.game_diff));
   return (
    <div>
      <div className="game-widget-bkg" data-game={this.props.index}></div>
      <div className="game-time-left-wrapper"><div className="game-time-left">{this.props.game_info.time_left_min}{this.props.game_info.time_divider}{this.props.game_info.time_left_sec}</div>
      <div className="half-value">{this.props.game_info.half_value}</div>
      <div className="game-time-bkg"> </div>
      </div>
    </div>
  );
 }
});

var CheersBoosTracker = React.createClass({
 render: function() {

  return (
  <div>
    <div className="cheers-icon" onClick={this.props.handleCheersClick.bind(null, this.props.index)}>
      <img src="img/cheers.png" />
      </div>
      <div className="cheers-count">{this.props.game_info.cheers_count}</div>
      <div className="cheers" style={{width: this.props.game_info.cheers_width}}></div>
      <div className="boos-count">{this.props.game_info.boos_count}</div>
      <div className="boos-icon" onClick={this.props.handleBoosClick.bind(null, this.props.index)}>
        <img src="img/boos.png" />
      </div>
      <div className="boos" style={{width: this.props.game_info.boos_width}}></div>
      <div className="cheers-label">CHEERS</div><div className="boos-label">BOOOOS</div>
  </div>);
 }
});

var swapTools = React.createClass({
  render: function() {
    return (
          <label for="swap-git-header">Git Repo:</label>
          <div className="swap-git-header">http://www.github.com/mikefordweb</div>

          <div className="swap-section">
            <div className="swap-header">Select a Framework</div>
              <div className="swap-items">
                <div className="swap-item">
                  <div className="swap-item-inner-header">React</div>
                  <img className="swap-item-img" id="react-img" src="img/React.js_logo.svg.png"></img>
                </div>
                <div className="swap-item">
                  <div className="swap-item-inner-header">Angular</div>
                  <img className="swap-item-img" id="angular-img" src="img/angular.png"></img>
                </div>
              </div>
          </div>
          <div className="swap-section">
            <div className="swap-header">Select a JS version</div>
              <div className="swap-items">
                <div className="swap-item">
                  <div className="es-inner">ES5</div>
                </div>
                <div className="swap-item">
                  <div className="es-inner">ES6</div>
                </div>
              </div>
          </div>
      );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('game-wrapper')
);
