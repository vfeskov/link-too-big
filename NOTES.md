# Notes

## Ruby

Event machine turned out to be even a bit more performant than NodeJS. I guess one of the reasons is that NodeJS core API preprocesses request headers, while Ruby just gives them as text.

Code based on event machine though looks pretty shitty compared to classic Ruby, and really awkward compared to JavaScript. My NodeJS server uses async/await syntatic sugar and because of that looks more like classic ruby than event-machine

Perhaps with [Fibers](http://ruby-doc.org/core-2.5.0/Fiber.html) it could look like JS with async/await, although a fiber looks more like a JS generator function

Core API turned out to be extremely basic compared to NodeJS. I had to read HTTP specification and finally I just inspected how [Puma](https://github.com/puma/puma) and [Em::Http::Server](https://github.com/alor/em-http-server) do it

Important lesson learned: when responding with empty body always send an extra line-break after last header, e.g.:

```
HTTP/1.1 301 Moved Permanently
Content-Length: 0
Location: http://google.com
Connection: close
** the extra line-break here  **
```

## NodeJS

Reading request body and limiting it turned out to be super verbose using core API.

I inspected [`raw-body`](https://www.npmjs.com/package/raw-body) and just copied most of it making it on-demand (not a request middleware) and stripping all the NodeJS 0.x nonsense.

Who would've thought that to stop reading request mid-way you had to:

```
request.removeListener('data', onData);
request.removeListener('error', onError);
request.removeListener('end', onEnd);
request.unpipe();
request.pause();
```

TBH I'm not sure if removing listeners is required in latest NodeJS, but upiping AND pausing is, which is confusing.

## [Poi](poi.js.org)
It is AMAZING, look at this [config](https://github.com/vfeskov/link-too-big/blob/master/shortener/client/poi.config.js)

I only had to set proxy URL to my API server. In return I got Webpack-powered pipeline and dev server with JSX, Babel, PostCSS and many other great things.

It even tells you which package to install if you attempt to do something unsupported by default

## [Vue][https://vuejs.org/] + JSX

Attributes like `v-on:submit.prevent` don't play nicely with JSX unfortunately :(

Having to declare Vue components globally instead of importing them feels kind of crappy

[`ref`](https://vuejs.org/v2/api/#vm-refs) attribute is AMAZING
