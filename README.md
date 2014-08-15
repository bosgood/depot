depot
=====

Ships it for you. Lets you deploy and manage static JS apps, serves up the `index.html` for you.

### Rationale

This project was inspired by a few posts \[[1](https://medium.com/@feifanw/framework-agnostic-fast-zero-downtime-javascript-app-deployment-df40cf105622)\] \[[2](http://blog.abuiles.com/blog/2014/07/08/lightning-fast-deployments-with-rails/)\] about how to serve static asset-based JavaScript apps from a Rails server. The basic problem:

* You have a single page app, you don't want to serve it from a real backend.
* You need to manage deployments and cache-busting in a sane manner.

The general solution:

* Run `depot` somewhere behind your load balancer.
* Develop, compile and package your application as usual.
* When ready, send your `index.html` to depot with the version number.
* For your site URL, proxy the address to `<depot_url>/serve/<app_name>`.
  * Be sure to pass through additional parameters, so different versions can be served, e.g., `<depot_url>/serve/<app_name>/<version>`.

### Details

* `depot` serves your `index.html` for you, of any version you ask for, or `latest` if none is provided. This allows you to deploy a version of your application and have it testable in production without "promoting" it to `latest`.

## Implementing depot persistence yourself

### Implementing a `Connection` adapter

All methods are async and follow the standard node pattern:

```js
function(err, contents) { ... }
```

Implement the methods in the interface [`Connection`](https://github.com/bosgood/depot/blob/master/src/connection.js) following the reference implementations for either [Redis](https://github.com/bosgood/depot/blob/master/src/connections/redis-connection.js) or [MongoDB](https://github.com/bosgood/depot/blob/master/src/connections/mongo-connection.js).

## Internals

### Schema Details

```
SCHEMA
├── applications [
│   └── application
│         └─── String name (applicationId)
│         └─── String urlSlug
│         └─── Date createdAt
│     ...
│   ]
│
├── application versions [
│   └── version
│         └─── String applicationId
│         └─── String versionId
│         └─── String contents
│         └─── Date createdAt
│     ...
│   ]
```