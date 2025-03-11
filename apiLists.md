# DevTinder APIs

## Auth Router
    Post - /signup
    Post - /login
    Post - /logout

## Profile Router
    get - /profile/view
    Patch  - /profile/edit
    patch - /profile/password

## Connection Request router
    POST - /requests/send/interested/:userId
    POST - /requests/send/ignored/:userId

    ----- POST - /requests/send/:status/:userId

    POST - /requests/review/accepted/:userId
    POST - /requests/review/rejected/:userId

    ----- POST - /requests/review/:status/:userId

## User Router
    GET - /user/requests - pending requests from our side
    GET - /user/connections - our connections
    GET - /user/feeds - get profiles of others

four status - interested / ignored / accepted / rejected


/user/feeds?page=1&limit=5 => 1-5 =>  skip 0 limit 5
/user/feeds?page=2&limit=5 => 6-10 => skip 5 limit 5    skip = (page-1)* limit
/user/feeds?page=3&limit=5 => 11-15 => skip 10 limit 5
