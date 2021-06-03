// Client ID and API key from the Developer Console
var CLIENT_ID = '725974078382-lh6hb3t6qrs46pbjoe20l2rdjlks9o8q.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBfxkH4rQz-rJGTJTf3rL84tTJwhUI6C_Y';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');

/**
  *  On load, called to load the auth2 library and API client library.
  */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
  *  Initializes the API client library and sets up sign-in state
  *  listeners.
  */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    handleAuthClick(); // sign in on init
    authorizeButton.onclick = handleAuthClick;
  }, function (error) {
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
  *  Sign in the user upon button click.
  */
function handleAuthClick(event) {
  // Handle the initial sign-in state.
  let is_signed_in = gapi.auth2.getAuthInstance().isSignedIn.get();
  if (!is_signed_in) {
    gapi.auth2.getAuthInstance().signIn();
  }
  if (is_signed_in) {
    fetchIntentList();
  }
}

/**
  * Print the names and majors of students in a sample spreadsheet:
  */
var IntentDB = {};
function fetchIntentList() {
  return; // DISABLE until we finish migrating to a more permanent home for the list.
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1EsWou1K5nxBdLPvQapdoA9h-s8lg_qjn8fJH64g9izQ',
    range: 'Level 3 Speakable!A2:D',
  }).then(function (response) {
    var range = response.result;
    var last_fixity = "";
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        var hints = row[3].split("\n").filter(function (e) { return e })
          .sort().reverse(); // longest is first, since that's our default

        if (row[0] && row[0].length > 0) {
          last_fixity = row[0];
        }
        IntentDB[row[1]] = {
          fixity: last_fixity,
          notation: row[2],
          speech_hint: hints
        };
      }
    }
    console.log(IntentDB);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}