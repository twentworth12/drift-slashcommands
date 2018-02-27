const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('superagent');

const DRIFT_TOKEN = process.env.BOT_API_TOKEN

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'
const CONTACT_API_BASE = 'https://driftapi.com/contacts'


function handleMessage(orgId, data) {
  if (data.type === 'private_note') {
    const messageBody = data.body
    const conversationId = data.conversationId

    if (messageBody.startsWith('/googlethat')) {
      console.log("Yeah! We found a /googlethat message!!!")
      return readMessage(conversationId, orgId)
    }
  }
}



// Get the email address from Drift
function getContactEmail (contactId, callbackFn, conversationId, orgId) {


	request
	  .get(CONTACT_API_BASE + `${contactId}`)
	  .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
	  .set('Content-Type', 'application/json')
	  .end(function (err, res) {
	  
	  console.log("socialProfile Email is " + res.body.data.attributes.socialProfiles.email)
	  
	  if (typeof res.body.data.attributes.email != 'undefined') {
	  	emailAddress = res.body.data.attributes.email
	  	} else 
	  	 	{  
	  	 	if (typeof res.body.data.attributes.socialProfiles.email != 'undefined') {
	  	 		emailAddress = res.body.data.attributes.socialProfiles.email
	  	 	}
	  	 }	  	
	  
			callbackFn(emailAddress, conversationId, orgId)
		 });
	}

function GetContactEmail(emailAddress, conversationId, orgId) { 
    return returnSFAccessToken(emailAddress, ReturnSFAccessToken, conversationId, orgId)
}

function postMessage(body, conversationId, orgId) { 

		
    const message = {
    'orgId': orgId,
    'body': body,
    'type': 'private_prompt',
  	}
  
    
  	// Send the message
    request
    .post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
    .send(message)
    .catch(err => console.log(err))
        
}

app.use(bodyParser.json())
app.listen(process.env.PORT || 3000, () => console.log('googlethat listening on port 3000!'))
app.post('/api', (req, res) => {
  
  if (req.body.type === 'new_message') {
      handleMessage(req.body.orgId, req.body.data);  
  }
  return res.send('ok')
})
