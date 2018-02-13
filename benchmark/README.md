# Benchmark

> [Old benchmark](https://github.com/vfeskov/link-too-big/blob/89549fbc52620d96ffd208fc213548d25730a609/benchmark/README.md) showing crazy numbers was wrong, because it was done on `t2` instance with dynamic CPU and because `wrk` benchmarking tool was run on the same machine as the benchmarked servers making them all compete for resources

The first version of `expander` HTTP server was written in Ruby in 2 different ways and in NodeJS, see [source code](https://github.com/vfeskov/link-too-big/tree/master/benchmark)

The server responds to requests like `/:key`, e.g., `/123`, with value from Redis matching that key.

The benchmark targeted `expander` and was done on 2 identical clean AWS EC2 instances:
- Type: `m5.large` (fixed CPU unlike `t2` instances)
- AMI ID: Amazon Linux 2 LTS Candidate AMI 2017.12.0.20180115 x86_64 HVM GP2
- Memory: 8GiB
- vCPU: 2
- Storage: General purpose SSD

The following packages were installed on both:
- Ruby 2.5.0
- NodeJS 9.4.0
- Redis
- [wrk](https://github.com/wg/wrk) benchmarking tool

On the **first instance** `redis-server` was started and a single key-value was put in there using `redis-cli`: [screenshot](https://raw.githubusercontent.com/vfeskov/link-too-big/master/benchmark/redis.png). Then each version of  `expander` was boot up and it's port exposed worldwide. Here's how they were bootup and what their responses were:

- [`ruby-multithreaded`](https://raw.githubusercontent.com/vfeskov/link-too-big/master/benchmark/start-ruby-multithreaded.png)
- [`ruby-event-machine`](https://raw.githubusercontent.com/vfeskov/link-too-big/master/benchmark/start-ruby-event-machine.png)
- [`nodejs`](https://raw.githubusercontent.com/vfeskov/link-too-big/master/benchmark/start-nodejs.png)

On the **second instance** `wrk` command was run benchmarking every `expander` server 8 times for `10` minutes each, e.g., `wrk -d10m -t2 -c2 http://172.31.14.187:20000/286`

## Result requests/second
|wrk [args](https://github.com/wg/wrk#command-line-options)|[ruby-event-machine](https://github.com/vfeskov/link-too-big/tree/master/benchmark/ruby-event-machine)|[ruby-multithreaded](https://github.com/vfeskov/link-too-big/tree/master/benchmark/ruby-multithreaded)|[nodejs](https://github.com/vfeskov/link-too-big/tree/master/benchmark/nodejs)|
|-|-|-|-|
|`-t1 -c1`|`4299.86`|`3894.52`|`1769.91`|
|`-t1 -c2`|`2874.67`|`91.43`|`1310.77`|
|`-t1 -c5`|`1312.45`|`1128.25`|`1228.33`|
|`-t1 -c10`|`1258.38`|`1086.58`|`1117.10`|
|`-t2 -c2`|`2371.51`|`115.49`|`62.03`|
|`-t5 -c5`|`1667.64`|`228.10`|`145.61`|
|`-t10 -c10`|`1560.22`|`443.37`|`391.76`|
|`-t10 -c100`|`1861.85`|`1664.48`|`1785.36`|

`-tX -cY` means benchmarking command was:
```
wrk -d10m -tX -cY http://benchmarked-server-address/286
```
where `-t` is number of threads and `-c` is number of simultaneous connections.

Full `wrk` logs can be found here: [wrk.log](https://github.com/vfeskov/link-too-big/tree/master/benchmark/wrk.log), server addresses were:
- `http://172.31.14.187:10000` - `ruby-event-machine`
- `http://172.31.14.187:20000` - `ruby-multithreaded`
- `http://172.31.14.187:30000` - `nodejs`

## Run your own benchmarks

The instance's image was saved and is publicly available in case you want to reproduce the benchmark or run a different one:
- AMI Name: `benchmark-ruby-nodejs`
- AMI ID: `ami-aae38ad3`

To start servers do
```
rvm install ruby-2.5.0
gem install bundler
cd ~/link-to-big/benchmark/ruby-event-machine
bundle
PORT=10000 nohup ruby server.rb &

cd ~/link-to-big/benchmark/ruby-multithreaded
bundle
PORT=20000 nohup ruby server.rb &

cd ~/link-to-big/benchmark/nodejs
npm install
PORT=30000 nohup node server.js &
```

And expose `10000`, `20000` and `30000` ports in security group of the instance
