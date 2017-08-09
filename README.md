# URL Shortener Microservice | Farahmand Moslemi

## Part 3 of Free Code Camp Backend Challenges

### User stories:
1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.
### Example creation usage:
`https://farahmand-url-shortener-microservice.glitch.me/https://google.com`

`https://farahmand-url-shortener-microservice.glitch.me/http://example.com:80?q1=hello&q2=test`

`https://farahmand-url-shortener-microservice.glitch.me/Hello`

### Example output:
`{"original_url":"http://example.com:80/?q1=hello&q2=test","short_url":"https://farahmand-url-shortener-microservice.glitch.me/6"}`

`{"error":"Invalid Url! Make sure you enter a valid Url."}`

### Example redirection usage:
`https://farahmand-url-shortener-microservice.glitch.me/6`

Redirects to:
`http://example.com:80/?q1=hello&q2=test`