depot
=====

Ships it for you. Lets you deploy and manage static JS apps, serves up the `index.html` for you. [https://github.com/bosgood/depot](https://github.com/bosgood/depot)

### Rationale

This project was inspired by a few posts about how to serve static asset-based JavaScript apps from a Rails server. The basic problem:

* You have a single page app, you don't want to serve it from a real backend.
* You need to manage deployments and cache-busting in a sane manner.

The general solution:

* Run depot somewhere behind your load balancer.
* Develop, compile and package your application as usual.
* When ready, send your `index.html` to depot with the version number.
* For your site URL, proxy the address to `depot_url/app_name/latest`.

### Details

* `depot` serves your `index.html` for you, of any version you ask for, or `latest` if none is provided. This allows you to deploy a version of your application and have it testable in production without "promoting" it to `latest`.

## Implementing depot persistence yourself

### Implementing a `Connection` adapter

All methods are async and follow the standard node pattern:

```js
function(err, contents) { ... }
```

* `connect`: establishes a connection to the database or store
* `getLatest`: gets the latest app bundle

### Storing

* An application version is:
  * `String versionId`: uniquely identifies the application version
  * `String indexPage`: the contents of `index.html`
  * `Date createdDate`: the date this version was deployed

## Internals

### Schema Details

```
SCHEMA
├── applications [
│   └── application
│         └─── String name
│         └─── String urlSlug
│         └─── Date createdDate
│     ...
│   ]
│
├── application versions [
│   └── version
│         └─── String versionId
│         └─── String indexPage
│         └─── Date createdDate
│     ...
│   ]
```