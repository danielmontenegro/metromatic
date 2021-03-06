'use strict';

var lynx = require('lynx');

function Metromatic () {}

Metromatic.instrument = function (object, options) {
  var self = this;
  var statsd = options.statsd;
  var metrics = options.metrics || [];

  if (!statsd || !statsd.host || !statsd.port) {
    throw new Error('A StatsD host and port are required');
  }

  metrics.forEach(function (metric) {
    metric.events = metric.events || {};

    if (metric.type === 'timing') {
      object.on(metric.eventStart, function (id) {
        id = id || '';
        metric.events[id] = {
          startTime: new Date().getTime()
        };
      });

      object.on(metric.eventStop, function (id) {
        id = id || '';
        var startTime;
        var elapsed;
        if (metric.events[id]) {
          elapsed = new Date().getTime() - metric.events[id].startTime;
          delete metric.events[id];
          self.send(metric.type, metric.name, elapsed);
        }
      });
    }

    if (metric.type === 'gauge') {
      object.on(metric.eventGauge, function (data) {
        self.send(metric.type, metric.name, data || {});
      });
    }
  });

  this.statsd = new lynx(statsd.host, statsd.port);
  object._metrics = metrics;
};

/*
* Send a metric to StatsD
*
* @param {string} type - The StatsD metric type to send
* @param {string} name - The metric name
* @param {*} data - Whatever payload data the metric requires
*/
Metromatic.send = function (type, name, data) {
  var args = [name].concat(data);
  this.statsd[type].apply(this.statsd, args);
};

/*
* Restores the object back to its original form by
* removing all attached values and event listeners from the object.
*/
Metromatic.restore = function (object) {
  object._metrics.forEach(function (metric) {
    if (metric.type === 'timing') {
      object.removeAllListeners(metric.eventStart);
      object.removeAllListeners(metric.eventStop);
    }

    if (metric.type === 'gauge') {
      object.removeAllListeners(metric.eventGauge);
    }
  });

  delete object._metrics;
};

module.exports = Metromatic;
