var express = require('express');
var router = express.Router();
var soap = require('soap');
var nodeCache = require('node-cache');
var balModule = require('../models/homeBALModule');
const myCache = new nodeCache({ stdTTL: 24 * 60 * 60, checkperiod: 24 * 60 * 60 * 0.3, useClones: false });

router.get('/getGraph', function (req, res) {
  var getValue = myCache.get('graphData');
  if (getValue != undefined) {
    res.send(getValue);
  }
  else {
    // var url = 'http://epestodisha.nic.in/DistData.asmx?wsdl';
    // soap.createClient(url, function (err, client) {
    //   if (client != undefined) {
    //     client.Graph_dist_Data(function (err, result) {
    //       if (result.Graph_dist_DataResult != undefined) {
    //         var apiResult = result.Graph_dist_DataResult.diffgram.NewDataSet.Table;
    //         var isSet = myCache.set('graphData', apiResult);
    //         if (isSet) {
    //           var getValue = myCache.get('graphData');
    //           if (getValue != undefined) {
    //             res.send(getValue);
    //           }
    //         }
    //       }
    //       else {
    //         res.send();
    //       }
    //     });
    //   }
    // });
    balModule.getGraphData().then(function success(response) {
      if (response.length > 0) {
        var apiResult = response;
        var isSet = myCache.set('graphData', apiResult);
        if (isSet) {
          var getValue = myCache.get('graphData');
          if (getValue != undefined) {
            res.send(getValue);
          }
        }
      }
      else {
        res.send();
      }
    }, function error(response) {
      console.log(response.status);
    }).catch(function err(error) {
      console.log('An error occurred...', error);
    });
  }
});

module.exports = router;
