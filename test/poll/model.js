/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Poll = mongoose.model('Poll');

//Globals
var user;
var poll;

//The tests
describe('<Unit Test>', function() {
    describe('Model Poll:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.save(function(err) {                
                poll = new Poll({
                    name: 'Poll Title',
                    owner: user._id
                });

                done();
            });
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return poll.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without name', function(done) {
                poll.name = '';

                return poll.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        afterEach(function(done) {
            User.FindOneAndRemove
            done();
        });
    });
});