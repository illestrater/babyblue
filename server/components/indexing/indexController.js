exports.render = function(req, res) {
  var displayName;
  
  req.session.lastVisit = new Date();
  
  if(req.user) {
    displayName = req.user.user.nickname ? req.user.user.nickname : req.user.user.first;
  }
  
  res.render('index', {
    pagename: 'Baby Blue',
    userFullName: displayName
  })
};
