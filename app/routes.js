const express = require('express')
const router = express.Router()

var orgs = require('./data/organisations.json')
var org_types = require('./data/organisation_types.json')
var org_brand_colours = require('./data/organisation_brand_colours.json')


// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Add your routes here - above the module.exports line
router.get('/dashboard', function (req, res) {
  var org_table = []


  for (i in orgs.results) {
    var org = orgs.results[i]

    var org_type = ''
    for (j in org_types) {
      if (org.organisations[0].organisation_type == org_types[j].value) {
        org_type = org_types[j].text
      }
    }

    var org_row = [
      { html: '<a href="/overview/'+org.slug+'">'+org.title+'</a>'},
      { text: org.organisations[0].acronym },
      { text: org_type },
      { text: org.organisations[0].organisation_state.replace(/^\w/, c => c.toUpperCase()) },
      { html: '<a href="/edit/'+org.slug+'">Edit</a>'}
    ]

    org_table.push(org_row)
  }

  res.render('dashboard', { org_table: org_table })
})

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
