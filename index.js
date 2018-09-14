const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('superagent');
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

// Set these in Heroku
const DRIFT_TOKEN = process.env.BOT_API_TOKEN

const GOOGLE_TOKEN = process.env.GOOGLE_API_TOKEN
const GOOGLE_CX = process.env.GOOGLE_CX_TOKEN

const IMGFLIP_USER = process.env.IMGFLIP_USER
const IMGFLIP_PASS = process.env.IMGFLIP_PASS


const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'
const IMGFLIP_API_BASE = 'https://api.imgflip.com/caption_image'

function handleMessage(orgId, data) {
  if (data.type === 'private_note') {
    console.log("Drift private note")
    const messageBody = data.body
    const conversationId = data.conversationId

    // Okay, what command did we get
     if (messageBody.startsWith('/woodward')) {
      console.log("Yeah! We found a /justin message!!!")
      return woodwardThat(conversationId, orgId, messageBody)
    }  
    if (messageBody.startsWith('/justin')) {
      console.log("Yeah! We found a /justin message!!!")
      return hayleyThat(conversationId, orgId, messageBody)
    }  
    if (messageBody.startsWith('/googlethat')) {
      console.log("Yeah! We found a /googlethat message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }  
    if (messageBody.startsWith('/meme')) {
      console.log("Yeah! We found a /meme message!!!")
      return memeThat(conversationId, orgId, messageBody)
    }	  
  }
return
}

// Get the email address from Drift
function woodwardThat (conversationId, orgId, messageBody) {
	    
    const driftMessage = {
    'orgId': orgId,
    'body': "https://www.youtube.com/watch?v=QyS_o6lqKS0",
    'type': 'private_prompt',
    }	
	
    // Send the message
    request
    .post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
    .send(driftMessage)
    .catch(err => console.log(err))
    return	

}

// Get the email address from Drift
function hayleyThat (conversationId, orgId, messageBody) {
	    
    const driftMessage = {
    'orgId': orgId,
    'body': "<p>Justin, we must never forget you</p><br/>Blind date: What’s my motivation?<br/>Will these millennial go-getters get each other?<br/><br/>Compiled by Melissa Schorr  March 05, 2016<br/><br/>Justin Levin.<br/>JUSTIN LEVIN: 24 / manager<br/><br/>Last thing he read:Drive, a motivational book<br/><br/>First thing people notice in his home: It is very clean and organized.<br/><br/>HAYLEY MATUSOW: 25 / marketing programs manager<br/><br/>Last thing she read: The 7 Habits of Highly Effective People<br/><br/>First thing people notice in her home: How clean it is<br/><br/>7 P.M. AMELIA’S TRATTORIA, CAMBRIDGE<br/><br/>> TYPECASTING<br/><br/>Justin [I] wanted to try something new.<br/><br/>Hayley My mother has been reading Dinner With Cupid for years. One day I brought a few of the magazines back to my house and my roommates decided to submit me.<br/><br/>Justin [I] showered and got ready.<br/><br/>Hayley I came home, changed, and had a glass of wine with my roommate. It was a bit of a stressful day at work.<br/><br/>Justin She was right on time. I thought she was very cute.<br/><br/>Hayley He was already waiting at the table with two wineglasses. He had ordered us both white wine. I’m more of a red wine person, but I drank it anyway.<br/><br/>Justin The first thing I notice in a girl is her eyes, and she had very pretty eyes.<br/><br/><br/>Hayley Matusow.<br/>Hayley He was cute. Not exactly my type. I tend to be more attracted to brunet men.<br/><br/>> TALK OF THE TOWN<br/><br/>Justin She works in marketing, enjoys going to the gym, and meeting new people. We spoke about Boston, our jobs, past relationships.<br/><br/>Hayley He’s from Jersey but moved to Boston for a job. We talked about our days, what we do. We were both in Greek life at school. We talked about our different experiences.<br/><br/>Justin I ordered chicken breast and it was delicious — just very filling.<br/><br/>Hayley I ordered the butternut squash homemade gnocchi. It had really good reviews online. I was impressed with the food and service.<br/><br/>Justin I just got more comfortable as the date went on. There wasn’t an awkward moment.<br/><br/>Hayley I like to think I can make easy conversation and thought he did as well.<br/><br/>> TRUTH BE TOLD<br/><br/>Justin [After dinner] we went to a bar in Cambridge. It was her idea, since I do not go out to Cambridge a lot. I was excited to continue the date just to see where it would go.<br/><br/>Hayley We each grabbed a beer and chatted more. When [he] asked to hang out later this weekend, I knew I wasn’t interested.<br/><br/>Justin She had plans in the morning and I was meeting up for a friend’s birthday later that night, so after the bar we called separate Ubers.<br/><br/>Hayley I had given him my number, so he said he would text me. I went in for a hug, and he leaned in for a kiss. It was a bit awkward, but I wasn’t able to dodge it when he went in for the second.<br/><br/>> SECOND DATE?<br/><br/>Justin I am really not sure yet.<br/><br/>Hayley There wasn’t really any attraction. He was a bit over enthusiastic for me, and I don’t think our friends would get along.<br/><br/>> POST-MORTEM<br/><br/>Justin / B+Hayley / B+",
    'type': 'private_prompt',
    }	
	
    // Send the message
    request
    .post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
    .send(driftMessage)
    .catch(err => console.log(err))
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

function memeThat (conversationId, orgId, messageBody) {
// Creates a meme using the imgflip API
	
	 if (messageBody.startsWith('/memethat')) {
	   var memeBody = messageBody.slice(10)
           var memeBody1 = memeBody.split(",")
	   console.log("body is " + memeBody1[0])
	   
	   switch (memeBody1[0]) {
		   case "wethebest":
			   var memeChar = "58892453";
			   break;
		   case "car":
			   var memeChar = "125349613";
			   break;
		   case "boromir":
			   var memeChar = "61579";
			   break;
		   case "interesting":
			   var memeChar = "61532";
			   break;
		   case "oprah":
			   var memeChar = "28251713";
			   break;
		   case "drizzy":
			   var memeChar = "71273969";
			   break;   
		   case "wonka":
			   var memeChar = "61582";
			   break;
		   default:
			   var memeChar = "1509839";
	   }
		 
		 
           
	   request
	  .get(IMGFLIP_API_BASE + "?template_id=" + memeChar + "&username=" + IMGFLIP_USER + "&password=" + IMGFLIP_PASS + "&text0=" + memeBody1[1] + "&text1=" + memeBody1[2])
	  .set('Content-Type', 'application/json')
	  .end(function (err, res) {
		var meme = "<img src=" + res.body.data.url + ">"
		console.log("meme is " + meme);
		postMessage(meme, conversationId, orgId)
		return
	   });
	 }
}

function googleThat (conversationId, orgId, callbackFn, messageBody) {
// Searches google using the custom search API
	
	  customsearch.cse.list({
	    cx: GOOGLE_CX,
	    q: messageBody,
	    auth: GOOGLE_TOKEN
	  }, (err, res) => {
	    if (err) {
	      throw err;
	    }
		  
	  for (var i = 0; i < 6; ++i) {
	    if (res.data.items[i] != undefined) {

		var link = res.data.items[i];

		body = "<p><a target=_blank href=" + link.link + ">" + link.title + "</a><br/>" + "</p>";
		callbackFn(body, conversationId, orgId);
		}
	  }	    
  });
	
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
