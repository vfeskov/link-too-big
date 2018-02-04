# Bechnmark

`expander` server receives requests like `/:key` and returns value from Redis matching that key. It was written in [three different ways](https://github.com/vfeskov/link-too-big/tree/master/expander).

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

`redis-server` was started and a single key-value was put in Redis using `redis-cli`:<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/redis.png" width="400px"/>

One by one each version of `expander` was boot up and benchmarked. Here's how they were boot up:

**`ruby-multithreaded`:**<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/start-ruby-multithreaded.png" width="800px" />
<br/>
<br/>
**`ruby-event-machine`:**<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/start-ruby-event-machine.png" width="800px" />
<br/>
<br/>
**`nodejs`:**<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/start-nodejs.png" width="800px" />
<br/>
<br/>
Then `wrk` was run for 1 minute bombarding each `expander` server with requests using `100` threads and keeping `1000` simultaneous connections.

## Results

**`ruby-multithreaded`:**<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/wrk-ruby-multithreaded.png" width="800px" />
<br/>
<br/>
**`ruby-event-machine`:**<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/wrk-ruby-event-machine.png" width="800px" />
<br/>
<br/>
**`nodejs`:**<br/>
<img src="https://raw.githubusercontent.com/vfeskov/link-too-big/master/expander/benchmark/wrk-nodejs.png" width="800px" />
<br/>
<br/>
