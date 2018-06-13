const express = require('express')
const router = express.Router()

var orgs_import       = require('./data/organisations.json')
var org_types         = require('./data/organisation_types.json')
var org_brand_colours = require('./data/organisation_brand_colours.json')
var org_crests        = require('./data/organisation_crests.json')

var orgs = []
// parse orgs
for (i in orgs_import.results) {
  var imported = orgs_import.results[i].organisations[0]
  orgs.push(imported)
}

var inArray = function(needle, haystack) {
  var result = ""

  for (var i in haystack) {
    var straw = haystack[i]
    if (needle == straw.value) {
      result = straw.text
    }
  }

  return result
}

var lookupOrg = function (slug) {
  var this_org = {}
  // look up org
  for (i in orgs) {
    var org = orgs[i]
    if (slug == org.slug) {
      this_org = org
    }
  }

  this_org.formatted_organisation_type = inArray(this_org.organisation_type, org_types)
  this_org.formatted_crest = inArray(this_org.organisation_crest, org_crests)
  this_org.formatted_brand_colour = inArray(this_org.organisation_brand, org_brand_colours)

  return this_org
}

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Add your routes here - above the module.exports line
router.get('/dashboard', function (req, res) {
  var org_table = []


  for (i in orgs) {
    var org = orgs[i]

    var org_type = inArray(org.organisation_type, org_types)

    var org_row = [
      { html: '<a href="/overview/'+org.slug+'">'+org.title+'</a>'},
      { text: org.acronym },
      { text: org_type },
      { text: org.organisation_state.replace(/^\w/, c => c.toUpperCase()) },
      { html: '<a href="/edit/'+org.slug+'">Edit</a>'}
    ]

    org_table.push(org_row)
  }

  res.render('dashboard', { org_table: org_table })
})

router.post('/overview', function (req, res) {
  var org = {
    organisation_brand:   req.session.data['org_logo_brand'],
    logo_formatted_title: req.session.data['org_logo_formatted_title'],
    organisation_crest:   req.session.data['org_logo_crest'],
    title:                req.session.data['org_title'],
    acronym:              req.session.data['org_acronym'],
    link:                 req.session.data['org_url'],
    slug:                 req.session.data['org_title'].toLowerCase().replace(/\s+/, '-'),
    organisation_type:    req.session.data['organisation_type'],
    organisation_state:   req.session.data['org_status']
  }

  orgs.unshift(org)

  res.redirect('/overview/'+org.slug)
})

router.get('/overview/:org_slug', function (req, res) {
  var this_org = lookupOrg(req.params['org_slug'])

  if (this_org == {}) {
    res.send("oops")
  } else {
    res.render('overview', { org: this_org })
  }
})

router.get('/create-organisation', function (req, res) {
  res.render('create-organisation', { org_types: org_types })
})

router.get('/organisation-logo', function (req, res) {
  res.render('organisation-logo', { org_brand_colours: org_brand_colours, org_crests: org_crests })
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

// change status routes
router.get('/change-status/:org_slug', function (req, res) {
  res.render('change-status', {org_slug: req.params['org_slug']})
})

router.post('/change-status/:org_slug', function (req, res) {
  var status = req.session.data['org_status']

  res.redirect("/"+status+"-organisation/"+req.params['org_slug'])
})

router.get('/replace-organisation/:org_slug', function (req, res) {
  var org = lookupOrg(req.params['org_slug'])

  res.render('replace-organisation', {org: org })
})

router.post('/merge-options-route', function (req, res) {
  if (req.session.data['merge_options'] == "true") {
    res.redirect('/create-merge-organisation')
  } else {
    res.redirect('/confirm-merge')
  }
})

module.exports = router
