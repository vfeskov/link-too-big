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

The results will follow shortly
