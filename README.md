# Link Too Big [libi.me](https://libi.me)

Ever got tired of them huge links? Just feed them to [libi.me](https://libi.me) and get a super tiny ones instead

<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/in-action.gif" width="382px" />

I made this to:
- Implement distributed microservice architecture
- Make the whole thing runnable with a single command
- Explore Ruby core API
- See how fast Ruby can go, compare different ways vs. NodeJS
- Explore [Redis](https://redis.io/) database
- Explore [Poi](poi.js.org) with [Vue](https://vuejs.org/) + JSX
- Make good UX

## How to run

Install Docker and do: `docker-compose up`, go to http://localhost:20000

It's deployed to AWS EB using: [Dockerrun.aws.json](https://github.com/vfeskov/link-too-big/blob/master/Dockerrun.aws.json)

## Architecture

TBD

## Benchmark

I benchmarked HTTP server serving Redis values written with:
- Ruby making new thread on each request
- Ruby with event-machine
- NodeJS

See [BENCHMARK](https://github.com/vfeskov/link-too-big/tree/master/expander/benchmark/README.md)

## Notes

TBD

## License

MIT, see [LICENSE](https://github.com/vfeskov/link-too-big/blob/master/LICENSE)

----------


[Leave a star if you like it ♥](https://github.com/vfeskov/link-too-big)
