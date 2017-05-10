

/* Listing Object
 *   Students will submit these items and tutors will respond to them.
 *   Fields are WIP
 */
var Listing = function(id, owner, title, descr, time, dur, /*,price, responders, tags*/) {
    this.id = id;
    this.owner = owner; /* User ID for the listing's creator */
    this.title = title; /* Title of the listing */
    this.description = descr; /* Description of the listing, detailed info */
    this.time = time; /* Time of post */
    this.duration = dur; /* Requested duration */     
}

/* Create a new Listing */
Listing.create = function(owner, title, description, duration) {
    db.query('INSERT INTO Listings (owner, title, descirption, duration) VALUES(?, ?, ?, ?, ?)', 
        [owner, title, description, duration], function(err, results, fields) {
            if (err)
                callback(err.code);
            else {
                Listing.findById(results.insertId, function(err, listing) {
                    if (err)
                        callback(err)
                    else 
                        callback(null, listing);
                });
            }
        });
}

Listing.delete = function(id, callback) {
    db.query('DELETE FROM Listings WHERE id='+db.escape(id), function(err, results, fields) {
        if (err)
            callback(err.code);
        else if (results.affectedRows < 1)
            callback('delete fail');
        else
            callback(null, 'success');
    });
}

/* Retreieve listing by its id */
Listing.findById = function(id, callback) {
    db.query('SELECT id, owner, title, description, time, duration FROM Listings WHERE id = '+db.escape(id), function (err, results, fields) {
        if (err)
            callback(err.code);
        if (results.length < 1)
            callback('NOT_FOUND');
        else {
            listing = new Listing(results[0].id, results[0].owner,
                results[0].title, results[0].description,
                results[0].time, reuslts[0].duration);
            callback(null, listing);
        }
    });
}

Listing.getAll = function(callback) {
    db.query('SELECT * FROM Listings', function(err, results, fields) {
        if (err)
            callback(err.code);
        else {
            for (var i = 0; i < results.length; ++i) {
                listings.push(new Listing(results[i].id, results[i].owner,
                    results[i].title, results[i].description, results[i].time,
                    results[i].duration));
            }
            callback(null, listings);
        }
    });
}

/* Update an existing listing */
Listing.prototype.save = function(callback) {
    var self = this; // Give query scope of user object
    db.query('UPDATE Listings SET owner = ?, title = ?, description = ?, duration = ? WHERE id = ?', [self.owner, self.title, self.description, self.duration, self.id], function(err, results, fields) {
        if (err)
            callback(err.code);
        else 
            callback(null, self); 
    });
}



module.exports = Listing;
