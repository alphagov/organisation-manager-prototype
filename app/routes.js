const express = require('express')
const router = express.Router()

var org_types = require('./data/organisation_types.json')
var org_brand_colours = require('./data/organisation_brand_colours.json')


// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Add your routes here - above the module.exports line
router.get('/create-organisation', function (req, res) {
  res.render('create-organisation', { org_types: org_types })
})

router.get('/organisation-logo', function (req, res) {
  res.render('organisation-logo', { org_brand_colours: org_brand_colours })
})

router.get('/confirm-publish', function (req, res) {
  var data, org_type_formatted, org_brand_formatted
  for (i in org_types) {
    if (org_types[i].value == req.session.data.org_type) {
      org_type_formatted = org_types[i].text
    }
  }

  for (i in org_brand_colours) {
    if (org_brand_colours[i].value == req.session.data.org_logo_brand) {
      org_brand_formatted = org_brand_colours[i].text
    }
  }

  data = {
    org_type_formatted: org_type_formatted,
    org_brand_formatted: org_brand_formatted
  }

  res.render('confirm-publish', data)
})

module.exports = router
