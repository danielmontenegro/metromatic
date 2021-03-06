# metromatic

Report [StatsD](https://github.com/etsy/statsd) metrics based on events shouted by a given object

## Installation

Install using npm

```
npm install metromatic
```

## Usage

```
var Metromatic = require('metromatic');
Metromatic.instrument(myAPIClient, {
  statsd: {
    host: 'localhost',
    port: 8125
  },
  metrics: [{
    name: 'request_time',
    type: 'timing', // as per lynx methods
    eventStart: 'request',
    eventStop: 'response'
  }, {
    name: 'gauge_foo',
    type: 'gauge',
    eventGauge: 'hey'
  }]
});
```

Eventually, timings and gauges StatsD metrics will be sent when `myAPIClient` emits the `request` and `response` events (for timing) or `hey` event (for gauge).

If you just want to stop listening the object:

```
Metromatic.restore(myAPIClient);
```

To keep track of multiple timings of the same event pass any id string as a parameter when emitting the events to differentiate them.

## Running tests

Run the tests using

```
npm test
```

## Contributing

At the moment supports `timing` and `gauges` metric types. You're more than welcome to express some code love in a Pull Request to make it even more awesome.

Also, if you feel like something is quite not right or want to suggest something, leave us an open issue.

### Future enhancements

* Add more [metric types](https://github.com/etsy/statsd/blob/master/docs/metric_types.md)

## License (MIT)