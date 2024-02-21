## Todo

- [x] create dbs on Mongo Atlas
  - [x] development
  - [x] production
- [x] plan things out
- [x] create skeleton project
- [x] create models
- [x] create db scripts
- [x] basic route handlers (...)
- [x] upgrade member
- [x] upgrade admin
- [x] delete message
- [x] display links in places we need them
- [x] create new message
- [x] downgrade user membership
- [x] downgrade user admin
- [x] constrain inputs in every form
- [x] styles
- [ ] hosting
- [ ] setup db production

## Assignment

- [x] Models db
  - [x] User
    - [x] full-names (first + last)
    - [x] usernames (can use email for uniqueness)
    - [x] passwords
    - [x] create message
    - [x] membership (optional)
    - [x] admin (optional)
  - [x] Message
    - [x] title
    - [x] timestamp
    - [x] some text
    - [x] author
- [x] Setup db on Mongo
- [x] Generate or create project skeleton
- [x] Create Models
- [x] Create db scripts
  - [x] `clear`
  - [x] `total`
  - [x] `populate`
- [x] `signup` form to add normal user to db
  - [x] sanitize and validate information
  - [x] secure passwords with `bcrypt`
  - [x] another field `confirmPassword` and validate with custom validator
  - [x] should not automatically given membership status nor admin status
  - [x] user should navigate to `upgrade` to be able to upgrade to `membership` or `admin`
- [x] `login` form using `passport`
- [x] "Create new message" link
  - [x] only show if user is logged in
  - [x] navigate to create new message form
  - [x] if user try to navigate to the route without logging in, `redirect` them to `login` route
- [x] `home-page`
  - [x] logged in normal user can see messages
  - [x] logged in membership user can see messages + author + time
  - [x] logged in admin user can see messages + author + time + delete message button
- [x] Authorization be like
  - [x] not logged in user can
    - [x] READ messages
  - [x] logged in normal user can
    - [x] READ messages
    - [x] CREATE messages
  - [x] logged in membership user can
    - [x] READ messages + author + time
    - [x] CREATE messages
  - [x] logged in admin user can
    - [x] READ messages + author + time
    - [x] CREATE messages
    - [x] DELETE messages
- [ ] host this app on `fly.io`?
- [x] remember to switch to the right db in `app.js`

## Imagine Route Handlers

- [x] handle `/` with `app.set('/', indexRouter);`
  - [x] `/` this route will be used to display all messages ever been made
    - [x] on `get` will display messages, and current user's authorization
      - [x] `is not logged in`
        - [x] `anonymous` see `login` and `signup` link
          - [x] will navigate to `/login` and `/signup` with `get` request
      - [x] `is logged in`
        - [x] `normal` see `upgrade-member` and `upgrade-admin`
          - [x] navigate to `/user/:id/upgrade/member` or `/user/:id/upgrade/admin` with `get`
        - [x] `member` see `downgrade-member` and `upgrade-admin`
          - [x] navigate to `/user/:id/downgrade/member` with `get` and redirect back to `/`
          - [x] navigate to `/user/:id/upgrade/admin` with `get`
        - [x] `admin` see `downgrade-admin` and `delete-message` link
          - [x] navigate to `/user/:id/downgrade/admin` with `get` and redirect back to `/`
          - [x] navigate to `/message/:id/delete` with `get`
        - [x] all will see `logout` link
          - [x] navigate to `/logout` with `get` and redirect back to `/` after logging out
      - [x] all will see `new-message` link
        - [x] if `is not logged in` then navigate to `/login`
        - [x] if `is logged in` then navigate to `/user/:id/create`
  - [x] `/login`
    - [x] on `get` will serve a form with `username` and `password` and a link `signup` in case they don't have account
    - [x] on `post` will authenticate and let user in
  - [x] `/signup`
    - [x] on `get` will serve a form with
      - [x] `fullname`
      - [x] `username`
      - [x] `password`
      - [x] `confirm-password`
      - [x] and a link `log-in` in case they already had an account
    - [x] on `post`
      - [x] if `valid` will add user to db
      - [x] if `invalid` will serve this form again with pre-filled information and `errors` (should not let this even happen in the front end)
  - [x] `/message/:id/delete`
    - [x] on `get` will serve a form to confirm `delete`
    - [x] on `post` will delete message with match `id`
  - [x] `/logout` on `get` will end current account's session
  - [x] `/about` on `get` will serve a static page
- [x] handle `/user` with `app.set('/user', userRouter);`

  - [x] `/user/:id/create`
    - [x] on `get`
      - [x] if not logged in go to `/login`
      - [x] if logged in
    - [x] on `post` will create a message with `user: req.params.id`
  - [x] `/user/:id/upgrade/member`
    - [x] on `get` will serve a form to confirm `MEMBER_PASSCODE`
    - [x] on `post`
      - [x] if correct will upgrade current user to `member: true`
      - [x] if wrong will serve form again
  - [x] `/user/:id/upgrade/admin`
    - [x] on `get` will serve a form to confirm `ADMIN_PASSCODE`
    - [x] on `post`
      - [x] if correct will upgrade current user to `admin: true`
      - [x] if wrong serve form again
  - [x] `/user/:id/downgrade/member` on `get` will immediately set `member: false` and navigate back to `/`
  - [x] `/user/:id/downgrade/admin` on `get` will immediately set `admin: false` and navigate back to `/`

- [x] i realize that in order to use custom validation, I have to `throw Error()` or return a rejected promise, and not return `false`, which doesn't do anything
- [x] I realized that if we put a space after parent element in `pug` will cause a bug

```js
h2<space> // this will cause a bug
	strong Some dummy text here
```

- [x] realized that we can use other user's identity by logged in but create with different user's id URL
- [x] realize that we store whole mongoose document reference in a document's field to user `populate` instead of store the `.id` only, so when we create new message we have to store the whole `user` reference (of the document search in db) document instead of the `req.params.id` only
- [x] realize that chatgpt write better regex than me, use that will save my time
- [x] realize that use Vim to edit **pug** cause me a indentation **bug**, I don't know why Vim use something different from VScode

```js
// those will cause a bug
<1 tab   >div
<2 spaces>div
```

- [x] realize that we always need db scripts for development
- [x] [[members-only-screenshot.png]]
- [x] realize that when I change environment to `production` I can't login because in my local development, `localhost:3000` will use `http` and the `session.cookie.secure = true` don't allow me to do that (that's right, can't believe it takes me seconds to debug this), I have to keep this in mind when use SaaS to host (luckily that `glitch` host with `https`)
- [x] I thought it's because I change something in the code base that make me logout every time but I forgot that i set the cookie to 2 minutes and that's why when I edited the code (which is probably more than 2mins) will result a logout
