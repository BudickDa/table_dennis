Games = new Mongo.Collection('games');

Meteor.methods({
    insertResult: function (pointA, pointB, playerB) {
        check(pointA, Number);
        check(pointB, Number);
        check(playerB, String);
        if (this.userId === null) {
            return;
        }
        Games.insert({
            playerA: this.userId,
            playerB: playerB,
            pointA: pointA,
            pointB: pointB,
            date: new Date(),
            confirmed: false
        })
    },
    confirm: function (_id) {
        check(_id, String);
        if (this.userId === null) {
            return;
        }
        Games.update({'_id': _id, playerB: this.userId}, {$set: {confirmed: true}});
    },
    destroy: function (_id) {
        check(_id, String);
        var gameToDelete = Games.findOne(_id);
        if (gameToDelete.confirmed === false && (gameToDelete.playerA === this.userId || gameToDelete.playerB === this.userId)) {
            Games.remove(_id);
        }
    }
});

if (Meteor.isServer) {
    Meteor.publish('games', function () {
        return Games.find();
    });
    Meteor.publish('users', function () {
        return Meteor.users.find({}, {fields: {username: 1}});
    });

    //Meteor.users.remove({});
    //Games.remove({});
}