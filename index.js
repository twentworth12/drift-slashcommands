const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('superagent');

// Set this in Heroku
const DRIFT_TOKEN = process.env.BOT_API_TOKEN

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'

function handleMessage(orgId, data) {
  if (data.type === 'private_note') {
    console.log("Drift private note")
    const messageBody = data.body
    const conversationId = data.conversationId

    // Okay, what command did we get
    if (messageBody.startsWith('/googlethat')) {
      console.log("Yeah! We found a /googlethat message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }
    if (messageBody.startsWith('/community')) {
      console.log("Yeah! We found a /community message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }
    if (messageBody.startsWith('/docs')) {
      console.log("Yeah! We found a /community message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }	  
    if (messageBody.startsWith('/winning')) {
      console.log("Yeah! We found a /winning message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }	  
  }
return
}

// Get the email address from Drift
function readMessage (conversationId, orgId, messageBody) {
	request
	  .get(CONVERSATION_API_BASE + `${conversationId}` + "/messages/")
	  .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
	  .set('Content-Type', 'application/json')
	  .end(function (err, res) {
		return googleThat(conversationId, orgId, GoogleThat, messageBody)
	   });
}

function googleThat (conversationId, orgId, callbackFn, messageBody) {
	
	var body = "";
	var google = require('google')

	google.resultsPerPage = 5
	var nextCounter = 0

	// Each of these changes the Google search query
	if (messageBody.startsWith('/community')) {
		var query = "site:community.rapidminer.com" + messageBody.substr(10);
	} else if (messageBody.startsWith('/winning')) {
		// no matter what
		callbackFn("https://www.youtube.com/watch?v=GGXzlRoNtHU", conversationId, orgId);
		return;
		
	} else if (messageBody.startsWith('/docs')) {
		var query = "site:docs.rapidminer.com" + messageBody.substr(5);
	}
	else
		{
		var query = messageBody.substr(11);
	}
	
	google(query, function (err, res){
  		if (err) console.error(err)
		// Generate the search results in a string
		  for (var i = 0; i < 4; ++i) {
		    var link = res.links[i];
		    body = "<p>Let me know if this link helps: <a target=_blank href=" + link.href + ">" + link.title + "</a><br/>" + "</p>";
		    callbackFn(body, conversationId, orgId);
		  }
		})
}

function GoogleThat (body, conversationId, orgId) {
    return postMessage(body, conversationId, orgId);
}
	       
function postMessage(body, conversationId, orgId) { 	

  const message = {
    'orgId': orgId,
    'body': body,
    'type': 'private_prompt',
    'buttons': [{
      'label': 'Send This Result',
      'value': body,
      'type': 'reply',
      'style': 'primary',
      'reaction': {
        'type': 'delete'
      }
    },]
  }   
    
    // Send the message
    request
    .post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
    .send(message)
    .catch(err => console.log(err))
    return
}

app.use(bodyParser.json())
app.listen(process.env.PORT || 3000, () => console.log('googlethat listening on port 3000!'))
app.post('/api', (req, res) => {
  
  if (req.body.type === 'new_message') {
      handleMessage(req.body.orgId, req.body.data); 
  }
  return res.send('ok')
})
