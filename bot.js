const Botkit = require('botkit');
var request = require('request');
const http = require('http');

if (!process.env.token) {
	console.log('Error: Specify token in environment');
	process.exit(1);
}

const controller = Botkit.slackbot({
	debug: false
});

controller.spawn({
	token: process.env.token
}).startRTM(function(err){
	if (err) {
		throw new Error(err);
	}
});


var context = '';
var mode = 'dialog';
var place = '大阪';
var t = '20';

controller.hears('', ['direct_message,direct_mention,mention'], function(bot, message) {
		console.log(message);
    var options = {
        url: 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=434c77655678346836627944586d71637846667765786150374441336a534c77414449594f476169425544',
        json: {
            utt: message.text,
            place: place,
            t:t,

            // 以下2行はしりとり以外の会話はコメントアウトいいかも
            // 会話を継続しているかの情報
            context: context,
            mode: mode
        }
    }

    //リクエスト送信
    request.post(options, function (error, response, body) {
        context = body.context;
        mode = body.mode;

        bot.reply(message, body.utt);
    })

});
