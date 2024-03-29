# Link Too Big [libi.me](https://libi.me)

**⚠️ I had to shut it down to allocate more resources for my [other project](https://github.com/vfeskov/gitpunch). Submit an issue if you have any questions ⚠️**

Ever got tired of them huge links? Just feed them to [libi.me](https://libi.me) and get super tiny ones instead

Unlike https://bitly.com/ it supports internationalized links, e.g., http://한국.icom.museum

<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/in-action.gif" width="382px" />

## How to run

Install Docker and do: `docker-compose up`, go to http://localhost:20000

It's deployed to AWS EB using: [Dockerrun.aws.json](https://github.com/vfeskov/link-too-big/blob/master/Dockerrun.aws.json)

## Architecture

See [ARCHITECTURE](https://github.com/vfeskov/link-too-big/blob/master/ARCHITECTURE.md)

## Benchmark

I benchmarked HTTP server serving Redis values written with:
- Ruby making new thread on each request
- Ruby with event-machine
- NodeJS

See [BENCHMARK](https://github.com/vfeskov/link-too-big/tree/master/benchmark/README.md)

## Notes

See [NOTES](https://github.com/vfeskov/link-too-big/blob/master/NOTES.md)

## License

MIT, see [LICENSE](https://github.com/vfeskov/link-too-big/blob/master/LICENSE)

----------


[Leave a star if you like it ♥](https://github.com/vfeskov/link-too-big)
