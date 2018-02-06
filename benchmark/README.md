# Bechnmark

The first version of `expander` HTTP server was written in Ruby in 2 different ways and in NodeJS.

The server responds to requests like `/:key`, e.g., `/123`, with values from Redis matching that key.

The benchmark targeted `expander` and was done on a brand new VPS - AWS EC2 instance:
- Type: t2.micro
- AMI ID: Amazon Linux 2 LTS Candidate AMI 2017.12.0.20180115 x86_64 HVM GP2
- Memory: 1GiB
- vCPU: 1

The following packages were installed:
- Ruby 2.5.0
- NodeJS 9.4.0
- Redis
- [wrk](https://github.com/wg/wrk) benchmarking tool

`redis-server` was started and a single key-value was put in there using `redis-cli`: [screenshot](https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/redis.png)

One by one each version of `expander` was boot up and benchmarked. Here's how they were bootup and their responses:

- [`ruby-multithreaded`](https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/start-ruby-multithreaded.png)
- [`ruby-event-machine`](https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/start-ruby-event-machine.png)
- [`nodejs`](https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/start-nodejs.png)

Then `wrk` was run for `1 minute` bombarding each `expander` server with requests using `100` threads and keeping `1000` simultaneous connections.

## Results

### `ruby-multithreaded`

<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/wrk-ruby-multithreaded.png" width="670px" />

### `ruby-event-machine`

<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/wrk-ruby-event-machine.png" width="617px" />

### `nodejs`

<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/wrk-nodejs.png" width="676px" />
