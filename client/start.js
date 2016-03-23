Meteor.subscribe('games');
Meteor.subscribe('users');


Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});


function getPoints(userId) {

}

function getGames() {

}

Template.table.helpers({
    users: function () {
        var nr = 0;
        return Meteor.users.find().map(function (user) {
            nr++;
            let results = {
                points: 0,
                won: 0,
                ties: 0,
                lost: 0
            };
            Games.find({
                playerA: user._id,
                confirmed: true
            }).forEach(function (doc) {
                if (doc.pointA > doc.pointB) {
                    results.won++;
                } else if (doc.pointA === doc.pointB) {
                    results.ties++;
                }
                else if (doc.pointA < doc.pointB) {
                    results.lost++;
                }
                results.points = doc.pointA - doc.pointB;
            });

            Games.find({
                playerB: user._id,
                confirmed: true
            }).forEach(function (doc) {
                if (doc.pointA < doc.pointB) {
                    results.won++;
                } else if (doc.pointA === doc.pointB) {
                    results.ties++;
                }
                else if (doc.pointA > doc.pointB) {
                    results.lost++;
                }
                results.points = doc.pointB - doc.pointA;
            });


            return {
                nr: nr,
                username: user.username,
                points: results.points,
                won: results.won,
                ties: results.ties,
                lost: results.lost
            };
        });
    }
})
;


Template.body.helpers({
    userDropdown: function () {
        let userId = Meteor.userId();
        return _.filter(Meteor.users.find().fetch(), function (user) {
            return user._id !== userId;
        });
    },
    queque: function () {
        return Games.find({
            playerB: Meteor.userId(),
            confirmed: false
        });
    }
});

Template.body.events({
    'submit #points'(event){
        event.preventDefault();
        let pointA = document.getElementById('pointA').value,
            pointB = document.getElementById('pointB').value,
            playerIdElement = document.getElementById('user-dropdown'),
            playerId = playerIdElement.options[playerIdElement.selectedIndex].value;
        Meteor.call('insertResult', Number.parseInt(pointA), Number.parseInt(pointB), playerId);
        document.getElementById('save').classList.add('disabled');
        Meteor.setTimeout(function () {
            document.getElementById('save').classList.remove('disabled');
        }, 5000);
    },
    'click .confirm'(event){
        let _id = event.currentTarget.dataset._id;
        Meteor.call('confirm', _id);
    },
    'click .destroy'(event){
        let _id = event.currentTarget.dataset._id;
        Meteor.call('delete', _id);
    }
});

