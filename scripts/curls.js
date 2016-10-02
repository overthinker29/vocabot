
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=EAAPZBXjOvZBmwBAHmK8fjjFnVsIury78jZA5ZBRfXHiYsBW4d25weKRFeaMa9uxLYVPnhxrDUgvQZCTwuZAGU4uw3pcid1CNZAheqGsoXth1eDoJR4SZAC4yu9ExXME9tv2znouBYnijGmfpYuTYuSDzk29Y4fxLpCf4l5mmy4zFUQZDZD"

curl -X POST -H "Content-Type: application/json" -d '{                                                                                                                              "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "payload":"FIRST_MESSAGE"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAPZBXjOvZBmwBAHmK8fjjFnVsIury78jZA5ZBRfXHiYsBW4d25weKRFeaMa9uxLYVPnhxrDUgvQZCTwuZAGU4uw3pcid1CNZAheqGsoXth1eDoJR4SZAC4yu9ExXME9tv2znouBYnijGmfpYuTYuSDzk29Y4fxLpCf4l5mmy4zFUQZDZD"

curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"postback",
      "title":"Random word",
      "payload":"RANDOM_WORD"
    },
    {
      "type":"postback",
      "title":"About Developer",
      "payload":"ABOUT_ME"
    },
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAPZBXjOvZBmwBAHmK8fjjFnVsIury78jZA5ZBRfXHiYsBW4d25weKRFeaMa9uxLYVPnhxrDUgvQZCTwuZAGU4uw3pcid1CNZAheqGsoXth1eDoJR4SZAC4yu9ExXME9tv2znouBYnijGmfpYuTYuSDzk29Y4fxLpCf4l5mmy4zFUQZDZD