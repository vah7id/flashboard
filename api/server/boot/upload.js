'use strict';

module.exports = function(Uploads) {

    Uploads.upload = function(req, res, Uploads_id, cb) {

        var StorageContainer = Uploads.app.models.StorageContainer;

        StorageContainer.getContainers(function (err, containers) {
            if (containers.some(function(e) { return e.name == Uploads_id; })) {
                StorageContainer.upload(req, res, {container: Uploads_id}, cb);
            }
            else {
                StorageContainer.createContainer({name: Uploads_id}, function(err, c) {
                    StorageContainer.upload(req, res, {container: c.name}, cb);
                });
            }
        });
    };

};