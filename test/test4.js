'use strict';

const React = require('react');

const App = (props) => {
    return (
        <div id="app">
            <Comment {...props.comments}/>
        </div>
    )
}

//-------------------solution--------------------------------
const User = (()=>{
    const map = new WeakMap();
    class User {
        constructor(name) {
            map.set(this, {name: name, logged: false, lastLoggedInAt: false});
        }
        isLoggedIn() {
            return map.get(this).logged;
        }
        getLastLoggedInAt() {
            return map.get(this).lastLoggedInAt;
        }
        logIn() {
            map.set(this, {logged: true, lastLoggedInAt: +new Date()});
            return true;
        }
        logOut() {
            map.set(this, {logged: false});
            return true;
        }
        getName() {
            return map.get(this).name;
        }
        setName(name) {
            map.set(this, {name: name});
        }
        canEdit(comment) {
            if(comment.getAuthor() == this){
                return true;
            }
            return false;
        }
        canDelete(comment) {
            return false;
        }
    }
    return User;
})();


const Moderator = (()=>{
    class Moderator extends User{
        canDelete(comment) {
            return true;
        }
    }
    return Moderator;
})();


const Admin = (()=>{
    class Admin extends Moderator{
        canEdit(comment) {
            return true;
        }
    }
    return Admin;
})();


const Comment = (()=>{
    const map = new WeakMap();
    class Comment {
        constructor(author, message, repliedTo=null) {
            map.set(this, {author: author, message: message, repliedTo: repliedTo, createdAt: false});
        }
        getMessage() {
            return map.get(this).message;
        }
        setMessage(message) {
            map.set(this, {message: message, createdAt: +new Date()});
        }
        getCreatedAt() {
            return map.get(this).createdAt;
        }
        getAuthor() {
            return map.get(this).author;
        }
        getRepliedTo() {
            return map.get(this).repliedTo;
        }
        toString() {
            return map.get(this).repliedTo ? this.getMessage() + " by " + this.getAuthor().getName() + " (replied to " + this.getRepliedTo().getAuthor().getName() + ")" : this.getMessage() + " by " + this.getAuthor().getName();
        }
    }
    return Comment;
})();


//-------------------TESTING--------------------------------
(()=>{
    const {assert, expect} = require('chai');

    describe('OOP Tests', function() {
        it('should handle instantiation', ()=>{
            const user = new User("user"),
                mod = new Moderator("mod"),
                adm = new Admin("admin");
            expect(user).to.be.an.instanceof(User);
            expect(mod).to.be.an.instanceof(Moderator);
            expect(adm).to.be.an.instanceof(Admin);
        });
        it('should handle inheritance', ()=>{
            const mod = new Moderator("mod"),
                adm = new Admin("admin");
            expect(mod).to.be.an.instanceof(User, 'Moderator is a User');
            expect(adm).to.be.an.instanceof(User, 'Admin is a User');
        });
        it('should handle method overriding', ()=>{
            class SomeUser extends User{
                canDelete(){
                    return true;
                }
            }
            const newUser = new SomeUser("newUser");
            expect(newUser.canDelete()).to.be.equal(true, "Overriding not working");
        });
        it('should handle function overloading', ()=>{
            const user = new User("John");
            const comment = new Comment(user, "message");
            expect(comment.getRepliedTo()).to.be.null;
            const commentWithReply = new Comment(user, "message", comment);
            expect(commentWithReply.getRepliedTo()).to.be.equal(comment, "Not support overloading");
        });
        it('should handle User encapsulation', ()=>{
            const user = new User("John");
            const publicFields = Object.keys(user);
            expect(publicFields).to.have.lengthOf(0, "There are public fields: "+publicFields.length);
        });
        it('should handle Comment encapsulation', ()=>{
            const user = new User("John");
            const comment = new Comment(user, "message");
            const publicFields = Object.keys(comment);
            expect(publicFields).to.have.lengthOf(0, "There are public fields: "+publicFields.length);
        });
        it('should handle composition', ()=>{
            const user = new User("John");
            const comment = new Comment(user, "message");
            expect(comment.getAuthor().getName()).to.be.equal("John");
        });
        it('should handle toString', ()=>{
            const user = new User("John");
            const comment = new Comment(user, "message");
            expect(comment.toString()).to.be.equal("message by John", "Tostring not working")
        });
        it('should login and logout', ()=>{
            const user = new User("John");
            expect(user.isLoggedIn()).to.be.equal(false);
            user.logIn();
            expect(user.isLoggedIn()).to.be.equal(true);
            user.logOut();
            expect(user.isLoggedIn()).to.be.equal(false);
        });
    });
})();