import Rebase from 're-base';
import firebase from 'firebase/app';
import database from 'firebase/database';
import 'firebase/auth'; //pulling in the auth service here

const config={
  apiKey: "AIzaSyCohlhFhT9pWNd6vv7PSQH7TtCfqOMoffs",
  authDomain: "playbook-2f966.firebaseapp.com",
  databaseURL: "https://playbook-2f966.firebaseio.com"
}

var app = firebase.initializeApp(config);

const base = Rebase.createClass(app.database());

export default base;
